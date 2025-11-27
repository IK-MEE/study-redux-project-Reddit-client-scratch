import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getSubredditPosts, getPostComments } from '../api/reddit.js';

// Thunk แบบง่าย ดึงโพสจาก subreddit เดียว
export const fetchPosts = createAsyncThunk(
    'reddit/fetchPosts',
    async (subreddit) => {
        //console.log('fetchPosts called with:', subreddit)

        const posts = await getSubredditPosts(subreddit);
        return posts.map( (post) => ({
            ...post,
            comments: [],
            showingComments: false,
            loadingComments: false,
            errorComments: false,
        }));
    }
);

export const fetchComments = createAsyncThunk(
    'reddit/fetchComments',
    async (permalink, { rejectWithValue }) => {
        try{
            const comments = await getPostComments(permalink);
            return { permalink, comments };
        } catch (error){
            return rejectWithValue({ permalink });
        }
    }
);

export const selectFilteredPosts = (state) => {
    const { posts, searchTerm } = state.reddit;
    
    if (!searchTerm) return posts;

    const lower = searchTerm.toLowerCase();

    return posts.filter( (post) => 
        (post.title || '').toLowerCase().includes(lower)
    );
};

const redditSlice = createSlice({
    name: 'reddit',
    initialState: {
        posts: [],
        isLoading: false,
        error: false,
        selectedSubreddit: 'r/pics',
        searchTerm: '',
    },
    reducers: {
        setSelectedSubreddit(state, action) {
            state.selectedSubreddit = action.payload;
            state.searchTerm = '';
        },
        setSearchTerm(state, action) {
            state.searchTerm = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPosts.pending, (state) => {
                state.isLoading = true;
                state.error = false;
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.posts = action.payload;
            })
            .addCase(fetchPosts.rejected, (state) => {
                state.isLoading = false;
                state.error = true;
                //console.error('[fetchPosts.rejected]', action.error);
            })
            .addCase(fetchComments.pending, (state, action) => {
                const permalink = action.meta.arg;
                const post = state.posts.find( (p) => p.permalink === permalink);
                if (!post) return;
                post.loadingComments = true;
                post.errorComments = false;
                post.showingComments = true;
            })
            .addCase(fetchComments.fulfilled, (state, action) => {
                const { permalink, comments } = action.payload;
                const post = state.posts.find( (p) => p.permalink === permalink);
                if (!post) return;
                post.loadingComments = false;
                post.errorComments = false;
                post.comments = comments;
                post.showingComments = true;
            })
            .addCase(fetchComments.rejected, (state, action) => {
                const {permalink} = action.payload?.permalink || action.meta.arg;
                const post = state.posts.find( (p) => p.permalink === permalink);
                if (!post) return;
                post.loadingComments = false;
                post.errorComments = true;
                post.showingComments = false;
            })
    },
})

export const { setSelectedSubreddit, setSearchTerm } = redditSlice.actions;
export default redditSlice.reducer;
