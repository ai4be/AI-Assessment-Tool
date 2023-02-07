import React, { useState, useContext, useEffect } from 'react'
import UserContext from '@/src/store/user-context'
import { useSessionStorage } from 'usehooks-ts'
import EmailVerificationModal from '@/src/components/modal-email-verification'

/**
 * Save in session if we ask the user to verify his email.
 * If the user has not verified his email after 12 hours, we ask him again.
 */
export const EmailVerificationCheck = (): JSX.Element => {
  const { user, triggerReloadUser } = useContext(UserContext)
  const [showedEmailVerificationModal, setShowedEmailVerificationModal] = useSessionStorage<number>(`showedEmailVerificationModal_${String(user?._id)}`, 0)
  const [showModal, setShowModal] = useState<boolean>(false)

  const openModalCheck = (): void => {
    const SHOW_AFTER_MS = 1000 * 60 * 60 * 12 // 12 hours
    const lastShowed = Date.now() - showedEmailVerificationModal
    if (!showModal && user != null && user?.emailVerified !== true && lastShowed > SHOW_AFTER_MS) {
      setShowModal(true)
      setShowedEmailVerificationModal(Date.now())
    }
  }

  useEffect(() => {
    const intervalId = setInterval(openModalCheck, 1000 * 60 * 60 * 1) // 1 hour
    openModalCheck()
    return () => clearInterval(intervalId)
  }, [])

  // fallback if the user was null at the time of the render
  useEffect(() => {
    if (user != null && user?.emailVerified !== true) {
      openModalCheck()
    }
  }, [user])

  const closeCb = (isCancel: boolean = false): void => {
    if (!isCancel) triggerReloadUser()
    setShowModal(false)
  }

  return (
    <>
      {showModal && <EmailVerificationModal successCb={() => closeCb()} cancelCb={() => closeCb(true)} canAskForNewToken />}
    </>
  )
}

export default EmailVerificationCheck
