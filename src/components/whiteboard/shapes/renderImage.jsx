import React from "react";
import { URL } from "../../../context/appContext";

const RenderImage = ({ shape }) => {
  return (
    <>
      <image
        id={shape?.id}
        style={shape?.style}
        x={shape?.props.x}
        y={shape?.props.y}
        href={"uploads/" + shape?.props.filename}
        height={shape?.props.height}
      />
      {/* <foreignObject
                onMouseMove={
                    () => { console.log('forign Object') }
                }
                id={shape?.id}
                x={shape.props.x} y={shape.props.y}
                width={300} height={300}
                style={{ pointerEvents: 'none' }}
            >
                <img id={shape?.id} width={300} src={URL + 'images/' + shape.props.filename} alt="" />
            </foreignObject>
            <rect style={shape?.style} id={shape?.id} x={shape?.props.x} y={shape?.props.y} width={shape?.props.width} height={shape?.props.height} fill={'#0000'} /> */}
    </>
  );
};

export default RenderImage;
