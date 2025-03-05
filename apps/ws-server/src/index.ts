
import { WebSocketServer } from 'ws';
import jwt, { JwtPayload } from "jsonwebtoken";
import {JWT_SECRET} from "@repo/backend-common/config"

const wss = new WebSocketServer({ port: 8080 });

interface User {
    ws:WebSocket,
    room : string,
    chat : string
}

const user:User[] = []

function checkUser(token:string): string | null{
    const decoded = jwt.verify(JWT_SECRET,token) as JwtPayload;

    if(typeof decoded === "string") { 
            return null
    }

    if(!decoded || !decoded.userId){
        return null;
    }

    return decoded.userId;
    console.log(decoded.userId)
}



wss.on('connection', (ws,request) => {
   const url = request.url;


   const queryparams = new URLSearchParams(url?.split('?')[1]);
   const token = queryparams.get("token") || "";
   const decoded = jwt.verify(token,JWT_SECRET)

    if(!decoded || !(decoded as JwtPayload).userId){
        ws.close()
        return;
    }else{
        ws.send("Pong mf")
    }
    

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log('WebSocket server is running on ws://localhost:8080');({ port: 8080 });
