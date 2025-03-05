import { JWT_SECRET } from "@repo/backend-common/config";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { decoded } from "./types.js";

export function middleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["authorization"] as string;

  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as decoded;

    req.userId = decoded.userId;
    next();
  } catch (e) {
    res.status(403).json({
      message: "Unauthorized",
    });
  }
}
