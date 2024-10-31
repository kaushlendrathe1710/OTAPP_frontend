import React, { useContext, useState } from "react";
import UsersList from "./usersList";
import Modal from "./modal/modal";
import styles from "./addUser.module.css";
import { style } from "@mui/system";
import SelectedParticipents from "./selectedParticipents";
import api from "../../../../services/api";

const AddUser = ({ setOpenModal, selectedSession, refresh }) => {
  const [participents, setParticipents] = useState([]);
  const [viewAdmins, setViewAdmins] = useState(true);
  const [viewTutors, setViewTutors] = useState(false);
  const [viewStudents, setViewStudents] = useState(false);

  async function addParticipents() {
    setOpenModal(false);
    let trimmedParticipents = participents.map((prt) => {
      let newPartic = {
        _id: prt._id,
        name: prt.name,
        email: prt.email,
        userType: prt.userType,
      };
      return newPartic;
    });
    if (trimmedParticipents && selectedSession._id) {
      const res = await api.patch("whiteboard/addUser", {
        boardId: selectedSession._id,
        selectedUsers: trimmedParticipents,
      });
      // console.log(res)
      if (res.data.modifiedCount === 1) {
        refresh();
      }
    }
  }

  return (
    <Modal setOpenModal={setOpenModal}>
      {participents.length > 0 && (
        <>
          Selected Participents:
          <SelectedParticipents
            participents={participents}
            setParticipents={setParticipents}
          />
        </>
      )}

      {viewAdmins && (
        <UsersList setParticipents={setParticipents} userType="admin" />
      )}
      {viewTutors && (
        <UsersList setParticipents={setParticipents} userType="tutor" />
      )}
      {viewStudents && (
        <UsersList setParticipents={setParticipents} userType="student" />
      )}

      <div className={styles.row}>
        <button
          style={viewAdmins ? { backgroundColor: "var(--primary-400)" } : {}}
          onClick={(e) => {
            setViewAdmins(true);
            setViewTutors(false);
            setViewStudents(false);
          }}
          className={styles.selectUserBtn}
        >
          Select Admins
        </button>
        <button
          style={
            viewTutors
              ? { backgroundColor: "var(--primary-400)", margin: "0 10px" }
              : { margin: "0 10px" }
          }
          onClick={(e) => {
            setViewTutors(true);
            setViewAdmins(false);
            setViewStudents(false);
          }}
          className={styles.selectUserBtn}
        >
          Select Tutors
        </button>
        <button
          style={viewStudents ? { backgroundColor: "var(--primary-400)" } : {}}
          onClick={(e) => {
            setViewStudents(true);
            setViewTutors(false);
            setViewAdmins(false);
          }}
          className={styles.selectUserBtn}
        >
          Select Students
        </button>
      </div>
      <button onClick={addParticipents} className={styles.addPartcipentBtn}>
        Add Pariticipents
      </button>
    </Modal>
  );
};

export default AddUser;
