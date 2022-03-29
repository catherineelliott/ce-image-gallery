import React from 'react';
import logo from './celogo.PNG';
import './App.css';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'

function App() {
  return (
    <div className="App">
      <header>
        <img src={logo} className="App-logo" alt="logo" />
        <h1>We now have Auth!</h1>
      </header>
      <div>
        <p>
          New site coming soon.
        </p>
        <a
          className="App-link"
          href="https://www.redbubble.com/people/CathElliott/shop"
          target="_blank"
          rel="noopener noreferrer"
        >
          Buy stuff here
        </a>
      </div>
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);
