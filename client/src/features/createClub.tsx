import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import Cookies from "js-cookie";

export interface CreateClubState {
    name: string,
    description: string,
    is_public: boolean,
    status: string
}

const initialState: CreateClubState = {
    name: '',
    description: '',
    is_public: true,
    status: ''
}

export const fetchCreateClub = createAsyncThunk(
    'createClub/fetchCreateClub',
    
    async(payload: any, {rejectWithValue}) => {
        console.log("Club Payload:", payload);

        return await fetch('http://localhost:4001/api/v1/club', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': Cookies.get('bearer_token') || ''
            },
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => {
            console.log("Club Data: ", data);
            return data;
        })
        .catch(err => {
            console.error(err);
            return rejectWithValue({isSuccess: false});
        });
    }
);


export const createClubSlice = createSlice({
    name: 'createClub',
    initialState,
    reducers: {
        setName: (state, action) => {
            state.name = action.payload;
        },
        setDescription: (state, action) => {
            state.description = action.payload;
        },
        setIsPublic: (state, action) => {
            state.is_public = action.payload;
        }
    },
    extraReducers: {
        [fetchCreateClub.fulfilled.type]: (state, action) => {
            console.log("Fulfilled:", action);
            if (action.payload.isSuccess) {
                state.status = "Successfully created club...";
            } else {
                state.status = "Could not create club...";
            }
        },
        [fetchCreateClub.pending.type]: (state, action) => {
            console.log("Pending:", action);
            state.status = "Creating club..."
        }
    }
});

export const selectCreatelub = (state: any) => state.createClub;

export const {setName, setDescription, setIsPublic} = createClubSlice.actions;

export default createClubSlice.reducer;