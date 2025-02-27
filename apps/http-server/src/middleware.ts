import { NextFunction,Request,Response } from "express";
import jwt  from "jsonwebtoken";



export function middleware(req:Request,res:Response,next:NextFunction){
    const token = req.headers["authorization"] as string | undefined;

    if (!token) {
        return res.status(401).send("Unauthorized");
    }

    const decoded  = jwt.verify(token,process.env.JWT_SECRET as string);

    if(decoded){
        //@ts-ignore
        req.userId = decoded.userId;
        next();
    }else{
        res.send("unauthorized").status(403).json({
            message:"Unauthorized"
        })
    }

}