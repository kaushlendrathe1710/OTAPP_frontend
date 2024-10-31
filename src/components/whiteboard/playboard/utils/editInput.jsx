import React, { useContext, useEffect, useRef } from "react";
import { BoardContext } from "../context/boardContext";
import styles from "./editInput.module.css";

const EditInput = ({ editInputPos, editInputChange, setTextShape }) => {
  const editInput = useRef(null);
  const { selectedStrokeColor } = useContext(BoardContext);
  useEffect(() => {
    let timeout = setTimeout(() => {
      editInput?.current?.focus();
      // editInput?.current?.select();
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  function testChange(e) {
    console.log(e);
  }
  return (
    <p
      ref={editInput}
      className={styles.editInput}
      contentEditable
      style={{
        position: "absolute",
        // top: editInputPos.y + 32 + "px",
        top: editInputPos.y + 60 + "px",
        left: editInputPos.x + -5 + "px",
        color: selectedStrokeColor,
      }}
      onInput={editInputChange}
      onBlur={setTextShape}
      tabIndex={0}
      suppressContentEditableWarning={true}
    ></p>

    // <form onSubmit={e => {
    //     e.preventDefault();
    //     editInput.current.value = '';
    //     setTextShape();
    // }}>
    //     <textarea name="editInput"
    //         id="editInput"
    //         cols="10"
    //         rows="1"
    //         className={styles.editInput}
    //         style={{
    //             position: 'absolute',
    //             top: editInputPos.y + 30 + 'px',
    //             left: editInputPos.x - 10 + 'px',
    //         }}
    //         ref={editInput}
    //         onChange={editInputChange}
    //         onBlur={setTextShape}
    //         type={'text'}
    //         placeholder={'ENTER TEXT'}
    //     >
    //     </textarea>
    // </form>
  );
};

export default EditInput;
