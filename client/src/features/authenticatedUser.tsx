import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'

interface AuthenticatedUserState {
    status: string,
    is_authenticated: boolean,
    id: number,
    username: string,
    profile_picture_url: string,
    bearer_token: string
}

export interface UserLoginData {
    username: string,
    password: string,
    save_password: boolean
}

const initialState: AuthenticatedUserState = {
    status: '',
    is_authenticated: false,
    id: -1,
    username: '',
    profile_picture_url: '',
    bearer_token: ''
}

export const fetchAuthenticatedUser = createAsyncThunk(
    'authenticatedUser/requestStatus',
    async(payload: UserLoginData, {dispatch, rejectWithValue}) => {
        let username = Cookies.get('username');
        let bearer_token = Cookies.get('bearer_token');

        if (bearer_token !== undefined && username !== 'undefined') {
            try {
                return fetch(`http://localhost:4001/api/v1/users/${username}`, {
                    method: 'GET',
                    mode: 'cors',
                    headers: {
                        'Authorization': bearer_token || ''
                    }
                }).then(response => response.json())
                .then(data => {
                    return data;
                });
            } catch(err) {
                console.error(err);
                return rejectWithValue({});
            }
        } else if (payload.username.length > 0) {
            try {
                return fetch('http://localhost:4001/api/v1/auth', {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                }).then(response => response.json())
                .then(data => {
                    if (payload.save_password) {
                        console.log("Payload:",payload);

                        Cookies.set('bearer_token', data.auth.bearer_token, {expires: 7});
                        Cookies.set('username', payload.username, {expires: 7});
                    }

                    return data;
                });
            } catch(err) {
                console.error(err);
                return rejectWithValue({});
            }
        }
    }
)

export const authenticatedUserSlice = createSlice({
    name: 'authenticatedUser',
    initialState,
    reducers: {
        unauthenticate: (state) => {
            state.status = '';
            state.is_authenticated = false;
            state.id = -1;
            state.username = '';
            state.profile_picture_url = '';
            state.bearer_token = '';

            Cookies.remove('bearer_token');
            Cookies.remove('username');
        }
    },
    extraReducers: {
        [fetchAuthenticatedUser.pending.type]: (state, action) => {
            console.log("Pending: ", state);

            state.status = 'loading';
            state.is_authenticated = false;
            state.id = -1;
            state.username = '';
            state.profile_picture_url = '';
            state.bearer_token = '';
        },
        [fetchAuthenticatedUser.fulfilled.type]: (state, action) => {
            console.log(action);

            if (action.payload.isSuccess === true) {
                state.status = 'idle';

                if (action.payload.auth) {
                    state.is_authenticated = action.payload.isSuccess;
                    state.id = action.payload.auth.user.id;
                    state.username = action.payload.auth.user.username;
                    state.profile_picture_url = '';
                    state.bearer_token = action.payload.auth.bearer_token;
                } else {
                    state.is_authenticated = action.payload.isSuccess;
                    state.id = action.payload.user.id;
                    state.username = action.payload.user.username;
                    state.profile_picture_url = '';
                    state.bearer_token = Cookies.get('bearer_token') || '';
                }
            }
        },
        [fetchAuthenticatedUser.rejected.type]: (state, action) => {
            console.log("Rejected: ", state);
            state.status = 'idle';
            state.is_authenticated = false;
            state.id = -1;
            state.username = '';
            state.profile_picture_url = '';
            state.bearer_token = '';
        },
    }
})

export const selectAuthenticatedUser = (state: any) => state.authenticatedUser;

export const {unauthenticate} = authenticatedUserSlice.actions;

export default authenticatedUserSlice.reducer;