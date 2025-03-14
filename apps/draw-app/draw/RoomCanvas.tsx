import { useEffect, useState } from "react"
import { Canvas } from "./Canvas";
import { WS_URL } from "@/config";


export function RoomCanvas({ roomId }: { roomId: string }){
    const [socket,setSocket] = useState<WebSocket|null>();


    useEffect(()=>{
        const ws = new WebSocket(WS_URL)

        ws.onopen = ()=>{
            setSocket(ws)
        }
    })

    if(!socket){
        return <div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><linearGradient id="a9"><stop offset="0" stop-color="#FF156D" stop-opacity="0"></stop><stop offset="1" stop-color="#FF156D"></stop></linearGradient><circle fill="none" stroke="url(#a9)" stroke-width="15" stroke-linecap="round" stroke-dasharray="0 44 0 44 0 44 0 44 0 360" cx="100" cy="100" r="70" transform-origin="center"><animateTransform type="rotate" attributeName="transform" calcMode="discrete"
             dur="2" values="360;324;288;252;216;180;144;108;72;36" repeatCount="indefinite"></animateTransform></circle></svg>
        </div>
    }


    

    return <Canvas roomId={roomId} socket={socket}/>


}