'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from 'react'
import { updateUser } from "@/api";
import { useUserStore } from "@/zustand";
import classNames from "classnames";
import { lemon } from "../layout";


export default function EnterRoom({
  existingRoomNumber,
  className=""
}){
  const [roomNumber,setRoomNumber] = useState('')
  const [username,setUsername] = useState('')
  const [error,setError] = useState('')
  const router = useRouter()
  useEffect(()=>{
    setRoomNumber(existingRoomNumber)
  },[])
  
  const updateUserName = useUserStore(state=>state.setUsername)


  return(
    <div className={className}>
      <h3 className={classNames(lemon.className)}>update user</h3>
      <form 
        className="flex flex-col"
        onSubmit={async (e)=>{
          e.preventDefault();
          console.log('updating user and added to room')

          //will it not set room number?
          const updatedUser = await updateUser({
            username,
            roomNumber,
            refresh:()=>router.refresh()
          })
          if(updatedUser.status!==200){
            setError(updatedUser.message ?? 'error occured')
            return
          }
          console.log('updated user',updatedUser)
          updateUserName(updatedUser.username)
          router.push(`/rooms/${roomNumber}/play`)
      }}>
        <label htmlFor="username" className="font-optima font-bold">
          username:
        </label>
        <input 
          name="username"
          type="text"
          value={username}
          onChange={e=>setUsername(e.target.value)}
        />
        {!existingRoomNumber &&
        <>
          <label htmlFor="roomNumber" className="font-optima font-bold">
            roomNumber:
          </label>
          <input 
            name="roomNumber"
            type="text"
            value={roomNumber}
            onChange={e=>setRoomNumber(e.target.value)}
          />
        </>}
        {error && <div>{error}</div>}
        <button className="btn mt-2" type="submit" disabled={!username}>
          Enter Room update
        </button>
      </form>
    </div>
  )
};