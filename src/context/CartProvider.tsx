import { createContext, FC, ReactNode } from "react";
import { useSelector } from "react-redux";
import { TState } from "../store";
import { CartItem } from "../store/slice/cart.slice";

interface Props {
    children: ReactNode;
}

interface ICartContext {
    id?: string;
    items: CartItem[]
}

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext<ICartContext>({
    items: []
})

const CartProvider: FC<Props> = ({ children }) => {

    const cart = useSelector((state: TState) => state.cart)

    return <CartContext.Provider value={{ items: cart.items }}>
        {children}
    </CartContext.Provider>
}

export default CartProvider