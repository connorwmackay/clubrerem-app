import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

interface User {
    id: number,
    username: string,
    description: string,
    profile_picture: string
}

interface FindUserState {
    isUserFound: boolean;
    targetUsername: string;
    status: string;
    user: User;
}

const initialState: FindUserState = {
    isUserFound: false,
    targetUsername: '',
    status: 'Loading...',
    user: {
        id: -1,
        username: '',
        description: '',
        profile_picture: ''
    }
}

export const fetchUser = createAsyncThunk(
    'findUser/requestStatus',
    async(payload: string, {dispatch, rejectWithValue}) => {
        try {
            return await fetch(`http://localhost:4001/api/v1/users/${payload}`, {
                method: 'GET',
                mode: 'cors',
            }).then(response => response.json())
            .then(data => {
                return data;
            })
        } catch(err) {
            console.error(err);
            return rejectWithValue({});
        }
    }
);

export const findUserSlice = createSlice({
    name: 'findUser',
    initialState,
    reducers: {
        setTargetUsername: (state, action) => {
            state.targetUsername = action.payload || '';
        }
    },
    extraReducers: {
        [fetchUser.fulfilled.type]: (state, action) => {
            console.log(action)

            state.isUserFound = action.payload.isSuccess;
            
            if (state.isUserFound) {
                let tmpUser: User = {
                    id: action.payload.user.id,
                    username: action.payload.user.username,
                    description: action.payload.user.description,
                    profile_picture: 'http://localhost:4001' + action.payload.user.profilePicture
                }

                state.status = "";
                state.user = tmpUser;
            } else {
                state.status = "Could not find user.";
            }
        }
    }
})

export const selectFindUser = (state: any) => state.findUser;

export const {setTargetUsername} = findUserSlice.actions;

export default findUserSlice.reducer;