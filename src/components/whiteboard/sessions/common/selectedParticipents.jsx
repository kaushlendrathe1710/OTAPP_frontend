import React from 'react';

const SelectedParticipents = ({participents, setParticipents}) => {
    return (
        <ul style={{
            maxHeight: '150px',
            overflowY: 'scroll',
            display: 'flex',
            justifyContent: 'flex-start',
            flexWrap: 'wrap',
            marginBottom: '20px',
            backgroundColor: 'rgb(238, 238, 238)',
            padding: '5px 0'
            // boxShadow: 'inset 0 0 50px var(--primary-50)'
        }}>
            {participents?.map(user => (
                <li key={user._id+Math.random()} style={{
                    listStyle: 'none',
                    margin: '5px 10px',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    gap: '20px',
                    padding: '10px',
                    background: '#fffa',
                    borderRadius: '5px'
                }}>
                    <span>{user?.name}</span>
                    <span>{user.email}</span>
                    <span
                        onClick={e => {
                            setParticipents(prv => {
                                let participents = prv.filter(prvv => user._id !== prvv._id)
                                return participents
                            })
                        }}
                        style={{ fontSize: '10px', cursor: 'pointer' }}>&#10060;</span>
                </li>
            ))}
        </ul>
    );
}

export default SelectedParticipents;
