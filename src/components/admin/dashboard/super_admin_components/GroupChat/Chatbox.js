import "./styles.css";
import SingleChat from "./SingleChat";
import { ChatState } from "../Context/ChatProvider";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
  );
};

export default Chatbox;
