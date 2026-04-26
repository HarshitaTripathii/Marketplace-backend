import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

const COOKIE_NAME = "marketplaceJwt";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

function signToken(userId: string, role: "USER" | "SELLER" | "ADMIN") {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET || "", {
    expiresIn: "7d",
  });
}

function setAuthCookie(res: Response, token: string) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_MAX_AGE,
  });
}

async function signUp(req: Request, res: Response) {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Enter details",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "password do not match",
    });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "User already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const token = signToken(user.id, user.role);
  setAuthCookie(res, token);

  return res.status(201).json({
    success: true,
    message: "Sign up successful",
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}

async function logIn(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Enter details",
    });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "user does not exist",
    });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(400).json({
      success: false,
      message: "invalid credentials",
    });
  }

  const token = signToken(user.id, user.role);
  setAuthCookie(res, token);

  return res.json({
    success: true,
    message: "Logged in successfully",
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}

async function logOut(req: Request, res: Response) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return res.json({
    success: true,
    message: "Logged out successfully",
  });
}

async function me(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorised",
    });
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    include: { seller: true },
  });

  return res.json({
    success: true,
    data: user,
  });
}

export { signUp, logIn, logOut, me };
