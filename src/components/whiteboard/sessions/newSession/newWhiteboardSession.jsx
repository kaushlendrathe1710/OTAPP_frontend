import React, { useState, useContext } from "react";
import userContext from "../../../../context/userContext";
import api from "../../../../services/api";
import styles from "./newWhiteboardSession.module.css";
import UsersList from "../common/usersList";
import moment from "moment";
import SelectedParticipents from "../common/selectedParticipents";

const NewWhiteboardSession = () => {
  const [boardName, setBoardName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [participents, setParticipents] = useState([]);
  const [viewAdmins, setViewAdmins] = useState(false);
  const [viewTutors, setViewTutors] = useState(false);
  const [viewStudents, setViewStudents] = useState(false);

  const userCtx = useContext(userContext);
  const userData = userCtx.userData;

  async function createSession() {
    // console.log(userCtx)
    let startTimeStamp = Date.parse(startTime);
    let endTimeStamp = Date.parse(endTime);
    let durationTimeStamp = endTimeStamp - startTimeStamp;

    // console.log('time', startTime, endTime)
    // console.log('timestamp', timestamp)
    // console.log('back to date', moment(timestamp).format('MMMM Do YYYY'))
    // console.log('back to time', moment(timestamp).format('h:mm:ss a'))
    // console.log('duration timestamp', moment.duration(durationTimeStamp))

    let trimmedParticipents = participents.map((prt) => {
      let newPartic = {
        _id: prt._id,
        name: prt.name,
        email: prt.email,
        userType: prt.userType,
      };
      return newPartic;
    });

    trimmedParticipents = [
      ...trimmedParticipents,
      {
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        userType: userData.userType,
      },
    ];

    if (boardName && startTime && endTime && trimmedParticipents && userData) {
      const res = await api.post("whiteboard/create", {
        boardName,
        createdBy: { _id: userData._id, name: userData.name },
        startTimeStamp,
        endTimeStamp,
        durationTimeStamp,
        participents: trimmedParticipents,
      });
      // console.log('create board', res);
      if (res.status === 200) {
        alert("Successfully Created Whiteboard Session!");
      }
    } else {
      alert("something is wrong");
    }
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Create Whiteboard Session</h3>
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <input
            onChange={(e) => setBoardName(e.target.value)}
            value={boardName}
            type="text"
            placeholder="Enter Whiteboard Name"
          />
        </div>
        <div>{/* <DateTimePicker /> */}</div>
        <div>
          <label>
            Start Time:
            <br />
            <input
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              style={{ width: "75%" }}
              type="datetime-local"
            />
          </label>
          <label>
            End Time: <br />
            <input
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              style={{ width: "75%" }}
              type="datetime-local"
            />
          </label>
        </div>

        {participents.length > 0 && (
          <div style={{ padding: 10, background: "#eee", display: "block" }}>
            <h6 style={{ margin: "5px" }}>Selected Participents:</h6>
            {/* <ul style={{
                        maxHeight: '150px',
                        overflow: 'scroll',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        flexWrap: 'wrap'
                    }}>
                        {participents?.map(user => (
                            <li key={user._id} style={{
                                listStyle: 'none',
                                margin: '5px 10px',
                                display: 'flex',
                                justifyContent: 'flex-start',
                                gap: '20px',
                                padding: '10px',
                                background: '#fffa',
                                borderRadius: '5px'
                            }}>
                                <span>{user?.name}</span>
                                <span>{user.email}</span>
                                <span
                                    onClick={e => {
                                        setParticipents(prv => {
                                            let participents = prv.filter(prvv => user._id !== prvv._id)
                                            return participents
                                        })
                                    }}
                                    style={{ fontSize: '10px', cursor: 'pointer' }}>&#10060;</span>
                            </li>
                        ))}
                    </ul> */}
            <SelectedParticipents
              participents={participents}
              setParticipents={setParticipents}
            />
          </div>
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
        <div>
          <button
            style={viewAdmins ? { backgroundColor: "var(--primary-400)" } : {}}
            onClick={(e) => {
              setViewAdmins((prv) => !prv);
              setViewTutors(false);
              setViewStudents(false);
            }}
          >
            Select Admins
          </button>
          <button
            style={viewTutors ? { backgroundColor: "var(--primary-400)" } : {}}
            onClick={(e) => {
              setViewTutors((prv) => !prv);
              setViewAdmins(false);
              setViewStudents(false);
            }}
          >
            Select Tutors
          </button>
          <button
            style={
              viewStudents ? { backgroundColor: "var(--primary-400)" } : {}
            }
            onClick={(e) => {
              setViewStudents((prv) => !prv);
              setViewTutors(false);
              setViewAdmins(false);
            }}
          >
            Select Students
          </button>
        </div>

        <div>
          <button onClick={createSession} className={styles.createBoardBtn}>
            Create Whiteboard
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewWhiteboardSession;
