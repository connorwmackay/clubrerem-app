import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {create} from "domain";
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

interface FindClubMemberState {
    is_member_found: boolean,
    id: number,
    is_admin: boolean,
    is_moderator: boolean,
    is_member: boolean,
    is_requested: boolean,
    user: User,
    club: Club
}

const initialState: FindClubMemberState = {
    is_member_found: false,
    id: -1,
    is_admin: false,
    is_moderator: false,
    is_member: false,
    is_requested: false,
    user: {
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
        is_public: true,
        owner: {
            id: -1,
            username: '',
            profile_picture: '',
        }
    }
}

export const fetchFindClubMember = createAsyncThunk(
    'findClubMember/fetchFindClubMember',
    async(payload: {clubUuid: string, username: string}, {rejectWithValue}) => {
        return await fetch(`http://localhost:4001/api/v1/club/${payload.clubUuid}/member/${payload.username}`, {
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
            return rejectWithValue({isSuccess: true});
        });
    }
);

export const findClubMemberSlice = createSlice({
    name: 'findClubMember',
    initialState,
    reducers: {

    },
    extraReducers: {
        [fetchFindClubMember.fulfilled.type]: (state, action) => {
            console.log(action);

            if (action.payload.isSuccess) {
                state.is_member_found = true;
                state.id = action.payload.member.id
                state.is_admin = action.payload.member.is_admin;
                state.is_member = action.payload.member.is_member;
                state.is_requested = action.payload.member.is_requested;
                state.club = action.payload.member.club;
                state.user = action.payload.member.user;
            }
        }
    }
});

export const selectFindClubMember = (state: any) => state.findClubMember;

export const {} = findClubMemberSlice.actions;

export default findClubMemberSlice.reducer;