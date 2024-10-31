import React from 'react';

const style = {
    position: 'fixed', 
    top: '0px',
    left: "0px",
    width: '100%',
    height: '100%',
    backgroundColor: '#0008'
}

const Backdrop = ({setOpenModal}) => {



    return (
        <div onClick={() => setOpenModal(false)} style={style} />

    );
}

export default Backdrop;
