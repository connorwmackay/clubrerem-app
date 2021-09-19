import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {create} from "domain";
import Cookies from "js-cookie";

interface User {
    id: number,
    username: string,
    profile_picture: string
}

interface FindClubState {
    is_club_found: boolean;
    id: number,
    uuid: string,
    name: string,
    description: string,
    profile_picture: string,
    cover_picture: string,
    is_public: boolean,
    owner: User
}

const initialState: FindClubState = {
    is_club_found: false,
    id: -1,
    uuid: '',
    name: '',
    description: '',
    profile_picture: '',
    cover_picture: '',
    is_public: true,
    owner: {
        id: -1,
        username: '',
        profile_picture: '',
    }
}

export const fetchClub = createAsyncThunk(
    'findClub/fetchClub',
    async(payload: string, {rejectWithValue}) => {
        console.log("Find Club Payload: ", payload);

        return await fetch(`http://localhost:4001/api/v1/club/${payload}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': Cookies.get('bearer_token') || ''
            },
        })
        .then(response => response.json())
        .then(data => {
            console.log("Data: ", data);
            return data;
        })
        .catch(err => {
            console.error(err);
            return rejectWithValue({isSuccess: false});
        });
    }
)

export const findClubSlice = createSlice({
    name: 'findClub',
    initialState,
    reducers: {
        resetClubState: (state) => {
            state.is_club_found = false;
            state.id = -1;
            state.uuid = '';
            state.name = '';
            state.description = '';
            state.profile_picture = '';
            state.cover_picture = '';
            state.is_public = false;
            state.owner = {
                id: -1,
                username: '',
                profile_picture: '',
            }
        }
    },
    extraReducers: {
        [fetchClub.fulfilled.type]: (state, action) => {
            console.log("Fulfilled:", action);

            if (action.payload.isSuccess) {
                state.is_club_found = true;
                state.id = action.payload.club.id;
                state.uuid = action.payload.club.uuid;
                state.name = action.payload.club.name;
                state.description = action.payload.club.description;
                state.profile_picture = action.payload.club.profile_picture;
                state.cover_picture = action.payload.club.cover_picture;
                state.is_public = action.payload.club.is_public;
                state.owner = action.payload.club.owner;
            } else {
                state.is_club_found = true;
            }
        },
        [fetchClub.pending.type]: (state, action) => {
            console.log("Pending:", action);
            state.is_club_found = true;
        }
    }
})

export const selectFindClub = (state: any) => state.findClub;

export const {resetClubState} = findClubSlice.actions;

export default findClubSlice.reducer;