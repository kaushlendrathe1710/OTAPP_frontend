import { createContext, useState } from "react";

let initialValue = {
  options: {
    top: undefined,
    left: undefined,
    fileContent: null,
    isOwnMessage: false,
  },
  hanldeShowMessageMediaViewModal: () => {},
  hanldeCloseMessageMediaViewModal: () => {},
};

export const MessageMediaViewModalContext = createContext(initialValue);

export const MessageMediaViewModalContextProvider = ({ children }) => {
  const [options, setOptions] = useState(initialValue.options);

  function hanldeShowMessageMediaViewModal({
    top,
    left,
    fileContent,
    isOwnMessage,
  }) {
    setOptions((prev) => ({
      ...prev,
      top,
      left,
      fileContent,
      isOwnMessage,
    }));
  }
  function hanldeCloseMessageMediaViewModal() {
    setOptions(initialValue.options);
  }
  return (
    <MessageMediaViewModalContext.Provider
      value={{
        options,
        hanldeShowMessageMediaViewModal,
        hanldeCloseMessageMediaViewModal,
      }}
    >
      {children}
    </MessageMediaViewModalContext.Provider>
  );
};
