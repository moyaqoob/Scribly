import {prismaClient} from "@repo/db/prisma"
import { JWT_SECRET } from "@repo/backend-common/config";
import jwt from "jsonwebtoken";
import { WebSocketServer } from "ws";
import { decoded } from "./types.js";


import { WebSocket } from "ws";

interface User {
    rooms: string[],
    userId: string,
    ws: WebSocket
  }
  
  const users: User[] = []; // Changed variable name for consistency
  
  function checkUser(token: string): string | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as decoded;
      
      if (typeof decoded === "string") {
        return null;
      }
      
      if (!decoded || !decoded.userId) {
        return null;
      }
      
      return decoded.userId;
    } catch(e) {
      console.error("Token verification error:", e);
      return null;
    }
  }
  
  const wss = new WebSocketServer({ port: 8080 });
  
  wss.on('connection', (ws, request) => {
    const url = request.url;
    const queryparams = new URLSearchParams(url?.split('?')[1]);
    const token = queryparams.get("token") || "";
    
    const userId = checkUser(token);
    
    if (userId === null) {
      ws.close();
      return;
    }
    
    // Create a new user object and add to users array
    const newUser: User = {
      userId,
      rooms: [],
      ws
    };
    
    users.push(newUser); // Push the new user object
    
    console.log(`User ${userId} connected`);
    
    ws.on("message", async function message(data) {
      let parsedData;
      
      try {
        if (typeof data !== "string") {
          parsedData = JSON.parse(data.toString());
        } else {
          parsedData = JSON.parse(data);
        }
        
        // Find the user object for this connection
        const user = users.find(u => u.ws === u.ws);
        if (!user) return; // Exit if user not found
        
        if (parsedData.type === "join_room") {
          const roomId = parsedData.roomId;
          if (!user.rooms.includes(roomId)) {
            user.rooms.push(roomId);
            console.log(`User ${userId} joined room ${roomId}`);
          }
        }
        
        if (parsedData.type === "leave_room") {
          const roomId = parsedData.roomId;
          user.rooms = user.rooms.filter(x => x !== roomId);
          console.log(`User ${userId} left room ${roomId}`);
        }
        
        if (parsedData.type === "chat") {
          const roomId = parsedData.roomId;
          const message = parsedData.message;
          
          // Check if user is in the room
          if (!user.rooms.includes(roomId)) {
            ws.send(JSON.stringify({
              type: "error",
              message: "You are not in this room"
            }));
            return;
          }
          
          // Save message to database
          await prismaClient.chat.create({
            data: {
              roomId: Number(roomId),
              message, // Make sure this field matches your schema
              userId
            }
          });
          
          // Broadcast to all users in the room
          users.forEach(u => {
            if (u.rooms.includes(roomId)) {
              u.ws.send(JSON.stringify({
                type: "chat",
                message,
                roomId,
                userId
              }));
            }
          });
        }
      } catch (error) {
        console.error("Error processing message:", error);
        ws.send(JSON.stringify({
          type: "error",
          message: "Failed to process message"
        }));
      }
    });
    
    ws.on("close", () => {
      console.log(`User ${userId} disconnected`);
      const index = users.findIndex(u => u.userId === userId);
      if (index !== -1) {
        users.splice(index, 1);
      }
    });
  });
  
  console.log('WebSocket server is running on ws://localhost:8080');