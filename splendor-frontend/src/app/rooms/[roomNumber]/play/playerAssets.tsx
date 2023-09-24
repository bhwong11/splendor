'use client';
import { useEffect,useState } from "react";
import { socketInitializeRoom } from "@/socket";
import { useRouter } from "next/navigation";
import { useSocketStore, useUserStore, useBoardStore } from "@/zustand";


const CardsGrid = ({params})=>{
  console.log(params.roomNumber)
  const [users,setUsers] = useState([])
  const socket = useSocketStore(state=>state.socket)
  const username = useUserStore(state=>state.username)
  const cards = useUserStore(state=>state.cards)
  const tokens = useUserStore(state=>state.tokens)

  const turn = useBoardStore(state=>state.turn)
  const turnPlayer = useBoardStore(state=>state.turnPlayer)
  const setTurn = useBoardStore(state=>state.setTurn)
  const setTurnPlayer = useBoardStore(state=>state.setTurnPlayer)

  const passTurn = ()=>{
    socket.emit('next-turn',{
      room:params.roomNumber
    })
  }

  const router = useRouter()
  useEffect(()=>{
    if(socket){
      socket.on('turn-update',data=>{
        console.log('turn update',data)
        setTurn(data.turn)
        setTurnPlayer(data.turnPlayer.username)
      })
    }
  },[socket])

  return (
      username && (
      <div>
          <h1>Player Assets</h1>
          <h4>turn:{JSON.stringify(turn)}</h4>
          <h4>turn player: {JSON.stringify(turnPlayer)}</h4>
          <button onClick={(e)=>{
            e.preventDefault()
            passTurn()
          }}>pass turn</button>
      </div>)
  )
}

export default CardsGrid