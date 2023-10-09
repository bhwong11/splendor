'use client';
import { useEffect,useState,memo } from "react";
import { useRouter } from "next/navigation";
import { useSocketStore, useBoardStore, useUserStore } from "@/zustand";
import { actionTypes } from "@/zustand";
import { useCanBuyCard, useIsTurnPlayer } from "@/app/lib";
import { Card, generateUserBoardTokensFromBuy, updateTokens, removeCardFromBoard } from "@/app/lib";

type CardProps ={
  card:Card
  staticCard: boolean
  roomNumber: number
}

const GameCard = ({
  card,
  staticCard=false,
  roomNumber
}:CardProps)=>{
  const username = useUserStore(state=>state.username)
  const socket = useSocketStore(state=>state.socket)
  const setActionTaken = useUserStore(state=>state.setActionTaken)
  const userReservedCards = useUserStore(state=>state.reservedCards)
  const isReservedCard = userReservedCards.find(c=>card.id===c.id)

  const {canBuyCard,remainingCost,userCardsValueMap} = useCanBuyCard()
  const isTurnPlayer = useIsTurnPlayer()
  const turn = useBoardStore(state=>state.turn)

  const cardsLv1 = useBoardStore(state=>state.cardsLv1)
  const cardsLv2 = useBoardStore(state=>state.cardsLv2)
  const cardsLv3 = useBoardStore(state=>state.cardsLv3)
  const boardTokens = useBoardStore(state=>state.tokens)

  const turnAction = useUserStore(state=>state.turnAction)
  const userTokens = useUserStore(state=>state.tokens)
  const [takenTurnCard,setTakenTurnCard] = useState(false)
  
  useEffect(()=>{
    setTakenTurnCard(false)
  },[turn])

  const takeCard = (card:Card)=>{
    const canBuy = canBuyCard(card)
    console.log('buying card',!canBuy,!isTurnPlayer,turnAction!==actionTypes.BUY_CARD,takenTurnCard)
    if(
        !canBuy
        || !isTurnPlayer
        || turnAction!==actionTypes.BUY_CARD
        || takenTurnCard
      ) return
    
    const goldTokenCost = remainingCost(card)
    const [userTokensClone,boardTokensClone]=generateUserBoardTokensFromBuy(
      card,
      userTokens,
      boardTokens,
      goldTokenCost,
      userCardsValueMap
    )
    removeCardFromBoard(
      socket,
      username,
      roomNumber,
      card,
      cardsLv1,
      cardsLv2,
      cardsLv3,
      true
    )
    updateTokens(
      socket,
      username,
      roomNumber,
      userTokensClone,
      boardTokensClone
    )
    setTakenTurnCard(true)
    setActionTaken(true)
  }

  const reserveCard = (card:Card)=>{
    if(boardTokens.gold<=0 || takenTurnCard) return
    updateTokens(
      socket,
      username,
      roomNumber,
    {
      ...userTokens,
      gold:userTokens.gold+1
    },
    {
      ...boardTokens,
      gold:boardTokens.gold -1
    })
    removeCardFromBoard(
      socket,
      username,
      roomNumber,
      card,
      cardsLv1,
      cardsLv2,
      cardsLv3,
      false
    )
    socket.emit('reserve-card',{
      room:roomNumber,
      username,
      card
    })
    setTakenTurnCard(true)
    setActionTaken(true)
  }

  const buyReservedCard = (card:Card)=>{
    const canBuy = canBuyCard(card)
    if(!canBuy || takenTurnCard) return
    const goldTokenCost = remainingCost(card)
    const [userTokensClone,boardTokensClone]=generateUserBoardTokensFromBuy(
      card,
      userTokens,
      boardTokens,
      goldTokenCost,
      userCardsValueMap
    )
    removeCardFromBoard(
      socket,
      username,
      roomNumber,
      card,
      cardsLv1,
      cardsLv2,
      cardsLv3,
      false
    )
    updateTokens(
      socket,
      username,
      roomNumber,
      userTokensClone,
      boardTokensClone
    )
    socket.emit('buy-reserve-card',{
      room:roomNumber,
      username,
      card
    })
    setTakenTurnCard(true)
  }

  return (
    <div
    className="card"
    key={card.id}
    onClick={()=>{
      if(staticCard) return
      if(turnAction===actionTypes.BUY_CARD){
        if(isReservedCard){
          buyReservedCard(card)
        }else{
          takeCard(card)
        }
      }else if(turnAction===actionTypes.RESERVE){
        reserveCard(card)
      }
    }}
  >
    {JSON.stringify(card)}
  </div>)
}

export default memo(GameCard,(oldProps,newProps)=>{
  return (
    oldProps.card.id === newProps.card.id
    && oldProps.roomNumber === newProps.roomNumber
    && oldProps.staticCard === newProps.staticCard
  )
})