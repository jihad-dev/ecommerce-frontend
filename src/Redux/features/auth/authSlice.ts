import { createSlice } from "@reduxjs/toolkit"

interface AuthState {
    user: any
    token: string | null
}

const initialState = {
    user: null,
    token: null,
} as AuthState

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
           const {user, token} = action.payload
           state.user = user
           state.token = token
        },
        logout: (state) => {
            state.user = null
            state.token = null
        },
    },
})

export const { setUser, logout } = authSlice.actions
export default authSlice.reducer