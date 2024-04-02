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
    }
})

export const { signInStart, signInSuccess, signInFail } = userSlice.actions

export default userSlice.reducer