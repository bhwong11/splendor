import cardsLv1 from "@/gameData/cardsLv1";
import cardsLv2 from "@/gameData/cardsLv2";
import cardsLv3 from "@/gameData/cardsLv1";
import nobles from "@/gameData/nobles";
import tokens from "@/gameData/tokens";
import { useBoardStore, useUserStore } from "@/zustand";

export interface Tokens{
  white:number,
  blue:number,
  green:number,
  red:number,
  black:number,
  gold: number
}

export interface Card{
  id:number,
  gem?:string,
  picture: string,
  level?:number,
  victoryPoints:number,
  price:{
    white?:number,
    blue?:number,
    green?:number,
    red?:number,
    black?:number
  }
}

export interface SocketUser{
  active:boolean,
  cards:Card[],
  reserveCards:Card[],
  socketId:string,
  tokens:Tokens,
  username:string
}

const emptyTokens = {
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
    nobles:shuffleCards(nobles),
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