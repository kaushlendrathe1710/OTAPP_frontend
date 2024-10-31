import { createContext, useContext, useState } from "react";

const WhiteboardContext = createContext(null);

export function useWhiteboard() {
  return useContext(WhiteboardContext);
}

export function WhiteboardProvider({ children }) {
  const [joinedUsers, setJoinedUsers] = useState([]);
  const [currentRoomId, setCurrentRoomId] = useState("");

  let data = { joinedUsers, setJoinedUsers, currentRoomId, setCurrentRoomId };

  return (
    <WhiteboardContext.Provider value={data}>
      {children}
    </WhiteboardContext.Provider>
  );
}
