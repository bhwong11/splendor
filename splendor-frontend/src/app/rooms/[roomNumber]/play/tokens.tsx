'use client';
import { useEffect,useState } from "react";
import { useRouter } from "next/navigation";
import { useSocketStore, useBoardStore,useUserStore } from "@/zustand";
import { actionTypes } from "@/zustand";
import { useIsTurnPlayer } from "@/app/lib";
import { SocketUser } from "@/app/lib";

const Tokens = ({params})=>{
  const username = useUserStore(state=>state.username)
  const socket = useSocketStore(state=>state.socket)
  const isTurnPlayer = useIsTurnPlayer()

  const [taken,setTaken] = useState({
    white:0,
    blue:0,
    green:0,
    red:0,
    black:0,
    gold: 0
  })

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
    setTaken({
      white:0,
      blue:0,
      green:0,
      red:0,
      black:0,
      gold: 0
    })
  },[turn])

  const tokensArray = Object.keys(tokens)?.reduce((all,next)=>(
    [...all,{color:next,quantity:tokens[next]}]
  ),[])

  const takeToken = (color: string)=>{
    console.log('turnAction',turnAction,isTurnPlayer,taken)
    const totalTaken = Object.values(taken).reduce((all,next)=>(
      all+next
    ),0)
  
    const willBeTwoOfSame = totalTaken>=2 && taken[color]>=1

    if(
      turnAction !== actionTypes.TAKE_TOKENS
      || !isTurnPlayer
      // || tokens[color]<=0
      // || totalTaken>=3
      // || willBeTwoOfSame
      // || color === 'gold'
    ) return

    console.log('taking token')
    setTaken(prev=>({
      ...prev,
      [color]:prev[color]+1
    }))
    const newBoardTokens = {
      ...tokens,
      [color]:tokens[color]>0?tokens[color]-1:0
    }
    const newUserTokens = {
      ...userTokens,
      [color]:userTokens[color]+1
    }
    socket.emit('update-tokens',{
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
          <div className="flex">
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