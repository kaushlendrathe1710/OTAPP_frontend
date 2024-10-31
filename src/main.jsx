import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ScrollToTop } from "./components/ScrollToTop";
import { QueryClient, QueryClientProvider } from "react-query";
import { MessageContextMenuModalContextProvider } from "./context/MessageContextMenuModalContext";
import { MessageContextMenuModal } from "./components/message/MessageContextMenuModal";
import { MessageReactionsMenuModalContextProvider } from "./context/MessageReactionsMenuModalContext";
import { MessageReactionInfoModalContextProvider } from "./context/MessageReactionInfoModalContext";
import { MessageReactionInfoModal } from "./components/message/MessageReactionInfoModal";
import { MessageReactionModal } from "./components/message/MessageReactionModal";
import { MessageReadInfoModalContextProvider } from "./context/MessageReadInfoModalContext";
import { MessageReadInfoModal } from "./components/message/MessageReadInfoModal";
import MessageMediaViewModal from "./components/message/MessageMediaViewModal";
import { MessageMediaViewModalContextProvider } from "./context/MessageMediaViewModalContext";
import { QuickChatUserContextProvider } from "./context/QuickChatUserContext";
import { ChatSendingDataPreviewModalContextProvider } from "./context/ChatSendingDataPreviewModalContext";
import { ChatSendingDataPreviewModal } from "./components/Chat";
// import { ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <QuickChatUserContextProvider>
        <MessageContextMenuModalContextProvider>
          <MessageReactionsMenuModalContextProvider>
            <MessageReactionInfoModalContextProvider>
              <MessageReadInfoModalContextProvider>
                <MessageMediaViewModalContextProvider>
                  <ChatSendingDataPreviewModalContextProvider>
                    <ScrollToTop />
                    <App />
                    <MessageReadInfoModal />
                    <MessageReactionInfoModal />
                    <MessageReactionModal />
                    <MessageContextMenuModal />
                    <MessageMediaViewModal />
                    <ChatSendingDataPreviewModal />
                  </ChatSendingDataPreviewModalContextProvider>
                </MessageMediaViewModalContextProvider>
              </MessageReadInfoModalContextProvider>
            </MessageReactionInfoModalContextProvider>
          </MessageReactionsMenuModalContextProvider>
        </MessageContextMenuModalContextProvider>
      </QuickChatUserContextProvider>
    </BrowserRouter>
    {/* <ReactQueryDevtools initialIsOpen={false} /> */}
  </QueryClientProvider>
  // </React.StrictMode>
);
