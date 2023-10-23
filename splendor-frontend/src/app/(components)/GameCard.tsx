'use client';
import { useEffect,useState,memo,useMemo } from "react";
import { useSocketStore, useBoardStore, useUserStore } from "@/zustand";
import { actionTypes } from "@/zustand";
import { useCanBuyCard, useIsTurnPlayer } from "@/app/lib";
import classNames from "classnames";
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
  const actionTaken = useUserStore(state=>state.actionTaken)
  const userCards = useUserStore(state=>state.cards)
  const userReservedCards = useUserStore(state=>state.reservedCards)
  const isReservedCard = userReservedCards.find(c=>card.id===c.id)

  const {canBuyCard,remainingCost,userCardsValueMap} = useCanBuyCard()
  const isTurnPlayer = useIsTurnPlayer()

  const cardsLv1 = useBoardStore(state=>state.cardsLv1)
  const cardsLv2 = useBoardStore(state=>state.cardsLv2)
  const cardsLv3 = useBoardStore(state=>state.cardsLv3)
  const boardTokens = useBoardStore(state=>state.tokens)

  const turnAction = useUserStore(state=>state.turnAction)
  const userTokens = useUserStore(state=>state.tokens)
  const [takenTurnCard,setTakenTurnCard] = useState(false)
  const [animationRun,setAnimationRun] = useState(false)

  const userTokensSerialized = JSON.stringify(userTokens)
  const userCardsSerialized = JSON.stringify(userCards.sort())
  const canBuy = useMemo(()=>canBuyCard(card),[
    card.id,
    userTokensSerialized,
    userCardsSerialized
  ])

  useEffect(()=>{
   const animationRun = setTimeout(()=>setAnimationRun(true),500)
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
        || actionTaken
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
    console.log('Resever',!isTurnPlayer,turnAction!==actionTypes.RESERVE,takenTurnCard)
    if(
        boardTokens.gold<=0
        || !isTurnPlayer
        || turnAction!==actionTypes.RESERVE
        || actionTaken
      ) return

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
    console.log('reserve card')
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
  
  const userCanBuyCard = canBuy && isTurnPlayer && turnAction===actionTypes.BUY_CARD
  const gemColor = card.gem ?? 'gold'

  return (
    <div
    className={classNames("card p-3 bg-gradient-to-b",
      gemColorMap[gemColor]?.textColor,
      gemColorMap[gemColor]?.borderColor,
      gemColorMap[gemColor]?.gradient,
      {
        [gemColorMap[card.gem]?.gradient]:!!card.gem,
        'hover:animate-[wiggle_1s_ease-in-out_infinite]':!staticCard,
        'animate-[zoomOut_500ms_ease-in-out]': !animationRun,
        'animate-[wiggle_1s_ease-in-out_infinite]':userCanBuyCard && !staticCard && !actionTaken,
        [gemColorMap[card.gem]?.textColor]:!!card.gem,
        [gemColorMap[card.gem]?.borderColor]:!!card.gem,
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


    <div className={classNames(
      "card__emoji-wrapper text-8xl py-2",
      noto_emoji.className,
      gemColorMap[gemColor]?.textColor,
    )}>
      {gameCardEmojis[card.level] || card.emoji}
    </div>

    <h4 className="text-center">victory Points: {card.victoryPoints}</h4>
    <p className={classNames("text-center border-b-2",gemColorMap[gemColor].borderColor)}>
      Price
    </p>
    <div className="flex justify-between">
      {Object.keys(card.price || {}).map((gem)=>(
        <div className="pe-1"  key={`gem-${gem}`}>
          <div className={classNames(noto_emoji.className,gemColorMap[gem].tokenColor,)}>
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