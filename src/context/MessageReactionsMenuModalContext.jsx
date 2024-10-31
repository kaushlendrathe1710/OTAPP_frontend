import { createContext, useState } from "react";

export const MessageReactionsMenuModalContext = createContext({
  options: {top: undefined, left: undefined, hanldeReaction: ()=>{}},
  hanldeShowMessageReactionsMenuModal: () => {},
  hanldeCloseMessageReactionsMenuModal: () => {},
});

export const MessageReactionsMenuModalContextProvider = ({ children }) => {
  const [options, setOptions] = useState(null);

  function hanldeShowMessageReactionsMenuModal({ top, left, hanldeReaction=()=>{} }) {
    setOptions({ top, left, hanldeReaction });
  }
  function hanldeCloseMessageReactionsMenuModal() {
    setOptions(null);
  }
  return (
    <MessageReactionsMenuModalContext.Provider
      value={{
        options,
        hanldeShowMessageReactionsMenuModal,
        hanldeCloseMessageReactionsMenuModal,
      }}
    >
      {children}
    </MessageReactionsMenuModalContext.Provider>
  );
};
