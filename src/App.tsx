import React, { useState } from 'react';
import './App.css';
import { initializeApp } from "firebase/app";
import { getMessaging, onMessage } from "firebase/messaging";
import io from 'socket.io-client';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "test-app-cbb2d.firebaseapp.com",
  projectId: "test-app-cbb2d",
  storageBucket: "test-app-cbb2d.firebasestorage.app",
  messagingSenderId: "110679803978",
  appId: "1:110679803978:web:69f5c38b379a7255b5beb3"
};




function App() {
  const [messages, setMessages] = useState(['']);
  const [message, setMessage] = useState('');
  
  const socket = io('https://service-app-1-110679803978.europe-west8.run.app'); // Adjust the URL to your backend

// Connect to the server
socket.on('connect', () => {
  console.log('Connected to WebSocket server');
});


const sendMessageToServer = (message: string) => {
  socket.emit('message', message);
};
  
  const app = initializeApp(firebaseConfig);

  const messaging = getMessaging(app);
  
  onMessage(messaging, (payload) => {
    console.log('Message received. ', payload);
    messages.push(payload.messageId);
    setMessages(messages);
  })
  
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    sendMessageToServer(message);
    setMessage('');
  };
  
  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter your message"
      />
      <button type="submit">Send</button>
      </form>
      <div>
        {messages.map((mes) => {
          return <p>{mes}</p>
        })}
      </div>
    </div>
  );
}

export default App;
