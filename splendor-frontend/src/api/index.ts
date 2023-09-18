const createRoom = async ({
  roomNumber=null,
  users=[],
  refresh=()=>{}
}={})=>{
  //put this in helper func
  if(!roomNumber && roomNumber!==0) return
  const res = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/api/rooms/create`,{
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        roomNumber,
        users
      })
  })
  refresh()
  const newRoom = await res.json()
  console.log('new room',newRoom)
  return {
    status:res.status,
    ...newRoom
  }
}

const getRoom = async ({
  roomNumber=null,
  refresh=()=>{}
}:{
  roomNumber:number | null,
  refresh?:() => void
})=>{
  //put this in helper func
  if(!roomNumber && roomNumber!==0) return
  const res = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/api/rooms/getOne/${roomNumber}`
  )
  refresh()
  const newRoom = await res.json()
  console.log('new room',newRoom)
  return {
    status:res.status,
    ...newRoom
  }
}


const createUser = async ({
  username='',
  roomNumber=null,
  refresh=()=>{}
}:{
  username:string,
  roomNumber:number | string | null,
  refresh?:() => void
})=>{
  if(!username) return
  //put this in helper func
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/create`,{
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username,
      roomNumber
    })
  })
  refresh()
  const newUser = await res.json()
  console.log('new User',newUser)
  return {
    status:res.status,
    ...newUser
  }
}

const updateUser = async ({
  userId='',
  username,
  roomNumbers,
  roomNumber,
  refresh=()=>{}
}:{
  userId?:string,
  username?:string,
  roomNumbers?:number[] | string[] | null,
  roomNumber?: number | string | null,
  refresh?:() => void
})=>{
  if(!userId && !username) return
  //put this in helper func
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/update/${
    userId || username
  }`,{
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username,
      ...(roomNumbers?{roomNumbers}:{}),
      roomNumber
    })
  })
  console.log('res',res)
  refresh()
  const updatedUser = await res.json()
  console.log('update User!!',updatedUser)
  return {
    status:res.status,
    ...updatedUser
  }
}

export {
  createRoom,
  createUser,
  updateUser,
  getRoom
}