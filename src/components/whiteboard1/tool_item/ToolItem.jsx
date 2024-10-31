import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "../../../styles/whiteboard.module.scss";
import { Square } from "@icon-park/react";
import { toast } from "react-hot-toast";

export const ToolItem = ({
  position,
  Icon,
  tooltipText,
  name,
  size,
  iconColor,
  strokeWidth,
  disabled,
  onClick,
  ...props
}) => {
  // write function for tooltip when user mouse over then after 3 second text display and when user mouse out then text display will be none
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipInterval, setTooltipInterval] = useState("");

  const onMouseOver = () => {
    const interval = setTimeout(() => setShowTooltip(true), 1000);
    setTooltipInterval(interval);
  };

  const onMouseOut = () => {
    setShowTooltip(false);
    clearTimeout(tooltipInterval);
  };

  const tooltipStyle = {
    top: position === "top" ? -44 : "50%",
    left: position === "left" ? 44 : "50%",
  };
  const buttonSizeStyle = {
    width: size || 44,
    height: size || 44,
  };
  return (
    <div className={styles.toolItem}>
      <button
        {...props}
        style={buttonSizeStyle}
        className={styles.toolItemIcon}
        disabled={disabled}
        onMouseEnter={onMouseOver}
        onMouseLeave={onMouseOut}
        onClick={()=>onClick(true)}
        // onClick={() => toast.success(`${name} clicked`)}
      >
        <Icon
          size={`${Math.round(size / 1.8333)}`}
          theme="outline"
          fill={iconColor || "#333"}
          strokeWidth={strokeWidth || 3}
        />
      </button>
      {showTooltip ? (
        <div className={styles.toolItemTooltip}>{tooltipText}</div>
      ) : null}
    </div>
  );
};

// write to define the props for the tooltip
ToolItem.propTypes = {
  position: PropTypes.string.isRequired,
  tooltipText: PropTypes.string.isRequired,
  name: PropTypes.string,
  Icon: PropTypes.any,
  disabled: PropTypes.bool,
};
ToolItem.defaultProps = {
  position: "top",
  tooltipText: "Tooltip",
  name: "Tool",
  Icon: Square,
  disabled: false,
};
