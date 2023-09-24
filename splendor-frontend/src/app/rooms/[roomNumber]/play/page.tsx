'use client';
import { useEffect,useState } from "react";
import { socketInitializeRoom } from "@/socket";
import { useUserStore } from "@/zustand";
import { useRouter } from "next/navigation";
import { createGame } from "@/app/lib";
import { useSocketStore } from "@/zustand";
import CardsGrid from "./cardsGrid";
import Tokens from "./tokens";
import PlayerAssets from "./playerAssets"
import Nobles from "./nobles"
import OtherPlayerAssets from "./otherPlayersAssets";

let socket: any;

const RoomPage = ({params})=>{
  console.log(params.roomNumber)
  const [users,setUsers] = useState([])
  const username = useUserStore(state=>state.username)
  const setSocket = useSocketStore(state=>state.setSocket)
  const router = useRouter()
  useEffect(()=>{
    if(!username){
      router.push('/')
    }
    socket = socketInitializeRoom(params.roomNumber,username)
    setSocket(socket)
    if(socket){
      socket.on('user-joined',data=>{
        setUsers(data?.users)
      })
      socket.on('user-left',data=>{
        setUsers(data?.users)
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
          <Nobles params={params}/>
          <CardsGrid params={params}/>
          <Tokens params={params}/>
          <PlayerAssets params={params}/>
          <button onClick={(e)=>{
            e.preventDefault()
            console.log('socket',socket)
            socket?.emit('start-game',{
              room:params.roomNumber,
              board:createGame()
            })
          }}>Play</button>
          <OtherPlayerAssets params={params}/>
      </div>)
  )
}

export default RoomPage