import { JWT_SECRET } from "@repo/backend-common/config";
import {
  CreateRoomSchema,
  CreateUserSchema,
  SigninSchema,
} from "@repo/common/types";
import express from "express";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware.js";
// import {prismaClient} from "@repo/db/client"
import { prismaClient } from "@repo/db/prisma";
import bcrypt from "bcrypt";

const app = express();
app.use(express.json());

// @ts-ignore
app.post("/signup", async (req, res) => {
  const parsedData = CreateUserSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: "incorrect inputs",
    });
    return res.status(400);
  }
  try {
    const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);
    await prismaClient.user.create({
      data: {
        email: parsedData.data?.username,
        password: hashedPassword,
        name: parsedData.data?.name,
      },
    });
    res.json({
      userId: parsedData.data.username,
    });
  } catch (e) {
    res.json({
      message: "User already exists",
    });
  }
});

//@ts-ignore
app.post("/signin", async (req, res) => {
  const parsedData = SigninSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.json({
      message: "Incorrect inputs",
    });
    return;
  }

  try {
    const user = await prismaClient.user.findFirst({
      where: {
        email: parsedData.data.username,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const passwordValid = await bcrypt.compare(
      parsedData.data.password,
      user.password
    );

    if (!passwordValid) {
      return res.status(401).json({
        message: "Invalid email and password",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
      },
      JWT_SECRET
    );

    res.status(200).json({
      token,
    });
  } catch (e) {
    console.log("Error during signin", e);
    res.status(404).json({
      message: "Something went wrong",
    });
  }
});

// @ts-ignore
app.post("/room", middleware, async (req, res) => {
  const parsedData = CreateRoomSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: "Incorrect inputs",
    });
    return;
  }

  const userId = req.userId;

  try {
    const room = await prismaClient.room.create({
    //   @ts-ignore
      data: {
        slug: parsedData.data.roomname,
        adminId: userId,
      },
    });
    res.json({
      roomId: room.id,
    });
  } catch (e) {
    console.log("Error during room creation", e);
    res.status(411).json({
      message: "Room already exists with this name",
    });
  }
});
// @ts-ignore

app.get("/chats/:roomId",async(req,res)=>{
    try{
      const parsedData = CreateRoomSchema.parse(req.params.roomId);
      
      const messages = await prismaClient.chat.findMany({
        where:{
          roomId:parsedData.roomname
        },
        orderBy:{
          id:"desc"
        },
        take:50
      })

    }catch(e){
        console.log(e);
        res.json({
          messages:[]
        })
    }
})

app.get("/room/:slug",async(req,res)=>{
  const slug = req.params.slug;
  const room = prismaClient.room.findFirst({
    where:{
      slug
    }
  });
  res.json({
    room
  })
})

app.listen(3001);
