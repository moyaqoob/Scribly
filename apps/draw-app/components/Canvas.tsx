"use Client";
import { useEffect, useRef } from "react";
import { initDraw } from "../draw";

export function Canvas({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      initDraw(canvasRef.current, roomId, socket);
    }
  }, [canvasRef, roomId]);

  if (!canvasRef.current) {
    return null;
  }

  return (
    <div>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}
