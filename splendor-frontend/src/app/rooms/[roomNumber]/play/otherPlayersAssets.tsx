'use client';
import { useEffect,useState } from "react";
import { socketInitializeRoom } from "@/socket";
import { useRouter } from "next/navigation";
import { useSocketStore, useUserStore, useBoardStore } from "@/zustand";
import { actionTypes } from "@/zustand";


const OtherPlayerAssets = ({params})=>{
  const socket = useSocketStore(state=>state.socket)
  const username = useUserStore(state=>state.username)
  const turnPlayer = useBoardStore(state=>state.turnPlayer)

  const [otherPlayerAssets,setOtherPlayerAssets] = useState([])

  const router = useRouter()
  useEffect(()=>{
    if(socket){
      socket.on('players-update',data=>{
        console.log('players-update',data)
        setOtherPlayerAssets(data)
      })
    }
  },[socket])

  return (
      username && (
      <div>
          {otherPlayerAssets?.map(playerAssets=>(
          <p>assets: {JSON.stringify(playerAssets)}</p>
          ))}

      </div>)
  )
}

export default OtherPlayerAssets