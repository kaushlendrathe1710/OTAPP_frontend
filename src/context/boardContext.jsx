import React, { createContext, useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";
// import { SocketContext } from './socketProvider';
import userContext from "../context/userContext";

export const BoardContext = createContext({});
import { AppContext, URL } from "../context/appContext";

//Shapes constants
export const SHAPES = {
  PENCIL: "pencil",
  RECTANGLE: "rectangle",
  CIRCLE: "circle",
  TRIANGLE: "triangle",
  DIAMOND: "diamond",
  HEXAGON: "hexagon",
  LINE: {
    SIMPLE: "simple",
    ONE_ARROW: "one_arrow",
    TWO_ARROW: "two_arrow",
  },
  TEXT: "text",
  STICKY_NOTE: "sticky_note",
  IMAGE: "image",
  PDF: "PDF",
};

//Button Constants
export const BUTTONS = {
  SELECT: {
    SELECT: "select",
    MOVE: "move",
  },
  DRAW: {
    PENCIL: SHAPES.PENCIL,
    HIGHLIGHTER: "highlighter",
  },
  SHAPES: {
    RECTANGLE: SHAPES.RECTANGLE,
    CIRCLE: SHAPES.CIRCLE,
    TRIANGLE: SHAPES.TRIANGLE,
    DIAMOND: SHAPES.DIAMOND,
    HEXAGON: SHAPES.HEXAGON,
  },
  LINE: SHAPES.LINE,
  TEXT: SHAPES.TEXT,
  STICKY_NOTE: SHAPES.STICKY_NOTE,
  UPLOAD: "upload",
  ERASOR: "erasor",
  COLORS: "colors",
};

//Stroke sizes constants
export const STROKE_SIZES = {
  STROKE_THIN: "stroke_thin",
  STROKE_MID: "stroke_mid",
  STROKE_THICK: "stroke_thick",
};

const BoardContextProvider = ({ children }) => {
  const [selectedBtn, setSelectedBtn] = useState(BUTTONS.SELECT.SELECT);
  const [selectedStrokeSize, setSelectedStrokeSize] = useState(
    STROKE_SIZES.STROKE_MID
  );
  const [selectedStrokeColor, setSelectedStrokeColor] = useState("#000");
  const [selectedFillColor, setSelectedFillColor] = useState("#ffffff00");
  const [whiteboard, setWhiteboard] = useState(null);
  const [allWhiteboards, setAllWhiteboards] = useState(null);
  const [selectedShapeIds, setSelectedShapeIds] = useState([]);
  const [movingShape, setMovingShape] = useState(false);
  const [shapePropCompVals, setShapePropCompVals] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [boardUsers, setBoardUsers] = useState([]);

  // const { socket, setSocket, setSocketId } = useContext(userContext);
  const { socket } = useContext(userContext);
  const { user } = useContext(AppContext);

  useEffect(() => {
    // console.log("board from context", whiteboard);
    if (whiteboard) {
      let roomId = whiteboard._id;
      let id = Math.random();

      // console.log("board", whiteboard);
      if (roomId && id) {
        // console.log("id", roomId);
        // let newSocket = io(URL, {
        //     query: { roomId, user: JSON.stringify({ id: user._id, role: user.role, userName: user.name, visible: user.visible }) },
        //     transports: ["websocket"],
        // });
        // console.log("socket", newSocket);
        // if (newSocket) {
        //     // console.log('socket', newSocket);
        //     newSocket?.on("my_socketId", (socketId) => {
        //         // setSocketId(socketId);
        //     });
        //     setSocket(newSocket);
        //     return () => {
        //         newSocket?.removeListener("my_socketId");
        //         newSocket.close();
        //     };
        // }
        // socket?.emit('WB_joined-board', {})
      }
    }
  }, [socket]);

  return (
    <BoardContext.Provider
      value={{
        selectedBtn,
        setSelectedBtn,
        selectedStrokeSize,
        setSelectedStrokeSize,
        selectedStrokeColor,
        setSelectedStrokeColor,
        selectedFillColor,
        setSelectedFillColor,
        whiteboard,
        setWhiteboard,
        allWhiteboards,
        setAllWhiteboards,
        selectedShapeIds,
        setSelectedShapeIds,
        movingShape,
        setMovingShape,
        shapePropCompVals,
        setShapePropCompVals,
        selectedImage,
        setSelectedImage,
        boardUsers,
        setBoardUsers,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};

export default BoardContextProvider;
