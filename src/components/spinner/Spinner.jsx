import React, { useContext, useEffect } from 'react';
import spinner from '../../assets/spinner.gif';
import './spinner.css'

const Spinner = ({ msg }) => {

    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "auto";
        }
    }, [])
    return (
        <>
            <div className='spinnerWrapper'>
                <div className='bg-dark blur-background'>
                </div>
                <div className="loading-spinner content-position">
                    <img src={spinner} alt="loading spinner" className='spinner-gif' />
                    <h6 className='loading-message'>{msg}</h6>
                </div>
            </div>
        </>
    )
}

export default Spinner