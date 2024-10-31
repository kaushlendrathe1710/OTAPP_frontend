import React, { useState } from 'react';
import { IoMdArrowDropdown } from 'react-icons/io';
import { RxTriangleRight } from 'react-icons/rx';
import styles from './participentsList.module.css';

const list = [
    { name: 'Amit Arya', email: 'amit@gmail.com' },
    { name: 'Karan Arya', email: 'karan@gmail.com' },
    { name: 'Karishma Arya', email: 'karishma@gmail.com' },
]

const ParticipentsList = ({participentsList}) => {
    const [openList, setOpenList] = useState(false);

    return (
        <div className={styles.participentsList} onClick={e => setOpenList(prv => !prv)}>
            <p>
                {participentsList?.length} participents 
                {openList ? <IoMdArrowDropdown /> : <RxTriangleRight />}
            </p>
            {openList && <ul>
                {participentsList?.map(item => <li key={Math.random() + item?.name}>{item.name}</li>)}
            </ul>}
        </div>
    );
}

export default ParticipentsList;
