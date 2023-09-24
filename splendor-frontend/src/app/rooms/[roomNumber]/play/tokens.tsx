'use client';
import { useEffect,useState } from "react";
import { socketInitializeRoom } from "@/socket";
import { useRouter } from "next/navigation";
import { useSocketStore, useBoardStore,useUserStore } from "@/zustand";

const Tokens = ({params})=>{
  const username = useUserStore(state=>state.username)
  const socket = useSocketStore(state=>state.socket)
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
        console.log('game-board tokens',data)
        setTokens(data.tokens)
      })
    }
  },[socket])

  const tokensArray = Object.keys(tokens)?.reduce((all,next)=>(
    [...all,{color:next,quantity:tokens[next]}]
  ),[])

  return (
      username && (
      <div>
          <h4>Tokens</h4>
          <div className="cards-lv3 d-flex">
            {tokensArray?.map(token=>(
                <div className="card" key={token.color}>
                  <div>
                    color:{token.color}
                  </div>
                  <div>
                    quantity:{token.quantity}
                  </div>
                </div>
              ))}
          </div>
      </div>)
  )
}

export default Tokens