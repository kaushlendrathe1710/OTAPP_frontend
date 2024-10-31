import { createContext, useState } from "react";

let initialValue = {
  options: {
    top: undefined,
    left: undefined,
    isOwnMessage: false,
    reactions: [],
  },
  hanldeShowMessageReactionInfoModal: () => {},
  hanldeCloseMessageReactionInfoModal: () => {},
};

export const MessageReactionInfoModalContext = createContext(initialValue);

export const MessageReactionInfoModalContextProvider = ({ children }) => {
  const [options, setOptions] = useState(initialValue.options);

  function hanldeShowMessageReactionInfoModal({
    top,
    left,
    isOwnMessage,
    reactions,
  }) {
    setOptions((prev) => ({
      ...prev,
      top,
      left,
      isOwnMessage,
      reactions,
    }));
  }
  function hanldeCloseMessageReactionInfoModal() {
    setOptions(initialValue.options);
  }
  return (
    <MessageReactionInfoModalContext.Provider
      value={{
        options,
        hanldeShowMessageReactionInfoModal,
        hanldeCloseMessageReactionInfoModal,
      }}
    >
      {children}
    </MessageReactionInfoModalContext.Provider>
  );
};
