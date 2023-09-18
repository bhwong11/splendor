'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from 'react'
import { io } from "socket.io-client";
import { createUser, updateUser } from "@/api";
import CreateUser from "./CreateUser";
import UpdateUser from "./UpdateUser"


export default function EnterRoom({
  existingRoomNumber
}){
  const [roomNumber,setRoomNumber] = useState('')
  const [username,setUsername] = useState('')
  const [message,setMessage] = useState('')
  const [allMessages,setAllMessages] = useState([])
  const [randomRoomNumber,setRandomRoomNumber] = useState('')
  const router = useRouter()


  return(
    <div>
      <h2>Enter</h2>
      <CreateUser existingRoomNumber={existingRoomNumber}/>
      <UpdateUser existingRoomNumber={existingRoomNumber}/>
      {/* <h3>create user</h3>
      <form onSubmit={async (e)=>{
        e.preventDefault();
        console.log('creating user and added to room')

        await createUser({
          username,
          roomNumber,
          refresh:()=>router.refresh()
        })
        router.push(`/rooms/${roomNumber}/play`)
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

      <h3>update user</h3>
      <form onSubmit={async (e)=>{
        e.preventDefault();
        console.log('creating user and added to room')

        //will it not set room number?
        await updateUser({
          username,
          roomNumber,
          refresh:()=>router.refresh()
        })
        router.push(`/rooms/${roomNumber}/play`)
      }}>
        <label for="username">update user: username</label>
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
      </form> */}
    </div>
  )
};