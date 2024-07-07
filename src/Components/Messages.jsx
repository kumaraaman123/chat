import React, { useContext, useEffect, useState } from 'react';
import { ChatContext } from '../context/ChatContext';
import Message from './Message';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const Messages = () => {
  const [messages,setMessage]=useState([]);
  const {data}=useContext(ChatContext);


  useEffect(()=>{
    const unSub= onSnapshot(doc(db,"chats",data.chatId),(doc)=>{
      doc.exists()&& setMessage(doc.data().messages)
    })

    return()=>{
      unSub()
    }
  },[data.chatId])

  console.log(messages)
  return (
    <div className='messages'>
      {messages.map(m=>(
        <Message message={m} key={m.Id}/>
      ))}
      
      
    </div>
  );
};

export default Messages;
