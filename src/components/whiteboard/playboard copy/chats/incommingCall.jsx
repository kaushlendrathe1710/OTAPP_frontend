import React, { useContext, useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { Stack } from '@mui/system';
import { TextField } from '@mui/material';
import { BsTelephone } from 'react-icons/bs';
import { PeerContext } from '../context/peerContext';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    // border: '2px solid #000',
    boxShadow: 24,
    pt: 4,
    px: 4,
    pb: 4,
    borderRadius: 2,
    fontFamily: 'sans-serif'
};

const IncommingCall = ({ answerCall, leaveCall }) => {
    const [open, setOpen] = useState(true);
    const { callAccepted, otherUsername } = useContext(PeerContext);

    function handleClose() {
        setOpen(false)
    }

    function acceptClickHanlder() {
        answerCall()
        // setOpen(false)
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
        >
            <Box sx={{ ...style, width: 400, }}>
                {/* <h3 id="parent-modal-title">Enter Caller Id</h3> */}
                {!callAccepted && <h3>{otherUsername} is calling...</h3>}
                {callAccepted && <h3>Ongoing Call with {otherUsername}...</h3>}
                <Stack sx={{ mt: 2 }} spacing={1} direction="row">
                    {!callAccepted && <>
                        <Button onClick={acceptClickHanlder} variant="contained">
                            Accept  <BsTelephone style={{ marginLeft: '5px' }} />
                        </Button>
                        <Button variant="outlined">Decline</Button>
                    </>}
                    {callAccepted && <Button onClick={leaveCall} variant="contained">End Call</Button>}
                </Stack>
            </Box>
        </Modal>
    );
}

export default IncommingCall;
