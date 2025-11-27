import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getSubredditPosts, getPostComments } from '../api/reddit.js';

// Thunk แบบง่าย ดึงโพสจาก subreddit เดียว
export const fetchPosts = createAsyncThunk(
    'reddit/fetchPosts',
    async (subreddit) => {
        //console.log('fetchPosts called with:', subreddit)

        const posts = await getSubredditPosts(subreddit);
        return posts;
    }
);

export const fetchComments = createAsyncThunk(
    'reddit/fetchComments',
    async (permalink) => {
        const comments = await getPostComments(permalink);
        return { permalink, comments };
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
    },
})

export const { setSelectedSubreddit, setSearchTerm } = redditSlice.actions;
export default redditSlice.reducer;
