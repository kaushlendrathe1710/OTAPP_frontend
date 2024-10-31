import { createContext, useState, useEffect } from "react";
import api from "../services/api";

function getQuickChatUserAccessToken() {
  let token = sessionStorage.getItem("quick-chat-user-access-token") || "";
  return token === "" ? null : `Bearer ${token}`;
}

let initialValue = {
  quickChatUser: null,
  setQuickChatUser: () => {},
  isAuthLoading: true,
  isQuickChatVisible: false,
  setIsQuickChatVisible: () => {},
};
export const QuickChatUserContext = createContext(initialValue);

export const QuickChatUserContextProvider = ({ children }) => {
  const [quickChatUser, setQuickChatUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isQuickChatVisible, setIsQuickChatVisible] = useState(false);

  async function checkUserVerification() {
    try {
      let token = getQuickChatUserAccessToken();
      if (token) {
        const { data } = await api.get("/quick-chat/get-user", {
          headers: {
            Authorization: token,
          },
        });
        setQuickChatUser(data);
      }
    } catch (err) {
      console.log("An error occured while fetching user: ", err);
    } finally {
      setIsAuthLoading(false);
    }
  }
  useEffect(() => {
    checkUserVerification();
  }, []);
  return (
    <QuickChatUserContext.Provider
      value={{
        quickChatUser,
        setQuickChatUser,
        isAuthLoading,
        isQuickChatVisible,
        setIsQuickChatVisible,
      }}
    >
      {children}
    </QuickChatUserContext.Provider>
  );
};
