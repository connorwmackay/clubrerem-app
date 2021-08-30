import { createAsyncThunk, createSlice, isRejectedWithValue } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'
import React, { useEffect } from 'react'

interface UserResult {
    username: string;
    description: string;
    profile_picture: string;
}

interface SearchResult {
    user: UserResult | null;
}

interface SearchState {
    status: string;
    query: string;
    has_search_ran: boolean;
    searchResults: SearchResult[];
}

const initialState: SearchState = {
    status: '',
    query: '',
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
        setQuery: (state, action) => {
            state.query = action.payload || '';
        }
    },
    extraReducers: {
        [fetchFind.fulfilled.type]: (state, action) => {
            console.log("Fulfilled Find:", action.payload);

            if (action.payload.success.is_success) {
                action.payload.users.forEach((user: UserResult) => {
                    const searchResult: SearchResult = {user: user};
                    state.searchResults.push(searchResult);
                });

                state.has_search_ran = true;
            }
        }
    }
});

export const selectSearch = (state: any) => state.search;

export const {setQuery} = searchSlice.actions;
export default searchSlice.reducer;