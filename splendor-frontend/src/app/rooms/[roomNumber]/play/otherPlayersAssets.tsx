'use client';
import { useEffect,useState } from "react";
import { useRouter } from "next/navigation";
import { useSocketStore, useUserStore, useBoardStore } from "@/zustand";
import { determineVictoryPoints,SocketUser } from "@/app/lib";
import Modal from "@/app/(components)/AssetsModal";


const OtherPlayerAssets = ({params})=>{
  const socket = useSocketStore(state=>state.socket)
  const username = useUserStore(state=>state.username)
  const victor = useBoardStore(state=>state.victor)
  const setVictor = useBoardStore(state=>state.setVictor)

  const [otherPlayerAssets,setOtherPlayerAssets] = useState([])
  const [otherPlayerVictoryPoints,setOtherPlayerVictoryPoints] = useState([])

  const topPlayer = otherPlayerVictoryPoints.reduce((all,assets)=>{
    if(
      (!all.victoryPoints && all.victoryPoints!==0) 
        || assets.victoryPoints>=all["victoryPoints"]
      ){
      return assets
    }
    return all
  },{})

  useEffect(()=>{
    if(topPlayer["victoryPoints"]>=15 && !victor){
      setVictor(topPlayer["username"])
      socket.emit('winner',{
        room:params.roomNumber,
        playerPoints:otherPlayerAssets.map(player=>({
          username: player.username,
          victor: topPlayer["username"]===username,
          victoryPoints:determineVictoryPoints(player)
        }))
      })
    }
  },[topPlayer["victoryPoints"]])

  const router = useRouter()
  useEffect(()=>{
    if(socket){
      socket.on('players-update',(data:SocketUser[])=>{
        console.log('players-update',data)
        setOtherPlayerAssets(data)

        const otherPlayerVictoryPoints = data.map(playerAsset=>({
          username: playerAsset.username,
          victoryPoints:determineVictoryPoints(playerAsset)
        }))
        setOtherPlayerVictoryPoints(otherPlayerVictoryPoints)
      })
    }
  },[socket])

  return (
      username && (
      <div>
        <div className="flex gap-1 flex-wrap">
          {otherPlayerAssets?.map(playerAssets=>(
            <div key={`player-assets-${playerAssets.username}`}>
              <Modal playerAssets={playerAssets} roomNumber={params.roomNumber}/>
            </div>
          ))}
        </div>
      </div>
    )
  )
}

export default OtherPlayerAssets