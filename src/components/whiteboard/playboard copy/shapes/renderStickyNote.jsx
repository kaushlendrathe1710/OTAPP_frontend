import React from 'react';

const RenderStickyNote = ({ shape }) => {
    return (
        <>
            {/* <text x={shape?.props.x} y={shape?.props.y} width={shape?.props.w} height={shape?.props.h}>Helloooo</text> */}
            <rect
                id={shape?.id}
                x={shape?.props.x}
                y={shape?.props.y}
                width={shape?.props.w}
                height={shape?.props.h}
                style={{ 
                    ...shape?.style, 
                    fill: 'rgb(255, 235, 153)',  
                    filter: 'drop-shadow(2px 5px 4px #0005)'
                }}

            />
            <foreignObject id={shape.id} x={shape?.props.x} y={shape?.props.y} width={shape?.props.w} height={shape?.props.h}>
                <p id={shape.id} style={{textAlign: 'center', marginTop: '40%', border: 'none', outline: 'none', cursor: 'text'}} contentEditable suppressContentEditableWarning>{shape?.props.text}</p>
            </foreignObject>
        </>
    );
}

export default RenderStickyNote;
