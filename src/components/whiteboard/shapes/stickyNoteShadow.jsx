import React from 'react';

const StickyNoteShadow = ({ stickyShadowProps }) => {
    return (
        <rect x={stickyShadowProps.x} y={stickyShadowProps.y}
            width={stickyShadowProps.w} height={stickyShadowProps.h}
            fill='rgba(255, 235, 153, 0.6)'
        >

        </rect>
    );
}

export default StickyNoteShadow;
