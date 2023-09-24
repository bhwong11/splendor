import { create } from 'zustand'
import { Card, Tokens } from '@/app/lib'

interface UserState {
  username: string
  room: string | number
  cards: Card[]
  tokens:Tokens,
  setRoom: (roomNumber: string | number)=>void,
  setUsername: (username: string)=>void,
  setCards:(cards: Card[])=>void
  setTokens:(tokens: Tokens)=>void
}

const useUserStore = create<UserState>()((set) => ({
  username:'',
  room:'',
  cards:[],
  tokens:{
    white:0,
    blue:0,
    green:0,
    red:0,
    black:0,
    gold: 0
  },
  setRoom: (roomNumber)=>set(_=>({room:roomNumber})),
  setUsername: (username)=>set(_=>({username})),
  setCards:(cards)=>set(_=>({cards})),
  setTokens:(tokens)=>set(_=>({tokens}))
}))

interface SocketState {
  socket: any,
  setSocket: (socket:any)=>void
}

const useSocketStore = create<SocketState>()((set) => ({
  socket:null,
  setSocket: (socket)=>set(_=>({socket}))
}))

interface BoardState {
  turn: number,
  turnPlayer: string,
  cardsLv1:Card[],
  cardsLv2:Card[],
  cardsLv3:Card[],
  cardsLv1Deck:[],
  cardsLv2Deck:[],
  cardsLv3Deck:[],
  nobles:Card[],
  tokens:Tokens,
  setTurn: (turn:number)=> void
  setTurnPlayer: (turnPlayer:string)=> void
  setCardsLv1: (cardsLv1:Card[])=>void
  setCardsLv2: (cardsLv2:Card[])=>void
  setCardsLv3: (cardsLv3:Card[])=>void
  setCardsLv1Deck: (cardsLv1:Card[])=>void
  setCardsLv2Deck: (cardsLv2:Card[])=>void
  setCardsLv3Deck: (cardsLv3:Card[])=>void
  setNobles: (nobles:Card[])=>void
  setTokens: (tokens:Tokens)=>void
}

const useBoardStore = create<BoardState>()((set) => ({
  turn: 0,
  turnPlayer:'',
  cardsLv1:[],
  cardsLv2:[],
  cardsLv3:[],
  cardsLv1Deck:[],
  cardsLv2Deck:[],
  cardsLv3Deck:[],
  nobles:[],
  tokens:{ 
    white:0,
    blue:0,
    green:0,
    red:0,
    black:0,
    gold: 0
  },
  setTurn: (turn)=>set(_=>({turn})),
  setTurnPlayer: (turnPlayer)=>set(_=>({turnPlayer})),
  setCardsLv1: (cardsLv1)=>set(_=>({cardsLv1})),
  setCardsLv2: (cardsLv2)=>set(_=>({cardsLv2})),
  setCardsLv3: (cardsLv3)=>set(_=>({cardsLv3})),
  setCardsLv1Deck: (cardsLv1)=>set(_=>({cardsLv1})),
  setCardsLv2Deck: (cardsLv2)=>set(_=>({cardsLv2})),
  setCardsLv3Deck: (cardsLv3)=>set(_=>({cardsLv3})),
  setNobles: (nobles)=>set(_=>({nobles})),
  setTokens: ({
    white=0,
    blue=0,
    green=0,
    red=0,
    black=0,
    gold=0
  })=>set(_=>({tokens:{
    white,
    blue,
    green,
    red,
    black,
    gold
  }})),
}))


export {
  useUserStore,
  useSocketStore,
  useBoardStore
}