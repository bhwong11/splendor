'use client';
import { useEffect,useState } from "react";
import { socketInitializeRoom } from "@/socket";
import { useRouter } from "next/navigation";
import { useSocketStore, useUserStore, useBoardStore } from "@/zustand";
import { actionTypes } from "@/zustand";
import { 
  Card,
  SocketUser,
  generateUserBoardTokensFromBuy,
  useCanBuyCard,
  updateTokens,
  removeCardFromBoard,
  determineVictoryPoints
 } from "@/app/lib";


const PlayerAssets = ({params})=>{
  console.log(params.roomNumber)
  const socket = useSocketStore(state=>state.socket)
  const username = useUserStore(state=>state.username)
  const userCards = useUserStore(state=>state.cards)
  const userNobles = useUserStore(state=>state.nobles)
  const tokens = useUserStore(state=>state.tokens)
  const boardTokens = useBoardStore(state=>state.tokens)
  const reservedCards = useUserStore(state=>state.reservedCards)
  const cardsLv1 = useBoardStore(state=>state.cardsLv1)
  const cardsLv2 = useBoardStore(state=>state.cardsLv2)
  const cardsLv3 = useBoardStore(state=>state.cardsLv3)
  const user = useUserStore(state=>(state))
  const {canBuyCard,remainingCost,userCardsValueMap} = useCanBuyCard()

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
  const [takenTurnCard,setTakenTurnCard] = useState(false)

  const victoryPoints = determineVictoryPoints(user)

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

  const buyReservedCard = (card:Card)=>{
    const canBuy = canBuyCard(card)
    if(!canBuy || takenTurnCard) return
    const goldTokenCost = remainingCost(card)
    const [userTokensClone,boardTokensClone]=generateUserBoardTokensFromBuy(
      card,
      tokens,
      boardTokens,
      goldTokenCost,
      userCardsValueMap
    )
    removeCardFromBoard(
      socket,
      username,
      params.roomNumber,
      card,
      cardsLv1,
      cardsLv2,
      cardsLv3,
      false
    )
    updateTokens(
      socket,
      username,
      params.roomNumber,
      userTokensClone,
      boardTokensClone
    )
    socket.emit('buy-reserve-card',{
      room:params.roomNumber,
      username,
      card
    })
    setTakenTurnCard(true)
  }

  const router = useRouter()
  useEffect(()=>{
    if(socket){
      socket.on('turn-update',data=>{
        console.log('turn update',data)
        setTurn(data.turn)
        setTurnPlayer(data.turnPlayer.username)
      })
      socket.on('players-update',(users:SocketUser[])=>{
        const currentUser = users.find(user=>user.username=username)
        console.log('player update cur',currentUser)
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
    setTakenTurnCard(false)
  },[turn])

  const userCardsByGem = userCards.reduce((all,card)=>{
    if(all[card.gem]){
      all[card.gem].push(card)
      return all
    }
    all[card.gem] = [card]
    return all
  },{})

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


  return (
      username && (
      <div>
          <h1>Player Assets</h1>
          <h4>turn:{JSON.stringify(turn)}</h4>
          <h4>turn action: {JSON.stringify(turnAction)}</h4>
          <h4>turn player: {JSON.stringify(turnPlayer)}</h4>
          <p>victoryPoints: {victoryPoints}</p>
          <div>
            {userTurnActions.map((action:Action)=>(
            <button 
              disabled={actionTaken}
              onClick={(e)=>{
                e.preventDefault()
                if(actionTaken) return
                setTurnAction(action.type)
              }}
            >
                {action.name}
            </button>
            ))}

            <button onClick={(e)=>{
              e.preventDefault()
              passTurn()
            }}>pass turn</button>

            <button onClick={(e)=>{
              e.preventDefault()
              clearUser()
            }}>clear user</button>
          </div>
          <p>tokens: {JSON.stringify(tokens)}</p>
          <p>nobles: {JSON.stringify(userNobles)}</p>
          <p>cards:</p>
          <div className="flex">
            {Object.keys(userCardsByGem).map((gemColor)=>(
              <div className="flex flex-col">
                <h3>{gemColor}</h3>
                {userCardsByGem[gemColor]?.map((card:Card)=>(
                  <div
                    className="card"
                  >
                    {JSON.stringify(card)}
                  </div>
                ))}
              </div>
            )
          )}
          </div>
          <p>reserved cards:</p>
          <div>
            {reservedCards?.map(card=>(
              <div
                onClick={()=>buyReservedCard(card)}
                className="card"
              >
                {JSON.stringify(card)}
              </div>
            ))}
          </div>

      </div>)
  )
}

export default PlayerAssets