import express from "express"
import jwt from  "jsonwebtoken"
import  {JWT_SECRET} from "@repo/backend-common/config"
import { middleware } from "./middleware.js"
import {CreateUserSchema,SigninSchema,CreateRoomSchema} from "@repo/common/types"
// import {prismaClient} from "@repo/db/client"
import { prismaClient } from "@repo/db/client"
import bcrypt from "bcrypt"

const app = express();

//@ts-ignore
app.post("/signup", async (req,res)=>{
    const parsedData = CreateUserSchema.safeParse(req.body);
    if(!parsedData.success){
        res.json({
            message:"incorrect inputs"
        })
        return res.status(400);
    }
    try{

        const hashPassword = await bcrypt.hash(parsedData.data.password,10)
        const user  = prismaClient.user.create({
            data:{
                email : parsedData.data.username,
                password : hashPassword,
                name : parsedData.data.name,
            },
        })
        return res.json({
            message:"User created successfully",
            userId:(await user).id
        })

    }catch(e){
        res.json({
            message: "User Already exists"
        })
    }
})

//@ts-ignore
app.post("/signin",async (req,res)=>{
    const parsedData = SigninSchema.safeParse(req.body);

    if(!parsedData.success){
        res.json({
            message:"Incorrect inputs"
        })
        return;
    }

    try{
        const user = await prismaClient.user.findFirst({
            where:{
                email:parsedData.data.username,
                password:parsedData.data.password
            },
        })

        if(!user){
            return res.status(404).json({
                message:  "User not found"
            })
        }

        const passwordValid = await bcrypt.compare(parsedData.data.password,user.password)

        if(!passwordValid){
            return res.status(401).json({
                message:"Invalid email and password"
            })
        }

        const token = jwt.sign({
            userId:user.id
        },JWT_SECRET)

        res.status(200).json({
            token
        })
    } catch(e){
        console.log("Error during signin",e)
        res.status(404).json({
            message:"Something went wrong"
        })
    }
    
})

// @ts-ignore
app.post("/room",middleware,(req,res)=>{
     
})

app.listen(3001)

