'use client'
import { FC, useEffect, useState } from "react";
import { useDraw } from "@/hooks/useDraw";
import io from 'socket.io-client';
import { PopoverPicker } from "../components/PopoverPicker";
import { globalAgent } from "http";
let socket = io("https://theboardserver.onrender.com", {transports: ["websocket"]});

interface pageProps {}

const Page: FC<pageProps> = ({}) => {
  var eraserDefaultStyle = { border: ''};
  var pickerDefaultStyle = {background:"#000", border:''};
  var selectedToolDefaultColor = "yellow";
  const { canvasRef, onMouseDown, onTouchStart } = useDraw(drawLine);
  const [pickerColor, setPickerColor] = useState("#000000");
  const [eraserStyle, setEraserStyle] = useState();
  const [pickerStyle, setPickerStyle] = useState(); 
  const [lineWidth, setLineWidth] = useState(5);
  const [lineQueue, setLineQueue] = useState([{}]);
  const [showCanvas, setShowCanvas] = useState(false);
  var isDrawing = false;
  var timeout: NodeJS.Timeout;
  var drawColor = pickerColor;
  //var lineQueue: { startX: number; startY: number; currX: number; currY: number; lineWidth: number; lineJoin: string; lineCap: string; strokeStyle: string; }[] = [];
  useEffect(()=>{
    socket.on("canvas-data", function(data){
      var interval = setInterval(function(){
          if(isDrawing) return;
          isDrawing = true;
          clearInterval(interval);
          var canvas = canvasRef.current;
          if(!canvas) return
          var ctx = canvas.getContext('2d');
          if(ctx == null) return
          var image = new Image();
          image.onload = function(){
            ctx?.drawImage(image, 0, 0);
            isDrawing = false;
          };
          image.src = data;
      });
      setShowCanvas(true);
    })
    socket.emit("canvas-data", null);
  }, []);

  function drawLine({prevPoint, currentPoint, ctx}:Draw){
    // const {x: currX, y:currY } = currentPoint
    // const lineColor = drawColor

    // let startPoint = prevPoint ?? currentPoint
    // ctx.beginPath()
    // ctx.lineWidth = lineWidth
    // ctx.strokeStyle = lineColor
    // ctx.moveTo(startPoint.x, startPoint.y)
    // ctx.lineTo(currX, currY)
    // ctx.stroke()

    // ctx.fillStyle = lineColor
    // ctx.beginPath()
    // ctx.arc(startPoint.x, startPoint.y, 2, 0, 2*Math.PI)
    // ctx.fill()

    const {x: currX, y:currY } = currentPoint
    let startPoint = prevPoint ?? currentPoint

    ctx.lineWidth = lineWidth;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = drawColor;
    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(currX, currY);
    ctx.closePath();
    ctx.stroke();

    lineQueue.push({
      startX: startPoint.x, 
      startY: startPoint.y, 
      currX: currX, currY:currY, 
      lineWidth: lineWidth,
      lineJoin: 'round',
      lineCap: 'round',
      strokeStyle: drawColor
    })
    setLineQueue(lineQueue);
  }

  const notifyServer = () => {
    // var canvas = canvasRef.current;
    // if(!canvas) return
    // if(timeout != undefined) 
    // {
    //   clearTimeout(timeout);
    // }
    // timeout = setTimeout(function(){
    //   var base64ImageData = canvas?.toDataURL("image/png");
    //   socket.emit("canvas-data", base64ImageData);
    // }, 1000)

    // socket.emit("pen-action", lineQueue);
    // lineQueue = [];
    socket.emit("pen-action", lineQueue);
    setLineQueue([]);
  }

  return <div className="w-screen h-screen bg-white flex justify-center items-center">
    <div className="canvasAndTools">
      <div className="tools">
        <PopoverPicker className="swatch" color={pickerColor} onChange={setPickerColor}/>
        <input className="slider" min="2" value={lineWidth} max="50" type="range" onInput={(event: React.ChangeEvent<HTMLInputElement>) => setLineWidth(parseInt(event.target.value)) } />
        <div className="cursorSizeContainer">
          <div className="cursorSize" style={{border: "1px solid black", borderRadius: 50, width: lineWidth, height: lineWidth}}></div>
        </div>
      </div>
      <div className="canvasAndBoard">
        { showCanvas === true && <canvas
        onMouseDown={onMouseDown}
        onMouseUp={notifyServer}
        onTouchEnd={notifyServer}
        onTouchStart={onTouchStart}
        ref={canvasRef}
        width = {750}
        height={750}
        className="border border-black rounded-m"
        />}
      </div>
    </div>
  </div>
}

export default Page;