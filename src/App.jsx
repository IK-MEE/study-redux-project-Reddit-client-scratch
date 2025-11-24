import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import './App.css'
import { fetchPosts } from './store/redditSlice'

function App() {
  const dispatch = useDispatch();
  const { posts, isLoading, error, selectedSubreddit } = useSelector( (state) => state.reddit);

  useEffect( () => {
    dispatch(fetchPosts(selectedSubreddit));
    //console.log('selectedSubreddit in component:', selectedSubreddit)
  }, [dispatch, selectedSubreddit]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load posts.</p>;

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
    </>
  )
}

export default App
