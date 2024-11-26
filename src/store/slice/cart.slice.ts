import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TState } from "..";
import { ICartItemsInfo } from "../../context/CartProvider";
import { IBookDetails } from "../../pages/BookPage";

export type CartItem = {
    product: IBookDetails;
    quantity: number;
} | ICartItemsInfo

export interface CartState {
    id?: string;
    items: (CartItem | ICartItemsInfo)[]
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

export const getCartState = createSelector((state: TState) => state, ({ cart }) => {
    return {
        totalCount: cart.items.reduce((total, cartItem) => {
            total += cartItem.quantity
            return total;
        }, 0),
        subTotal: cart.items.reduce((total, cartItem) => {
            total += Number(cartItem.product.price.mrp) * cartItem.quantity
            return total;
        }, 0),
        totalPrice: cart.items.reduce((total, cartItem) => {
            total += Number(cartItem.product.price.sale) * cartItem.quantity
            return total;
        }, 0),
        ...cart
    }
});

export const { updateCartId, updateCartItem, updateCartState } = slice.actions;

export default slice.reducer;