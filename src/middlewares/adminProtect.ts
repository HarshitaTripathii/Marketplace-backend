import type { NextFunction, Request, Response } from "express";

function adminProtect(req: Request, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "forbidden",
    });
  }

  next();
}

export default adminProtect;
