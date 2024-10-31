import { useFormik } from "formik";
import React, { useEffect, useState, useContext } from "react";
import { toast } from "react-hot-toast";
import { useClickOutside } from "../../hooks/useClickOutside";
import glassStyles from "../../styles/glass.module.scss";
import * as Yup from "yup";
import userContext from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import { useWhiteboard } from "../../context/WhiteboardContext";

export const CreateSessionModal = ({ setIsCreateSessionModalOpen }) => {
  const modalRef = useClickOutside(handleCloseModal);
  const { userData, socket } = useContext(userContext);
  const navigate = useNavigate();

  const whiteboard = useWhiteboard();

  const [roomId, setRoomId] = useState(self.crypto.randomUUID());

  const formik = useFormik({
    initialValues: {
      roomId: roomId,
      sessionName: "",
    },
    validationSchema: Yup.object({
      roomId: Yup.string().required("Room ID is required"),
      sessionName: Yup.string().required("Session name is required"),
    }),
    onSubmit: (values) => {
      const roomData = {
        ...values,
        userData: userData?.name,
        host: true,
        presenter: true,
      };
      console.log("room data: ", roomData);
      handleCloseModal();
      // socket.emit("wb-userJoined", roomData);
      //   setJoinedUsers(prev=>[...prev, {...userData?.name}])
      setTimeout(() => {
        navigate(`/whiteboard/${values.roomId}`);
      }, 100);
    },
  });

  // // socket events
  // useEffect(() => {
  //   socket.on("wb-userIsJoined", (data) => {
  //     console.log("user joined: ", data);
  //     // setRoomId(data.roomId);
  //   });

  //   return ()=>{
  //     socket.off("wb-userIsJoined")
  //   }
  // }, []);

  useEffect(() => {
    document.getElementById("mainSidebar").style.zIndex = "0";
    document.getElementById("mainSidebarButton").style.zIndex = "0";
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
      document.getElementById("mainSidebar").style.zIndex = "100";
      document.getElementById("mainSidebarButton").style.zIndex = "101";
    };
  }, []);

  function handleCloseModal() {
    setIsCreateSessionModalOpen(false);
  }

  function handleCopyRoomId() {
    navigator.clipboard.writeText(roomId);
    toast.success("Room Id copied successfully");
  }
  return (
    <div
      className={`${glassStyles.modalWrapper} ${glassStyles.modalCenterWrapper}`}
    >
      <div
        style={{
          maxWidth: "540px",
          minHeight: "fit-content",
          padding: ".5rem 1rem 1.5rem 1rem",
        }}
        className={glassStyles.modalBoxWrapper}
        ref={modalRef}
      >
        <div className={glassStyles.header}>
          <h3>Create whiteboard</h3>
        </div>
        <div className={glassStyles.formWrapper} style={{ marginTop: ".5rem" }}>
          <form onSubmit={formik.handleSubmit}>
            <div className={glassStyles.inputWrapper}>
              <label htmlFor="sessionName">Session name</label>
              <input
                type="text"
                id="sessionName"
                name="sessionName"
                value={formik.values.sessionName}
                onChange={formik.handleChange}
                placeholder="Session name"
                className={
                  formik.errors.sessionName &&
                  formik.touched.sessionName &&
                  glassStyles.errorBorder
                }
              />
              {formik.errors.sessionName && formik.touched.sessionName ? (
                <div className={glassStyles.error}>
                  {formik.errors.sessionName}
                </div>
              ) : null}
            </div>
            <div className={glassStyles.inputWrapper}>
              <label htmlFor="roomId">Room Id</label>
              <div data-type="phone-wrapper">
                <input
                  type="text"
                  id="roomId"
                  name="roomId"
                  value={roomId}
                  placeholder="Room Id"
                  readOnly
                  className={
                    formik.errors.roomId &&
                    formik.touched.roomId &&
                    glassStyles.errorBorder
                  }
                />
                <button
                  onClick={handleCopyRoomId}
                  type="button"
                  className="btnInfo btn--medium"
                >
                  Copy
                </button>
              </div>
            </div>
            <button type="submit" className="btnPrimary btn--large">
              Create Room
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
