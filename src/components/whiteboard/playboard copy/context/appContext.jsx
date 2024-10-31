import React, { createContext, useState } from 'react';
export const AppContext = createContext({});

export const URL = 'http://localhost:4000/';
// export const URL = '/';

const AppContextProvider = (props) => {
    const [user, setUser] = useState({
        _id: '1',
        name: 'You',
        
    });

    return (
        <AppContext.Provider value={{
            user,
            setUser
        }}>
            {props.children}
        </AppContext.Provider>
    );
}

export default AppContextProvider;
