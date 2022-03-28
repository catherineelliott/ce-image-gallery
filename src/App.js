import logo from './celogo.png';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          New site coming soon.
        </p>
        <a
          className="App-link"
          href="https://www.redbubble.com/people/CathElliott/shop"
          target="_blank"
          rel="noopener noreferrer"
        >
          Buy stuff
        </a>
      </header>
    </div>
  );
}

export default App;
