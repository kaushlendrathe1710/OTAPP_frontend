import React, { useEffect, useState } from 'react'
import { useClickOutside } from '../../../../../hooks/useClickOutside'
import styles from '../../../../../styles/GroupInfo.module.scss'

const ListOfParticipants = ({ setIsModalOpen, clickedInfo }) => {

  const modalRef = useClickOutside(() => setIsModalOpen(false));
  const [search, setSearch] = useState('')

  // const data = clickedInfo?.filter((x) => {
  //   return 
  // })

  const data = clickedInfo?.filter((x) => {
    if (search === '') {
      return x;
    } else {
      return x.name.toLowerCase().includes(search)
    }
  })

  return (
    <div className={styles.ListWrapper}>
      <div ref={modalRef} className={styles.ListMOdal}>
        <div className={styles.header}>
          <h5>Search Participants</h5>
        </div>
        <div className={styles.searchContainer}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder='search' />
        </div>
        <div className={styles.ListingContainer}>
          {data?.length > 0 ? (
            data?.map((data) => {
              return (
                <p key={data._id}>{data.name}</p>
              )
            })
          ) : "No Record Found"}
        </div>
      </div>
    </div>
  )
}

export default ListOfParticipants
