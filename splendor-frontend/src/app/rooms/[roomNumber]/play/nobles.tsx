'use client';
import { useEffect } from "react";
import { useSocketStore, useBoardStore,useUserStore } from "@/zustand";
import { costCovered,emptyTokens } from "@/app/lib";
import GameCard from "@/app/(components)/GameCard";
import classNames from "classnames";
import { lemon } from "@/app/layout";


const Nobles = ({params})=>{
  const username = useUserStore(state=>state.username)
  const userCardsTotalValue = useUserStore(
    state=>state.cards.reduce((all,next)=>{
        return {
          ...all,
          ...(
            all[next.gem]?{[next.gem]:all[next.gem]+1}:{[next.gem]:1}
          )
        }
    },{...emptyTokens})
  )
  const socket = useSocketStore(state=>state.socket)
  const setNobles = useBoardStore(state=>state.setNobles)
  const userNobles = useUserStore(state=>state.nobles)

  const nobles = useBoardStore(state=>state.nobles)
  
  useEffect(()=>{
    if(socket){
      socket.on('game-board',(data:any)=>{
        console.log('game-board nobles',data)
        setNobles(
          data.nobles
        )
      })
      socket.on('noble-change',(data:any)=>{
        // setUserNobles(data.userNobles)
        setNobles(data.nobles)
      })
    }
  },[socket])

  useEffect(()=>{
    const newUserNobles = nobles.filter(noble=>costCovered(
      userCardsTotalValue,noble.price
    ))
    if(newUserNobles.length!==userNobles.length){
      socket.emit('noble-change',{
        room:params.roomNumber,
        username,
        userNobles:newUserNobles,
        nobles:nobles.filter(
          noble=>!newUserNobles.map(n=>n.id).includes(noble.id)
        )
      })
    }
  },[JSON.stringify(userCardsTotalValue)])

  return (
      username && (
      <div>
          <h2 className={classNames(
            lemon.className,
            "text-center pt-5 pb-3 mb-2 border-b-2 border-black"
          )}>
            Nobles
          </h2>
          <div className="flex flex-wrap justify-around gap-5">
            {nobles
              .map(noble=>(
                <GameCard 
                  key={`noble-${noble.id}`}
                  card={noble}
                  staticCard={true}
                  roomNumber={params.roomNumber}
                  className="mt-2"
                />
              ))}
          </div>
      </div>)
  )
}

export default Nobles