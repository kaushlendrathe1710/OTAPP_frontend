import React from 'react';
import Thread from './thread';

const ThreadList = () => {
    return (
        <div>
            <Thread userName={"Amit"} lastMsg={"Bye"} />
            <Thread userName={"Karan"} lastMsg={"When"} />
            <Thread userName={"Piyush"} lastMsg={"Okk"} />
        </div>
    );
}

export default ThreadList;
