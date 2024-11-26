import { createContext, FC, ReactNode, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import client from "../api/client";
import useAuth from "../hooks/useAuth";
import { CartItem, getCartState, updateCartId, updateCartItem, updateCartState } from "../store/slice/cart.slice";
import { parseError } from "../utils/helper";

interface Props {
    children: ReactNode;
}

interface ICartContext {
    id?: string;
    items: (CartItem | ICartItemsInfo)[];
    updateCart(item: CartItem): void;
    loading: boolean;
    totalCount: number;
}

export interface ICartItemsInfo {
    product: {
        id: string;
        title: string;
        cover?: {
            url: string;
            id: string;
        };
        slug: string;
        price: {
            mrp: string;
            sale: string;
        };
    };
    quantity: number;
}

export interface ICartInfo {
    cart: {
        id: string;
        items: ICartItemsInfo[];
    };
}

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext<ICartContext>({
    items: [],
    updateCart() { },
    loading: false,
    totalCount: 0,
})

const CartProvider: FC<Props> = ({ children }) => {

    const cart = useSelector(getCartState);
    const dispatch = useDispatch();
    const { profile } = useAuth();
    const [loading, setLoading] = useState(false);

    const updateCart = (item: CartItem) => {
        // update the UI
        dispatch(updateCartItem(item))
        // update the server if user is authenticated
        if (profile) {
            setLoading(true);
            client.post('/cart', {
                items: [{ product: item.product.id, quantity: item.quantity }]
            }).then(({ data }) => {
                toast.success("Product added to cart!");
                dispatch(updateCartId(data.cart))
            }).catch((err) => {
                parseError(err)
            }).finally(() => {
                setLoading(false);
            })

        }

    };


    useEffect(() => {
        const fetchCartInfo = async () => {
            const { data } = await client.get<ICartInfo>('/cart');
            dispatch(updateCartState({ id: data.cart.id, items: data.cart.items }))

        };
        fetchCartInfo();
    }, [])

    return <CartContext.Provider value={{ items: cart.items, loading, updateCart, totalCount: cart.totalCount }}>
        {children}
    </CartContext.Provider>
}

export default CartProvider