const API_ROOT = 'https://www.reddit.com';

// ดึงโพสต์จาก subreddit เช่น 'r/pics'
export const getSubredditPosts = async (subreddit) => {
    const url = `${API_ROOT}?type=posts&subreddit=${encodeURIComponent(subreddit)}`;

    try {
        const response = await fetch(url);
        console.log(
            '[getSubredditPosts] Response satus:',
            response.status,
            response.statusText
        )

        if (!response.ok) {
            const text = await response.text().catch( () => '<no body>');
            console.log('[getSubredditPosts] !response.ok',{
                status: response.status,
                statusText: response.statusText,
                bodySample: text.slice(0, 200)
            });
            throw new Error(`HTTP ${response.status}`);
        }

        const json = await response.json();
        console.log('[getSubredditPosts] JSON keys:',
            Object.keys(json || {})
        );

        if (!json.data || !Array.isArray(json.data.children)) {
            console.log('[getSubredditPosts] Invalid JSON shape:', json);
            throw new Error('Invalid JSON from Reddit');
        }

        return json.data.children.map( (c) => c.data);
        
    } catch(error) {
        console.log('[getSubredditPosts] Error:', error);
        throw error;
    }


}

// ดึงรายการ subreddits
export const getSubreddits = async () => {
    const url = `${API_ROOT}?type=subreddits`;
    console.log('Fetching subreddits from:', url);
    try{
        const response = await fetch(url);
        const json = await response.json();

        return json.data.children.map( (subreddit) => subreddit.data);
    } catch (error){
        console.log('[getSubreddits] Error:', error);
        throw error;
    }
}

// ดึง comments จาก permalink เช่น '/r/pics/comments/xxx'
export const getPostComments = async (permalink) => {
    const url = `${API_ROOT}?type=comments&permalink=${encodeURIComponent(permalink)}`;
    console.log('Fetching comments from:', url);
    try{
        const response = await fetch(url);
        const json = await response.json();

        return json[1].data.children.map( (c) => c.data);
    } catch (error){
        console.log('[getPostComments] Error:', error);
        throw error;
    }
}