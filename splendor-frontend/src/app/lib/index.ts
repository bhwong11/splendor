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
  }),{})
  return {
    canBuyCard:(card: Card)=>{

      const remainingCost = 0
      Object.keys(card.price).reduce((all,gemColor)=>({
        ...all,
        [gemColor]:card.price[gemColor]<=cardsValueMap[gemColor]+userTokens[gemColor]
      }),{})
      
      return Object.keys(card.price).every(gemColor=>(
        card.price[gemColor]<=cardsValueMap[gemColor]+userTokens[gemColor]
      ))
    },
    userCardsValueMap:cardsValueMap
  }
}