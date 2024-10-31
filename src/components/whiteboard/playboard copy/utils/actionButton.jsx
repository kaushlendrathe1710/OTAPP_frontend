import React from 'react';
import styles from './actionButton.module.css'

const ActionButton = ({ buttonName, selectedBtn, onClick, onMouseMove, onMouseDown, onMouseUp, children, style }) => {

    function hasActiveNestedButtons(obj) {
        return (Object.values(obj).filter(vl => { if (selectedBtn === vl) { return true } }).length > 0)
    }

    return (
        <button
            // ref={ref}
            onClick={onClick}
            onMouseMove={onMouseMove}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            className={
                styles.actionBtn
                + ' ' +
                (typeof (buttonName) !== 'object' && selectedBtn === buttonName ? styles.selectedBtn : '')
                + ' ' +
                (typeof (buttonName) === 'object' && hasActiveNestedButtons(buttonName) ? styles.selectedBtn : '')

            }
            style={style}
        >
            {children}
        </button>
    );
}

export default ActionButton;
