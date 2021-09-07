import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {create} from "domain";
import Cookies from "js-cookie";

interface Friend {
    is_friend: boolean;
    is_requested: boolean;
    senderUsername: string;
}

interface User {
    id: number;
    username: string;
    description: string;
    profile_picture: string;
}

interface FindUserState {
    isUserFound: boolean;
    targetUsername: string;
    status: string;
    user: User;
    friend: Friend;
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
    },
    friend: {
        is_friend: false,
        is_requested: false,
        senderUsername: ''
    }
}

export const fetchAddFriend = createAsyncThunk(
    'findUser/addFriend',
    async(payload: string, {rejectWithValue}) => {
        return await fetch(`http://localhost:4001/api/v1/friends/`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': Cookies.get('bearer_token') || ''
            },
            body: JSON.stringify({recipientUsername: payload})
        })
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(err => {
            console.error(err);
            return rejectWithValue({isSuccess: false});
        });
    }
)

export const fetchAcceptFriend = createAsyncThunk(
    'findUser/acceptFriend',
    async(payload: string, {rejectWithValue}) => {

        return await fetch(`http://localhost:4001/api/v1/friends/${payload}/accept`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Authorization': Cookies.get('bearer_token') || ''
            },
        })
            .then(response => response.json())
            .then(data => {
                return data;
            })
            .catch(err => {
                console.error(err);
                return rejectWithValue({isSuccess: false});
            });
    }
)

export const fetchFriendStatus = createAsyncThunk(
    'findUser/friendStatus',
    async(payload: string, {rejectWithValue}) => {

        return await fetch(`http://localhost:4001/api/v1/friends/${payload}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Authorization': Cookies.get('bearer_token') || ''
            },
        })
            .then(response => response.json())
            .then(data => {
                return data;
            })
            .catch(err => {
                console.error(err);
                return rejectWithValue({isSuccess: false});
            });
    }
)

export const fetchUser = createAsyncThunk(
    'findUser/user',
    async(payload: string, {dispatch, rejectWithValue}) => {
        return await fetch(`http://localhost:4001/api/v1/users/${payload}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Authorization': Cookies.get('bearer_token') || ''
            }
        })
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(err =>
        {
            console.error(err);
            return rejectWithValue({isSuccess: false});
        });
    }
);

export const findUserSlice = createSlice({
    name: 'findUser',
    initialState,
    reducers: {
        setTargetUsername: (state, action) => {
            state.targetUsername = action.payload || '';
        },
        resetUserState: (state) => {
            state.isUserFound = false;
            state.targetUsername = '';
            state.status = 'Loading...';
            state.user = {
                id: -1,
                username: '',
                description: '',
                profile_picture: ''
            };
            state.friend = {
                is_requested: false,
                is_friend: false,
                senderUsername: ''
            };
        }
    },
    extraReducers: {
        [fetchUser.fulfilled.type]: (state, action) => {
            console.log(action)

            state.isUserFound = action.payload.isSuccess;
            
            if (state.isUserFound) {
                let tmpUser: User;
                if (action.payload.user.email) {
                    tmpUser = {
                        id: action.payload.user.id,
                        username: action.payload.user.username,
                        description: action.payload.user.description,
                        profile_picture: 'http://localhost:4001' + action.payload.user.profile_picture
                    }
                } else {
                    tmpUser = {
                        id: action.payload.user.id,
                        username: action.payload.user.username,
                        description: action.payload.user.description,
                        profile_picture: 'http://localhost:4001' + action.payload.user.profilePicture
                    }
                }

                state.status = "";
                state.user = tmpUser;
            } else {
                state.status = "Could not find user.";
            }
        },
        [fetchFriendStatus.fulfilled.type]: (state, action) => {
            console.log(action);

            if (action.payload.isSuccess && action.payload.friend.sender !== undefined) {
                state.friend.is_friend = action.payload.friend.friend_status;
                state.friend.is_requested = action.payload.friend.friend_requests_status;
                state.friend.senderUsername = action.payload.friend.sender.username;
            }
        },
        [fetchAddFriend.fulfilled.type]: (state, action) => {
            console.log(action);

            if (action.payload.isSuccess) {
                state.friend.is_requested = action.payload.friend.friend_requests_status;
            }
        },
        [fetchAcceptFriend.fulfilled.type]: (state, action) => {
            console.log(action);

            if (action.payload.isSuccess) {
                state.friend.is_friend = action.payload.friend.friend_status;
                state.friend.is_requested = action.payload.friend.friend_requests_status;
            }
        }
    }
})

export const selectFindUser = (state: any) => state.findUser;

export const {setTargetUsername, resetUserState} = findUserSlice.actions;

export default findUserSlice.reducer;