"use client";
import { RoomCanvas } from "@/components/RoomCanvas";
import { useEffect, useRef } from "react";
import React from "react";

const CanvasPage = ({params}:{
  params:{
    roomId:string
  }
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const roomId = params.roomId;

  useEffect(() => {
    // Ensure the canvas context is available
    const canvas = canvasRef.current;
    if(!canvas){
      return;
    }
    const startX = 0;
    const startY = 0;
    const ctx = canvas.getContext("2d");
    if(!ctx){
      return;
    }
    let clicked = false;
    ctx.strokeStyle = "black"
    
    canvas.addEventListener("mousedown", (e) => {
      clicked = true;
      // startX = /
      ctx.fillRect(e.clientX,e.clientY,startX,startY)
      ctx.strokeStyle = "black"
      console.log(e.clientX,e.clientY)
    })

    canvas.addEventListener("mouseup",(e)=>{
      clicked = false;
      const width = e.clientX - startX;
      const height = e.clientY - startY
      ctx.strokeRect(startX,startY,width,height)
    })


    if(canvas){
      canvas.addEventListener("mousemove",(e)=>{
      if(clicked){
        const width = e.clientX - startX;
        const height = e.clientY - startY;
        ctx.fillRect(startX,startY,width,height)
        ctx.strokeStyle ="black"
        ctx.strokeRect(25,25,25,25)
      }
    })
  } 
  }, []);

  

  return (
    <RoomCanvas
      roomId={roomId}
    />
  );
};

export default CanvasPage;
