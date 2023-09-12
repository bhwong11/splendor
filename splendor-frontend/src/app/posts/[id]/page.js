import PostComment from '../../(components)/comment'

const getPostData = async (id)=>{
    const res = await fetch(
      `http://localhost:5050/posts/${id}`,
      {cache:'no-store'}
    )
    const postData = await res.json()
    return postData
}

const postPage = async ({params})=>{
    const postData = await getPostData(params.id)

    return (
        <div>
            <h1>note page</h1>
            hello
            <h3>{postData.title}</h3>
            <p>{postData.body}</p>
            {postData.comments?.map(commentData=>(
              <PostComment
                author={commentData.author}
                email={commentData.email}
                body={commentData.body}
              />
            ))}

        </div>
    )
}

export default postPage