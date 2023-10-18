'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRoom } from "@/api";


export default function CreateRoom(){
  const [roomNumber,setRoomNumber] = useState('')
  const [error,setError] = useState('')
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
        if(newRoom.status!==200){
          setError(newRoom.message ?? 'error occured')
          return
        }
        
        router.push(`/rooms/${newRoom.roomNumber}`)
      }}>
      <div>
        <label>room number</label>
        <input 
          name="number"
          type="number"
          value={roomNumber}
          onChange={e=>setRoomNumber(e.target.value)}
        />
      </div>
      {error && <div>{error}</div>}
      <button className="btn" type="submit">
        create
      </button>
      </form>
    </div>
  )
};