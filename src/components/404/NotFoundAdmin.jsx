import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/notfound.module.scss";

export const NotFoundAdmin = () => {
  const navigate = useNavigate();

  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  useEffect(() => {
    function getMousePointer(e) {
      setX(e.clientX);
      setY(e.clientY);
    }

    window.addEventListener("mousemove", getMousePointer);
    return () => {
      window.removeEventListener("mousemove", getMousePointer);
    };
  }, []);

  let transformStyleForLeftBalls = {
    transform: `translate(-${Math.round(x) / 10}px, ${Math.round(y) / 15}px)`,
  };
  let transformStyleForRightBalls = {
    transform: `translate(${Math.round(x) / 10}px, -${Math.round(y) / 15}px)`,
  };
  let transformStyleForCenterBalls = {
    transform: `translate(${Math.round(x) / 5}px, ${Math.round(y) / 10}px)`,
  };

  return (
    <div className={styles.pageWrapper}>
      <div
        className={`${styles.bubble}`}
        style={transformStyleForLeftBalls}
      ></div>
      <div className={styles.bubble} style={transformStyleForLeftBalls}></div>
      <div className={styles.bubble} style={transformStyleForCenterBalls}></div>
      <div className={styles.bubble} style={transformStyleForRightBalls}></div>
      <div className={styles.bubble} style={transformStyleForRightBalls}></div>
      <div className={styles.main}>
        <h1>404</h1>
        <p>
          It looks like you're lost...
          <br />
          That's a trouble?
        </p>
        <button
          type="button"
          className="btnPrimary btn--large"
          onClick={() => navigate("/login/admin")}
        >
          Click to go to Login Screen
        </button>
        {navigate("/login/admin")}
      </div>
    </div>
  );
};
