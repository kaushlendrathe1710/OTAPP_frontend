import React, { useContext } from 'react'
import userContext from '../../../../../context/userContext'
import { SingleAdminQuickChat } from '../../../../single_chat'

export const QuickChat = () => {
  const { userData } = useContext(userContext);
  return (
    <>
      <SingleAdminQuickChat  user={userData} />
    </>
  )
}
