import { Router } from "express";
import protect from "../middlewares/protect.js";
import adminProtect from "../middlewares/adminProtect.js";
import {
  applyForSeller,
  approveSeller,
  getAllSellers,
  getMySellerProfile,
  suspendSeller,
} from "../controllers/sellerController.js";

const sellerRouter = Router();

sellerRouter.post("/apply", protect, applyForSeller);
sellerRouter.get("/me", protect, getMySellerProfile);
sellerRouter.get("/", protect, adminProtect, getAllSellers);
sellerRouter.patch("/:id/approve", protect, adminProtect, approveSeller);
sellerRouter.patch("/:id/suspend", protect, adminProtect, suspendSeller);

export default sellerRouter;
