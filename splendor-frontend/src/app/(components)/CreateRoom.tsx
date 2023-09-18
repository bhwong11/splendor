'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRoom } from "@/api";


export default function CreateRoom(){
  const [roomNumber,setRoomNumber] = useState('')
  const router = useRouter()


  return(
    <div>
      <h2>Create Room</h2>
      <form onSubmit={async (e)=>{
        e.preventDefault()
        console.log('create room')
        const newRoom = await createRoom({
          roomNumber,
          refresh:()=>router.refresh()
        })
        
        router.push(`/rooms/${newRoom.roomNumber}`)
      }}>
      <div>
        <label>room number</label>
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