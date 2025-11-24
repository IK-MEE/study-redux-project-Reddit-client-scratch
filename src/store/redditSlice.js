import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Thunk แบบง่าย ดึงโพสจาก subreddit เดียว
export const fetchPosts = createAsyncThunk(
    'reddit/fetchPosts',
    async (subreddit) => {
        const res = await fetch('https://www.reddit.com/${subreddit}.json');
        const json = await res.json();
        return json.data.children.map( (c) => c.data );
    }
);

const redditSlice = createSlice({
    name: 'reddit',
    initialState: {
        posts: [],
        isLoading: false,
        error: false,
        selectedSubreddit: 'r/pics',
    },
    reducers: {
        setSelectedSubreddit(state, action) {
            state.selectedSubreddit = action.payload;
        },
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
            })
    },
})

export const { setSelectedSubreddit } = redditSlice.actions;
export default redditSlice.reducer;
