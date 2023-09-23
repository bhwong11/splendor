import { create } from 'zustand'

const useUserStore = create((set) => ({
  username:'',
  room:'',
  cards:[],
  setRoom: (roomNumber)=>set(_=>({room:roomNumber})),
  setUsername: (username)=>set(_=>({username})),
  setCards:(cards)=>set(_=>cards)
}))

const useSocketStore = create((set) => ({
  socket:null,
  setSocket: (socket)=>set(_=>({socket}))
}))

const useBoardStore = create((set) => ({
  turnPlayer:'',
  cardsLv1:[],
  cardsLv2:[],
  cardsLv3:[],
  nobles:[],
  tokens:{},
  setTurnPlayer: (turnPlayer)=>set(_=>({turnPlayer})),
  setCardsLv1: (cardsLv1)=>set(_=>({cardsLv1})),
  setCardsLv2: (cardsLv2)=>set(_=>({cardsLv2})),
  setCardsLv3: (cardsLv3)=>set(_=>({cardsLv3})),
  setNobles: (nobles)=>set(_=>({nobles})),
  setTokens: (tokens)=>set(_=>({tokens})),
}))


export {
  useUserStore,
  useSocketStore,
  useBoardStore
}