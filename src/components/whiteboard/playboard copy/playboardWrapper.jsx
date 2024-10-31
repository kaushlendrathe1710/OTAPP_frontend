import React from 'react';
import AppContextProvider from './context/appContext';
import BoardContextProvider from './context/boardContext';

const PlayboardWrapper = ({ children }) => {
    return (
        <AppContextProvider>
            <BoardContextProvider>
                <div >
                    {children}
                </div>
            </BoardContextProvider>
        </AppContextProvider>
    );
}

export default PlayboardWrapper;
