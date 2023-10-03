'use client';
import { useEffect,useState } from "react";
import { useRouter } from "next/navigation";
import { useSocketStore, useBoardStore, useUserStore } from "@/zustand";
import { actionTypes } from "@/zustand";
import { useCanBuyCard, useIsTurnPlayer } from "@/app/lib";
import { Card, Tokens, generateUserBoardTokensFromBuy, updateTokens, removeCardFromBoard } from "@/app/lib";

const CardsGrid = ({params})=>{
  console.log(params.roomNumber)
  const username = useUserStore(state=>state.username)
  const socket = useSocketStore(state=>state.socket)
  const setCardsLv1 = useBoardStore(state=>state.setCardsLv1)
  const setCardsLv2 = useBoardStore(state=>state.setCardsLv2)
  const setCardsLv3 = useBoardStore(state=>state.setCardsLv3)
  const setUserTokens = useUserStore(state=>state.setTokens)
  const setReservedCards = useUserStore(state=>state.setReservedCards)
  const setUserCards = useUserStore(state=>state.setCards)

  const {canBuyCard,remainingCost,userCardsValueMap} = useCanBuyCard()
  const isTurnPlayer = useIsTurnPlayer()

  const cardsLv1 = useBoardStore(state=>state.cardsLv1)
  const cardsLv2 = useBoardStore(state=>state.cardsLv2)
  const cardsLv3 = useBoardStore(state=>state.cardsLv3)
  const boardTokens = useBoardStore(state=>state.tokens)

  const turnAction = useUserStore(state=>state.turnAction)
  const userCards = useUserStore(state=>state.cards)
  const userReservedCards = useUserStore(state=>state.reservedCards)
  const userTokens = useUserStore(state=>state.tokens)
  const [cardsLv1Display,setCardsLv1Display] = useState([])
  const [cardsLv2Display,setCardsLv2Display] = useState([])
  const [cardsLv3Display,setCardsLv3Display] = useState([])
  
  const router = useRouter()
  useEffect(()=>{
    if(socket){
      socket.on('game-board',data=>{
        console.log('game-board',data)
        setCardsLv1(data.cardsLv1)
        setCardsLv2(data.cardsLv2)
        setCardsLv3(data.cardsLv3)
        setCardsLv1Display(data.cardsLv1.slice(data.cardsLv1.length-4,data.cardsLv1.length))
        setCardsLv2Display(data.cardsLv2.slice(data.cardsLv2.length-4,data.cardsLv2.length))
        setCardsLv3Display(data.cardsLv3.slice(data.cardsLv3.length-4,data.cardsLv3.length))
      })

      socket.on('board-cards-update',data=>{
        console.log('board-cards-update',data)
        setCardsLv1(data.cardsLv1)
        setCardsLv2(data.cardsLv2)
        setCardsLv3(data.cardsLv3)
        setCardsLv1Display(prev=>{
          const newCards = data.cardsLv1.slice(data.cardsLv1.length-4,data.cardsLv1.length)

          const indexOfOldCard = prev.findIndex(card=>card.id===data?.newCard.id)
          if(indexOfOldCard===-1){
            return newCards
          }
          const prevCopy = [...prev]
          prevCopy.splice(indexOfOldCard,1,newCards[0])
          return prevCopy
        })
        setCardsLv2Display(prev=>{
          const newCards = data.cardsLv2.slice(data.cardsLv2.length-4,data.cardsLv2.length)

          const indexOfOldCard = prev.findIndex(card=>card.id===data?.newCard.id)
          if(indexOfOldCard===-1){
            return newCards
          }
          const prevCopy = [...prev]
          prevCopy.splice(indexOfOldCard,1,newCards[0])
          return prevCopy
        })
        setCardsLv3Display(prev=>{
          const newCards = data.cardsLv3.slice(data.cardsLv3.length-4,data.cardsLv3.length)

          const indexOfOldCard = prev.findIndex(card=>card.id===data?.newCard.id)
          if(indexOfOldCard===-1){
            return newCards
          }
          const prevCopy = [...prev]
          prevCopy.splice(indexOfOldCard,1,newCards[0])
          return prevCopy
        })
      })
    }
  },[socket])

  const takeCard = (card:Card)=>{
    const canBuy = canBuyCard(card)
    console.log('buying card',!canBuy,!isTurnPlayer,turnAction!==actionTypes.BUY_CARD)
    if(
        !canBuy
        || !isTurnPlayer
        || turnAction!==actionTypes.BUY_CARD
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
      params.roomNumber,
      card,
      cardsLv1,
      cardsLv2,
      cardsLv3,
      true
    )
    updateTokens(
      socket,
      username,
      params.roomNumber,
      userTokensClone,
      boardTokensClone
    )
  }

  const reserveCard = (card:Card)=>{
    if(boardTokens.gold<=0) return
    updateTokens(
      socket,
      username,
      params.roomNumber,
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
      params.roomNumber,
      card,
      cardsLv1,
      cardsLv2,
      cardsLv3,
      false
    )
    socket.emit('reserve-card',{
      room:params.roomNumber,
      username,
      card
    })
  }

  return (
      username && (
      <div className="max-w-7xl">
          <h1 className="text-3xl font-bold underline">Card grid</h1>
          <h4>lv 3 cards</h4>
          <div className="cards-lv3 flex w-full">
            {cardsLv3Display
              .map(cardLv3=>(
                <div
                  className="card w-full"
                  key={cardLv3.id}
                  onClick={()=>{
                    if(turnAction===actionTypes.BUY_CARD){
                      takeCard(cardLv3)
                    }
                    if(turnAction===actionTypes.RESERVE){
                      reserveCard(cardLv3)
                    }
                  }}
                >
                  {JSON.stringify(cardLv3)}
                </div>
              ))}
          </div>
          <h4>lv 2 cards</h4>
          <div className="cards-lv2 flex">
            {cardsLv2Display
              .map(cardLv2=>(
              <div
                className="card"
                key={cardLv2.id}
                onClick={()=>{
                  if(turnAction===actionTypes.BUY_CARD){
                    takeCard(cardLv2)
                  }
                  if(turnAction===actionTypes.RESERVE){
                    reserveCard(cardLv2)
                  }
                }}
              >
                {JSON.stringify(cardLv2)}
              </div>
            ))}
          </div>
          <h4>lv 1 cards</h4>
          <div className="cards-lv2 flex">
            {cardsLv1Display
              .map(cardLv1=>(
              <div
                className="card"
                key={cardLv1.id}
                onClick={()=>{
                  if(turnAction===actionTypes.BUY_CARD){
                    takeCard(cardLv1)
                  }
                  if(turnAction===actionTypes.RESERVE){
                    reserveCard(cardLv1)
                  }
                }}
              >
                {JSON.stringify(cardLv1)}
              </div>
            ))}
          </div>
      </div>)
  )
}

export default CardsGrid