import React, { useContext } from 'react';
import { BoardContext } from '../context/boardContext';

const SvgDefs = () => {
    const { selectedStrokeColor } = useContext(BoardContext);

    return (
        <>
            <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7"
                    refX="0" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill={selectedStrokeColor} />
                </marker>
                <marker id="startarrow" markerWidth="10" markerHeight="7"
                    refX="10" refY="3.5" orient="auto">
                    <polygon points="10 0, 10 7, 0 3.5" fill={selectedStrokeColor} />
                </marker>
            </defs>
        </>
    );
}

export default SvgDefs;
