'use client';
import { useEffect,useState } from "react";
import { useSocketStore, useBoardStore, useUserStore } from "@/zustand";
import GameCard from "@/app/(components)/GameCard";
import classNames from "classnames";
import { lemon } from "@/app/layout";

const CardsGrid = ({params})=>{
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
          const newCards = data.cardsLv1.slice(data.cardsLv1.length-4,data.cardsLv1.length)

          const indexOfOldCard = prev.findIndex(card=>card.id===data?.newCard.id)
          const prevCopy = [...prev]
          if(indexOfOldCard===-1){
            return prevCopy
          }
          prevCopy.splice(indexOfOldCard,1,newCards[0])
          return prevCopy
        })
        setCardsLv2Display(prev=>{
          const newCards = data.cardsLv2.slice(data.cardsLv2.length-4,data.cardsLv2.length)

          const indexOfOldCard = prev.findIndex(card=>card.id===data?.newCard.id)
          const prevCopy = [...prev]
          if(indexOfOldCard===-1){
            return prevCopy
          }
          prevCopy.splice(indexOfOldCard,1,newCards[0])
          return prevCopy
        })
        setCardsLv3Display(prev=>{
          const newCards = data.cardsLv3.slice(data.cardsLv3.length-4,data.cardsLv3.length)

          const indexOfOldCard = prev.findIndex(card=>card.id===data?.newCard.id)
          const prevCopy = [...prev]
          if(indexOfOldCard===-1){
            return prevCopy
          }
          prevCopy.splice(indexOfOldCard,1,newCards[0])
          return prevCopy
        })
      })
    }
  },[socket])


  //could probably stop repeating here
  return (
      username && (
      <div className="flex flex-col">
          <h2 className={classNames(
            lemon.className,
            "text-center pt-5 pb-3 mb-2 border-b-2 border-black"
          )}>
            Cards
          </h2>
          <h2 className={classNames(
            lemon.className,
            "text-center pt-5 pb-3"
          )}>
            lv 3 cards
          </h2>
          <div className="cards-lv3 flex flex-wrap justify-around gap-5">
            {cardsLv3Display
              .map(cardLv3=>(
                <GameCard 
                  key={`card-${cardLv3.id}`}
                  card={cardLv3}
                  staticCard={false}
                  roomNumber={params.roomNumber}
                  className="mt-2"
                />
              ))}
          </div>
          <h2 className={classNames(
            lemon.className,
            "text-center pt-5 pb-3"
          )}>lv 2 cards</h2>
          <div className="cards-lv2 flex flex-wrap justify-around gap-5">
            {cardsLv2Display
              .map(cardLv2=>(
                <GameCard 
                  key={`card-${cardLv2.id}`}
                  card={cardLv2}
                  staticCard={false}
                  roomNumber={params.roomNumber}
                  className="mt-2"
                />
            ))}
          </div>
          <h2 className={classNames(
            lemon.className,
            "text-center pt-5 pb-3"
          )}>lv 1 cards</h2>
          <div className="cards-lv1 flex flex-wrap justify-around gap-5">
            {cardsLv1Display
              .map(cardLv1=>(
                  <GameCard 
                    key={`card-${cardLv1.id}`}
                    card={cardLv1}
                    staticCard={false}
                    roomNumber={params.roomNumber}
                    className="mt-2"
                  />
            ))}
          </div>
      </div>)
  )
}

export default CardsGrid