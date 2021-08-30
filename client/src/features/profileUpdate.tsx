import { createAsyncThunk, createSlice, isRejectedWithValue } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'
import React, { useEffect } from 'react'

interface ProfileUpdateState {
    isUpdated: boolean,
    description: string,
    profileUrl: string
}

const initialState: ProfileUpdateState = {
    isUpdated: false,
    description: '',
    profileUrl: ''
}

export const fetchSendPicture = createAsyncThunk(
    'profileUpdate/sendPictureRequest',
    async(payload: FormData, {dispatch, rejectWithValue}) => {
        return await fetch('http://localhost:4001/api/v1/pictures',
            {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Authorization': Cookies.get('bearer_token') || ''
                },
                body: payload
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

export const fetchUpdateProfile = createAsyncThunk(
    'profileUpdate/profileUpdateRequest',
    async(payload: {}, {dispatch, rejectWithValue}) => {
        const username = Cookies.get('username') || '';

        return await fetch(`http://localhost:4001/api/v1/users/${username}`,
            {
                method: 'PUT',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': Cookies.get('bearer_token') || ''
                },
                body: JSON.stringify(payload)               
            })
            .then(response => response.json())
            .then(data => {
                return data;
            })
            .catch(err => {
                console.error(err);
                rejectWithValue({});
            })
    }
);

export const updateProfileSlice = createSlice({
    name: 'updateProfile',
    initialState,
    reducers: {
        setDescription(state, action) {
            state.description = action.payload || '';
        }
    },
    extraReducers: {
        // Fetch Send Picture
        [fetchSendPicture.fulfilled.type]: (state, action) => {
            if (action.payload.isSuccess) {
                state.profileUrl = action.payload.image.url;
            }
        },
        [fetchSendPicture.rejected.type]: (state, action) => {

        },

        // Fetch Update Profile
        [fetchUpdateProfile.fulfilled.type]: (state, action) => {
            console.log("Fulfilled:", action);

            if (action.payload) {
                if (action.payload.isSuccess) {
                    state.isUpdated = true;
                }
            }
        },
        [fetchUpdateProfile.rejected.type]: (state, action) => {

        }
    }
});

export const selectUpdateProfile = (state: any) => state.updateProfile;

export const {setDescription} = updateProfileSlice.actions;

export default updateProfileSlice.reducer;