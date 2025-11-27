import './Post.css'

const PostSkeleton = () => {
    return (
        <article className="post-skeleton">
            <div className="post-skeleton-title" />
            <div className="post-skeleton-meta" />
            <div className="post-skeleton-image" />
        </article>    
    )
}

export default PostSkeleton;