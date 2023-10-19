'use client';
import { useEffect,useState,useMemo } from "react";
import { useSocketStore, useUserStore, useBoardStore } from "@/zustand";
import { actionTypes } from "@/zustand";
import GameCard from "@/app/(components)/GameCard";
import { 
  Card,
  SocketUser,
  determineVictoryPoints,
  gemColorMap,
  createCardsByGem,
  createCardGemMap
 } from "@/app/lib";
import classNames from "classnames";
import { lemon, noto_emoji } from "@/app/layout";


const PlayerAssets = ({params})=>{
  const socket = useSocketStore(state=>state.socket)
  const username = useUserStore(state=>state.username)
  const userCards = useUserStore(state=>state.cards)
  const userNobles = useUserStore(state=>state.nobles)
  const tokens = useUserStore(state=>state.tokens)
  const reservedCards = useUserStore(state=>state.reservedCards)
  const user = useUserStore(state=>(state))

  const turn = useBoardStore(state=>state.turn)
  const turnPlayer = useBoardStore(state=>state.turnPlayer)
  const turnAction = useUserStore(state=>state.turnAction)
  const actionTaken = useUserStore(state=>state.actionTaken)
  const setTurn = useBoardStore(state=>state.setTurn)
  const setTurnPlayer = useBoardStore(state=>state.setTurnPlayer)
  const setTurnAction = useUserStore(state=>state.setTurnAction)
  const setUserCards = useUserStore(state=>state.setCards)
  const setActionTaken = useUserStore(state=>state.setActionTaken)
  const setReservedCards = useUserStore(state=>state.setReservedCards)
  const setUserNobles = useUserStore(state=>state.setNobles)
  const setUserTokens = useUserStore(state=>state.setTokens)
  const [visibleAssets,setVisibleAssets]=useState<{
    cards: boolean
    nobles: boolean
    reservedCards:boolean
  }>({
    cards:false,
    nobles:false,
    reservedCards:false
  })

  const victoryPoints = determineVictoryPoints(user)

  const cardGemMap = useMemo(()=>createCardGemMap(userCards),[userCards.length])

  const userCardsByGem = useMemo(()=>createCardsByGem(userCards),[userCards.length])

  const passTurn = ()=>{
    console.log('passing turn')
    socket.emit('next-turn',{
      room:params.roomNumber
    })
  }

  const clearUser = ()=>{
    socket.emit('clear-user',{
      room:params.roomNumber,
      username
    })
  }

  useEffect(()=>{
    if(socket){
      socket.on('turn-update',data=>{
        console.log('turn update',data)
        setTurn(data.turn)
        setTurnPlayer(data.turnPlayer.username)
      })
      socket.on('players-update',(users:SocketUser[])=>{
        const currentUser = users.find(user=>user.username===username)
        setUserCards(currentUser.cards)
        setReservedCards(currentUser.reservedCards)
        setUserNobles(currentUser.nobles)
        setUserTokens(currentUser.tokens)
      })
    }
  },[socket])

  useEffect(()=>{
    setTurnAction(null)
    setActionTaken(false)
  },[turn])

  interface Action{
    name:string,
    type:string
  }

  const userTurnActions = [
    {
      name:'Reserve',
      type:actionTypes.RESERVE
    },
    {
      name:'Buy Card',
      type:actionTypes.BUY_CARD
    },
    {
      name:'Take tokens',
      type:actionTypes.TAKE_TOKENS
    }
  ]

  const isTurnPlayer = turnPlayer!==username

  const disabled = (
    actionTaken
    || isTurnPlayer
  )


  return (
      username && (
      <div>
          <div className="flex flex-wrap gap-1 pb-1">
            <div>
              <span className="font-bold">turn:</span> 
              {turn}
            </div>
            <div>
              <span className="font-bold">turn action:</span> 
              {turnAction ?? "none"}
            </div>
            <div>
              <span className="font-bold">turn player:</span> 
              {turnPlayer}
            </div>
            <div>
              <span className="font-bold">victoryPoints:</span> 
              {victoryPoints}
            </div>
          </div>
          <div className="flex gap-1 flex-wrap pb-2">
            {userTurnActions.map((action:Action)=>(
            <button 
              className="btn"
              disabled={disabled}
              onClick={(e)=>{
                e.preventDefault()
                if(actionTaken) return
                setTurnAction(action.type)
              }}
            >
                {action.name}
            </button>
            ))}

            <button 
              className="btn"
              disabled={isTurnPlayer}
              onClick={(e)=>{
                e.preventDefault()
                passTurn()
              }}
            >
              pass turn
            </button>

            <button
              className="btn"
              onClick={(e)=>{
                e.preventDefault()
                clearUser()
            }}>clear user</button>
          </div>

          <div className="flex flex-wrap">
            <span className={classNames(lemon.className)}>tokens: </span>
            {Object.keys(tokens).map(color=>(
            <div className={gemColorMap[color].textColor}>
              <span className={classNames(noto_emoji.className)}>
                &nbsp;💎:&nbsp;
              </span>
              <span className={classNames(lemon.className)}>
                {tokens[color]}
              </span>
            </div>
          ))}
          </div>

          <div className="flex flex-wrap pb-1">
            <span className={classNames(lemon.className)}>Card Gems: </span>
            {Object.keys(cardGemMap).map(color=>(
            <div className={gemColorMap[color].textColor}>
              <span className={classNames(noto_emoji.className)}>
                &nbsp;💎:&nbsp;
              </span>
              <span className={classNames(lemon.className)}>
                {cardGemMap[color]}
              </span>
            </div>
          ))}
          </div>

          <div className="flex flex-wrap gap-1 pb-2">
            <button 
              className={classNames("btn-link pr-2",{
                "text-purple-700":visibleAssets['nobles'],
                "text-pink-700":!visibleAssets['nobles']
              })}
              onClick={
                ()=>setVisibleAssets(prev=>({...prev,nobles:!prev.nobles}))
              }
            >
              nobles {visibleAssets['nobles']?"hide":"show"}
            </button>
            <button 
              className={classNames("btn-link pr-2",{
                "text-purple-700":visibleAssets['cards'],
                "text-pink-700":!visibleAssets['cards']
              })}
              onClick={
                ()=>setVisibleAssets(prev=>({...prev,cards:!prev.cards}))
              }
            >
              cards {visibleAssets['cards']?"hide":"show"}
            </button>
            <button 
              className={classNames("btn-link",{
                "text-purple-700":visibleAssets['reservedCards'],
                "text-pink-700":!visibleAssets['reservedCards']
              })}
              onClick={
                ()=>setVisibleAssets(prev=>({...prev,reservedCards:!prev.reservedCards}))
              }
            >
              reserved cards {visibleAssets['reservedCards']?"hide":"show"}
            </button>
          </div>

          <div className="visible-assets">
          {visibleAssets['nobles'] && (
          <div>
            <span>nobles:</span>
              <div>
              {userNobles.map(noble=>(
                  <GameCard 
                    key={`noble-${noble.id}`}
                    card={noble}
                    staticCard={true}
                    roomNumber={params.roomNumber}
                    className="mt-2 mx-2"
                  />
                ))}
                </div>
          </div>
          )}

          { visibleAssets['cards'] && (
            <div>
              <span>cards:</span>
              <div className="flex gap-2">
                {Object.keys(userCardsByGem).map((gemColor)=>(
                  <div className="flex flex-col">
                    <h3>{gemColor}</h3>
                    {userCardsByGem[gemColor]?.map((card:Card)=>(
                      <GameCard 
                        key={`card-${card.id}`}
                        card={card}
                        staticCard={true}
                        roomNumber={params.roomNumber}
                        className="mt-2"
                      />
                    ))}
                  </div>
                )
              )}
            </div>
            </div>)}

          { visibleAssets['reservedCards'] &&
            (
            <div>
              <span>reserved cards:</span>
              <div className="flex">
                {reservedCards?.map(card=>(
                  <GameCard 
                    key={`card-${card.id}`}
                    card={card}
                    staticCard={false}
                    roomNumber={params.roomNumber}
                    className="mt-2 mx-2"
                  />
                ))}
              </div>
            </div>)}

          </div>
      </div>)
  )
}

export default PlayerAssets