import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {fetchSubreddits } from '../../store/subredditsSlice';
import { setSelectedSubreddit } from '../../store/redditSlice';

const Subreddits = () => {
    const dispatch = useDispatch();
    const { items, isLoading, error } = useSelector( 
        (state) => state.subreddits);
    const selectedSubreddit = useSelector(
        (state) => state.reddit.selectedSubreddit);
    
    useEffect( () => {
        dispatch(fetchSubreddits());
    }, [dispatch]);

    const handleClick = (subreddit) => {
        // reddit API ส่ง url แบบ '/r/pics/' ต้อง normalize ให้เป็น 'r/pics'
        const normalized = subreddit.url.replace(/^\/|\/$/g, ''); // ตัด / หน้าและท้าย
        dispatch(setSelectedSubreddit(normalized));
    };

    if (isLoading) return <p>Loading subreddits...</p>
    if (error) return <p>Failed to load subreddits.</p>

    return (
        <div>
            <h2>Subreddits</h2>
            <ul style={{ listStyle: 'none', padidng: 0}}>
                {items.map( (sub) => {
                    const normalized = sub.url.replace(/^\/|\/$/g, '');
                    const isActive = normalized === selectedSubreddit;

                    return (
                        <li key={sub.id}>
                            <button
                                type="button"
                                onClick={() => handleClick(sub)}
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '4px 8px',
                                    marginBottom: '4px',
                                    background: isActive? '#977f6cff' : '#afafafff',
                                    border: '1px solid #ccc',
                                    cursor: 'pointer',
                                }}
                            >
                                {sub.display_name_prefixed  /*เช่น r/pics */}
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Subreddits;