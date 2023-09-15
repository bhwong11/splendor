'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUser } from "@/api";
import { useUserStore } from "@/zustand";

export default function CreateUser({
  existingRoomNumber
}){
  const [roomNumber,setRoomNumber] = useState('')
  const [username,setUsername] = useState('')
  const [message,setMessage] = useState('')
  const [allMessages,setAllMessages] = useState([])
  const [randomRoomNumber,setRandomRoomNumber] = useState('')
  const router = useRouter()
  const updateUserName = useUserStore(state=>state.setUsername)

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
        <label for="username">new user: username</label>
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
          Enter Room
        </button>
      </form>
    </div>
  )
};