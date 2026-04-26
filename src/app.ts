import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routers/authRouter.js";
import sellerRouter from "./routers/sellerRouter.js";
import productRouter from "./routers/productRouter.js";
import { ipRateLimiter } from "./middlewares/rateLimiter.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(ipRateLimiter);

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Marketplace backend is working",
  });
});

app.use("/auth", authRouter);
app.use("/marketplace/sellers", sellerRouter);
app.use("/marketplace/products", productRouter);

export default app;
