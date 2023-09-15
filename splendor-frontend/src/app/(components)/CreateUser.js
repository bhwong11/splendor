'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from 'react'
import { io } from "socket.io-client";
import { createUser } from "@/api";

let socket;


export default function CreateUser({
  existingRoomNumber
}){
  const [roomNumber,setRoomNumber] = useState('')
  const [username,setUsername] = useState('')
  const [message,setMessage] = useState('')
  const [allMessages,setAllMessages] = useState([])
  const [randomRoomNumber,setRandomRoomNumber] = useState('')
  const router = useRouter()

  const socketInitializer = async (room) =>{
    socket = io(process.env.NEXT_PUBLIC_API_URL)
    console.log('init')
    socket.emit('join-room',{
      room,
      username:''
    })
  }
  useEffect(()=>{
    // socketInitializer()
    socket.on("receive-message", (data) => {
      console.log('recive',data)
    });
    return () => {
      socket.disconnect();
    };
  },[])


  return(
    <div>
      <h3>create user</h3>
      <form onSubmit={async (e)=>{
        e.preventDefault();
        console.log('creating user and added to room')

        await createUser({
          username,
          roomNumber,
          refresh:()=>router.refresh()
        })
        router.push(`/rooms/${roomNumber}/play`)
        socketInitializer(roomNumber)
      }}>
        <label for="username">new user: username</label>
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
          Enter Room
        </button>
      </form>
    </div>
  )
};