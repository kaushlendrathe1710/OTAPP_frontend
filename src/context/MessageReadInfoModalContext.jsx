import { createContext, useState } from "react";

let initialValue = {
  options: {
    top: undefined,
    left: undefined,
    isOwnMessage: false,
    readBy: [],
  },
  hanldeShowMessageReadInfoModal: () => {},
  hanldeCloseMessageReadInfoModal: () => {},
};

export const MessageReadInfoModalContext = createContext(initialValue);

export const MessageReadInfoModalContextProvider = ({ children }) => {
  const [options, setOptions] = useState(initialValue.options);

  function hanldeShowMessageReadInfoModal({ top, left, isOwnMessage, readBy }) {
    setOptions((prev) => ({
      ...prev,
      top,
      left,
      isOwnMessage,
      readBy,
    }));
  }
  function hanldeCloseMessageReadInfoModal() {
    setOptions(initialValue.options);
  }
  return (
    <MessageReadInfoModalContext.Provider
      value={{
        options,
        hanldeShowMessageReadInfoModal,
        hanldeCloseMessageReadInfoModal,
      }}
    >
      {children}
    </MessageReadInfoModalContext.Provider>
  );
};
