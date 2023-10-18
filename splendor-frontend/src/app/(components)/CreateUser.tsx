'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createUser } from "@/api";
import { useUserStore } from "@/zustand";
import classNames from "classnames";
import { lemon } from "../layout";

export default function CreateUser({
  existingRoomNumber,
  className=''
}){
  const [roomNumber,setRoomNumber] = useState('')
  const [username,setUsername] = useState('')
  const [error,setError] = useState('')
  const router = useRouter()
  const updateUserName = useUserStore(state=>state.setUsername)
  useEffect(()=>{
    setRoomNumber(existingRoomNumber)
  },[])

  return(
    <div className={className}>
      <h3 className={classNames(lemon.className)}>create user</h3>
      <form 
        className="flex flex-col" 
        onSubmit={async (e)=>{
          e.preventDefault();
          console.log('creating user and added to room')

          const newUser = await createUser({
            username,
            roomNumber,
            refresh:()=>router.refresh()
          })
          if(newUser.status!==200){
            console.log(newUser.message)
            setError(newUser.message ?? 'error occured')
            return
          }
          updateUserName(newUser.username)
          router.push(`/rooms/${roomNumber}/play`)
      }}>
        <label htmlFor="username">username:</label>
        <input 
          name="username"
          type="text"
          value={username}
          onChange={e=>setUsername(e.target.value)}
        />
        {!existingRoomNumber &&
        <>
          <label className="font-optima">roomNumber</label>
          <input 
            name="roomNumber"
            type="text"
            value={roomNumber}
            onChange={e=>setRoomNumber(e.target.value)}
          />
        </>}
        {error && <div>{error}</div>}
        <button className="btn mt-2" type="submit" disabled={!username}>
          Enter Room
        </button>
      </form>
    </div>
  )
};