
import { WebSocketServer } from 'ws';
import jwt, { JwtPayload } from "jsonwebtoken";
import {JWT_SECRET} from "@repo/backend-common/config"

const server = new WebSocketServer({ port: 8080 });

server.on('connection', (ws,request) => {
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