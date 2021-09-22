import { createAsyncThunk, createSlice, isRejectedWithValue } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'
import React, { useEffect } from 'react'

export interface UserResult {
    username: string;
    description: string;
    profile_picture: string;
}

export interface ClubResult {
    uuid: string,
    name: string,
    profile_picture: string
}

export interface SearchResult {
    user: UserResult | null;
    club: ClubResult | null;
}

interface SearchState {
    status: string;
    has_search_ran: boolean;
    searchResults: SearchResult[];
}

const initialState: SearchState = {
    status: '',
    has_search_ran: false,
    searchResults: []
}

export const fetchFind = createAsyncThunk(
    'find/requestStatus',
    async(payload: string, {rejectWithValue}) => {

        return await fetch(`http://localhost:4001/api/v1/find/${payload}`,
            {
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
                rejectWithValue({});
            });
    }
);

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        resetSearchResults: (state) => {
            state.searchResults = [];
        }
    },
    extraReducers: {
        [fetchFind.fulfilled.type]: (state, action) => {
            console.log("Fulfilled Find:", action);

            if (action.payload) {
                if (action.payload.success.is_success) {
                    action.payload.users.forEach((user: UserResult) => {
                        const searchResult: SearchResult = {user: user, club: null};
                        state.searchResults.push(searchResult);
                    });

                    action.payload.clubs.forEach((club: ClubResult) => {
                        const searchResult: SearchResult = {user: null, club: club};
                        state.searchResults.push(searchResult);
                    });

                    state.has_search_ran = true;
                }
            }
        },
        [fetchFind.pending.type]: (state, action) => {
            console.log("Pending Find:", action);
        },
        [fetchFind.rejected.type]: (state, action) => {
            console.log("Rejected Find:", action);
        }
    }
});

export const selectSearch = (state: any) => state.search;
export const {resetSearchResults} = searchSlice.actions;
export default searchSlice.reducer;