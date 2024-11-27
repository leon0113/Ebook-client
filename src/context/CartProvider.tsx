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
    clearCart(): void;
    loading: boolean;
    fetching: boolean;
    totalCount: number;
    subTotal: number;
    totalPrice: number;
}

export interface ICartItemsInfo {
    product: {
        id: string;
        title: string;
        cover?: string;
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
};

const updateLocalStorage = (cartItems: CartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(cartItems))
};

let startLSUpdate = false;

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext<ICartContext>({
    items: [],
    updateCart() { },
    clearCart() { },
    loading: false,
    fetching: true,
    totalCount: 0,
    subTotal: 0,
    totalPrice: 0
})

const CartProvider: FC<Props> = ({ children }) => {

    const cart = useSelector(getCartState);
    const dispatch = useDispatch();
    const { profile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const updateCart = (item: CartItem) => {
        startLSUpdate = true;
        // update the UI
        dispatch(updateCartItem(item))
        // update the server if user is authenticated
        if (profile) {
            setLoading(true);
            client.post('/cart', {
                items: [{ product: item.product.id, quantity: item.quantity }]
            }).then(({ data }) => {
                toast.success("Product cart updated!");
                dispatch(updateCartId(data.cart))
            }).catch((err) => {
                parseError(err)
            }).finally(() => {
                setLoading(false);
            })

        }

    };


    const clearCart = () => {
        // update the UI
        dispatch(updateCartState({ id: '', items: [] }))
        // update the server if user is authenticated
        if (profile) {
            setLoading(true);
            client.post('/cart/clear').then(() => {
                toast.success("Cart is cleared");

            }).catch((err) => {
                parseError(err)
            }).finally(() => {
                setLoading(false);
            })

        }

    };


    useEffect(() => {
        const fetchCartInfo = async () => {

            if (!profile) {
                const result = localStorage.getItem("cart");
                if (result) {
                    dispatch(updateCartState({ items: JSON.parse(result) }))
                }

                return setFetching(false);
            }

            try {
                const { data } = await client.get<ICartInfo>('/cart');
                dispatch(updateCartState({ id: data.cart.id, items: data.cart.items }))
            } catch (error) {
                parseError(error)
            } finally {
                setFetching(false);
            }
        };

        fetchCartInfo();
    }, []);


    useEffect(() => {
        if (startLSUpdate && !profile) {
            updateLocalStorage(cart.items)
        }
    }, [cart.items, profile])

    return <CartContext.Provider value={{ items: cart.items, loading, updateCart, totalCount: cart.totalCount, fetching, subTotal: cart.subTotal, totalPrice: cart.totalPrice, clearCart, id: cart.id }}>
        {children}
    </CartContext.Provider>
}

export default CartProvider