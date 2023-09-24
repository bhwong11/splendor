'use client';
import { useEffect,useState } from "react";
import { socketInitializeRoom } from "@/socket";
import { useRouter } from "next/navigation";
import { useSocketStore, useBoardStore,useUserStore } from "@/zustand";
import { actionTypes } from "@/zustand";

const Tokens = ({params})=>{
  const username = useUserStore(state=>state.username)
  const socket = useSocketStore(state=>state.socket)

  const [taken,setTaken] = useState(0)

  const setTokens = useBoardStore(state=>state.setTokens)
  const setUserTokens = useUserStore(state=>state.setTokens)

  const turnAction = useUserStore(state=>state.turnAction)
  const userTokens = useUserStore(state=>state.tokens)
  const tokens = useBoardStore(state=>state.tokens)
  const turn = useBoardStore(state=>state.turn)
  
  const router = useRouter()
  useEffect(()=>{
    if(socket){
      socket.on('game-board',data=>{
        console.log('game-board tokens',data)
        setTokens(data.tokens)
      })
      socket.on('token-taken',data=>{
        console.log('game-board tokens new',data)
        setTokens(data)
      })
    }
  },[socket])

  useEffect(()=>{
    setTaken(0)
  },[turn])

  const tokensArray = Object.keys(tokens)?.reduce((all,next)=>(
    [...all,{color:next,quantity:tokens[next]}]
  ),[])

  const takeToken = (color: string)=>{
    if(turnAction !== actionTypes.TAKE_TOKENS) return
    if(taken>=3) return
    console.log('taking token')
    setTaken(prev=>prev+1)
    const newBoardTokens = {
      ...tokens,
      [color]:tokens[color]>0?tokens[color]-1:0
    }
    const newUserTokens = {
      ...userTokens,
      [color]:userTokens[color]+1
    }
    setUserTokens(newUserTokens)
    socket.emit('take-token',{
      room: params.roomNumber,
      username,
      boardTokens:newBoardTokens,
      userTokens:newUserTokens
    })
  }

  return (
      username && (
      <div>
          <h4>Tokens</h4>
          <div className="cards-lv3 d-flex">
            {tokensArray?.map(token=>(
                <div 
                  className="card"
                  key={token.color}
                  onClick={()=>{
                    takeToken(token.color)
                  }}
                >
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