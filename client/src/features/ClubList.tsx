import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {create} from "domain";
import Cookies from "js-cookie";

interface User {
    id: number,
    username: string,
}

interface Club {
    id: number,
    uuid: string,
    name: string,
    description: string,
    profile_picture: string,
    cover_picture: string,
    is_public: boolean,
    owner: User
}

interface ClubListState {
    is_data_fetched: boolean,
    clubs: Club[],
}

const initialState: ClubListState = {
    is_data_fetched: false,
    clubs: []
}

export const fetchClubList = createAsyncThunk(
    'clublist/fetchClubList',
    async(payload: User, {rejectWithValue}) => {
        return await fetch(`http://localhost:4001/api/v1/club/member/${payload.id}`, {
            method: 'GET',
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
            return rejectWithValue({isSuccess: false, clubs: []});
        });
    }
)

export const clubListSlice = createSlice({
    name: 'listClub',
    initialState,
    reducers: {

    },
    extraReducers: {
        [fetchClubList.pending.type]: (state, action) => {
            console.log(action);
        },
        [fetchClubList.fulfilled.type]: (state, action) => {
            if (action.payload.isSuccess) {
                state.is_data_fetched = true;
                state.clubs = action.payload.clubs;
                console.log(action);
            } else {
                state.is_data_fetched = true;
                state.clubs = [];
                console.log(action);
            }
        }
    }
});


export const selectClubList = (state: any) => state.clubList;

export const {} = clubListSlice.actions;

export default clubListSlice.reducer;