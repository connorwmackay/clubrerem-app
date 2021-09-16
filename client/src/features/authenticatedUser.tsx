import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'

interface AuthenticatedUserState {
    status: string,
    is_authenticated: boolean,
    id: number,
    username: string,
    email: string,
    profile_picture_url: string,
    bearer_token: string
}

export interface UserLoginData {
    username: string,
    password: string,
    save_password: boolean,
    is_signup: boolean
}

const initialState: AuthenticatedUserState = {
    status: '',
    is_authenticated: false,
    id: -1,
    email: '',
    username: '',
    profile_picture_url: '',
    bearer_token: ''
}

export const fetchAuthenticatedUser = createAsyncThunk(
    'authenticatedUser/requestStatus',
    async(payload: UserLoginData, {dispatch, rejectWithValue}) => {

        if (payload === undefined) {
            return rejectWithValue({});
        }

        let username = Cookies.get('username');
        let bearer_token = Cookies.get('bearer_token');

        if ((payload.is_signup)) {
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
                    Cookies.set('bearer_token', data.auth.bearer_token, {expires: 7});
                    Cookies.set('username', payload.username, {expires: 7});
                }

                return data;
            }).catch(err => {
                console.error(err);
                return rejectWithValue({});
            });
        } else  {
            console.log("Bearer token:", bearer_token);

            return fetch(`http://localhost:4001/api/v1/users/${username}`, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': bearer_token || ''
                }
            }).then(response => response.json())
            .then(data => {
                return data;
            }).catch(err => {
                console.error(err);
                return rejectWithValue({});
            });
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
            state.email = '';
            state.profile_picture_url = '/res/images/default_profile.png';
            state.bearer_token = '';

            Cookies.remove('bearer_token');
            Cookies.remove('username');
        }
    },
    extraReducers: {
        [fetchAuthenticatedUser.pending.type]: (state, action) => {
            console.log("Pending:", action);
            state.status = "Logging in...";
        },
        [fetchAuthenticatedUser.fulfilled.type]: (state, action) => {
            console.log("Fulfilled:", action);

            if (action.payload.isSuccess === true) {
                if (action.payload.auth) {
                    state.status = 'Logged in...';
                    state.is_authenticated = action.payload.isSuccess;
                    state.id = action.payload.auth.user.id;
                    state.username = action.payload.auth.user.username;
                    state.email = action.payload.auth.user.email;
                    state.profile_picture_url = action.payload.auth.user.profile_picture;
                    state.bearer_token = action.payload.auth.bearer_token;
                } else if (action.payload.user.email) {
                    state.status = 'Logged in...';
                    state.is_authenticated = action.payload.isSuccess;
                    state.id = action.payload.user.id;
                    state.username = action.payload.user.username;
                    state.email = action.payload.user.email;
                    state.profile_picture_url = action.payload.user.profile_picture;
                } else if (action.payload.auth !== {}) {
                    state.status = 'Incorrect login details';
                }
            } else {
                state.is_authenticated = false;
                state.status = 'Incorrect login details';
            }
        },
        [fetchAuthenticatedUser.rejected.type]: (state, action) => {
            console.log("Rejected:", action);

            state.status = 'Incorrect login details';
            state.is_authenticated = false;
        },
    }
})

export const selectAuthenticatedUser = (state: any) => state.authenticatedUser;

export const {unauthenticate} = authenticatedUserSlice.actions;

export default authenticatedUserSlice.reducer;