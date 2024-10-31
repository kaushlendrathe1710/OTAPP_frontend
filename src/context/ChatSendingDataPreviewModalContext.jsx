import { createContext, useState } from "react";

let initialValue = {
  options: {
    top: undefined,
    left: undefined,
    width: 540,
    attachmentFiles: [],
    activeAttachmentFile: null,
    isLoading: false,
    handleSendMessageClick: async () => {},
  },
  handleUpdateModalPosition: () => {},
  handleUpdateAttachmentFiles: () => {},
  handleUpdateActiveAttachmentFile: () => {},
  handleShowChatSendingDataPreviewModal: () => {},
  handleCloseChatSendingDataPreviewModal: () => {},
  setIsLoading: () => {},
};

export const ChatSendingDataPreviewModalContext = createContext(initialValue);

export const ChatSendingDataPreviewModalContextProvider = ({ children }) => {
  const [options, setOptions] = useState(initialValue.options);

  function setIsLoading(boolean) {
    setOptions((prev) => ({ ...prev, isLoading: boolean }));
  }
  function handleUpdateModalPosition({ top, left, width = 540 }) {
    setOptions((prev) => ({
      ...prev,
      top,
      left,
      width,
    }));
  }
  function handleShowChatSendingDataPreviewModal({
    attachmentFiles,
    activeAttachmentFile,
    handleSendMessageClick,
  }) {
    setOptions((prev) => ({
      ...prev,
      attachmentFiles,
      activeAttachmentFile,
      handleSendMessageClick
    }));
  }
  function handleUpdateAttachmentFiles(updatedFiles) {
    setOptions((prev) => ({ ...prev, attachmentFiles: updatedFiles }));
  }
  function handleUpdateActiveAttachmentFile(updatedActiveFile) {
    setOptions((prev) => ({
      ...prev,
      activeAttachmentFile: updatedActiveFile,
    }));
  }

  function handleCloseChatSendingDataPreviewModal() {
    setOptions(initialValue.options);
  }

  return (
    <ChatSendingDataPreviewModalContext.Provider
      value={{
        options,
        handleUpdateModalPosition,
        handleUpdateAttachmentFiles,
        handleUpdateActiveAttachmentFile,
        handleShowChatSendingDataPreviewModal,
        handleCloseChatSendingDataPreviewModal,
        setIsLoading,
      }}
    >
      {children}
    </ChatSendingDataPreviewModalContext.Provider>
  );
};
