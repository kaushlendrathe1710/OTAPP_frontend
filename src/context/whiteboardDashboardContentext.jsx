import React, { createContext, useState } from 'react';

export const WhiteboardDashboardContentext = createContext(null);

const WhiteboardDashBoardProvider = ({ children }) => {
    const [whiteboardList, setWhiteboardList] = useState([]);
    const [currentTabIndex, setCurrentTabIndex] = useState(-1);

    return (
        <WhiteboardDashboardContentext.Provider value={{
            whiteboardList,
            setWhiteboardList,
            currentTabIndex,
            setCurrentTabIndex
        }}>
            {children}
        </WhiteboardDashboardContentext.Provider>
    );
}

export default WhiteboardDashBoardProvider;
