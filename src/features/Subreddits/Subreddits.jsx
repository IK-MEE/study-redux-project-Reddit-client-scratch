import { useDispatch, useSelector } from 'react-redux';
import { setSelectedSubreddit } from '../../store/redditSlice';
import './Subreddits.css'

const Subreddits = () => {
    const dispatch = useDispatch();
    const { items, isLoading, error } = useSelector( 
        (state) => state.subreddits);
    const selectedSubreddit = useSelector(
        (state) => state.reddit.selectedSubreddit);

    const handleClick = (subreddit) => {
        // reddit API ส่ง url แบบ '/r/pics/' ต้อง normalize ให้เป็น 'r/pics'
        const normalized = subreddit.url.replace(/^\/|\/$/g, ''); // ตัด / หน้าและท้าย
        dispatch(setSelectedSubreddit(normalized));
    };

    //if (isLoading) return <p>Loading subreddits...</p>
    if (error) return <p>Failed to load subreddits.</p>

    return (
        <div className='subreddit-card'>
            {isLoading ? (
                <ul className="subreddit-list Loading">
                    {Array.from({ length: 13}).map((_, i) => (
                        <li key={i} className='subreddit-skeleton-item'>
                            <div className='subreddit-skeleton-avatar' />
                            <div className='subreddit-skeleton-text' />
                        </li>
                    ))}
                </ul>
            ) : (
                <div>
                    <h2>Subreddits</h2>
                    <ul className='subreddits-list'>
                    {items.map( (subreddit) => {
                        const normalized = subreddit.url.replace(/^\/|\/$/g, '');
                        const isActive = normalized === selectedSubreddit;

                        return (
                            <li
                                key={subreddit.id}
                                className={isActive ? 'selected-subreddit' : ''}
                            >
                                <button
                                    type='button'
                                    onClick={() => handleClick(subreddit)}
                                    style={{
                                        width: '100%'
                                    }}
                                >
                                    {subreddit.display_name_prefixed}
                                </button>
                            </li>
                        )
                    })}
                </ul>
                </div>
            )}


             
        </div>
    );
};

export default Subreddits;