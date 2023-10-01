'use client';
import { useEffect,useState } from "react";
import { socketInitializeRoom } from "@/socket";
import { useRouter } from "next/navigation";
import { useSocketStore, useUserStore, useBoardStore } from "@/zustand";
import { actionTypes } from "@/zustand";
import { SocketUser } from "@/app/lib";


const PlayerAssets = ({params})=>{
  console.log(params.roomNumber)
  const socket = useSocketStore(state=>state.socket)
  const username = useUserStore(state=>state.username)
  const userCards = useUserStore(state=>state.cards)
  const userNobles = useUserStore(state=>state.nobles)
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
  const setUserNobles = useUserStore(state=>state.setNobles)
  const setUserTokens = useUserStore(state=>state.setTokens)
  const [actionTaken,setActionTaken]=useState(false)

  const passTurn = ()=>{
    console.log('passing turn')
    socket.emit('next-turn',{
      room:params.roomNumber
    })
  }

  const clearUser = ()=>{
    socket.emit('clear-user',{
      room:params.roomNumber,
      username
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
      socket.on('players-update',(users:SocketUser[])=>{
        const currentUser = users.find(user=>user.username=username)
        console.log('USER UPDATE',currentUser)
        setUserCards(currentUser.cards)
        setReservedCards(currentUser.reservedCards)
        setUserNobles(currentUser.nobles)
        setUserTokens(currentUser.tokens)
      })
    }
  },[socket])

  useEffect(()=>{
    setTurnAction(null)
    setActionTaken(false)
  },[turn])

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
          <p>nobles: {JSON.stringify(userNobles)}</p>
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
            {/* make a enum to loop over */}
            <button onClick={(e)=>{
              e.preventDefault()
              if(actionTaken) return
              setTurnAction(actionTypes.RESERVE)
            }}>Reserve</button>

            <button onClick={(e)=>{
              e.preventDefault()
              if(actionTaken) return
              setTurnAction(actionTypes.BUY_CARD)
            }}>Buy Card</button>

            <button onClick={(e)=>{
              e.preventDefault()
              if(actionTaken) return
              setTurnAction(actionTypes.BUY_CARD)
            }}>Buy Reserved Card</button>

            <button onClick={(e)=>{
              e.preventDefault()
              if(actionTaken) return
              setTurnAction(actionTypes.TAKE_TOKENS)
            }}>take tokens</button>
          </div>

          <button onClick={(e)=>{
            e.preventDefault()
            passTurn()
          }}>pass turn</button>

          <button onClick={(e)=>{
            e.preventDefault()
            clearUser()
          }}>clear user</button>
      </div>)
  )
}

export default PlayerAssets