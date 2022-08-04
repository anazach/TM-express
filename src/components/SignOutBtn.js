import React from 'react'
import { Auth, Hub } from 'aws-amplify'
import '../style/SignOutBtn.css'

const handleSignOutButtonClick = async () => {
  try {
    await Auth.signOut()
    Hub.dispatch('UI Auth', {
      event: 'AuthStateChange',
      message: 'signedout',
    })
  } catch (error) {
    console.log('Signout error: ', error)
  }
}

const SignOutBtn = () => {
  return <button onClick={handleSignOutButtonClick}>Sign out</button>
}

export default SignOutBtn
