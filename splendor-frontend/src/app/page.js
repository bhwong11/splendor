import styles from './page.module.css'
import CreatePost from './posts/[id]/createPost'

const getLastestPostData = async ()=>{
  const res = await fetch(
    'http://localhost:5050/posts/latest',
    {cache:'no-store'}
  )
  const latestPostData = await res.json()
  return latestPostData
}

export default async function Home() {
  const latestPostData = await getLastestPostData()
  return (
    <main className={styles.main}>
      <h1 className={styles.test}>test</h1>
      <div className={styles.description}>
        {latestPostData?.map(post=>(
          <p>{post.title}</p>
        ))}
      </div>

        <CreatePost/>
    </main>
  )
}
