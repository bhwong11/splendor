'use client';
import { useEffect,useState } from "react";
import { socketInitializeRoom } from "@/socket";
import { useRouter } from "next/navigation";
import { useSocketStore, useUserStore, useBoardStore } from "@/zustand";
import { actionTypes } from "@/zustand";
import { determineVictoryPoints,SocketUser } from "@/app/lib";


const OtherPlayerAssets = ({params})=>{
  const socket = useSocketStore(state=>state.socket)
  const username = useUserStore(state=>state.username)
  const turnPlayer = useBoardStore(state=>state.turnPlayer)
  const victor = useBoardStore(state=>state.victor)
  const setVictor = useBoardStore(state=>state.setVictor)

  const [otherPlayerAssets,setOtherPlayerAssets] = useState([])

  const otherPlayerVictoryPoints = otherPlayerAssets.map(playerAsset=>({
    username: playerAsset.username,
    victoryPoints:determineVictoryPoints(playerAsset)
  }))
  const topPlayer = otherPlayerAssets.reduce((all,assets)=>{
    if(assets.victoryPoints>=all.victoryPoints){
      return assets
    }
    return all
  },{})
  
  useEffect(()=>{
    if(topPlayer.victoryPoints>=15){
      setVictor(topPlayer.username)
    }
  },[topPlayer.victoryPoints])

  const router = useRouter()
  useEffect(()=>{
    if(socket){
      socket.on('players-update',(data:SocketUser[])=>{
        console.log('players-update',data)
        setOtherPlayerAssets(data)
      })
    }
  },[socket])

  return (
      username && (
      <div>
        <div>
          {otherPlayerVictoryPoints.map(player=>(
            <div>
              <p>player: {player.username}</p>
              <p>Victory Points: {player.victoryPoints}</p>
            </div>
          ))}
        </div>
        <div>
          {otherPlayerAssets?.map(playerAssets=>(
          <p>assets: {JSON.stringify(playerAssets)}</p>
          ))}
        </div>
      </div>
    )
  )
}

export default OtherPlayerAssets