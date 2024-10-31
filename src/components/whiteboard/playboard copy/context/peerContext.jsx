import { createContext, useContext, useState, useEffect } from "react";
import { SocketContext } from "./socketProvider";

export const PeerContext = createContext(null);

const PeerProvider = (props) => {
  // const [peer, setPeer] = useState(null);
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [otherUsername, setOtherUsername] = useState("");
  // const [name, setName] = useState("")

  // const { socket } = useContext(SocketContext);

  // useEffect(() => {
  //     // console.log('peer effect', socket)
  //     // socket?.on("callUser", (data) => {
  //     //     console.log('Got a call!!')
  //     //     setReceivingCall(true)
  //     //     setCaller(data.from)
  //     //     setOtherUsername(data.name)
  //     //     setCallerSignal(data.signal)
  //     // })

  //     return () => {
  //         // socket?.r
  //     }
  // }, [socket])

  return (
    <PeerContext.Provider
      value={{
        // peer, setPeer,
        stream,
        setStream,
        receivingCall,
        setReceivingCall,
        caller,
        setCaller,
        callerSignal,
        setCallerSignal,
        callAccepted,
        setCallAccepted,
        idToCall,
        setIdToCall,
        callEnded,
        setCallEnded,
        // name, setName,
        otherUsername,
        setOtherUsername,
      }}
    >
      {props.children}
    </PeerContext.Provider>
  );
};
export default PeerProvider;
