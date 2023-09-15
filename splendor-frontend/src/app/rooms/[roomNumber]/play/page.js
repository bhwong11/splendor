'use client';
import { useEffect } from "react";
import { socketInitializeRoom } from "@/socket";
import { useUserStore } from "@/zustand";
import { useRouter } from "next/navigation";

let socket

const RoomPage = ({params})=>{
  console.log(params.roomNumber)
  const username = useUserStore(state=>state.username)
  const router = useRouter()
  useEffect(()=>{
    console.log('username!',username)
    if(!username){
      router.push('/')
    }
    socket = socketInitializeRoom(params.roomNumber,username)
  },[])

  return (
      <div>
          <h1>Room</h1>
          <h3>{params.roomNumber}</h3>
      </div>
  )
}

export default RoomPage