import express from "express"
import jwt from  "jsonwebtoken"
import  {JWT_SECRET} from "@repo/backend-common/config"
import { middleware } from "./middleware.js"
import {CreateUserSchema,SigninSchema,CreateRoomSchema} from "@repo/common/types"

const app = express();

//@ts-ignore
app.post("/signup",(req,res)=>{
    const data = CreateUserSchema.safeParse(req.body);
    if(!data.success){
        return res.json({
            message:"incorrect inputs"
        })
    }
    res.json({
        userId:"123"
    })
})


app.post("/signin",(req,res)=>{
    const userId = 1;
    const token  = jwt.sign({
        userId
    },JWT_SECRET)

    res.json({
        token
    })
})

//@ts-ignore
// app.post("/room",middleware,(req,res)=>{
//     const 
// })

app.listen(3001)

