import React, { useContext, useState, useEffect } from "react";
import { BoardContext, SHAPES } from "../context/boardContext";
import styles from "./shapeProperties.module.css";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

const ShapeProperties = ({ setShapes, shape, rectProps, pdfOptionsObj }) => {
  let style = {
    top: shape?.props.y,
    left: shape?.props.x,
    transform: `translate(${shape?.props?.translateX}px, ${shape?.props?.translateY}px)`,
  };

  // useEffect(() => {
  //     if (shapePropCompVals) {
  //         setStyle({
  //             top: shapePropCompVals.y,
  //             left: shapePropCompVals.x,
  //             transform: `translate(${shapePropCompVals?.shape?.props?.translateX}px, ${shapePropCompVals?.shape?.props?.translateY}px)`
  //         })
  //     }
  // }, [shapePropCompVals]);

  function fillColorInputChangeHander(e) {
    console.log(shape);
    let color = e.target.value;
    setShapes((prv) => {
      let index = prv.findIndex((shp) => shp.id === shape?.id);
      if (index >= 0) {
        prv[index].style.fill = color;
      }
      return prv;
    });
  }
  function strokeColorInputChangeHander(e) {
    let color = e.target.value;
    setShapes((prv) => {
      let index = prv.findIndex((shp) => shp.id === shape?.id);
      if (index >= 0) {
        prv[index].style.stroke = color;
      }
      return prv;
    });
  }
  function strokeWidthChangeHandler(e) {
    let width = e.target.value;
    setShapes((prv) => {
      let index = prv.findIndex((shp) => shp.id === shape?.id);
      if (index >= 0) {
        prv[index].style.strokeWidth = width;
      }
      return prv;
    });
  }

  return (
    <foreignObject
      x={rectProps?.x + shape?.props.translateX}
      y={rectProps?.y + shape?.props.translateY + rectProps.h + 10}
      width={rectProps.w > 150 ? rectProps.w : 200}
      height={60}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={styles.shapeProperitesBox}
      >
        {shape?.type !== SHAPES.PDF && shape?.type !== SHAPES.IMAGE && (
          <>
            <div className={styles.option}>
              <label>
                <div
                  style={{ border: "2px solid " + shape?.style?.stroke }}
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
                  style={{ backgroundColor: shape?.style?.fill }}
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
                defaultValue={shape?.style?.strokeWidth}
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
          </>
        )}

        {shape?.type === SHAPES.PDF && (
          <>
            <div style={{ width: "40px" }} className={styles.option}>
              <button onClick={pdfOptionsObj?.prvClickHandler}>Prv</button>
            </div>
            <div style={{ width: "40px" }} className={styles.option}>
              {pdfOptionsObj?.pageNumber} / {pdfOptionsObj?.numOfPages}
            </div>
            <div style={{ width: "40px" }} className={styles.option}>
              <button onClick={pdfOptionsObj?.nextClickHandler}>Next</button>
            </div>
          </>
        )}

        <div className={styles.vl} />
        <div className={styles.option}>
          <HiOutlineDotsHorizontal />
        </div>
      </div>
    </foreignObject>
  );
};

export default ShapeProperties;
