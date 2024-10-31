import React, { useState, useEffect, useContext, useRef } from "react";
import { BoardContext, BUTTONS, SHAPES } from "../../../context/boardContext";
import ShapeProperties2 from "../utils/ShapeProperties2";
import ShapeProperties from "./shapeProperties";

const ShapeCover = ({
  children,
  shape,
  setUndoShapes,
  isMousePressed,
  setShapes,
  updateShapesOnDb,
  pdfOptionsObj,
}) => {
  const [rectProps, setRectProps] = useState({});
  const [selected, setSelected] = useState(false);
  const [shapeGStyle, setShapeGStyle] = useState({});
  const {
    selectedShapeIds,
    setSelectedShapeIds,
    selectedBtn,
    movingShape,
    setMovingShape,
    setShapePropCompVals,
  } = useContext(BoardContext);

  const gRef = useRef(null);

  useEffect(() => {}, []);

  useEffect(() => {
    let bbox = gRef.current.getBBox();

    let style = {
      fill: "#fff0",
      stroke: "blueviolet",
      strokeWidth: "2px",
    };

    let x = bbox.x - 5;
    let y = bbox.y - 5;
    let w = bbox.width + 10;
    let h = bbox.height + 10;

    setRectProps({
      x: x,
      y: y,
      w: w,
      h: h,
      style: style,
    });

    if (selectedShapeIds.includes(shape.id)) {
      setSelected(true);
      // console.log(rectProps);
    } else {
      setSelected(false);
    }
  }, [selectedShapeIds, movingShape]);

  function shapeClickHandler(e) {
    e.stopPropagation();
    // alert('Clicked')
    // if (selectedBtn === BUTTONS.SELECT.SELECT) {
    //     if (selected) {
    //         // setSelectedShapeIds(prv => {
    //         //     let newIds = prv.filter(id => { return id !== shape.id });
    //         //     return newIds
    //         // })
    //         setSelectedShapeIds([])
    //     } else {
    //         // setSelectedShapeIds(prv => [...prv, shape.id])\
    //         setSelectedShapeIds([shape.id])
    //     }
    // }
    let bbox = gRef.current.getBBox();
    if (shape) {
      setShapePropCompVals({
        x: bbox.x + 20,
        y: bbox.y + bbox.height + 60,
        shape: shape,
      });
    }
  }
  function shapeMouseMove(e) {
    // e.stopPropagation()
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
      if (elmId) {
        setShapes((prv) => {
          let index = prv.findIndex((shp) => shp.id === elmId);
          // console.log("index", index);
          if (index !== undefined && prv) {
            // console.log("inside index");
            // let elm = document.getElementById(elmId);
            let elm = gRef.current;

            let mx = e.movementX;
            let my = e.movementY;
            let pmx = parseInt(elm.style.transform.split(",")[0].split("(")[1]);
            let pmy = parseInt(elm.style.transform.split(",")[1]);
            elm.style.transform = `translate(${pmx + mx}px, ${pmy + my}px)`;
            prv[index].props.translateX = pmx + mx;
            prv[index].props.translateY = pmy + my;
          }
          return prv;
        });
      }
    }
  }
  function onMouseOver(e) {
    if (selectedBtn === BUTTONS.SELECT.SELECT) {
      e.target.style.cursor = "move";
    }
  }
  function onMouseOut(e) {
    e.target.style.cursor = "auto";
  }

  function onMouseUp(e) {
    // e.stopPropagation()
    setMovingShape(false);
    if (selectedBtn === BUTTONS.SELECT.SELECT) {
      setSelectedShapeIds([shape.id]);
      updateShapesOnDb();
    }
  }

  return (
    <>
      <g
        ref={gRef}
        onMouseUp={onMouseUp}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        onClick={shapeClickHandler}
        onMouseMove={shapeMouseMove}
        // style={{ ...shapeGStyle }}
        style={{
          transform: `translate(${shape?.props?.translateX}px,${shape?.props?.translateY}px)`,
        }}
      >
        {selected && !movingShape && (
          <rect
            x={rectProps.x}
            y={rectProps.y}
            width={rectProps.w}
            height={rectProps.h}
            style={rectProps.style}
          />
        )}
        {children}
        {/* {(selected && !movingShape) && <ShapeProperties rectProps={rectProps} />} */}
      </g>
      {selected && !movingShape && (
        <ShapeProperties
          pdfOptionsObj={pdfOptionsObj}
          setShapes={setShapes}
          shape={shape}
          rectProps={rectProps}
        />
      )}
    </>
  );
};

export default ShapeCover;
