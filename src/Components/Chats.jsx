import React, { useContext, useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

const Chats = () => {
  const [chats, setChats] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      if (currentUser && currentUser.uid) {
        const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
          if (doc.exists()) {
            setChats(doc.data());
          } else {
            console.log("Document does not exist");
            setChats([]); // Set chats to an empty array if the document doesn't exist
          }
        }, (error) => {
          console.error("Error fetching document:", error);
          setChats([]); // Set chats to an empty array in case of error
        });
        return () => unsub();
      }
    };

    getChats(); // Call the function to fetch chats

  }, [currentUser]);

  const handleSelect = (user) => {
    dispatch({ type: "CHANGE_USER", payload: user });
  };

  return (
    <div className='chats'>
      {Object.entries(chats)?.sort((a,b)=>b[1].date-a[1].date).map(([chat]) => (
        <div className='userChat' key={chat[0]} onClick={() => handleSelect(chat.userInfo)}>
          <img src={chat[11].userInfo.photoURL} alt='' />
          <div className='userChatInfo'>
            <span>{chat[1].userInfo.displayName}</span>
            <p>{chat[1].lastMessage?.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chats;
