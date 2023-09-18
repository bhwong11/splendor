'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createUser } from "@/api";
import { useUserStore } from "@/zustand";

export default function CreateUser({
  existingRoomNumber
}){
  const [roomNumber,setRoomNumber] = useState('')
  const [username,setUsername] = useState('')
  const router = useRouter()
  const updateUserName = useUserStore(state=>state.setUsername)
  useEffect(()=>{
    setRoomNumber(existingRoomNumber)
  },[])

  return(
    <div>
      <h3>create user</h3>
      <form onSubmit={async (e)=>{
        e.preventDefault();
        console.log('creating user and added to room')

        const newUser = await createUser({
          username,
          roomNumber,
          refresh:()=>router.refresh()
        })
        if(newUser.status!==200){
          console.log(newUser.message)
          return
        }
        updateUserName(newUser.username)
        router.push(`/rooms/${roomNumber}/play`)
      }}>
        <label>new user: username</label>
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
          Enter Room
        </button>
      </form>
    </div>
  )
};