import { create } from 'zustand'

const useUserStore = create((set) => ({
  username:'',
  room:'',
  setRoom: (roomNumber)=>set(_=>({room:roomNumber})),
  setUsername: (username)=>set(_=>({username}))
}))

export {
  useUserStore
}