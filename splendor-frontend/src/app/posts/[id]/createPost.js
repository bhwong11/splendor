'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function CreatePost(){
  const [title,setTitle] = useState('')
  const [author,setAuthor] = useState('')
  const [body,setBody] = useState('')
  const [randomPostTitle,setRandomPostTitle] = useState('')
  const router = useRouter()

  const createPost = async ({
    title='',
    body='',
    author='',
    permalink='',
    tags=[],
    comments=[],
    refresh=()=>{}
  }={})=>{
    await fetch('http://localhost:5050/posts/',{
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        body,
        author,
        permalink,
        tags,
        comments
      })
    })
    refresh()
  }
  
  const getRandomPost = async ()=>{
    const res = await fetch('http://localhost:5050/posts/latest')
    const latestPosts = await res.json()
    const randomNum02 = Math.floor(Math.random()*2)
    console.log('random nu',randomNum02,latestPosts[randomNum02])
    setRandomPostTitle(latestPosts[randomNum02]?.title)
  }

  return(
    <>
    <h2>{randomPostTitle}</h2>
    <button onClick={()=>{
      getRandomPost()
    }}>
      get Random
    </button>
    <form onSubmit={(e)=>{
      e.preventDefault()
      createPost({
      title,
      author,
      body,
      refresh:()=>router.refresh()
    })}}>
    <div>
      <label for="title">title</label>
      <input 
        name="title"
        type="text"
        value={title}
        onChange={e=>setTitle(e.target.value)}
      />
    </div>
    <div>
      <label for="author">author</label>
      <input 
        name="author"
        type="text"
        value={author}
        onChange={e=>setAuthor(e.target.value)}
      />
    </div>
    <div>
      <label for="body">body</label>
      <textarea
        name="body"
        onChange={e=>setBody(e.target.value)}
        value={body}
      />
    </div>
    <button type="submit">
      create
    </button>
    </form>
    </>
  )
};