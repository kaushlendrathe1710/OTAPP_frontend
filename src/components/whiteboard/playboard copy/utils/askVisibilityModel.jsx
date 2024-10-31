import React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { Stack } from '@mui/system';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 4,
    px: 4,
    pb: 4,
    borderRadius: 2,
    fontFamily: 'sans-serif'
};

const AskVisibilityModel = ({ open, setOpen, handleInvisibleClick, handleVisibleClick }) => {
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={{ ...style, width: 400 }}>
                    <h3 id="parent-modal-title">Enter in whiteboard as:</h3>
                    <Stack sx={{ mt: 2 }} spacing={1} direction="row">
                        <Button onClick={handleVisibleClick} variant="outlined" style={{}}>Visible</Button>
                        <Button onClick={handleInvisibleClick} variant="outlined" style={{}}>Invisible</Button>
                    </Stack>
                </Box>

            </Modal>
        </>
    );
}

export default AskVisibilityModel;
