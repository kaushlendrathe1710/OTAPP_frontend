import { useContext } from "react";
import { useEffect, useState, useRef } from "react";
import userContext from "../../../context/userContext";
import { useWhiteboard } from "../../../context/WhiteboardContext";
import styles from "../../../styles/whiteboard.module.scss";

export const Board = ({ eraseAllDrawings, canErase }) => {
  const socket = useContext(userContext)?.socket;
  const [drawing, setDrawing] = useState(false);

  const [imgData, setImgData] = useState(null);
  const [canvasDataURL, setCanvasDataURL] = useState("");

  const currentRoomId = useWhiteboard()?.currentRoomId;

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const startDraw = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);
    setDrawing(true);
  };
  const stopDraw = () => {
    ctxRef.current.closePath();
    setDrawing(false);
  };
  const draw = (evt) => {
    const { nativeEvent } = evt;
    // console.log("buttons: ", evt.buttons);
    // evt.buttons = 0 -> when none of the buttons are pressed of mouse
    // evt.buttons = 1 -> when left button pressed  " " " " " " " " " "
    // evt.buttons = 2 -> when right " " " " " " " " " " " " " " " " " "
    // evt.buttons = 4 -> when scrollwheel  " " " " " " " " " " " " " " " " " "
    if (!drawing || evt.buttons !== 1) return;
    const { offsetX, offsetY } = nativeEvent;
    ctxRef.current.lineTo(offsetX, offsetY);
    ctxRef.current.stroke();

    const canvasUrl = canvasRef.current.toDataURL();

    // setCanvasDataURL(canvasUrl);
    socket.emit("wb-dataURL", { imgURL: canvasUrl, roomId: currentRoomId });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    // For supporting computers with higher screen densities, we double the screen density
    canvas.width = window.innerWidth * 1;
    canvas.height = window.innerHeight * 1;
    // canvas.style.width = `${window.innerWidth}px`;
    // canvas.style.height = `${window.innerHeight}px`;
    // Setting the context to enable us draw
    const ctx = canvas.getContext("2d");
    ctx.scale(1, 1);
    ctx.lineCap = "round";
    ctx.strokeStyle = "#AA14F0";
    ctx.lineWidth = 10;
    ctxRef.current = ctx;
  }, []);

  const clear = () => {
    ctxRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    // const canvasUrl = canvasRef.current.toDataURL();
    // console.log("clear canvas url: ", canvasUrl);
    socket.emit("wb-clearWhiteboard", currentRoomId);
    // socket.emit("wb-dataURL", { imgURL: canvasUrl, roomId: currentRoomId });
  };

  // useEffect(() => {
  // console.log("canvasDataURL: ", canvasDataURL);
  // console.log("canvas data changed");
  // socket.emit("wb-dataURL", { imgURL: canvasDataURL, roomId: currentRoomId });
  // }, [canvasDataURL]);

  useEffect(() => {
    if (socket) {
      socket.on("wb-dataUrlResponse", (data) => {
        setImgData(data);
        // console.log("img data ******");
        let image = new Image();
        image.src = data.imgURL;
        image.onload = () => {
          ctxRef.current.drawImage(image, 0, 0);
        };
        image.src = data.imgURL;

        // console.log("imgdata: ", data);
      });

      socket.on("wb-clearWhiteboardData", (data) => {
        if (data) {
          ctxRef.current.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
        }
      });
      // console.log("yes socket");
    }

    return () => {
      socket.off("wb-clearWhiteboardData");
      socket.off("wb-dataUrlResponse");
    };
  }, []);

  // useEffect(() => {
  // console.log("img data: ", imgData?.imgURL);
  // }, [imgData]);

  useEffect(() => {
    eraseAllDrawings(clear);
    // setCanvasDataURL("");
  }, [canErase]);

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDraw}
      onMouseUp={stopDraw}
      onMouseMove={draw}
      id="whiteboard"
      className={styles.Whiteboard}
    ></canvas>
  );
};
