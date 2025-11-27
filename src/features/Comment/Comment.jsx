const Comment = ({ comment}) => {
    return (
        <div
            style={{
                borderTop: '1px solid #eee',
                padding: '6px 0',
                fontSize: '14px',
            }}
        >
            <div
                style={{
                    fontWeight: 'bold',
                    fontSize: '12px',
                    marginBottom: '2px',
                    color: '#555'
                }}
            >
                {comment.author || 'unknown'}
            </div>
            <div>{comment.body}</div>
        </div>
    );
};

export default Comment;