import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, selectFilteredPosts } from '../../store/redditSlice';
import Post from '../Post/Post';
import PostSkeleton from '../Post/PostSkeleton';
import './Home.css'

const Home = () => {
    const dispatch = useDispatch();
    const { isLoading, error, selectedSubreddit, searchTerm } = useSelector(
        (state) => state.reddit
    );
    const posts = useSelector(selectFilteredPosts);

    // โหลดโพสต์เมื่อเข้า/เปลี่ยน subreddit
    useEffect( () => {
        dispatch(fetchPosts(selectedSubreddit));
    }, [dispatch, selectedSubreddit]);

    if (isLoading) {
        return (
            <div style={{width: '50vw', margin: '5rem 0 0 0'}}>
                {Array.from({ length: 5}).map((_, i) => (
                    <PostSkeleton key={i} />
                ))}
            </div>
        )
    }

    if (error) {
        return (
            <div>
                <p>Failed to load posts.</p>
                <button onClick={() => dispatch(fetchPosts(selectedSubreddit))}>
                    Try again
                </button>
            </div>
        )
    }

    if (!posts.length) return <p>No posts match: <strong>{searchTerm}</strong></p>

    return (
        <div>
            <h1 className='topic'>r/{selectedSubreddit.replace('r/', '')}</h1>
            <ul>
                {posts.map( (post) => (
                    <li key={post.id}>
                        <Post key={post.id} post={post} />
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Home;