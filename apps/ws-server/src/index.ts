
import WebSocket, { WebSocketServer } from 'ws';
import jwt, { JwtPayload } from "jsonwebtoken";
import {JWT_SECRET} from "@repo/backend-common/config"
import { decoded } from './types.js';
const wss = new WebSocketServer({ port: 8080 });
import {prismaClient}  from "@repo/db/prisma"

interface User {
    rooms : string[],
    userId : string
    ws:WebSocket

}

const users: User[] = []

function checkUser(token:string): string | null{
    try{
    const decoded = jwt.verify(JWT_SECRET,token) as decoded;

    if(typeof decoded === "string") { 
            return null
    }

    if(!decoded || !decoded.userId){
        return null;
    }

    return decoded.userId;
    console.log(decoded.userId)
    } catch(e){
        return "cant decoded the user"
    }
    
}



wss.on('connection', (ws,request) => {
   const url = request.url;


   const queryparams = new URLSearchParams(url?.split('?')[1]);
   const token = queryparams.get("token") || "";
    const userId = checkUser(token)

    if(userId==null){
        ws.close()
        return null;
    }

    users.push({
        userId,
        rooms:[],
        ws
    })

    ws.on("message",async function message(data){
        let parsedData;

        if(typeof data != "string"){
            parsedData =  JSON.parse(data.toString())
        }else{
            parsedData = JSON.parse(data)
        }
        

        if(parsedData.type == "join_room"){
            const user = users.find(x => x.ws === ws);
            user?.rooms.push(parsedData.roomsId)
        }

        if(parsedData.type == "leave_room"){
            const user = users.find(x => x.ws === ws);
            if(!user){
                return;
            }
            user?.rooms == user?.rooms.filter(x => x === parsedData.roomId)
        }

        if(parsedData.type == "chat"){
            const roomId = parsedData.roomsId;
            const message  = parsedData.message;

            await prismaClient.chat.create({
                data: {
                  roomId,
                  message,
                  userId
                }
              });

            users.forEach(user=>{
                if(user.rooms.includes(roomId)){
                    user.ws.send(JSON.stringify({
                        type : parsedData.type,
                        message:message,
                        roomId 
                    }))
                }
            })
        }
    })

});



console.log('WebSocket server is running on ws://localhost:8080');({ port: 8080 });
