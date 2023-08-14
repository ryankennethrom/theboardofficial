import { useEffect, useRef, useState } from "react";


export const useDraw = (onDraw:({ctx, currentPoint, prevPoint}:Draw) => void) => {
    const [mouseDown, setMouseDown] = useState(false);
    const [touchStart, setTouchStart] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const prevPoint = useRef<null | Point>(null)
    
    const onMouseDown = () => setMouseDown(true)
    const onTouchStart = () => setTouchStart(true)

    useEffect(()=>{
        const mouseMovehandler = (e:MouseEvent) => {
            if(!mouseDown) return
            const currentPoint = computeMousePointsInCanvas(e);
            const ctx = canvasRef.current?.getContext('2d');

            if(!ctx || !currentPoint) return

            onDraw({ctx, currentPoint, prevPoint: prevPoint.current})
            prevPoint.current = currentPoint

        }

        const touchMoveHandler = (e: TouchEvent) => {
            if(!touchStart) return
            if(e.touches.length >= 2) return
            e.preventDefault()
            const currentPoint = computeTouchPointsInCanvas(e);
            const ctx = canvasRef.current?.getContext('2d');

            if(!ctx || !currentPoint) return

            onDraw({ctx, currentPoint, prevPoint: prevPoint.current})
            prevPoint.current = currentPoint
        }

        const computeTouchPointsInCanvas = (e:TouchEvent) => {
            const canvas = canvasRef.current
            if(!canvas) return
            const rect = canvas.getBoundingClientRect()
            const x = e.touches[0].clientX - rect.left;
            const y = e.touches[0].clientY - rect.top;

            return { x, y }
        }


        const computeMousePointsInCanvas = (e:MouseEvent) => {
            const canvas = canvasRef.current
            if(!canvas) return
            const rect = canvas.getBoundingClientRect()
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            return { x, y }
        }

        const mouseUpHandler = () => {
            setMouseDown(false);
            prevPoint.current = null;
        }

        const touchEndHandler = () => {
            setTouchStart(false)
            prevPoint.current = null;
        }

        //Add event listeners
        canvasRef.current?.addEventListener('mousemove', mouseMovehandler)
        canvasRef.current?.addEventListener('touchmove', touchMoveHandler)
        window.addEventListener('mouseup', mouseUpHandler)
        window.addEventListener('touchend', touchEndHandler)
        return () => {
            canvasRef.current?.removeEventListener('mousemove', mouseMovehandler)
            canvasRef.current?.removeEventListener('touchmove', touchMoveHandler)
            window.removeEventListener('mouseup', mouseUpHandler)
            window.removeEventListener('touchend', touchEndHandler)
        }
    }, [onDraw])

    return { canvasRef, onMouseDown, onTouchStart }
}