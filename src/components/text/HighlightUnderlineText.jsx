import React from "react";
import { motion } from "framer-motion";
import hightlightUnderline from "../../assets/elements/highlight_underline.svg";
import styles from "../../styles/doodles.module.scss";

const HighlightUnderlineText = ({
  text,
  hueRotate = 0,
  underlineWidth = 100,
}) => {
  return (
    text &&
    typeof text === "string" && (
      <div className={styles.highlightUnderlineText}>
        <span>{text}</span>
        <motion.img
          initial={{ width: 0 }}
          whileInView={{ width: `${underlineWidth}%` }}
          transition={{ duration: 0.35 }}
          viewport={{once: true}}
          style={{
            filter: `hue-rotate(${hueRotate}deg)`,
            width: `${underlineWidth}%`,
          }}
          src={hightlightUnderline}
          alt="underline"
        />
      </div>
    )
  );
};

export default HighlightUnderlineText;
