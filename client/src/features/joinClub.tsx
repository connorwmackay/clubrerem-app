import { createAsyncThunk, createSlice, } from '@reduxjs/toolkit'
import {create} from "domain";
import Cookies from "js-cookie";

interface JoinClubState {
    has_joined: boolean,
}

const initialState: JoinClubState = {
    has_joined: false
}

export const fetchJoinClub = createAsyncThunk(
    'joinClub/fetchJoinClub',
    async(payload: string, {rejectWithValue}) => {
        return await fetch(`http://localhost:4001/api/v1/club/${payload}/member`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': Cookies.get('bearer_token') || ''
            },
        })
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(err => {
            console.error(err);
            return rejectWithValue({isSuccess: true});
        })
    }
)

export const joinClubSlice = createSlice({
    name: 'joinClub',
    initialState,
    reducers: {

    },
    extraReducers: {
        [fetchJoinClub.fulfilled.type]: (state, action) => {
            if (action.payload.isSuccess) {
                state.has_joined = true;
            }
        }
    }
});

export const selectJoinClub = (state: any) => state.joinClub;

export const {} = joinClubSlice.actions;

export default joinClubSlice.reducer;