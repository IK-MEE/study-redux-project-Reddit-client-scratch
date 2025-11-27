import { useDispatch } from "react-redux";
import { fetchComments } from "../../store/redditSlice";
import Comment from "../Comment/Comment";

const Post = ({ post }) => {
    const dispatch = useDispatch();

    const handleToggleComments = () => {
        if (!post.showingComments){
            dispatch(fetchComments(post.permalink));
        } else {

        }
    }

    const title = post.title || '(no title)';
    const author = post.author || 'unknown';
    const ups = post.ups ?? 0;
    
    // เดาคร่าว ๆ ว่าเป็นรูปหรือไม่
    const isImage = typeof post.url === 'string' && post.url.match(/\.(jpg|jpeg|png|gif)$/i);
    //console.log('sample Post: ', post);

    return (
        <article
            style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '8px 12px',
                marginBottom: '12px',
                background: '#a5a5a5ff'
            }}
        >
            <h3 style={{ marginBottom: '4px' }}>{title}</h3>
            <div style={{ frontSize: '12px', color: '#555', marginBottom: '8px'}}>
                by <strong>{author} {post.url}</strong>. 👍 {ups}
            </div>
            <div>Num comments: {post.num_comments}</div>

            {isImage && (
                <div 
                    style={{
                        maxHeight: '300px',
                        overflow: 'hidden',
                        borderRadius: '6px',
                    }}
                >
                    <img
                        src={post.url}
                        alt={title}
                        style={{ width: '100%', display: 'block', objectFit: 'cover'}}
                    />
                </div>
            )}

            <button
                type="button"
                onClick={handleToggleComments}
                style={{ marginTop: '8px'}}
            >
                {post.showingComments ? 'Hide' : 'Show'}
            </button>
            <div>
                {post.loadingComments && <p>Loading comments...</p>}

                {post.errorComments && (
                    <p style={{ color: 'red'}}>Failed to load comments.</p>
                )}

                {post.showingComments && !post.loadingComments && !post.errorComments && (
                    <div style={{marginTop: '8px'}}>
                        {post.comments.map( (c) => (
                            <Comment key={c.id} comment={c} />
                        ))}
                    </div>
                )}
            </div>

            <a
                href={`https://www.reddit.com${post.permalink}`}
                target="_blank"
                rel="noreferrer"
            >
                Open on Reddit
            </a>
        </article>
    );
};

export default Post;