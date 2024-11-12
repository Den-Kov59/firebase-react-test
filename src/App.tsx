import React from 'react';
import logo from './logo.svg';
import './App.css';
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "12",
  authDomain: "test-app-cbb2d.firebaseapp.com",
  projectId: "test-app-cbb2d",
  storageBucket: "12",
  messagingSenderId: "110679803978",
  appId: "1:110679803978:web:69f5c38b379a7255b5beb3"
};


function App() {
  
  const app = initializeApp(firebaseConfig);
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
