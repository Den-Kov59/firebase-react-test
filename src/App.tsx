import React, { useEffect, useState } from 'react';
import './App.css';
import { getMessaging, onMessage, getToken } from "firebase/messaging";
import io from 'socket.io-client';
import { initializeApp } from 'firebase/app';

initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "test-app-cbb2d.firebaseapp.com",
  projectId: "test-app-cbb2d",
  storageBucket: "test-app-cbb2d.firebasestorage.app",
  messagingSenderId: "110679803978",
  appId: "1:110679803978:web:69f5c38b379a7255b5beb3"
});

  const messaging = getMessaging();
const App = () => {
  const [messages, setMessages] = useState(['']);
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');
  const socket = io('https://service-app-1-110679803978.europe-west8.run.app'); // Adjust the URL to your backend
// Connect to the server
socket.on('connect', () => {
  console.log('Connected to WebSocket server');
});

const sendMessageToServer = (message: string, token: string) => {
  console.log('emmitting', JSON.stringify({ message, token }));
  
  socket.emit('message', JSON.stringify({ message, token }));
};

  
  Notification.requestPermission().then(permission => {
  if (permission === 'granted') {
    getToken(messaging, { vapidKey: 'YOUR_PUBLIC_VAPID_KEY' })
      .then(currentToken => {
        if (currentToken) {
          console.log('Token generated:', currentToken);
          setToken(currentToken);
        } else {
          console.log('No registration token available.');
        }
      })
      .catch(err => {
        console.error('Error while getting token:', err);
      });
  } else {
    console.log('Unable to get permission to notify.');
  }
});
  
  onMessage(messaging, (payload) => {
    console.log('Message received. ', payload);
    messages.push(payload.messageId);
    setMessages(messages);
  })
  
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    sendMessageToServer(message, token);
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
