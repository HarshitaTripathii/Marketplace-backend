import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { Role } from "@prisma/client";

type AuthPayload = {
  userId: string;
  role: Role;
};

function isAuthPayload(payload: unknown): payload is AuthPayload {
  if (typeof payload !== "object" || payload === null) {
    return false;
  }

  const data = payload as Record<string, unknown>;

  return (
    typeof data.userId === "string" &&
    (data.role === "USER" || data.role === "SELLER" || data.role === "ADMIN")
  );
}

function protect(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.marketplaceJwt;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorised",
    });
  }

  const secret = process.env.JWT_SECRET || "";

  try {
    const payload = jwt.verify(token, secret);

    if (!isAuthPayload(payload)) {
      return res.status(401).json({
        success: false,
        message: "expired / invalid token",
      });
    }

    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "expired / invalid token",
    });
  }
}

export default protect;
