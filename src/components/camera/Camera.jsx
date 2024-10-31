import React, { useState, useEffect } from "react";
import Webcam from "react-webcam";
import styles from "../../styles/chatComponents.module.scss";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

function Camera({ setAttachmentFiles, setFileData }) {
  const [deviceId, setDeviceId] = React.useState({});
  const [devices, setDevices] = React.useState([]);
  const [captureImages, setCaptureImages] = useState([]);

  const handleDevices = React.useCallback(
    (mediaDevices) =>
      setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
    [setDevices]
  );

  React.useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices);
  }, [handleDevices]);

  const webcamRef = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState(null);
  // const capture = React.useCallback(
  //   () => {
  //     try {
  //       const imageSrc = webcamRef.current.getScreenshot();
  //       let imgObj = {
  //         name: `Captue img ${captureImages.length}`,
  //         src: imageSrc,
  //       }
  //       // setImgSrc(imageSrc);
  //       setCaptureImages(prev=>[...prev, imgObj]);
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   },
  //   [webcamRef]
  // );

  const capture = () => {
    try {
      const imageSrc = webcamRef.current.getScreenshot();
      const imageType = webcamRef.current.props.screenshotFormat;
      // console.log(webcamRef.current);
      let imgObj = {
        name: `Captue img ${captureImages.length + 1}`,
        imgSrc: imageSrc,
        type: imageType,
      };

      setFileData((prev) => {
        let imageData = new File(
          [imageSrc],
          `Captue img ${captureImages.length + 1}`,
          { lastModified: new Date(), type: imageType }
        );
        return [...prev, imageData];
      });
      setCaptureImages((prev) => [...prev, imgObj]);
    } catch (error) {
      console.log(error);
    }
  };
  // console.log(fileData,"file data image")

  useEffect(() => {
    // console.log("Capture images: ", captureImages)
    setAttachmentFiles((prev) => [...prev, ...captureImages]);
  }, [captureImages]);

  return (
    <>
      {devices.map((device, key) => (
        <div className={styles.cameraContainer}>
          <Webcam
            audio={false}
            // height={720}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            // width={1280}
            videoConstraints={videoConstraints && { deviceId: device.deviceId }}
          />
          {device.label || `Device ${key + 1}`}
          {/* <Webcam audio={false} videoConstraints={{ deviceId: device.deviceId }} />
            {device.label || `Device ${key + 1}`} */}
        </div>
      ))}
      <button className={styles.captureButton} onClick={capture}>
        Capture photo
      </button>
      {/* {imgSrc && (console.log(imgSrc)
        <img src={imgSrc} />
      )} */}
      {/* {
        captureImages.lenght !== 0 && captureImages.map
      } */}
    </>
  );
}

export default Camera;
