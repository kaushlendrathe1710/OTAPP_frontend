import React, { useContext, useState, useEffect } from "react";
import { BoardContext } from "../context/boardContext";
import styles from "./shapeProperties2.module.css";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

const ShapeProperties2 = ({ setShapes }) => {
  const { shapePropCompVals } = useContext(BoardContext);
  const [style, setStyle] = useState({});

  useEffect(() => {
    if (shapePropCompVals) {
      setStyle({
        top: shapePropCompVals.y,
        left: shapePropCompVals.x,
        transform: `translate(${shapePropCompVals?.shape?.props?.translateX}px, ${shapePropCompVals?.shape?.props?.translateY}px)`,
      });
    }
  }, [shapePropCompVals]);

  function fillColorInputChangeHander(e) {
    console.log(shapePropCompVals?.shape);
    let color = e.target.value;
    setShapes((prv) => {
      let index = prv.findIndex(
        (shp) => shp.id === shapePropCompVals?.shape?.id
      );
      if (index >= 0) {
        prv[index].style.fill = color;
      }
      return prv;
    });
  }
  function strokeColorInputChangeHander(e) {
    let color = e.target.value;
    setShapes((prv) => {
      let index = prv.findIndex(
        (shp) => shp.id === shapePropCompVals?.shape?.id
      );
      if (index >= 0) {
        prv[index].style.stroke = color;
      }
      return prv;
    });
  }
  function strokeWidthChangeHandler(e) {
    let width = e.target.value;
    setShapes((prv) => {
      let index = prv.findIndex(
        (shp) => shp.id === shapePropCompVals?.shape?.id
      );
      if (index >= 0) {
        prv[index].style.strokeWidth = width;
      }
      return prv;
    });
  }

  return (
    <div style={style} className={styles.shapeProperitesBox}>
      <div className={styles.option}>
        <label>
          <div
            style={{
              border: "2px solid " + shapePropCompVals?.shape?.style?.stroke,
            }}
            className={styles.strokeColor}
          />
          <input
            onInput={strokeColorInputChangeHander}
            type="color"
            style={{ visibility: "hidden", position: "absolute" }}
          />
        </label>
      </div>
      <div className={styles.vl} />
      <div className={styles.option}>
        <label>
          <div
            style={{ backgroundColor: shapePropCompVals?.shape?.style?.fill }}
            className={styles.fillColor}
          ></div>
          <input
            onInput={fillColorInputChangeHander}
            id="shapeSelectColor"
            type="color"
            style={{
              visibility: "hidden",
              position: "absolute",
              border: "0px",
              width: "60%",
              height: "60%",
            }}
            className={styles.fillColor}
          />
        </label>
      </div>
      <div className={styles.vl} />
      <div style={{ width: "40px" }} className={styles.option}>
        <input
          onInput={strokeWidthChangeHandler}
          min={1}
          defaultValue={shapePropCompVals?.shape?.style?.strokeWidth}
          type="number"
          style={{
            width: "100%",
            border: "none",
            outline: "none",
            paddingLeft: "2px",
            textAlign: "center",
          }}
        />
      </div>
      <div className={styles.vl} />
      <div className={styles.option}>
        <HiOutlineDotsHorizontal />
      </div>
    </div>
  );
};

export default ShapeProperties2;
