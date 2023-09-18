'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from 'react'
import { updateUser } from "@/api";
import { useUserStore } from "@/zustand";


export default function EnterRoom({
  existingRoomNumber
}){
  const [roomNumber,setRoomNumber] = useState('')
  const [username,setUsername] = useState('')
  const router = useRouter()
  useEffect(()=>{
    setRoomNumber(existingRoomNumber)
  },[])
  
  const updateUserName = useUserStore(state=>state.setUsername)


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
        <label>update user: username</label>
        <input 
          name="username"
          type="text"
          value={username}
          onChange={e=>setUsername(e.target.value)}
        />
        {!existingRoomNumber &&
        <>
          <label>roomNumber</label>
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