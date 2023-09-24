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