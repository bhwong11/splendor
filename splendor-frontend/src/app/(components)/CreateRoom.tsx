'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRoom } from "@/api";
import classNames from "classnames";
import { lemon } from "../layout";


export default function CreateRoom(){
  const [roomNumber,setRoomNumber] = useState('')
  const [error,setError] = useState('')
  const router = useRouter()


  return(
    <div>
      <h2 className={classNames(lemon.className)}>Create Room</h2>
      <form 
        className="flex flex-col"
        onSubmit={async (e)=>{
          e.preventDefault()
          const newRoom = await createRoom({
            roomNumber,
            refresh:()=>router.refresh()
          })
          if(newRoom.status!==200){
            setError(newRoom.message ?? 'error occured')
            return
          }
          
          router.push(`/rooms/${newRoom.roomNumber}`)
        }}
      >
      <div className="flex flex-col">
        <label htmlFor="room-number" className="font-optima font-bold">room number</label>
        <input 
          name="room-number"
          type="number"
          value={roomNumber}
          onChange={e=>setRoomNumber(e.target.value)}
          required
        />
      </div>
      {error && <div>{error}</div>}
      <button className="btn mt-2" type="submit">
        create
      </button>
      </form>
    </div>
  )
};