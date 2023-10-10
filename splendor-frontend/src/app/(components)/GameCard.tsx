'use client';
import { useEffect,useState,memo } from "react";
import { useRouter } from "next/navigation";
import { useSocketStore, useBoardStore, useUserStore } from "@/zustand";
import { actionTypes } from "@/zustand";
import { useCanBuyCard, useIsTurnPlayer } from "@/app/lib";
import classNames from "classnames";
import { 
  Card,
  generateUserBoardTokensFromBuy,
  updateTokens,
  removeCardFromBoard,
  gemEmojiMap,
  gameCardImages
} from "@/app/lib";

type CardProps ={
  card:Card
  staticCard: boolean
  roomNumber: number
  className?: string
}

const gradientMap = {
  white:'from-gray-400',
  blue:'from-blue-400',
  green:'from-green-400',
  red:'from-red-400',
  black:'from-gray-700',
  gold: 'from-yellow-400'
}


const GameCard = ({
  card,
  staticCard=false,
  roomNumber,
  className=''
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
  const isNoble = !card.gem && card.id
  
  useEffect(()=>{
    setTakenTurnCard(false)
  },[turn])

  //probably should break up these functions more
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
    className={classNames("card p-3 animate-fade bg-gradient-to-b",
      {[gradientMap[card.gem]]:card.gem},
      className
      )
    }
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
    {/* {JSON.stringify(card)} */}
    <p>id:{card.id}</p>
    {card.gem && <h4>Gem: {gemEmojiMap[card.gem]}</h4>}
    {gameCardImages[card.level] && 
    <div className="card__image-wrapper">
      <picture>
        <source srcSet={gameCardImages[card.level].WEBP} type="image/webp"/>
        <source srcSet={gameCardImages[card.level].JPG} type="image/jpeg"/> 
        <img src={gameCardImages[card.level].JPG}/>
      </picture>
    </div>}
    <h4>victory Points: {card.victoryPoints}</h4>
    <p>Price:</p>
    <div className="flex">
      {Object.keys(card.price || {}).map((gem)=>(
        <p className="pe-1">{gemEmojiMap[gem]}: {card.price[gem]}</p>
      ))}
    </div>
  </div>)
}

export default memo(GameCard,(oldProps,newProps)=>{
  return (
    oldProps.card.id === newProps.card.id
    && oldProps.roomNumber === newProps.roomNumber
    && oldProps.staticCard === newProps.staticCard
  )
})