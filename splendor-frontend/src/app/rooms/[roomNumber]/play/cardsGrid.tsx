'use client';
import { useEffect,useState } from "react";
import { useSocketStore, useBoardStore, useUserStore } from "@/zustand";
import GameCard from "@/app/(components)/GameCard";

const CardsGrid = ({params})=>{
  console.log(params.roomNumber)
  const username = useUserStore(state=>state.username)
  const socket = useSocketStore(state=>state.socket)
  const setCardsLv1 = useBoardStore(state=>state.setCardsLv1)
  const setCardsLv2 = useBoardStore(state=>state.setCardsLv2)
  const setCardsLv3 = useBoardStore(state=>state.setCardsLv3)


  const [cardsLv1Display,setCardsLv1Display] = useState([])
  const [cardsLv2Display,setCardsLv2Display] = useState([])
  const [cardsLv3Display,setCardsLv3Display] = useState([])

  useEffect(()=>{
    if(socket){
      //only on join/game start
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
        //potential performance improvement by not setting all cards
        setCardsLv1(data.cardsLv1)
        setCardsLv2(data.cardsLv2)
        setCardsLv3(data.cardsLv3)
        setCardsLv1Display(prev=>{
          const newCard = data.cardsLv1[data.cardsLv1.length-1]

          const indexOfOldCard = prev.findIndex(card=>card.id===data?.newCard.id)
          if(indexOfOldCard===-1){
            return prev
          }
          const prevCopy = [...prev]
          prevCopy.splice(indexOfOldCard,1,newCard)
          return prevCopy
        })
        setCardsLv2Display(prev=>{
          const newCard = data.cardsLv2[data.cardsLv2.length-1]

          const indexOfOldCard = prev.findIndex(card=>card.id===data?.newCard.id)
          if(indexOfOldCard===-1){
            return prev
          }
          const prevCopy = [...prev]
          prevCopy.splice(indexOfOldCard,1,newCard)
          return prevCopy
        })
        setCardsLv3Display(prev=>{
          const newCard = data.cardsLv3[data.cardsLv3.length-1]

          const indexOfOldCard = prev.findIndex(card=>card.id===data?.newCard.id)
          if(indexOfOldCard===-1){
            return prev
          }
          const prevCopy = [...prev]
          prevCopy.splice(indexOfOldCard,1,newCard)
          return prevCopy
        })
      })
    }
  },[socket])


  return (
      username && (
      <div className="flex flex-col">
          <h1 className="text-3xl font-bold underline">Card grid</h1>
          <h4>lv 3 cards</h4>
          <div className="cards-lv3 flex">
            {cardsLv3Display
              .map(cardLv3=>(
                <GameCard 
                  key={`card-${cardLv3.id}`}
                  card={cardLv3}
                  staticCard={false}
                  roomNumber={params.roomNumber}
                />
              ))}
          </div>
          <h4>lv 2 cards</h4>
          <div className="cards-lv2 flex">
            {cardsLv2Display
              .map(cardLv2=>(
                <>
                <GameCard 
                  key={`card-${cardLv2.id}`}
                  card={cardLv2}
                  staticCard={false}
                  roomNumber={params.roomNumber}
                />
                </>
            ))}
          </div>
          <h4>lv 1 cards</h4>
          <div className="cards-lv2 flex">
            {cardsLv1Display
              .map(cardLv1=>(
                <>
                  <GameCard 
                    key={`card-${cardLv1.id}`}
                    card={cardLv1}
                    staticCard={false}
                    roomNumber={params.roomNumber}
                  />
                </>
            ))}
          </div>
      </div>)
  )
}

export default CardsGrid