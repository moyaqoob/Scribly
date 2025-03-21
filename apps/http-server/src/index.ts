// filepath: /c:/Users/Yaqoob/nextjs/draw-clone/apps/http-server/src/index.ts
import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from '@repo/backend-common/config';
import { middleware } from "./middleware.ts";
import { CreateUserSchema, SigninSchema, CreateRoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/prisma";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/signup", async (req, res) => {
    const parsedData = CreateUserSchema.safeParse(req.body);
    if (!parsedData.success) {
        console.log(parsedData.error);
        res.json({
            message: "Incorrect inputs"
        });
        return;
    }
    try {
        const user = await prismaClient.user.create({
            data: {
                email: parsedData.data?.username,
                // TODO: Hash the pw
                password: parsedData.data.password,
                name: parsedData.data.name
            }
        });
        res.json({
            userId: user.id
        });
    } catch (e) {
        res.status(411).json({
            message: "User already exists with this username"
        });
    }
});

app.post("/signin", async (req, res) => {
    const parsedData = SigninSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.json({
            message: "Incorrect inputs"
        });
        return;
    }

    // TODO: Compare the hashed pws here
    const user = await prismaClient.user.findFirst({
        where: {
            email: parsedData.data.username,
            password: parsedData.data.password
        }
    });

    if (!user) {
        res.status(403).json({
            message: "Not authorized"
        });
        return;
    }

    const token = jwt.sign({
        userId: user?.id
    }, JWT_SECRET);

    res.json({
        token
    });
});

//@ts-ignore
app.post("/room", middleware, async (req, res) => {
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.json({
            message: "Incorrect inputs"
        });
        return;
    }
    const userId = req.userId;
    if (!userId) {
        res.status(400).json({ message: "User ID is missing" });
        return;
    }
    
    try {
        // Check if room with this name already exists
        const existingRoom = await prismaClient.room.findUnique({
            where: {
                slug: parsedData.data.name
            }
        });
        
       
        if(!existingRoom){
            const room = await prismaClient.room.create({
                data: {
                    slug: parsedData.data.name,
                    adminId: userId,
                }
            });
            res.json({
                roomId: room.id
            });
        }else{
            res.status(400).json({
                message: "Room with this name already exists"
            });
        }
        
    } catch (e) {
        console.error("Error creating room:", e);
        res.status(500).json({
            message: "Server error while creating room"
        });
    }
});

app.get("/chats/:roomId", async (req, res) => {
    try {
        const roomId = Number(req.params.roomId);
        console.log(req.params.roomId);
        const messages = await prismaClient.chat.findMany({
            where: {
                roomId: roomId
            },
            orderBy: {
                id: "desc"
            },
            take: 1000
        });

        res.json({
            messages
        });
    } catch (e) {
        console.log(e);
        res.json({
            messages: []
        });
    }
});

app.get("/room/:slug", async (req, res) => {
    const slug = req.params.slug;
    const room = await prismaClient.room.findFirst({
        where: {
            slug
        }
    });

    res.json({
        room
    });
});

app.listen(3001);