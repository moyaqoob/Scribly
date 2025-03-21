import { JWT_SECRET } from "@repo/backend-common/config";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { decoded } from "./types.js";

// Remove the return type
export async function middleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["authorization"] ?? " ";
  
  if (!token) {
    res.status(401).send("Unauthorized");
    return; // Just return without a value
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as decoded;
    
    (req as any).userId = decoded.userId;
    
    console.log("this is passed");
    next();
  } catch (e) {
    res.status(403).json({
      message: "Unauthorized",
    });
    console.error("Token verification error:", e);
  }
}