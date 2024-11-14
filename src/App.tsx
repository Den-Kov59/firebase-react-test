import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import { getMessaging, onMessage, getToken } from "firebase/messaging";
import io from 'socket.io-client';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "test-app-cbb2d.firebaseapp.com",
  projectId: "test-app-cbb2d",
  storageBucket: "test-app-cbb2d.firebasestorage.app",
  messagingSenderId: "110679803978",
  appId: "1:110679803978:web:69f5c38b379a7255b5beb3"
};

initializeApp(firebaseConfig);

const messaging = getMessaging();

type TMessage = {
  title: string,
  body: string
};

const App = () => {
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [messageBody, setMessageBody] = useState<string>('');
  const [messageTitle, setMessageTitle] = useState<string>('');
  const [token, setToken] = useState<string>('123');

  const socket = useRef(io('https://firebase-backend-1-110679803978.europe-west4.run.app'));

  useEffect(() => {
    socket.current.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      socket.current.disconnect(); 
    };
  }, []);

  useEffect(() => {
    const requestNotificationPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const currentToken = await getToken(messaging, { vapidKey: 'BCspKUQ-lmDr1NIipm7ScAjtVFAz51pQduo8FGFZeyeUQkTcxYGIBKXkl1NEJbh1tRGeK8EK-aV18UVz6r5UrpQ' });
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
    if (messaging) {
      requestNotificationPermission();
    }
  }, []);

  onMessage(messaging, (payload) => {
    console.log('Message received: ', payload);
    if (!payload.data) return;
    const message: TMessage = { title: payload.data!.title, body: payload.data!.body };
    setMessages((prevMessages) => [...prevMessages, message]);
  });

  const sendMessageToServer = async (title: string, message: string, token: string) => {
    console.log('Emitting:', JSON.stringify({ title, message, token }));

    socket.current.emit("message", JSON.stringify({ title, message, token }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (messageBody.trim() && messageTitle.trim() && token) {
      sendMessageToServer(messageTitle, messageBody, token);
      setMessageBody('');
      setMessageTitle('');
    }
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={messageTitle}
          onChange={(e) => setMessageTitle(e.target.value)}
          placeholder="Enter your message"
          required
        />

        <input
          type="text"
          value={messageBody}
          onChange={(e) => setMessageBody(e.target.value)}
          placeholder="Enter your message"
          required
        />
        <button type="submit">Send</button>
      </form>
      <div>
        {messages.map((mes, index) => (
          <div key={index}>
            <h1>{mes.title}</h1>  
            <p>{mes.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;