'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from 'react'
import { io } from "socket.io-client";
import { createUser } from "@/api";

let socket;


export default function CreatePost(){
  const [roomNumber,setRoomNumber] = useState('')
  const [username,setUsername] = useState('')
  const [message,setMessage] = useState('')
  const [allMessages,setAllMessages] = useState([])
  const [randomRoomNumber,setRandomRoomNumber] = useState('')
  const router = useRouter()

  const socketInitializer = async () =>{
    socket = io(process.env.NEXT_PUBLIC_API_URL)
    console.log('init')
    socket.emit('join-room',{
      room:'room-1',
      username:''
    })
  }
  useEffect(()=>{
    socketInitializer()
    socket.on("receive-message", (data) => {
      console.log('recive',data)
      setAllMessages((pre) => [...pre, data]);
    });
    return () => {
      socket.disconnect();
    };
  },[])


  return(
    <div>
    <form onSubmit={(e)=>{
      e.preventDefault();
      console.log('creating room')

      createUser({
        username,
        refresh:()=>router.refresh()
      })
    }}>
      <label for="username">username</label>
      <input 
        name="username"
        type="text"
        value={username}
        onChange={e=>setUsername(e.target.value)}
      />
      <label for="roomNumber">roomNumber</label>
      <input 
        name="roomNumber"
        type="text"
        value={roomNumber}
        onChange={e=>setRoomNumber(e.target.value)}
      />
      <button type="submit">
        send
      </button>
    </form>
    </div>
  )
};