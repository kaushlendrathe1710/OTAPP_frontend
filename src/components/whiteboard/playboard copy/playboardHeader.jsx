import React, { useContext, useState } from 'react';
import { AppContext } from './context/appContext';
import { BoardContext } from './context/boardContext';
import styles from './playboardHeader.module.css';
import { URL } from './context/appContext';
import BoardUserList from './homePage/boardUserList';
import ChatBox from './chats/chatBox';
import PeerProvider from './context/peerContext';
import { BsFillChatLeftDotsFill } from 'react-icons/bs';

const PlayboardHeader = () => {
    const [showChatBox, setShowChatBox] = useState(false);

    return (
        <div className={styles.header}>
            <h4>PlayBoard</h4>
            <div className={styles.box2}>
                {/* <h4 style={{ marginRight: '20px' }}>{user.name}</h4> */}
                {/* <button
                    style={{
                        padding: '5px 10px',
                        borderRadius: '20px',
                        border: '2px solid blueviolet',
                        cursor: 'pointer'
                    }}
                    onClick={addUser}
                >Add User</button> */}
                {/* <BoardUserList /> */}

                {/* <button onClick={() => setShowChatBox(prv => !prv)}>Chat</button>
                <PeerProvider >
                    {showChatBox && <ChatBox />}
                </PeerProvider> */}

                <button
                    style={
                        showChatBox ? {
                            width: '40px', height: '40px', borderRadius: '50%',
                            display: 'flex', justifyContent: 'center', alignItems: 'center',
                            background: 'var(--primary-50)', color: 'var(--primary-400)'
                        }
                            :
                            {}
                    }
                    onClick={() => setShowChatBox((prv) => !prv)}><BsFillChatLeftDotsFill /></button>
                <PeerProvider>{showChatBox && <ChatBox />}</PeerProvider>
            </div>
        </div>
    );
}

export default PlayboardHeader;
