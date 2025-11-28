import './App.css'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { fetchPosts } from './store/redditSlice.js'
import { fetchSubreddits } from './store/subredditsSlice.js'
import Header from './features/Header/Header.jsx'
import Home from './features/Home/Home.jsx'
import Subreddits from './features/Subreddits/Subreddits.jsx'
import PostSkeleton from './features/Post/PostSkeleton.jsx'

function App() {
  const dispatch = useDispatch();

  const { isLoading: isLoadingPosts, posts, selectedSubreddit } = useSelector(
    (state) => state.reddit
  )
  const { isLoading: isLoadingSubs, items:subItems } = useSelector(
    (state) => state.subreddits
  )

  useEffect(() => {
    dispatch(fetchSubreddits());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchPosts(selectedSubreddit));
  }, [dispatch, selectedSubreddit]);

  const isInitialLoading =
    (isLoadingPosts || isLoadingSubs) &&
    posts.length === 0 ||
    subItems.length === 0;

  return (
    <div className='app-root'>
      <Header />

      <main className='app-main'>
        <section className='app-content'>
          {isInitialLoading ? (
              <>
                {Array.from({ length: 5 }).map((_,i) => (
                  <PostSkeleton key={i} />
                ))}
              </>
            ) : (
              <Home />
            )}
        </section>

        <aside className='app-sidebar'>
          {isInitialLoading ? (
            <ul className='subreddits-list'>
              {Array.from({ length: 13 }).map( (_,i) => (
                <li key={i} className='subreddit-skeleton-item'>
                  <div className='subreddit-skeleton-avatar' />
                  <div className='subreddit-skeleton-text' />
                </li>
              ))}
            </ul>
          ) : (
            <Subreddits />
          )}
        </aside>
      </main>
    </div>
  );
}

export default App
