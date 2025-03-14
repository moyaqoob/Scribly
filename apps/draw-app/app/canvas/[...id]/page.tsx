"use client";
import { initDraw } from "@/draw";
import { Canvas } from "@/draw/Canvas";
import { RoomCanvas } from "@/draw/RoomCanvas";
import { Socket } from "dgram";
import { useEffect, useRef } from "react";

 async function CanvasPage({params}:{
  params:{
    roomId:string
  }
}){


  const roomId = (await params).roomId

  return <RoomCanvas roomId={roomId} ></RoomCanvas>
};

export default CanvasPage;
