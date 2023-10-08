'use client';
import { useEffect,useState } from "react";
import { socketInitializeRoom } from "@/socket";
import { useUserStore,useSocketStore, useBoardStore } from "@/zustand";
import { useRouter } from "next/navigation";
import { createGame } from "@/app/lib";
import CardsGrid from "./cardsGrid";
import Tokens from "./tokens";
import PlayerAssets from "./playerAssets"
import Nobles from "./nobles"
import OtherPlayerAssets from "./otherPlayersAssets";

let socket: any;

type error = {
  message:string
}

const RoomPage = ({params})=>{
  console.log(params.roomNumber)
  const [users,setUsers] = useState([])
  const [gameStarted,setGameStarted] = useState(false)
  const [error,setError]=useState<error | null>(null)
  const username = useUserStore(state=>state.username)
  const victor = useBoardStore(state=>state.victor)
  const setVictor = useBoardStore(state=>state.setVictor)
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
        setGameStarted(data.gameActive)
      })
      socket.on('user-left',data=>{
        setUsers(data?.users)
      })
      socket.on('load-error',data=>{
        console.log('hit error!')
        setError(data.message ?? 'Error Occured, please reload the page')
      })
    }
  },[])

  return (
      username && (
      <div>
          {
            error && <h1 className="error">error</h1>
          }
          <h1>Room</h1>
          <h3>{params.roomNumber}</h3>
          {users?.map(user=>(
            <div key={user.username}>
            <span>{user.username}</span>
            <span>{user.active?"ACTIVE":"NOT ACTIVE"}</span>
            </div>
          ))}
          {victor && <h1>Game Over, Winner: {victor}</h1>}
          <Nobles params={params}/>
          <CardsGrid params={params}/>
          <Tokens params={params}/>
          <PlayerAssets params={params}/>
          <button onClick={(e)=>{
            e.preventDefault()
            setVictor(null)
            setGameStarted(true)
            socket?.emit('start-game',{
              room:params.roomNumber,
              board:createGame()
            })
          }}>{gameStarted?'Reset':'Play'}</button>

          <button onClick={(e)=>{
            e.preventDefault()
            router.push('/')
          }}>leave room</button>
          <OtherPlayerAssets params={params}/>
      </div>)
  )
}

export default RoomPage