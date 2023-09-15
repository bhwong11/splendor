const createRoom = async ({
  roomNumber=null,
  users=[],
  refresh=()=>{}
}={})=>{
  //put this in helper func
  if(!roomNumber && !roomNumber===0) return
  const newRoom = await fetch(
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
  console.log('new room',newRoom)
  refresh()
}


const createUser = async ({
  username='',
  roomNumber,
  refresh=()=>{}
}={})=>{
  if(!username) return
  //put this in helper func
  const newUser = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/create`,{
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
  console.log('new User',newUser)
  refresh()
}

export {
  createRoom,
  createUser
}