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

export interface FindClubBulletinState {
    isFound: Boolean,
    title: String,
    content: String,
    author: User,
    club: Club
}

const initialState = {
    isFound: false,
    title: '',
    content: '',
    author: {
        id: -1,
        username: '',
        profile_picture: ''
    },
    club: {
        id: -1,
        uuid: '',
        name: '',
        description: '',
        profile_picture: '',
        cover_picture: '',
        is_public: false,
        owner: {
            id: -1,
            username: '',
            profile_picture: ''
        }
    }
}

export interface ClubBulletinPayload {
    uuid: string,
    id: number
}

export const fetchClubBulletin = createAsyncThunk(
    'findClubBulletin/fetchClubBulletin',
    async(payload: ClubBulletinPayload, {rejectWithValue}) => {
        return await fetch(`http://localhost:4001/api/v1/club/${payload.uuid}/bulletin/${payload.id}`, {
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

const findClubBulletinSlice = createSlice({
    name: 'findClubBulletin',
    initialState,
    reducers: {
        resetClubBulletin: (state, action) => {
            state.isFound = false;
            state.title = '';
            state.content = '';
            state.author = {
                id: -1,
                username: '',
                profile_picture: ''
            }
            state.club = {
                id: -1,
                uuid: '',
                name: '',
                description: '',
                profile_picture: '',
                cover_picture: '',
                is_public: false,
                owner: {
                    id: -1,
                    username: '',
                    profile_picture: ''
                }
            }
        }
    },
    extraReducers: {
        [fetchClubBulletin.fulfilled.type]: (state, action) => {
            console.log(action);

            if (action.payload.isSuccess) {
                state.isFound = true;
                state.author = action.payload.author;
                state.club = action.payload.club;
                state.title = action.payload.title;
                state.content = action.payload.content;
            }
        }
    }
})

export const selectFindClubBulletin = (state: any) => state.findClubBulletin;
export const { resetClubBulletin } = findClubBulletinSlice.actions;
export default findClubBulletinSlice.reducer;