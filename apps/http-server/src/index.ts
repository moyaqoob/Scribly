import express from "express";
const app = express();
import brcypt from "bcrypt";
import jwt from "jsonwebtoken";
import {PrismaClient} from "@prisma/client"


//start a server
//attach two communitcation methods
// 
app.use(express.json());
app.post("/",(req,res)=>{
    res.send("Hello World")
})

const prisma = new PrismaClient();

app.post("/api/signup",(req,res)=>{
    const {username,password} = req.body;

    try{
        const existinguser = await prisma.user.findFirst({
            where: {
                "firstName":username
            }
        })
        if(existinguser){
            res.send("User already exits")
        }

        const hash =  await brcypt.hash(password,10);

        const user = await prisma.user.create({
            data:{
                ""
            }
        })

    }
    
})


app.post("/api/signin",(req,res)=>{
    const {username,password} = req.body;



})