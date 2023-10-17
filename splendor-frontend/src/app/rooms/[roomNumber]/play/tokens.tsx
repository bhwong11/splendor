'use client';
import { useEffect,useState } from "react";
import { useRouter } from "next/navigation";
import { useSocketStore, useBoardStore,useUserStore } from "@/zustand";
import { actionTypes } from "@/zustand";
import { useIsTurnPlayer } from "@/app/lib";
import classNames from "classnames";
import { lemon, noto_emoji } from "@/app/layout";
import { gemColorMap } from "@/app/lib";

const Tokens = ({params,className})=>{
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
  const setActionTaken = useUserStore(state=>state.setActionTaken)

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
      || tokens[color]<=0
      || totalTaken>=3
      || willBeTwoOfSame
      || color === 'gold'
    ) return

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
    setActionTaken(true)
  }

  return (
      username && (
      <div className={className}>
          <h2 className={classNames(
            lemon.className,
            "text-center pt-5 pb-3 mb-2 border-b-2 border-black"
          )}>
            Tokens
          </h2>
          <div className="flex flex-wrap justify-evenly gap-5">
            {tokensArray?.map(token=>(
                <div
                  className={classNames(
                    gemColorMap[token.color].textColor,
                    gemColorMap[token.color].borderColor,
                    gemColorMap[token.color].gradient,
                    "border-4 bg-gradient-to-b rounded p-3 mt-2 font-optima font-bold",
                    "flex flex-col items-center"
                  )}
                  key={token.color}
                  onClick={()=>{
                    takeToken(token.color)
                  }}
                >
                  <div>
                    <span className={lemon.className}>{token.color}&nbsp;</span>
                    <span className={noto_emoji.className}>💎</span>
                  </div>
                  <div>
                    {token.quantity}
                  </div>
                </div>
              ))}
          </div>
      </div>)
  )
}

export default Tokens