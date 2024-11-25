import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from './slice/auth.slice'
import cartReducer from './slice/cart.slice'

const reducer = combineReducers({
    auth: authReducer,
    cart: cartReducer
})

const store = configureStore({ reducer });

export type TState = ReturnType<typeof store.getState>

export default store;