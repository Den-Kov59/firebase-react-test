import React, { useEffect, useState } from 'react';
import './App.css';
import { getMessaging, onMessage, getToken } from "firebase/messaging";
import io from 'socket.io-client';
import { initializeApp } from 'firebase/app';

// Firebase Configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "test-app-cbb2d.firebaseapp.com",
  projectId: "test-app-cbb2d",
  storageBucket: "test-app-cbb2d.firebasestorage.app",
  messagingSenderId: "110679803978",
  appId: "1:110679803978:web:69f5c38b379a7255b5beb3"
};

// Initialize Firebase
initializeApp(firebaseConfig);

// Get Messaging Instance
const messaging = getMessaging();

const App = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('');
  const [token, setToken] = useState<string>('');

  // Initialize WebSocket connection
  const socket = io('https://service-app-1-110679803978.europe-west8.run.app');

  // Handle WebSocket connection events
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    return () => {
      socket.off('connect');
      socket.disconnect(); // Clean up the socket connection
    };
  }, [socket]);

  // Request Notification Permission and Get Token
  useEffect(() => {
    const requestNotificationPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const currentToken = await getToken(messaging, { vapidKey: 'YOUR_PUBLIC_VAPID_KEY' });
          if (currentToken) {
            console.log('Token generated:', currentToken);
            setToken(currentToken);
          } else {
            console.log('No registration token available.');
          }
        } else {
          console.log('Unable to get permission to notify.');
        }
      } catch (error) {
        console.error('Error while getting token:', error);
      }
    };

    requestNotificationPermission();
  }, []);

  // Listen for Incoming FCM Messages
  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Message received: ', payload);
      setMessages((prevMessages) => [...prevMessages, payload.messageId || 'Unknown Message']); // Update the messages state correctly
    });

    return () => {
      unsubscribe(); // Clean up the FCM listener
    };
  }, []);

  // Function to Send Message to Server
  const sendMessageToServer = (message: string, token: string) => {
    console.log('Emitting:', JSON.stringify({ message, token }));
    socket.emit('message', JSON.stringify({ message, token }));
  };

  // Handle Form Submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (message.trim() && token) {
      sendMessageToServer(message, token);
      setMessage('');
    }
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
        {messages.map((mes, index) => (
          <p key={index}>{mes}</p>
        ))}
      </div>
    </div>
  );
}

export default App;