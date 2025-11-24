import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { fetchPosts } from './store/redditSlice'

function App() {
  const dispatch = useDispatch();
  const { posts, isLoading, error, selectedSubreddit } = useSelector( (state) => state.reddit);
  const [count, setCount] = useState(0)

  useEffect( () => {
    dispatch(fetchPosts(selectedSubreddit));
  }, [dispatch, selectedSubreddit]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load posts.</p>

  return (
    <>
      <div>
        <h1>Reddit Client (From Scratch)</h1>
        <p>Subreddit: {selectedSubreddit}</p>
        <ul>
          {posts.map( (post) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      </div>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
