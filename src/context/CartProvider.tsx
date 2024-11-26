import { createContext, FC, ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TState } from "../store";
import { CartItem, updateCartItem } from "../store/slice/cart.slice";

interface Props {
    children: ReactNode;
}

interface ICartContext {
    id?: string;
    items: CartItem[];
    updateCart(item: CartItem): void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext<ICartContext>({
    items: [],
    updateCart() { }
})

const CartProvider: FC<Props> = ({ children }) => {

    const cart = useSelector((state: TState) => state.cart);
    const dispatch = useDispatch();

    const updateCart = (item: CartItem) => {
        // update the UI
        dispatch(updateCartItem(item))
        // update the server

    }

    return <CartContext.Provider value={{ items: cart.items, updateCart }}>
        {children}
    </CartContext.Provider>
}

export default CartProvider