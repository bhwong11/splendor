'use client';
import { useEffect,useState } from "react";
import { socketInitializeRoom } from "@/socket";
import { useRouter } from "next/navigation";
import { useSocketStore, useBoardStore,useUserStore } from "@/zustand";


const Nobles = ({params})=>{
  const username = useUserStore(state=>state.username)
  const socket = useSocketStore(state=>state.socket)
  const setNobles = useBoardStore(state=>state.setNobles)

  const nobles = useBoardStore(state=>state.nobles)
  
  const router = useRouter()
  useEffect(()=>{
    if(socket){
      socket.on('game-board',data=>{
        console.log('game-board nobles',data)
        setNobles(data.nobles)
      })
    }
  },[socket])

  return (
      username && (
      <div>
          <h4>Nobles</h4>
          <div className="cards-lv3 d-flex">
            {nobles?.slice(nobles.length-4,nobles.length)
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