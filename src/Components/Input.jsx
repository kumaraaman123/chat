import React, { useState,useContext } from 'react'
import Img from "../img/Img.png"
import Attach from "../img/Attach.png"
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db, storage } from '../firebase'
import {v4 as uuid}from "uuid"
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'

const Input = () => {
  const[text,setText]=useState("");
  const[img,setImg]=useState(null);
  const {currentUser}=useContext(AuthContext);
  const {data}=useContext(ChatContext);

  const handleSend = async () => {
    if (img) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);
  
      uploadTask.on(
        (error) => {
          console.error("Error uploading image:", error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await updateDoc(doc(db, "chats", data.chatIid), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          } catch (error) {
            console.error("Error updating document with image URL:", error);
          }
        }
      );
    } else {
      try {
        await updateDoc(doc(db, "chats", data.chatIid), {
          messages: arrayUnion({
            id: uuid(),
            text,
            senderId: currentUser.uid,
            date: Timestamp.now(),
          }),
        });
      } catch (error) {
        console.error("Error updating document with text message:", error);
      }
    }

    await updateDoc(doc(db,"userChats",currentUser.uid),{
      [data.chatId+ ".lastMessage"]:{
        text
      },
      [data.chatId+".date"]:serverTimestamp(),
    });
    await updateDoc(doc(db,"userChats",data.user.uid),{
      [data.chatId+ ".lastMessage"]:{
        text
      },
      [data.chatId+".date"]:serverTimestamp(),
    });
    setText("");
    setImg(null);
  };
  
  
  return (
    <div className='input'>
      <input type="text" placeholder='Type something....'  onChange={e=>setText(e.target.value)}  value={text}/>
      <div className="send">
        <img src={Attach} alt="" />
        <input type="file" style={{display:"none"}} id='file' onChange={e=>setImg(e.target.files[0])} />
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  )
}

export default Input
