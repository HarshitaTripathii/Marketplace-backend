import type { Role, Seller, SellerStatus } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: Role;
      };
      seller?: Seller & {
        status: SellerStatus;
      };
    }
  }
}

export {};
