import React, { useState } from "react";
import { Document, Page } from "react-pdf/dist/esm/entry.vite";
import { URL } from "../context/appContext";
import ShapeCover from "./shapeCover";

const RenderPdf = ({
  shape,
  updateShapesOnDb,
  setShapes,
  setUndoShapes,
  isMousePressed,
}) => {
  const [numOfPages, setNumOfPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    console.log("pdf loaded");
    setNumOfPages(numPages);
  }
  function prvClickHandler() {
    setPageNumber((prv) => {
      if (prv > 1) {
        return prv - 1;
      }
      return prv;
    });
  }
  function nextClickHandler() {
    setPageNumber((prv) => {
      if (prv < numOfPages) {
        return prv + 1;
      }
      return prv;
    });
  }

  return (
    <>
      <ShapeCover
        shape={shape}
        setShapes={setShapes}
        setUndoShapes={setUndoShapes}
        isMousePressed={isMousePressed}
        updateShapesOnDb={updateShapesOnDb}
        pdfOptionsObj={{
          prvClickHandler,
          nextClickHandler,
          numOfPages,
          pageNumber,
        }}
      >
        <foreignObject
          x={shape?.props.x}
          y={shape?.props.y}
          width={shape?.props.width}
          height={shape?.props.height * 1.2}
        >
          <Document
            file={URL + "uploads/" + shape.props.filename}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            <Page height={shape?.props.height * 1.5} pageNumber={pageNumber} />
          </Document>
        </foreignObject>
        <rect
          style={shape?.style}
          id={shape?.id}
          x={shape?.props.x}
          y={shape?.props.y}
          width={shape?.props.width}
          height={shape?.props.height * 1.2}
          fill={"#0000"}
        />
      </ShapeCover>
    </>
  );
};

export default RenderPdf;
