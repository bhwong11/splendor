const PostComment = async ({
    body='',
    email='',
    author=''
}={})=>{

    return (
        <div>
            <h4>author: {author}</h4>
            <p>email:{email}</p>
            <p>{body}</p>
        </div>
    )
}

export default PostComment