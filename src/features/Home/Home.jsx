import { use, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, selectFilteredPosts } from '../../store/redditSlice';
import Post from '../Post/Post';

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

    if (isLoading) return <p>Loading posts...</p>

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
            <h1>r/{selectedSubreddit.replace('r/', '')}</h1>
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