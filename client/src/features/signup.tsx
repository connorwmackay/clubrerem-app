import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export interface SignupData {
    username: string,
    email: string,
    password: string,
}

interface SignupState {
    is_signed_up: boolean,
    is_authenticated: boolean,
    username: string,
    email: string,
    password: string,
    password_check: string
}

const initialState: SignupState = {
    is_signed_up: false,
    is_authenticated: false,
    username: '',
    email: '',
    password: '',
    password_check: ''
}

export const fetchCreateUser = createAsyncThunk(
    'signup/createUserRequest',
    async(payload: SignupData, {dispatch, rejectWithValue}) => {
        try {
            return await fetch('http://localhost:4001/api/v1/users', {
                method: 'POST', 
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            })
            .then(response => response.json())
            .then(data => {
                return data;
            });
        } catch(err) {
            console.error("Error: ", err);
            return rejectWithValue({});
        }
    }
)

export const signupSlice = createSlice({
    name: 'signup',
    initialState,
    reducers: {
        setUsername: (state, action) => {
            let username = action.payload;
            state.username = username;
        },
        setEmail: (state, action) => {
            let email = action.payload || '';
            state.email = email;
        },
        setPassword: (state, action) => {
            let password = action.payload;
            state.password = password;
        },
        setPasswordCheck: (state, action) => {
            let passwordCheck = action.payload;
            state.password_check = passwordCheck;
        },
    }, extraReducers: {
        [fetchCreateUser.fulfilled.type]: (state, action) => {
            console.log("Fulfilled:", action);
            state.is_signed_up = action.payload.isSuccess;
        },
        [fetchCreateUser.pending.type]: (state, action) => {
            console.log("Pending:", action);
        },
        [fetchCreateUser.rejected.type]: (state, action) => {
            console.log("Rejected:", action);
            state.is_signed_up = false;
        }
    }
});

export const selectSignup = (state: any) => state.signup;

export const {setUsername, setEmail, setPassword, setPasswordCheck} = signupSlice.actions;
export default signupSlice.reducer;