import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getSubreddits } from '../api/reddit.js';

// thunk โหลดรายชื่อ subreddits
export const fetchSubreddits = createAsyncThunk(
    'subreddits/fetchSubreddits',
    async () => {
        const subs = await getSubreddits();
        return subs;
    }
);

const subredditsSlice = createSlice({
    name: 'subreddits',
    initialState: {
        items: [],
        isLoading: false,
        error: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSubreddits.pending, (state) => {
                state.isLoading = true;
                state.error = false;
            })
            .addCase(fetchSubreddits.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;
            })
            .addCase(fetchSubreddits.rejected, (state) => {
                state.isLoading = false;
                state.error = true;
            })
    },
});

export default subredditsSlice.reducer;