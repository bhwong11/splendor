'use client';
import { useEffect,useState } from "react";
import { socketInitializeRoom } from "@/socket";
import { useRouter } from "next/navigation";
import { useSocketStore, useBoardStore,useUserStore } from "@/zustand";
import { costCovered,emptyTokens } from "@/app/lib";


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
  const setUserNobles = useUserStore(state=>state.setNobles)

  const nobles = useBoardStore(state=>state.nobles)
  
  const router = useRouter()
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
          <h4>Nobles</h4>
          <div className="flex">
            {nobles
              .map(noble=>(
                <div className="card" key={noble.id}>
                  {JSON.stringify(noble)}
                </div>
              ))}
          </div>
      </div>)
  )
}

export default Nobles