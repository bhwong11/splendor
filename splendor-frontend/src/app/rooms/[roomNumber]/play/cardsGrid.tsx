'use client';
import { useEffect,useState } from "react";
import { socketInitializeRoom } from "@/socket";
import { useUserStore } from "@/zustand";
import { useRouter } from "next/navigation";
import { useSocketStore, useBoardStore } from "@/zustand";

let socket;

const CardsGrid = ({params})=>{
  console.log(params.roomNumber)
  const [users,setUsers] = useState([])
  const username = useUserStore(state=>state.username)
  const socket = useSocketStore(state=>state.socket)
  
  const router = useRouter()
  useEffect(()=>{
    if(socket){
      socket.on('game-board',data=>{
        console.log('user=join',data)
      })
    }
  },[socket])

  return (
      username && (
      <div>
          <h1>Room</h1>
          <h3>{params.roomNumber}</h3>
          {users?.map(user=>(
            <div key={user.username}>
            <span>{user.username}</span>
            <span>{user.active?"ACTIVE":"NOT ACTIVE"}</span>
            </div>
          ))}
      </div>)
  )
}

export default CardsGrid