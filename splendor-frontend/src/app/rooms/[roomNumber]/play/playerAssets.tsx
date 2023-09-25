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
  const userCards = useUserStore(state=>state.cards)
  const tokens = useUserStore(state=>state.tokens)
  const reservedCards = useUserStore(state=>state.reservedCards)

  const turn = useBoardStore(state=>state.turn)
  const turnPlayer = useBoardStore(state=>state.turnPlayer)
  const turnAction = useUserStore(state=>state.turnAction)
  const setTurn = useBoardStore(state=>state.setTurn)
  const setTurnPlayer = useBoardStore(state=>state.setTurnPlayer)
  const setTurnAction = useUserStore(state=>state.setTurnAction)
  const setUserCards = useUserStore(state=>state.setCards)
  const setReservedCards = useUserStore(state=>state.setReservedCards)

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
          <h1>Player Assets</h1>
          <h4>turn:{JSON.stringify(turn)}</h4>
          <h4>turn action: {JSON.stringify(turnAction)}</h4>
          <h4>turn player: {JSON.stringify(turnPlayer)}</h4>
          <p>tokens: {JSON.stringify(tokens)}</p>
          <p>cards: {JSON.stringify(userCards)}</p>
          <p>Reserved Cards: {JSON.stringify(reservedCards)}</p>
          <div>
            {reservedCards?.map(card=>(
              <div 
                onClick={()=>{
                  socket.emit('buy-reserve-card',{
                    room:params.roomNumber,
                    username,
                    card
                  })
                  setUserCards([...userCards,card])
                  setReservedCards(reservedCards.filter(c=>c.id!==card.id))
                }}
              >
                {JSON.stringify(card)}
              </div>
            ))}
          </div>


          <div>
            <button onClick={(e)=>{
              e.preventDefault()
              setTurnAction(actionTypes.RESERVE)
            }}>Reserve</button>

            <button onClick={(e)=>{
              e.preventDefault()
              setTurnAction(actionTypes.BUY_CARD)
            }}>Buy Card</button>

            <button onClick={(e)=>{
              e.preventDefault()
              setTurnAction(actionTypes.BUY_CARD)
            }}>Buy Reserved Card</button>

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