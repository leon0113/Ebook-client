import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TState } from "..";

export interface Profile {
    id: string;
    name?: string;
    email: string;
    role: "user" | "author";
    avatar?: string;
    signedUp: boolean;
    authorId?: string;
    books?: string[];
}

export interface AuthState {
    profile: Profile | null;
    status: 'busy' | 'authenticated' | 'unauthenticated'
}

const initialState: AuthState = {
    profile: null,
    status: 'busy',
}

const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        updateProfile(state, { payload }: PayloadAction<Profile | null>) {
            state.profile = payload
        },
        updateStatus(state, { payload }: PayloadAction<AuthState['status']>) {
            state.status = payload
        },
    }
});


export const { updateProfile, updateStatus } = slice.actions;

export const getAuthState = createSelector((state: TState) => state, (state) => state.auth)

export default slice.reducer