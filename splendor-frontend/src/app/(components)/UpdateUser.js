'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from 'react'
import { io } from "socket.io-client";
import { updateUser } from "@/api";
import { useUserStore } from "@/zustand";


export default function EnterRoom({
  existingRoomNumber
}){
  const [roomNumber,setRoomNumber] = useState('')
  const [username,setUsername] = useState('')
  const [message,setMessage] = useState('')
  const [allMessages,setAllMessages] = useState([])
  const [randomRoomNumber,setRandomRoomNumber] = useState('')
  const router = useRouter()
  const updateUserName = useUserStore(state=>state.setUsername)

  useEffect(()=>{
    // socketInitializer()
    // socket.on("receive-message", (data) => {
    //   console.log('recive',data)
    // });
    // return () => {
    //   socket.disconnect();
    // };
  },[])


  return(
    <div>

      <h3>update user</h3>
      <form onSubmit={async (e)=>{
        e.preventDefault();
        console.log('updating user and added to room')

        //will it not set room number?
        const updatedUser = await updateUser({
          username,
          roomNumber,
          refresh:()=>router.refresh()
        })
        if(updatedUser.status!==200){
          console.log(updatedUser.message)
          return
        }
        console.log('updated user',updatedUser)
        updateUserName(updatedUser.username)
        router.push(`/rooms/${roomNumber}/play`)
      }}>
        <label for="username">update user: username</label>
        <input 
          name="username"
          type="text"
          value={username}
          onChange={e=>setUsername(e.target.value)}
        />
        {!existingRoomNumber &&
        <>
          <label for="roomNumber">roomNumber</label>
          <input 
            name="roomNumber"
            type="text"
            value={roomNumber}
            onChange={e=>setRoomNumber(e.target.value)}
          />
        </>}
        <button type="submit">
          Enter Room update
        </button>
      </form>
    </div>
  )
};