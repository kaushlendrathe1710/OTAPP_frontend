import React, { useContext, useState } from 'react';
import { BoardContext } from '../context/boardContext';
import styles from './boardUserList.module.css';

const BoardUserList = () => {
    const [showList, setShowList] = useState(false);
    const { whiteboard, boardUsers } = useContext(BoardContext);

    return (
        <div style={{ position: 'relative' }}>
            <button onClick={() => setShowList(prv => !prv)} className={styles.userListBtn}>Board Users</button>
            {(showList && boardUsers) && <ul className={styles.BoardUserList}>
                {boardUsers.map(user => {
                    if(user.visible){
                        return <li key={user.id + Math.random()}>{user.userName}</li>
                    }
                })}
            </ul>}
        </div>
    );
}

export default BoardUserList;
