import React from 'react';

const SelectedUsers = ({list}) => {
    return (
        <ul className={styles.usersList}>
            {list?.map(item => (
                <li key={item._id}>
                    <label>
                        <input onChange={e => listItemCheckHandler(e, item)} type='checkbox' />
                        <p>{item.name}</p>
                        <p>{item.email}</p>
                    </label>
                </li>
            ))}
        </ul>
    );
}

export default SelectedUsers;
