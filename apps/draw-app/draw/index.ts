import React from 'react'

export function initDraw(canvas:HTMLCanvasElement){
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    let clicked = false;
    let startX = 0;
    let startY = 0;
    const existingitems  = []

    //when we click the mouse
    canvas.addEventListener("mousedown", (e) => {
      clicked = true;
      startX = e.clientX;
      startY = e.clientY;
    });

    //when we leave the mouse
    canvas.addEventListener("mouseup", (e) => {
      clicked = false;
      existingitems.push({
      })
      console.log(startX);
      console.log(startY);
    });

    //when we move the mouse
    canvas.addEventListener("mousemove", (e) => {
      if (clicked) {
       
          const width = e.clientX - startX;
          const height = e.clientY - startY;

          ctx.clearRect(0,0,canvas.width,canvas.height)
          ctx.strokeRect(startX,startY,width,height);
      }
    });
}