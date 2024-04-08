import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error: null,
    loading: false
}

const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true
        },
        signInSuccess: (state, action) => {
            state.loading = false
            state.currentUser = action.payload
        },
        signInFail: (state, action) => {
            state.error = action.payload
            state.loading = false
        },
        // Update user reducer
        updateUserStart: (state) => {
            state.loading = true
        },
        updateUserSuccess: (state, action) => {
            state.loading = false
            state.currentUser = action.payload
            state.error = null
        },
        updateUserFail: (state, action) => {
            state.error = action.payload
            state.loading = false
        }
    }
})

export const { 
    signInStart, 
    signInSuccess, 
    signInFail,
    updateUserStart,
    updateUserSuccess,
    updateUserFail
} = userSlice.actions

export default userSlice.reducer