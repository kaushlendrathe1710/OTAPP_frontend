import React, { useContext, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { Stack } from "@mui/system";
import { TextField } from "@mui/material";
import { BsTelephone } from "react-icons/bs";
import { SocketContext } from "../context/socketProvider";
import { PeerContext } from "../context/peerContext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  // border: '2px solid #000',
  boxShadow: 24,
  pt: 4,
  px: 4,
  pb: 4,
  borderRadius: 2,
  fontFamily: "sans-serif",
};

const CallingBox = ({
  open,
  setOpen,
  handleCallClick,
  handleCallCancelClick,
  callerName,
}) => {
  const { socketId } = useContext(SocketContext);
  const { idToCall, setIdToCall } = useContext(PeerContext);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
      <Box sx={{ ...style, width: 400 }}>
        {/* <h3 id="parent-modal-title">Enter Caller Id</h3> */}
        <TextField
          value={idToCall}
          onChange={(e) => {
            console.log("callid", e.target.value);
            setIdToCall(e.target.value);
          }}
          fullWidth
          id="outlined-basic"
          label="Enter Caller ID"
          variant="outlined"
        />
        <Stack sx={{ mt: 2 }} spacing={1} direction="row">
          <Button
            variant="contained"
            onClick={() => {
              navigator.clipboard.writeText(socketId);
            }}
          >
            Copy Id
          </Button>
          <TextField
            id="outlined-basic"
            label="Send this to someone to call"
            variant="outlined"
            defaultValue={socketId}
            InputProps={{ readOnly: true }}
          />
          {/* <p>{socketId}</p> */}
        </Stack>
        <Stack sx={{ mt: 2 }} spacing={1} direction="row">
          <Button onClick={handleCallClick} variant="contained">
            Call <BsTelephone style={{ marginLeft: "5px" }} />
          </Button>
          <Button onClick={handleCallCancelClick} variant="text">
            Cancel
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default CallingBox;
