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

    if (isLoading) {
        return (
            <div className="posts-skeleton-wrapper">
                {Array.from({ length: 5 }).map((_, i) => (
                    <PostSkeleton key={i} />
                ))}
            </div>
        );
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
            <ul className='posts'>
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