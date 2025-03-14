import { BACKEND_URL } from "@/config";
import axios from "axios";

type Shape = {
      type:"rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }|{
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
};

export async function initDraw(canvas: HTMLCanvasElement,roomId:string,socket : WebSocket) {
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    let clicked = false;
    let startX = 0;
    let startY = 0;
    
    const existingitems: Shape[] = await getExistingShapes(roomId);
    
    socket.onmessage=(e)=>{
      const message = JSON.parse(e.data)
      
      if(message.type == "chat"){
        const parsedShape = JSON.parse(message.message);
        existingitems.push(parsedShape)
      }
    }
    
    clearCanvas(canvas,ctx,existingitems);
    //when we click the mouse
    canvas.addEventListener("mousedown", (e) => {
      clicked = true;
      startX = e.clientX;
      startY = e.clientY;
    });

    //when we leave the mouse
    canvas.addEventListener("mouseup", (e) => {
      clicked = false;
      const x = startX;
      const y = startY;
      const width = e.clientX - startX;
      const height = e.clientY - startY;

      const shape:Shape= {
          type:"rect",
          x:startX,
          y:startY,
          width,
          height,
      }

      existingitems.push(shape)
      socket.send(JSON.stringify({
        shape
      }))

  });

  //when we move the mouse
  canvas.addEventListener("mousemove", (e) => {
    if (clicked) {
        const width = e.clientX - startX;
        const height = e.clientY - startY;
        clearCanvas(canvas,ctx,existingitems);
        ctx.fillStyle = "rgba(255,255,255,255)";
        ctx.strokeRect(0,0,0,1)
    }
  });
}



function clearCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, existingItems: Shape[]) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 0, 0, 0)";
    ctx.fillRect(0,0,canvas.width,canvas.height)
    existingItems.forEach(item => {
      if (item.type === "rect") {
        item.x
        item.y,
        item.width,
        item.height
      }
    })
}

async function getExistingShapes(roomId:string){
    const res = axios.get(`${BACKEND_URL}/chat/${roomId}`);
    const messages = (await res).data.messages;

    const shapes = messages.map((x: {message:string})=>{
          const messageData = JSON.parse(x.message)
          return messageData
    })
    return shapes
}
