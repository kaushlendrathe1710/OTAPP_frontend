import React, { useState, useEffect } from "react";
import ShapeCover from "./shapeCover";

const RenderText = ({ shape, onClick, onMouseMove, onMouseUp }) => {
  const [text, setText] = useState([]);

  useEffect(() => {
    let textParts = shape?.props?.value?.split("\n");
    console.log(textParts);
    setText(textParts);
    return () => {};
  }, []);
  return (
    <>
      <text
        id={shape.id}
        key={shape.id}
        x={shape.props.x}
        y={shape.props.y}
        style={shape.style}
      >
        {text?.map((txt, i) => (
          <tspan key={txt + shape.id} id={shape.id} dy={i * 20}>
            {txt}
            <br />
          </tspan>
        ))}
      </text>
    </>
  );
};

export default RenderText;
