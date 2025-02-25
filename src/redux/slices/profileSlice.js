import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchProfile = createAsyncThunk('profile/fetchProfile', async (userId) => {
    const response = await axios.get(`http://192.168.88.201:5000/api/users/${userId}`);
    return response.data;
});

const profileSlice = createSlice({
    name: 'profile',
    initialState: { profile: null, loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
          .addCase(fetchProfile.pending, (state) => { state.loading = true; })
          .addCase(fetchProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.profile = action.payload;
          })
          .addCase(fetchProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          });
      },
  });

  export default profileSlice.reducer;

    export function selectProfile(state) {
        return state.profile.profile;
        
    }