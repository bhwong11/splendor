'use client';
import { useEffect,useState } from "react";
import { socketInitializeRoom } from "@/socket";
import { useRouter } from "next/navigation";
import { useSocketStore, useBoardStore,useUserStore } from "@/zustand";

let socket;

const Nobles = ({params})=>{
  const username = useUserStore(state=>state.username)
  const socket = useSocketStore(state=>state.socket)
  const setCardsLv1 = useBoardStore(state=>state.setCardsLv1)
  const setCardsLv2 = useBoardStore(state=>state.setCardsLv2)
  const setCardsLv3 = useBoardStore(state=>state.setCardsLv3)
  const setNobles = useBoardStore(state=>state.setNobles)
  const setTokens = useBoardStore(state=>state.setTokens)

  const cardsLv1 = useBoardStore(state=>state.cardsLv1)
  const cardsLv2 = useBoardStore(state=>state.cardsLv2)
  const cardsLv3 = useBoardStore(state=>state.cardsLv3)
  const nobles = useBoardStore(state=>state.nobles)
  const tokens = useBoardStore(state=>state.tokens)
  
  const router = useRouter()
  useEffect(()=>{
    if(socket){
      socket.on('game-board',data=>{
        console.log('game-board',data)
        setNobles(data.nobles)
        setTokens(data.tokens)
        setCardsLv1(data.cardsLv1)
        setCardsLv2(data.cardsLv2)
        setCardsLv3(data.cardsLv3)
      })
    }
  },[socket])

  return (
      username && (
      <div>
          <h1>Card grid</h1>
          <h4>lv 3 cards</h4>
          <div className="cards-lv3 d-flex">
            {cardsLv3?.slice(cardsLv3.length-4,cardsLv3.length)
              .map(cardLv3=>(
                <div className="card" key={cardLv3.id}>
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
          <h3>{params.roomNumber}</h3>
      </div>)
  )
}

export default Nobles