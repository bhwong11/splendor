'use client';
import { useEffect,useState } from "react";
import { socketInitializeRoom } from "@/socket";
import { useUserStore } from "@/zustand";
import { useRouter } from "next/navigation";

let socket

const RoomPage = ({params})=>{
  console.log(params.roomNumber)
  const [users,setUsers] = useState([])
  const username = useUserStore(state=>state.username)
  const router = useRouter()
  useEffect(()=>{
    console.log('username!',username)
    if(!username){
      router.push('/')
    }
    socket = socketInitializeRoom(params.roomNumber,username)
    console.log('soc',socket)
    if(socket){
      socket.on('user-joined',data=>{
        console.log('user=join',data)
        setUsers(data)
      })
      socket.on('user-left',data=>{
        console.log('user-left',data)
        setUsers(data)
      })
    }
  },[])

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

export default RoomPage