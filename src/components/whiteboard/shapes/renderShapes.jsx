import React, { useContext, useState } from "react";
import { BoardContext, BUTTONS, SHAPES } from "../../../context/boardContext";
import RenderImage from "./renderImage";
import RenderPdf from "./renderPdf";
import RenderStickyNote from "./renderStickyNote";
import RenderText from "./renderText";
import ShapeCover from "./shapeCover";

const RenderShapes = ({
  shapes,
  setShapes,
  isMousePressed,
  setUndoShapes,
  updateShapesOnDb,
}) => {
  const { selectedBtn, setMovingShape } = useContext(BoardContext);
  const [curIndx, setCurIndx] = useState();

  function onShapeClick(e) {
    // console.log(e.target.id)

    if (selectedBtn === BUTTONS.ERASOR) {
      setShapes((prv) => {
        let shps = prv.filter((itm) => {
          if (itm.id === e.target.id) {
            setUndoShapes((prv) => [...prv, itm]);
            return false;
          }
          return true;
        });
        return shps;
      });
    }
  }

  function shapeMouseDown() {
    // setCurIndx()
  }

  function shapeMouseMove(e) {
    if (selectedBtn === BUTTONS.ERASOR && isMousePressed) {
      // console.log('Erasor', e)
      setShapes((prv) => {
        let shps = prv.filter((itm) => {
          if (itm.id === e.target.id) {
            setUndoShapes((prv) => [...prv, itm]);
            return false;
          }
          return true;
        });
        return shps;
      });
    }
    if (selectedBtn === BUTTONS.SELECT.SELECT && isMousePressed) {
      // console.log('Select', e)
      setMovingShape(true);
      let elmId = e.target.id;
      let ox = e.nativeEvent.offsetX;
      let oy = e.nativeEvent.offsetY;

      setShapes((prv) => {
        let index = prv.findIndex((shp) => shp.id === elmId);
        console.log("index", index);
        if (index !== undefined) {
          console.log("inside index");
          let elm = document.getElementById(elmId);

          let mx = e.movementX;
          let my = e.movementY;
          let pmx = parseInt(elm.style.transform.split(",")[0].split("(")[1]);
          let pmy = parseInt(elm.style.transform.split(",")[1]);
          // console.log(pmx, pmy, prv[index]);
          elm.style.transform = `translate(${pmx + mx}px, ${pmy + my}px)`;
          prv[index].style.transform = `translate(${pmx + mx}px, ${
            pmy + my
          }px)`;
        }
        return prv;
      });
      // setShapes(prv => {
      //     let index = prv.findIndex(shp => shp.id === elmId);;
      //     console.log('index', index)
      //     if (index !== undefined) {
      //         console.log('inside index')
      //         let elm = document.getElementById(elmId);
      //         if (prv[index].type === SHAPES.CIRCLE) {
      //             prv[index].props.cx = ox;
      //             elm.setAttribute('cx', ox);
      //             prv[index].props.cy = oy;
      //             elm.setAttribute('cy', oy);
      //         }
      //         if (prv[index].type === SHAPES.TEXT) {
      //             prv[index].props.x = ox - prv[index].props.value.length * 5;
      //             elm.setAttribute('x', ox - prv[index].props.value.length * 5);
      //             prv[index].props.y = oy + 10;
      //             elm.setAttribute('y', oy + 10);
      //         }
      //         if (prv[index].type === SHAPES.RECTANGLE) {
      //             prv[index].props.x = ox - prv[index].props.width / 2;
      //             elm.setAttribute('x', ox - prv[index].props.width / 2);
      //             prv[index].props.y = oy - prv[index].props.width / 2;
      //             elm.setAttribute('y', oy - prv[index].props.width / 2);
      //         }
      //         if (prv[index].type === SHAPES.PENCIL || prv[index].type === SHAPES.TRIANGLE || prv[index].type === SHAPES.DIAMOND || prv[index].type === SHAPES.HEXAGON || prv[index].type === SHAPES.LINE) {
      //             let mx = e.movementX;
      //             let my = e.movementY;
      //             let pmx = parseInt(elm.style.transform.split(',')[0].split('(')[1]);
      //             let pmy = parseInt(elm.style.transform.split(',')[1]);
      //             // console.log(pmx, pmy, prv[index]);
      //             elm.style.transform = `translate(${pmx + mx}px, ${pmy + my}px)`;
      //             prv[index].style.transform = `translate(${pmx + mx}px, ${pmy + my}px)`;
      //         }
      //     }
      //     return prv;
      // })
    }
  }

  function shapeMouseUp() {
    updateShapesOnDb();
  }

  return (
    <>
      {shapes?.map((shape) => {
        switch (shape.type) {
          case SHAPES.PENCIL:
            return (
              <ShapeCover
                updateShapesOnDb={updateShapesOnDb}
                setShapes={setShapes}
                isMousePressed={isMousePressed}
                setUndoShapes={setUndoShapes}
                key={shape.id}
                shape={shape}
              >
                <polyline
                  key={shape.id}
                  id={shape.id}
                  style={{ ...shape.style }}
                  // onClick={onShapeClick}
                  // onMouseMove={shapeMouseMove}
                  // onMouseDown={shapeMouseDown}
                  // onMouseUp={shapeMouseUp}
                  points={shape.props.points}
                />
              </ShapeCover>
            );
          case SHAPES.CIRCLE:
            return (
              <ShapeCover
                updateShapesOnDb={updateShapesOnDb}
                setShapes={setShapes}
                isMousePressed={isMousePressed}
                setUndoShapes={setUndoShapes}
                key={shape.id}
                shape={shape}
              >
                <ellipse
                  id={shape.id}
                  style={{ ...shape.style }}
                  cx={shape.props.cx}
                  cy={shape.props.cy}
                  rx={shape.props.rx}
                  ry={shape.props.ry}
                  // onClick={onShapeClick}
                  // onMouseMove={shapeMouseMove}
                  // onMouseUp={shapeMouseUp}
                />
              </ShapeCover>
            );
          case SHAPES.RECTANGLE:
            return (
              <ShapeCover
                updateShapesOnDb={updateShapesOnDb}
                setShapes={setShapes}
                isMousePressed={isMousePressed}
                setUndoShapes={setUndoShapes}
                key={shape.id}
                shape={shape}
              >
                <rect
                  key={shape.id}
                  id={shape.id}
                  style={{ ...shape.style }}
                  x={shape.props.x}
                  y={shape.props.y}
                  width={shape.props.width}
                  height={shape.props.height}
                  // onClick={onShapeClick}
                  // onMouseMove={shapeMouseMove}
                  // onMouseUp={shapeMouseUp}
                />
              </ShapeCover>
            );
          case SHAPES.TRIANGLE:
            return (
              <ShapeCover
                updateShapesOnDb={updateShapesOnDb}
                setShapes={setShapes}
                isMousePressed={isMousePressed}
                setUndoShapes={setUndoShapes}
                key={shape.id}
                shape={shape}
              >
                <polygon
                  key={shape.id}
                  id={shape.id}
                  style={{ ...shape.style }}
                  // onClick={onShapeClick}
                  // onMouseMove={shapeMouseMove}
                  points={shape.props.points}
                  // onMouseUp={shapeMouseUp}
                />
              </ShapeCover>
            );
          case SHAPES.DIAMOND:
            return (
              <ShapeCover
                updateShapesOnDb={updateShapesOnDb}
                setShapes={setShapes}
                isMousePressed={isMousePressed}
                setUndoShapes={setUndoShapes}
                key={shape.id}
                shape={shape}
              >
                <polygon
                  key={shape.id}
                  id={shape.id}
                  style={{ ...shape.style }}
                  // onClick={onShapeClick}
                  // onMouseMove={shapeMouseMove}
                  points={shape.props.points}
                  // onMouseUp={shapeMouseUp}
                />
              </ShapeCover>
            );
          case SHAPES.HEXAGON:
            return (
              <ShapeCover
                updateShapesOnDb={updateShapesOnDb}
                setShapes={setShapes}
                isMousePressed={isMousePressed}
                setUndoShapes={setUndoShapes}
                key={shape.id}
                shape={shape}
              >
                <polygon
                  key={shape.id}
                  id={shape.id}
                  style={{ ...shape.style }}
                  // onClick={onShapeClick}
                  // onMouseMove={shapeMouseMove}
                  points={shape.props.points}
                  // onMouseUp={shapeMouseUp}
                />
              </ShapeCover>
            );
          case SHAPES.LINE.ONE_ARROW:
            return (
              <ShapeCover
                updateShapesOnDb={updateShapesOnDb}
                setShapes={setShapes}
                isMousePressed={isMousePressed}
                setUndoShapes={setUndoShapes}
                key={shape.id}
                shape={shape}
              >
                <polyline
                  id={shape.id}
                  style={{ ...shape.style }}
                  // onClick={onShapeClick}
                  // onMouseMove={shapeMouseMove}
                  points={shape.props.points}
                  markerEnd="url(#arrowhead)"
                  // onMouseUp={shapeMouseUp}
                />
              </ShapeCover>
            );
          case SHAPES.LINE.TWO_ARROW:
            return (
              <ShapeCover
                updateShapesOnDb={updateShapesOnDb}
                setShapes={setShapes}
                isMousePressed={isMousePressed}
                setUndoShapes={setUndoShapes}
                key={shape.id}
                shape={shape}
              >
                <polyline
                  id={shape.id}
                  style={{ ...shape.style }}
                  points={shape.props.points}
                  markerEnd="url(#arrowhead)"
                  markerStart="url(#startarrow)"
                />
              </ShapeCover>
            );
          case SHAPES.TEXT:
            return (
              <ShapeCover
                key={shape.id}
                updateShapesOnDb={updateShapesOnDb}
                shape={shape}
                setShapes={setShapes}
                setUndoShapes={setUndoShapes}
                isMousePressed={isMousePressed}
              >
                <RenderText key={shape.id} shape={shape} />
              </ShapeCover>
            );
          case SHAPES.STICKY_NOTE:
            return (
              <ShapeCover
                key={shape.id}
                updateShapesOnDb={updateShapesOnDb}
                shape={shape}
                setShapes={setShapes}
                setUndoShapes={setUndoShapes}
                isMousePressed={isMousePressed}
              >
                <RenderStickyNote key={shape.id} shape={shape} />
              </ShapeCover>
            );
          case SHAPES.IMAGE:
            return (
              <ShapeCover
                key={shape.id}
                updateShapesOnDb={updateShapesOnDb}
                shape={shape}
                setShapes={setShapes}
                setUndoShapes={setUndoShapes}
                isMousePressed={isMousePressed}
              >
                <RenderImage key={shape.id} shape={shape} />
              </ShapeCover>
            );
          case SHAPES.PDF:
            return (
              <RenderPdf
                key={shape.id}
                shape={shape}
                updateShapesOnDb={updateShapesOnDb}
                setShapes={setShapes}
                setUndoShapes={setUndoShapes}
                isMousePressed={isMousePressed}
              />
            );
        }
      })}
    </>
  );
};

export default RenderShapes;
