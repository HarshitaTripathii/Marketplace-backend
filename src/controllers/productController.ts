import type { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import cache from "../lib/cache.js";

const LIST_TAKE = 10;

function getSellerCacheKey(page: number, search: string, limit: number) {
  return `products:list:${page}:${limit}:${search || "all"}`;
}

async function createProduct(req: Request, res: Response) {
  const { name, description, price, stock } = req.body;

  if (!name || !price) {
    return res.status(400).json({
      success: false,
      message: "Enter product details",
    });
  }

  const sellerId = req.user?.role === "ADMIN" ? req.body.sellerId : req.seller?.id;

  if (!sellerId) {
    return res.status(403).json({
      success: false,
      message: "seller access required",
    });
  }

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price: Number(price),
      stock: Number(stock || 0),
      sellerId,
    },
    include: {
      seller: {
        include: { user: true },
      },
    },
  });

  cache.flushAll();

  return res.status(201).json({
    success: true,
    message: "product created successfully",
    data: product,
  });
}

async function getAllProducts(req: Request, res: Response) {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || LIST_TAKE, 1), 50);
  const search = String(req.query.search || "").trim();
  const skip = (page - 1) * limit;
  const cacheKey = getSellerCacheKey(page, search, limit);

  const cached = cache.get(cacheKey);

  if (cached) {
    return res.json({
      success: true,
      data: cached,
    });
  }

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { description: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : undefined;

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      take: limit,
      skip,
      orderBy: { createdAt: "desc" },
      include: {
        seller: {
          select: {
            id: true,
            brandName: true,
            status: true,
          },
        },
      },
    }),
    prisma.product.count({ where }),
  ]);

  const payload = {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };

  cache.set(cacheKey, payload);

  return res.json({
    success: true,
    data: payload,
  });
}

async function getProductById(req: Request, res: Response) {
  const productId = String(req.params.id || "");
  const cacheKey = `products:detail:${productId}`;

  const cached = cache.get(cacheKey);

  if (cached) {
    return res.json({
      success: true,
      data: cached,
    });
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      seller: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
        },
      },
    },
  });

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "product not found",
    });
  }

  cache.set(cacheKey, product);

  return res.json({
    success: true,
    data: product,
  });
}

async function updateProduct(req: Request, res: Response) {
  const productId = String(req.params.id || "");
  const { name, description, price, stock } = req.body;

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { seller: true },
  });

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "product not found",
    });
  }

  if (req.user?.role !== "ADMIN" && req.seller?.id !== product.sellerId) {
    return res.status(403).json({
      success: false,
      message: "forbidden",
    });
  }

  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: {
      name: name ?? product.name,
      description: description ?? product.description,
      price: price !== undefined ? Number(price) : product.price,
      stock: stock !== undefined ? Number(stock) : product.stock,
    },
  });

  cache.flushAll();

  return res.json({
    success: true,
    data: updatedProduct,
  });
}

async function deleteProduct(req: Request, res: Response) {
  const productId = String(req.params.id || "");

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "product not found",
    });
  }

  if (req.user?.role !== "ADMIN" && req.seller?.id !== product.sellerId) {
    return res.status(403).json({
      success: false,
      message: "forbidden",
    });
  }

  await prisma.product.delete({
    where: { id: productId },
  });

  cache.flushAll();

  return res.json({
    success: true,
    message: "product deleted successfully",
  });
}

export { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };
