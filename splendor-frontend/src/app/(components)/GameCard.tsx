'use client';
import { useEffect,useState,memo,useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSocketStore, useBoardStore, useUserStore } from "@/zustand";
import { actionTypes } from "@/zustand";
import { useCanBuyCard, useIsTurnPlayer } from "@/app/lib";
import classNames from "classnames";
import { CSSProperties } from "react";
import { 
  Card,
  generateUserBoardTokensFromBuy,
  updateTokens,
  removeCardFromBoard,
  gemColorMap,
  gameCardEmojis
} from "@/app/lib";
import { noto_emoji } from '@/app/layout'

type CardProps ={
  card:Card
  staticCard: boolean
  roomNumber: number
  className?: string
  animationStyle?: CSSProperties
  duration?: number
}


const GameCard = ({
  card,
  staticCard=false,
  roomNumber,
  className='',
  animationStyle,
  duration = 500
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
  const [animationRun,setAnimationRun] = useState(false)

  const isNoble = !card.gem && card.id
  
  useEffect(()=>{
    setTakenTurnCard(false)
  },[turn])

  useEffect(()=>{
   const animationRun = setTimeout(()=>setAnimationRun(true),duration)
    return ()=>clearTimeout(animationRun);
  },[card.id])

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
  
  const userCanBuyCard = canBuyCard(card) && isTurnPlayer && turnAction===actionTypes.BUY_CARD

  return (
    <div
    className={classNames("card p-3 bg-gradient-to-b",
      {
        [gemColorMap[card.gem]?.gradient]:card.gem,
        'hover:animate-[wiggle_1s_ease-in-out_infinite]':!staticCard,
        [`animate-[zoomOut_${duration}ms_ease-in-out]`]: !animationRun,
        'animate-pulse':userCanBuyCard
      },
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

    <p>id:{card.id}</p>
    {card.gem && (
    <h4>
      Gem: 
      <span className={classNames(noto_emoji.className,gemColorMap[card.gem].tokenColor)}>
        💎
      </span>
    </h4>)}

    {gameCardEmojis[card.level] && 
    <div className={classNames(
      "card__emoji-wrapper text-8xl pt-2",
      noto_emoji.className,
      gemColorMap[card.gem].mainEmoji
    )}>
      {gameCardEmojis[card.level]}
    </div>}


    <h4>victory Points: {card.victoryPoints}</h4>
    <p>Price:</p>
    <div className="flex justify-between">
      {Object.keys(card.price || {}).map((gem)=>(
        <div className="pe-1">
          <div className={classNames(noto_emoji.className,gemColorMap[gem].tokenColor)}>
            💎
          </div>
          <div className={classNames("text-center")}>
            {card.price[gem]}
          </div>
        </div>
      ))}
    </div>
  </div>)
}

export default memo(GameCard,(oldProps,newProps)=>{
  return (
    oldProps.card.id === newProps.card.id
    && oldProps.roomNumber === newProps.roomNumber
    && oldProps.staticCard === newProps.staticCard
    && oldProps.className === newProps.className
  )
})