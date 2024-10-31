import React, { createContext, useState } from 'react';

export const MsgContext = createContext(null);

const MsgContextProvider = ({ children }) => {
    const [messages, setMessages] = useState([
        // {
        //     _id: '11',
        //     userId: '1',
        //     userName: 'Amit',
        //     text: 'Heyy!',
        //     time: '2023-02-13T04:59:08.944+00:00'
        // },
        // {
        //     _id: '22',
        //     userId: '2',
        //     userName: 'Karan',
        //     text: 'Heyy!',
        //     time: '2023-02-13T04:59:08.944+00:00'
        // },
    ]);

    return (
        <MsgContext.Provider value={{
            messages,
            setMessages
        }}>
            {children}
        </MsgContext.Provider>
    );
}

export default MsgContextProvider;
