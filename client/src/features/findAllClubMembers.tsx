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

interface ClubMember {
    is_member_found: boolean,
    id: number,
    is_admin: boolean,
    is_moderator: boolean,
    is_member: boolean,
    is_requested: boolean,
    user: User,
    club: Club
}

interface FindAllClubMembersState {
    is_data_fetched: boolean,
    clubMembers: ClubMember[]
}

const initialState: FindAllClubMembersState = {
    is_data_fetched: false,
    clubMembers: []
}

export const fetchAllClubMembers = createAsyncThunk(
    'findAllClubMembers/fetchAllClubMembers',
    async(payload: string, {rejectWithValue}) => {
        return await fetch(`http://localhost:4001/api/v1/club/${payload}/member`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': Cookies.get('bearer_token') || ''
            },
        })
        .then(response => response.json())
        .then(data => {
            console.log("Members List Data:", data)
            return data;
        })
        .catch(err => {
            console.error(err);
            return rejectWithValue({isSuccess: false});
        });
    }    
);

export const findAllClubMembersSlice = createSlice({
    name: 'findAllClubMembers',
    initialState,
    reducers: {

    },
    extraReducers: {
        [fetchAllClubMembers.fulfilled.type]: (state, action) => {
            console.log("Member List", action);

            if (action.payload.isSuccess) {
                state.is_data_fetched = true;
                console.log(action.payload.members);

                state.clubMembers = action.payload.members;
            }
        }
    }
})

export const selectFindAllClubMembers = (state: any) => state.findAllClubMembers;

export const {} = findAllClubMembersSlice.actions;

export default findAllClubMembersSlice.reducer;