
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export interface NavbarState {
    isAccountMenuOpen: boolean,
    searchBarContent: string
}

const initialState: NavbarState = {
    isAccountMenuOpen: false,
    searchBarContent: ''
}

export const navbarSlice = createSlice({
    name: 'navbar',
    initialState,
    reducers: {
        toggleAccountMenu: (state) => {
            if (state.isAccountMenuOpen) {
                state.isAccountMenuOpen = false;
            } else {
                state.isAccountMenuOpen = true;
            }
        },
        updateSearchBarContent: (state, action) => {
            if (typeof action.payload === 'string') {
                state.searchBarContent = action.payload;
            }
        } 
    }
});

export const selectNavbar = (state: any) => state.navbar;

export const {toggleAccountMenu, updateSearchBarContent} = navbarSlice.actions;
export default navbarSlice.reducer;