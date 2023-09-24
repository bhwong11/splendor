'use client';
import { useEffect,useState } from "react";
import { socketInitializeRoom } from "@/socket";
import { useRouter } from "next/navigation";
import { useSocketStore, useUserStore, useBoardStore } from "@/zustand";
import { actionTypes } from "@/zustand";


const PlayerAssets = ({params})=>{
  console.log(params.roomNumber)
  const socket = useSocketStore(state=>state.socket)
  const username = useUserStore(state=>state.username)
  const cards = useUserStore(state=>state.cards)
  const tokens = useUserStore(state=>state.tokens)

  const turn = useBoardStore(state=>state.turn)
  const turnPlayer = useBoardStore(state=>state.turnPlayer)
  const turnAction = useUserStore(state=>state.turnAction)
  const setTurn = useBoardStore(state=>state.setTurn)
  const setTurnPlayer = useBoardStore(state=>state.setTurnPlayer)
  const setTurnAction= useUserStore(state=>state.setTurnAction)

  const passTurn = ()=>{
    console.log('passing turn')
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

  useEffect(()=>{
    setTurnAction(null)
  },[turnPlayer])

  return (
      username && (
      <div>
          <h1>ActionAssets</h1>
          <h4>turn:{JSON.stringify(turn)}</h4>
          <h4>turn action: {JSON.stringify(turnAction)}</h4>
          <h4>turn player: {JSON.stringify(turnPlayer)}</h4>
          <p>tokens: {JSON.stringify(tokens)}</p>
          <p>cards: {JSON.stringify(cards)}</p>

          <div>
            <button onClick={(e)=>{
              e.preventDefault()
              setTurnAction(actionTypes.RESERVE)
            }}>Reserve</button>

            <button onClick={(e)=>{
              e.preventDefault()
              setTurnAction(actionTypes.BUY_CARD)
            }}>Buy</button>

            <button onClick={(e)=>{
              e.preventDefault()
              setTurnAction(actionTypes.TAKE_TOKENS)
            }}>take tokens</button>
          </div>

          <button onClick={(e)=>{
            e.preventDefault()
            passTurn()
          }}>pass turn</button>
      </div>)
  )
}

export default PlayerAssets