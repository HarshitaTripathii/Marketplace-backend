import type { NextFunction, Request, Response } from "express";
import prisma from "../lib/prisma.js";

async function requireVerifiedSeller(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorised",
    });
  }

  if (req.user.role === "ADMIN") {
    return next();
  }

  if (req.user.role !== "SELLER") {
    return res.status(403).json({
      success: false,
      message: "seller access required",
    });
  }

  const seller = await prisma.seller.findUnique({
    where: { userId: req.user.userId },
  });

  if (!seller || seller.status !== "ACTIVE") {
    return res.status(403).json({
      success: false,
      message: "seller not approved",
    });
  }

  req.seller = seller;
  next();
}

export default requireVerifiedSeller;
