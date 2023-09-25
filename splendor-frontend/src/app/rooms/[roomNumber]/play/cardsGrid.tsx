'use client';
import { useEffect,useState } from "react";
import { useRouter } from "next/navigation";
import { useSocketStore, useBoardStore, useUserStore } from "@/zustand";
import { actionTypes } from "@/zustand";
import { useCanBuyCard, useIsTurnPlayer } from "@/app/lib";
import cloneDeep from 'lodash/clonedeep';

const CardsGrid = ({params})=>{
  console.log(params.roomNumber)
  const username = useUserStore(state=>state.username)
  const socket = useSocketStore(state=>state.socket)
  const setCardsLv1 = useBoardStore(state=>state.setCardsLv1)
  const setCardsLv2 = useBoardStore(state=>state.setCardsLv2)
  const setCardsLv3 = useBoardStore(state=>state.setCardsLv3)
  const setUserTokens = useUserStore(state=>state.setTokens)

  const {canBuyCard,userCardsValueMap} = useCanBuyCard()
  const isTurnPlayer = useIsTurnPlayer()

  const cardsLv1 = useBoardStore(state=>state.cardsLv1)
  const cardsLv2 = useBoardStore(state=>state.cardsLv2)
  const cardsLv3 = useBoardStore(state=>state.cardsLv3)
  const boardTokens = useBoardStore(state=>state.tokens)

  const turnAction = useUserStore(state=>state.turnAction)
  const userCards = useUserStore(state=>state.cards)
  const userTokens = useUserStore(state=>state.tokens)
  
  const router = useRouter()
  useEffect(()=>{
    if(socket){
      socket.on('game-board',data=>{
        console.log('game-board',data)
        setCardsLv1(data.cardsLv1)
        setCardsLv2(data.cardsLv2)
        setCardsLv3(data.cardsLv3)
      })

      socket.on('board-cards-update',data=>{
        console.log('board-cards-update',data)
        setCardsLv1(data.cardsLv1)
        setCardsLv2(data.cardsLv2)
        setCardsLv3(data.cardsLv3)
      })
    }
  },[socket])

  const takeCard = (card)=>{
    // const cardsValueMap = userCards.reduce((all,next)=>({
    //   ...all,
    //   [next.gem]: all[next.gem]?all[next.gem]+1:1
    // }),{})
    // const canBuy = Object.keys(card.price).every(gemColor=>(
    //   card.price[gemColor]<=cardsValueMap[gemColor]+userTokens[gemColor]
    // ))
    const canBuy = canBuyCard(card)
    console.log('buying card',!canBuy,!isTurnPlayer,turnAction!==actionTypes.BUY_CARD)
    if(
        !canBuy
        || !isTurnPlayer
        || turnAction!==actionTypes.BUY_CARD
      ) return
    const userTokensClone = cloneDeep(userTokens)
    const boardTokensClone = cloneDeep(boardTokens)
    Object.keys(card.price).forEach(gemColor=>{
      const rawPriceLessCards = card.price[gemColor] - userCardsValueMap[gemColor]
      const finalPriceLessCards = rawPriceLessCards>=0?rawPriceLessCards:0
      userTokensClone[gemColor]-= finalPriceLessCards
      boardTokensClone[gemColor] += finalPriceLessCards
    })
    setUserTokens(userTokensClone)
    //probably a way to clean this up but not too mad, since it'll max out at 3
    let cardsLv1Copy = cardsLv1
    let cardsLv2Copy = cardsLv2
    let cardsLv3Copy = cardsLv3
    if(card.level === 1){
      cardsLv1Copy = cardsLv1Copy.filter(c=>c.id!==card.id)
    }
    if(card.level === 2){
      cardsLv2Copy = cardsLv3Copy.filter(c=>c.id!==card.id)
    }
    if(card.level === 3){
      cardsLv3Copy = cardsLv3Copy.filter(c=>c.id!==card.id)
    }
    socket.emit('update-cards',{
      room: params.roomNumber,
      username,
      newCard:card,
      cardsLv1:cardsLv1Copy,
      cardsLv2:cardsLv2Copy,
      cardsLv3:cardsLv3Copy,
    })
    socket.emit('update-tokens',{
      room: params.roomNumber,
      username,
      boardTokens:boardTokensClone,
      userTokens:userTokensClone
    })
  }

  const reserveCard = ()=>{
    
  }

  return (
      username && (
      <div>
          <h1>Card grid</h1>
          <h4>lv 3 cards</h4>
          <div className="cards-lv3 d-flex">
            {cardsLv3?.slice(cardsLv3.length-4,cardsLv3.length)
              .map(cardLv3=>(
                <div
                  className="card"
                  key={cardLv3.id}
                  onClick={()=>{

                  }}
                >
                  {JSON.stringify(cardLv3)}
                </div>
              ))}
          </div>
          <h4>lv 2 cards</h4>
          <div className="cards-lv2 d-flex">
            {cardsLv2?.slice(cardsLv2.length-4,cardsLv2.length)
              .map(cardLv2=>(
              <div className="card" key={cardLv2.id}>
                {JSON.stringify(cardLv2)}
              </div>
            ))}
          </div>
          <h4>lv 1 cards</h4>
          <div className="cards-lv2 d-flex">
            {cardsLv1?.slice(cardsLv1.length-4,cardsLv1.length)
              .map(cardLv1=>(
              <div className="card" key={cardLv1.id}>
                {JSON.stringify(cardLv1)}
              </div>
            ))}
          </div>
      </div>)
  )
}

export default CardsGrid