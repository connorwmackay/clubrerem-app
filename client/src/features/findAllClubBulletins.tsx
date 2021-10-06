import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import Cookies from "js-cookie";

interface User {
    id: number,
    username: string,
    profile_picture: string
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

interface ClubBulletin {
    id: number,
    title: string,
    content: string,
    author: User,
    club: Club
}

export interface AllClubBulletinsState {
    isFound: Boolean,
    bulletins: ClubBulletin
}

const initialState = {
    isFound: false,
    bulletins: []
}

export const fetchAllClubBulletins = createAsyncThunk(
    'findAllClubBulletins/fetchAllClubBulletins',
    async(payload: string, {rejectWithValue}) => {
        return await fetch(`http://localhost:4001/api/v1/club/${payload}/bulletin/`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': Cookies.get('bearer_token') || ''
            }
        })
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(err => {
            console.error(err);

            return rejectWithValue({
                isSuccess: true,
                bulletin: {}
            })
        });
    }
);

const findAllClubBulletinsSlice = createSlice({
    name: 'findClubBulletin',
    initialState,
    reducers: {
        resetAllClubBulletins: (state, action) => {
            state.isFound = false;
            state.bulletins = [];
        }
    },
    extraReducers: {
        [fetchAllClubBulletins.fulfilled.type]: (state, action) => {
            console.log("Fulfilled: ", action);

            if (action.payload.isSuccess) {
                state.bulletins = action.payload.bulletins;
            }
        }
    }
});

export const selectFindClubBulletin = (state: any) => state.findAllClubBulletins;
export const { resetAllClubBulletins } = findAllClubBulletinsSlice.actions;
export default findAllClubBulletinsSlice.reducer;