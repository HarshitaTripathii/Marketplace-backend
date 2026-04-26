import type { NextFunction, Request, Response } from "express";

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 60;

type Bucket = {
  count: number;
  startedAt: number;
};

const buckets = new Map<string, Bucket>();

export function ipRateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip =
    (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim() ||
    req.socket.remoteAddress ||
    "unknown";

  const now = Date.now();
  const bucket = buckets.get(ip);

  if (!bucket || now - bucket.startedAt > WINDOW_MS) {
    buckets.set(ip, { count: 1, startedAt: now });
    return next();
  }

  bucket.count += 1;

  if (bucket.count > MAX_REQUESTS) {
    return res.status(429).json({
      success: false,
      message: "Too many requests",
      retryAfterMs: WINDOW_MS - (now - bucket.startedAt),
    });
  }

  next();
}
