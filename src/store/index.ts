import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from './slice/auth.slice'

const reducer = combineReducers({
    auth: authReducer
})

const store = configureStore({ reducer });

export type TState = ReturnType<typeof store.getState>

export default store;