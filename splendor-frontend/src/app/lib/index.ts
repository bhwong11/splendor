import cardsLv1 from "@/gameData/cardsLv1";
import cardsLv2 from "@/gameData/cardsLv2";
import cardsLv3 from "@/gameData/cardsLv3";
import nobles from "@/gameData/nobles";
import tokens from "@/gameData/tokens";
import { useBoardStore, useUserStore } from "@/zustand";
import {cloneDeep} from 'lodash';

export interface Tokens{
  white:number,
  blue:number,
  green:number,
  red:number,
  black:number,
  gold?: number
}

export type ActionType = 'reserve' | 'buy-card' | 'take-tokens'

export interface Card{
  id:number,
  gem?:string,
  picture?: string,
  emoji?: string,
  level?:number,
  victoryPoints:number,
  price:{
    white:number,
    blue:number,
    green:number,
    red:number,
    black:number
  }
}

export interface User{
  cards:Card[],
  reservedCards:Card[],
  tokens:Tokens,
  username:string,
  nobles:Card[]
}

export interface SocketUser extends User{
  active:boolean,
  socketId:string,
}

export const gemColorMap = {
  white:{
    tokenColor:'text-gray-500',
    gradient:'from-gray-200',
    textColor:'text-gray-500',
    borderColor:'border-gray-500'
  },
  blue: {
    tokenColor:'text-blue-500',
    gradient:'from-blue-300',
    textColor:'text-blue-700',
    borderColor:'border-blue-500'
  },
  green:{
    tokenColor:'text-green-500',
    gradient:'from-green-300',
    textColor:'text-green-700',
    borderColor:'border-green-700',
  },
  red:{
    tokenColor:'text-red-500',
    gradient:'from-red-300',
    textColor:'text-red-700',
    borderColor:'border-red-700',
  },
  black:{
    tokenColor:'text-black',
    gradient:'from-gray-500',
    textColor:'text-black',
    borderColor:'border-black',
  },
  gold: {
    tokenColor:'text-yellow-500',
    gradient:'from-yellow-300',
    textColor:'text-yellow-700',
    borderColor:'border-yellow-700',
  }
}

export const gameCardEmojis ={
  "1":'🍭',
  "2":'🍫',
  "3":'🍬',
}

export const emptyTokens = {
  white:0,
  blue:0,
  green:0,
  red:0,
  black:0,
  gold: 0
}

const shuffleCards = (cards:Card[]=[])=>{
  return cards.sort(() => (Math.random() > .5) ? 1 : -1);
}

export const createGame = ()=>{
  return {
    nobles:shuffleCards(nobles).slice(0,4),
    tokens,
    cardsLv1:shuffleCards(cardsLv1),
    cardsLv2:shuffleCards(cardsLv2),
    cardsLv3:shuffleCards(cardsLv3)
  }
}

export const useIsTurnPlayer = ()=>{
  const turnPlayer = useBoardStore(state=>state.turnPlayer)
  const username = useUserStore(state=>state.username)
  return username === turnPlayer
}

//hook
export const useCanBuyCard = ()=>{
  const userCards = useUserStore(state=>state.cards)
  const userTokens = useUserStore(state=>state.tokens)
  const cardsValueMap = userCards.reduce((all,next)=>({
    ...all,
    [next.gem]: all[next.gem]?all[next.gem]+1:1
  }),emptyTokens)

  const remainingCost=(card:Card):number=>{
    let remainingCost = 0
    for(let gemColor in card.price){
      const costOver = card.price[gemColor]-(cardsValueMap[gemColor]+userTokens[gemColor])
      remainingCost += costOver>=0?costOver:0
    }
    return remainingCost
  }
  return {
    remainingCost,
    canBuyCard:(card: Card):boolean=>{
      return userTokens.gold>=remainingCost(card)
    },
    userCardsValueMap:cardsValueMap
  }
}

export const costCovered=(valueObj:Tokens,priceObj:Tokens)=>(
  Object.keys(priceObj).every(
    tokenColor=>valueObj[tokenColor]>=priceObj[tokenColor]
  )
)

export const generateUserBoardTokensFromBuy = (
  card:Card,
  userTokens:Tokens,
  boardTokens:Tokens,
  goldTokenCost:number,
  userCardsValueMap:Tokens
):[Tokens,Tokens]=>{
  const userTokensClone = cloneDeep(userTokens)
  const boardTokensClone = cloneDeep(boardTokens)
  Object.keys(card.price).forEach(gemColor=>{
    //maybe a way to clean this up
    const rawPriceLessCards = card.price[gemColor] - userCardsValueMap[gemColor]
    const nonNegPriceLessCards = rawPriceLessCards>=0?rawPriceLessCards:0
    const finalPrice = (userTokensClone[gemColor]>=nonNegPriceLessCards)
      ?nonNegPriceLessCards:userTokensClone[gemColor]

    userTokensClone[gemColor]-= finalPrice
    boardTokensClone[gemColor] += finalPrice
  })
  userTokensClone.gold -=goldTokenCost
  boardTokensClone.gold +=goldTokenCost
  return [userTokensClone,boardTokensClone]
}

export const updateTokens = (
  socket:any,
  username:string,
  roomNumber:number,
  userTokensInput:Tokens, 
  boardTokensInput:Tokens
) =>{
  socket.emit('update-tokens',{
    room: roomNumber,
    username,
    boardTokens:boardTokensInput,
    userTokens:userTokensInput
  })
}

//should just make this a hook that spits out this function
export const removeCardFromBoard = (
  socket:any,
  username:string,
  roomNumber:number,
  card:Card,
  cardsLv1:Card[],
  cardsLv2:Card[],
  cardsLv3:Card[],
  addToUser:boolean=true
) =>{
  //probably a way to clean this up but not too mad, since it'll max out at 3
  let cardsLv1Copy = cardsLv1
  let cardsLv2Copy = cardsLv2
  let cardsLv3Copy = cardsLv3
  if(card.level === 1){
    cardsLv1Copy = cardsLv1Copy.filter(c=>c.id!==card.id)
  }
  if(card.level === 2){
    cardsLv2Copy = cardsLv2Copy.filter(c=>c.id!==card.id)
  }
  if(card.level === 3){
    cardsLv3Copy = cardsLv3Copy.filter(c=>c.id!==card.id)
  }
  socket.emit('update-cards',{
    room: roomNumber,
    username,
    newCard:card,
    addToUser,
    cardsLv1:cardsLv1Copy,
    cardsLv2:cardsLv2Copy,
    cardsLv3:cardsLv3Copy,
  })
}

export const determineVictoryPoints = (player:User):number=>{
  return player.cards.reduce((all,card)=>all+card.victoryPoints,0)
  + player.nobles.reduce((all,noble)=>all+noble.victoryPoints,0)
}

export const createCardGemMap = (cards:Card[])=>cards.reduce((all,next)=>({
  ...all,
  ...(all[next.gem]?{[next.gem]:all[next.gem]+1}:{[next.gem]:1})
}),emptyTokens)


export const createCardsByGem = (cards:Card[])=>cards.reduce((all,card)=>{
  if(all[card.gem]){
    all[card.gem].push(card)
    return all
  }
  all[card.gem] = [card]
  return all
},{})