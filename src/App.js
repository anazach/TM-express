import React from 'react'
import './App.css'
import Dashboard from './views/Dashboard'
import AddAsset from './views/AddAsset'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import { AmplifyAuthenticator, AmplifySignIn } from '@aws-amplify/ui-react'
import { I18n } from 'aws-amplify'
import { Translations } from '@aws-amplify/ui-components'

I18n.putVocabulariesForLanguage('en-US', {
  [Translations.SIGN_IN_HEADER_TEXT]: 'Tangy Market Admin Express',
  [Translations.SIGN_IN_ACTION]: 'Sign In',
})

function App() {
  return (
    <AmplifyAuthenticator>
      <Router>
        <Navbar />
        <Switch>
          <Route path='/' exact component={Dashboard} />
          <Route path='/addasset' component={AddAsset} />
        </Switch>
      </Router>
      <AmplifySignIn slot='sign-in' hideSignUp></AmplifySignIn>
    </AmplifyAuthenticator>
  )
}

export default App;
