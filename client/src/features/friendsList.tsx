import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {create} from "domain";
import Cookies from "js-cookie";
import {findUserSlice} from "./findUser";

export interface Friend {
    username: string;
    id: number;
    profile_picture: string;
    is_friend: boolean;
    is_requested: boolean;
    is_sender: boolean;
}

interface FriendListState {
    user: {
        id: number;
        username: string;
    };
    is_data_fetched: boolean;
    friends: Friend[];
}

const initialState: FriendListState = {
  user: {
      id: -1,
      username: ''
  },
  is_data_fetched: false,
  friends: []
};

export const fetchFriendList = createAsyncThunk(
    'fetchFriendList/request',
    async(payload, {rejectWithValue}) => {
        return await fetch(`http://localhost:4001/api/v1/friends/`, {
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
)

export const friendListSlice = createSlice({
    name: 'friendList',
    initialState,
    reducers: {
        setUserId: (state, action) => {
            state.user.id = action.payload;
        },
        setUsername: (state, action) => {
            state.user.username = action.payload;
        },
        resetFriendList: (state) => {
            state.user = initialState.user;
            state.is_data_fetched = initialState.is_data_fetched;
            state.friends = [];
        }
    },
    extraReducers: {
        [fetchFriendList.fulfilled.type]: (state, action) => {
            console.log(action);

            if (state.is_data_fetched) {
                state.is_data_fetched = initialState.is_data_fetched;
                state.friends = [];
            }

            if (action.payload.isSuccess) {
                for (let i=0; i < action.payload.friends.length; i++) {
                    let friend = action.payload.friends[i];
                    let is_sender = false;

                    if (friend.sender.id === state.user.id) {
                        is_sender = true;

                        state.friends.push({
                            username: friend.recipient.username,
                            id: friend.id,
                            profile_picture: friend.recipient.profile_picture,
                            is_friend: friend.friend_status,
                            is_requested: friend.friend_requests_status,
                            is_sender: is_sender
                        });
                    } else {
                        state.friends.push({
                            username: friend.sender.username,
                            id: friend.sender.id,
                            profile_picture: friend.sender.profile_picture,
                            is_friend: friend.friend_status,
                            is_requested: friend.friend_requests_status,
                            is_sender: is_sender
                        });
                    }

                }

                state.is_data_fetched = true;
            } else {
                state.is_data_fetched = false;
            }
        }
    }
})

export const selectFriendList = (state: any) => state.friendList;

export const {setUserId, setUsername, resetFriendList} = friendListSlice.actions;

export default friendListSlice.reducer;