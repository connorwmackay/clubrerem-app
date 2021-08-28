import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'

interface UpdateUserState {
    username: string,
    email: string,
    password: string
}

const initialState: UpdateUserState = {
    username: '',
    email: '',
    password: ''
}

export const fetchUpdateUser = createAsyncThunk(
    'updateUser/requestStatus',
    async(payload: UpdateUserState, {dispatch, rejectWithValue}) => {
        const username = Cookies.get('username');
        const bearer_token = Cookies.get('bearer_token');

        console.log("Payload:", payload);

        let body = {
            username: payload.username,
            email_addr: payload.email,
            password: payload.password
        }

        if (username !== 'undefined' && bearer_token !== undefined) {
            return await fetch(
                `http://localhost:4001/api/v1/users/${username}`, 
                {
                    method: 'PUT',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': bearer_token || ''
                    },
                    body: JSON.stringify(body)
                })
                .then(response => response.json())
                .then(data => {
                    return data;
                }).catch(err => {
                    console.error(err);
                    rejectWithValue({});
                });
        } else {
            rejectWithValue({});
        }
    }
)

export const updateUserSlice = createSlice({
    name: 'updateUser',
    initialState,
    reducers: {
        setUsername: (state, action) => {
            state.username = action.payload;
        },
        setPassword: (state, action) => {
            state.password = action.payload;
        },
        setEmail: (state, action) => {
            state.email = action.payload;
        }
    },
    extraReducers: {
        [fetchUpdateUser.fulfilled.type]: (state, action) => {
            console.log("Fulfilled:", action);

            if (action.payload.isSuccess === true) {
                state.username = '';
                state.email = '';
                state.password = '';
            }
        },
        [fetchUpdateUser.rejected.type]: (state, action) => {
            console.log("Rejected:", action);
            state.username = '';
            state.email = '';
            state.password = '';
        },
    }
});

export const selectUpdateUser = (state: any) => state.updateUser;

export const {setUsername, setEmail, setPassword} = updateUserSlice.actions;

export default updateUserSlice.reducer;