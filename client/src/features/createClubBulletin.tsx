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

export interface CreateClubBulletinState {
    isCreated: boolean,
    id: number,
    title: string,
    content: string,
    author: User,
    club: Club
}

const initialState = {
    isCreated: false,
    id: -1,
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

export interface CreateClubBulletinPayload {
    clubUuid: string,
    title: string,
    content: string
}

export const fetchCreateClubBulletin = createAsyncThunk(
    'createClubBulletin/fetchCreateClubBulletin',
    async(payload: CreateClubBulletinPayload, {rejectWithValue}) => {
        return await fetch(`http://localhost:4001/api/v1/club/${payload.clubUuid}/bulletin`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': Cookies.get('bearer_token') || ''
            },
            body: JSON.stringify({
                title: payload.title,
                content: payload.content
            })
        })
    }
);

const createClubBulletinSlice = createSlice({
    name: 'createClubBulletin',
    initialState,
    reducers: {
        resetCreateClubBulletin: (state) => {
            state.isCreated = true;
            state.id = -1;
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
        [fetchCreateClubBulletin.fulfilled.type]: (state, action) => {
            console.log("Fulfullied: ", action);

            if (action.payload.isSuccess) {
                state.isCreated = true;
                state.id = action.payload.bulletin.id;
                state.title = action.payload.bulletin.title;
                state.content = action.payload.bulletin.content;
                state.author = action.payload.bulletin.author;
                state.club = action.payload.bulletin.club;
            }
        }
    }
});

export const selectFindClubBulletin = (state: any) => state.createClubBulletin;
export const { resetCreateClubBulletin } = createClubBulletinSlice.actions;
export default createClubBulletinSlice.reducer;