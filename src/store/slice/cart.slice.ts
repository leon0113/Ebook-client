import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IBookDetails } from "../../pages/BookPage";

export interface CartItem {
    product: IBookDetails;
    quantity: number;
}

export interface CartState {
    id?: string;
    items: CartItem[]
};

const initialState: CartState = {
    items: [],
}

const slice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        updateCartId(state, { payload }: PayloadAction<string>) {
            state.id = payload;
        },
        updateCartState(state, { payload }: PayloadAction<CartState>) {
            state.id = payload.id;
            state.items = payload.items;
        },
        updateCartItem(state, { payload }: PayloadAction<CartItem>) {
            // Find the product is already in the cart or not
            const index = state.items.findIndex((item) => item.product.id === payload.product.id)
            if (index === -1) {
                // if not add the new product and its quantity in the cart
                state.items.push({ product: payload.product, quantity: payload.quantity });
            } else {
                // if yes update the product quantity
                state.items[index].quantity += payload.quantity
                // if quantity becomes 0 remove the product from the cart
                if (state.items[index].quantity <= 0) {
                    state.items.splice(index, 1)
                }
            }
        },
    }
});

export const { updateCartId, updateCartItem, updateCartState } = slice.actions;

export default slice.reducer;