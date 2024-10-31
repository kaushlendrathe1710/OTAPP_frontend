import { createContext, useState } from "react";

let initialValue = {
  options: {
    top: undefined,
    left: undefined,
    isOwnMessage: false,
    handleReplyMessage: () => {},
    handleForwardMessage: () => {},
    handleDeleteMessageForMe: () => {},
    handleDeleteMessageForEveryone: () => {},
    handleCopyMessage: () => {},
  },
  hanldeShowMessageContextMenuModal: () => {},
  hanldeCloseMessageContextMenuModal: () => {},
};

export const MessageContextMenuModalContext = createContext(initialValue);

export const MessageContextMenuModalContextProvider = ({ children }) => {
  const [options, setOptions] = useState(initialValue.options);

  function hanldeShowMessageContextMenuModal({
    top,
    left,
    isOwnMessage,
    handleForwardMessage,
    handleDeleteMessageForMe,
    handleDeleteMessageForEveryone,
    handleCopyMessage,
    handleReplyMessage,
  }) {
    setOptions((prev) => ({
      ...prev,
      top,
      left,
      isOwnMessage,
      handleForwardMessage,
      handleDeleteMessageForMe,
      handleDeleteMessageForEveryone,
      handleCopyMessage,
      handleReplyMessage,
    }));
  }
  function hanldeCloseMessageContextMenuModal() {
    setOptions(initialValue.options);
  }
  return (
    <MessageContextMenuModalContext.Provider
      value={{
        options,
        hanldeShowMessageContextMenuModal,
        hanldeCloseMessageContextMenuModal,
      }}
    >
      {children}
    </MessageContextMenuModalContext.Provider>
  );
};
