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
import classNames from "classnames";
import { lemon } from '@/app/layout'

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
        console.log('hit error!',data)
        setError(data.message ?? 'Error Occured, please reload the page')
      })
    }
  },[])

  return (
      username && (
      <div className="bg-yellow-100">
        <div>
            <h1 className={classNames(lemon.className)}>
              Room: {params.roomNumber}
            </h1>
            <Nobles params={params}/>
            <CardsGrid params={params}/>
            <Tokens params={params}/>
            <div className={classNames(
              "sticky bottom-0 bg-pink-100 rounded p-3 border-4 border-pink-500 w-full"
            )}>
              {
                error && 
                <div className="text-red-700 rounded bg-red-200 p-3">
                  <h1 className="error">error</h1>
                  <>{error}</>
                </div>
              }
              <h1 className={classNames(lemon.className)}>
                Player Assets
              </h1>
              <div className="flex gap-1">
              <span>users online:</span>
                {users?.map(user=>(
                  <div className="flex items-center justify-center" key={user.username}>
                  <div>{user.username}&nbsp;</div>
                  {user.active?<div className="bg-green-500 border-2 p-1 rounded-full"/>
                  :<div className="bg-transparent border-2 p-1 rounded-full"/>}
                  </div>
                ))}
              </div>

              <PlayerAssets params={params}/>

              <div className="flex gap-1 flex-wrap">
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
                  socket?.emit('leave-room',{
                    room:params.roomNumber,
                    username
                  })
                  router.push('/')
                }}>leave room</button>
                <OtherPlayerAssets params={params}/>
              </div>
            </div>

            {victor && <h1>Game Over, Winner: {victor}</h1>}
        </div>
      </div>)
  )
}

export default RoomPage