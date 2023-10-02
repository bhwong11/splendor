'use client';
import { useEffect,useState } from "react";
import { socketInitializeRoom } from "@/socket";
import { useRouter } from "next/navigation";
import { useSocketStore, useUserStore, useBoardStore } from "@/zustand";
import { actionTypes } from "@/zustand";
import { Card,SocketUser,generateUserBoardTokensFromBuy,useCanBuyCard,updateTokens,removeCardFromBoard } from "@/app/lib";


const PlayerAssets = ({params})=>{
  console.log(params.roomNumber)
  const socket = useSocketStore(state=>state.socket)
  const username = useUserStore(state=>state.username)
  const userCards = useUserStore(state=>state.cards)
  const userNobles = useUserStore(state=>state.nobles)
  const tokens = useUserStore(state=>state.tokens)
  const boardTokens = useBoardStore(state=>state.tokens)
  const reservedCards = useUserStore(state=>state.reservedCards)
  const cardsLv1 = useBoardStore(state=>state.cardsLv1)
  const cardsLv2 = useBoardStore(state=>state.cardsLv2)
  const cardsLv3 = useBoardStore(state=>state.cardsLv3)
  const victoryPoints = useUserStore(state=>(
    state.cards.reduce((all,card)=>all+card.victoryPoints,0)
    + state.nobles.reduce((all,noble)=>all+noble.victoryPoints,0)
  ))
  const {remainingCost,userCardsValueMap} = useCanBuyCard()

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

  const buyReservedCard = (card:Card)=>{
    const goldTokenCost = remainingCost(card)
    const [userTokensClone,boardTokensClone]=generateUserBoardTokensFromBuy(
      card,
      tokens,
      boardTokens,
      goldTokenCost,
      userCardsValueMap
    )
    removeCardFromBoard(
      socket,
      username,
      params.roomNumber,
      card,
      cardsLv1,
      cardsLv2,
      cardsLv3,
      false
    )
    updateTokens(
      socket,
      username,
      params.roomNumber,
      userTokensClone,
      boardTokensClone
    )
    socket.emit('buy-reserve-card',{
      room:params.roomNumber,
      username,
      card
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
          <p>victoryPoints: {victoryPoints}</p>
          <p>tokens: {JSON.stringify(tokens)}</p>
          <p>cards: {JSON.stringify(userCards)}</p>
          <p>Reserved Cards: {JSON.stringify(reservedCards)}</p>
          <p>nobles: {JSON.stringify(userNobles)}</p>
          <div>
            {reservedCards?.map(card=>(
              <div
                onClick={()=>buyReservedCard(card)}
                className="card"
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