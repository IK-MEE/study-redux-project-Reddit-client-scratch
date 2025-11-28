import { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchComments } from "../../store/redditSlice";
import Comment from "../Comment/Comment";
import './Post.css'

const Post = ({ post }) => {
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);

   const handleToggleComments = () => {
    if (!isOpen && post.comments.length === 0 && !post.loadingComments){
        dispatch(fetchComments(post.permalink));
    }
    setIsOpen( (prev) => !prev);
   }

    const title = post.title || '(no title)';
    const author = post.author || 'unknown';
    const ups = post.ups ?? 0;
    
    // เดาคร่าว ๆ ว่าเป็นรูปหรือไม่
    const isImage = typeof post.url === 'string' && post.url.match(/\.(jpg|jpeg|png|gif)$/i);
    //console.log('sample Post: ', post);

    return (
        <article className="post-card">
        <h3 className="post-title">{title}</h3>

        <div className="post-meta">
            by <strong>{author}</strong> | 👍{ups}, 💬{post.num_comments}
        </div>

        {isImage && (
            <div className="post-image-wrapper">
            <img src={post.url} alt={title} className="post-image" />
            </div>
        )}

        <button
            type="button"
            onClick={handleToggleComments}
            className="toggle-comments-btn"
        >
            {isOpen ? "Hide Comments" : "Show Comments"}
        </button>

        <div className={`comments-wrapper ${isOpen ? "open" : ""}`}>
            {post.loadingComments && <p>Loading comments...</p>}
            {post.errorComments && (
                <p className="error">Failed to load comments.</p>
            )}
            {!post.loadingComments &&
            !post.errorComments &&
            post.comments.map((c) => (
                <Comment key={c.id} comment={c} />
            ))}
        </div>

        <a
            href={`https://www.reddit.com${post.permalink}`}
            target="_blank"
            rel="noreferrer"
            className="open-reddit-link"
        >
            Open on Reddit
        </a>
        </article>
    );
};

export default Post;