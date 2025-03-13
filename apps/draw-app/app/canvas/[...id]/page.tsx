"use client";
import { initDraw } from "@/draw";
import { useEffect, useRef } from "react";

const page = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  

  useEffect(() => {
    
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    if(canvasRef.current){
      initDraw(canvas);
    }
    
  }, [canvasRef]);

  return <canvas ref={canvasRef} width={1080} height={1080}></canvas>;
};

export default page;
