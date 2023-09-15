'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from 'react'
import { io } from "socket.io-client";
import { createRoom } from "@/api";

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
    // socketInitializer()
    // socket.on("receive-message", (data) => {
    //   console.log('recive',data)
    //   setAllMessages((pre) => [...pre, data]);
    // });
    // return () => {
    //   socket.disconnect();
    // };
  },[])


  return(
    <div>
      <form onSubmit={(e)=>{
        e.preventDefault()
        console.log('create room')
        createRoom({
          roomNumber,
          refresh:()=>router.refresh()
        })
      }}>
      <div>
        <label for="number">room number</label>
        <input 
          name="number"
          type="text"
          value={roomNumber}
          onChange={e=>setRoomNumber(e.target.value)}
        />
      </div>
      <button type="submit">
        create
      </button>
      </form>
    </div>
  )
};