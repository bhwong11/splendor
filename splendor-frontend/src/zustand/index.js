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


export {
  useUserStore,
  useSocketStore
}