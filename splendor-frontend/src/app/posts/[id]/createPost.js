'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";

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

export default function CreatePost(){
  const [title,setTitle] = useState('')
  const [author,setAuthor] = useState('')
  const [body,setBody] = useState('')
  const router = useRouter()

  return(
    <>
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