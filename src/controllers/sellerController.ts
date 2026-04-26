import type { Request, Response } from "express";
import prisma from "../lib/prisma.js";

async function applyForSeller(req: Request, res: Response) {
  const { brandName, businessAddress, payoutDetails } = req.body;

  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorised",
    });
  }

  if (req.user.role !== "USER") {
    return res.status(403).json({
      success: false,
      message: "Only users can apply",
    });
  }

  if (!brandName || !businessAddress) {
    return res.status(400).json({
      success: false,
      message: "Enter seller details",
    });
  }

  const existingSeller = await prisma.seller.findUnique({
    where: { userId: req.user.userId },
  });

  if (existingSeller) {
    return res.status(409).json({
      success: false,
      message: "Seller profile already exists",
    });
  }

  const seller = await prisma.seller.create({
    data: {
      brandName,
      businessAddress,
      payoutDetails,
      userId: req.user.userId,
    },
    include: {
      user: true,
    },
  });

  return res.status(201).json({
    success: true,
    message: "Seller application submitted",
    data: seller,
  });
}

async function getMySellerProfile(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorised",
    });
  }

  const seller = await prisma.seller.findUnique({
    where: { userId: req.user.userId },
    include: {
      user: true,
      products: true,
    },
  });

  return res.json({
    success: true,
    data: seller,
  });
}

async function getAllSellers(req: Request, res: Response) {
  const sellers = await prisma.seller.findMany({
    include: {
      user: true,
      products: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return res.json({
    success: true,
    data: sellers,
  });
}

async function approveSeller(req: Request, res: Response) {
  const sellerId = String(req.params.id || "");

  const seller = await prisma.seller.update({
    where: { id: sellerId },
    data: { status: "ACTIVE" },
    include: { user: true },
  });

  await prisma.user.update({
    where: { id: seller.userId },
    data: { role: "SELLER" },
  });

  return res.json({
    success: true,
    message: "Seller approved successfully",
    data: seller,
  });
}

async function suspendSeller(req: Request, res: Response) {
  const sellerId = String(req.params.id || "");

  const seller = await prisma.seller.update({
    where: { id: sellerId },
    data: { status: "SUSPENDED" },
    include: { user: true },
  });

  await prisma.user.update({
    where: { id: seller.userId },
    data: { role: "USER" },
  });

  return res.json({
    success: true,
    message: "Seller suspended successfully",
    data: seller,
  });
}

export {
  applyForSeller,
  getMySellerProfile,
  getAllSellers,
  approveSeller,
  suspendSeller,
};
