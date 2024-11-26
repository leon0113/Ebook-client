import { Button, Chip, Divider } from "@nextui-org/react";
import { FC } from "react";
import { FaMinus, FaPlus, FaRegTrashCan } from "react-icons/fa6";
import SkeCart from "../components/skeletons/SkeCart";
import useCart from "../hooks/useCart";
import { calDiscount, formatPrice } from "../utils/helper";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";

const Cart: FC = () => {
    const { items, fetching, loading, subTotal, totalPrice, updateCart, totalCount, clearCart } = useCart();


    if (fetching) return <SkeCart />

    if (totalCount === 0) return (
        <div className="p-5 lg:p-0">
            <h1 className="text-xl mb-6 font-semibold">Your Shopping Cart</h1>
            <div className="p-5 text-center">
                <h1 className="text-3xl opacity-70 mb-6 font-semibold">You're Cart is Empty! 😪</h1>
            </div>
        </div>
    )

    return (
        <div className="p-5 lg:p-0">
            <div className="flex justify-between items-center">
                <h1 className="text-xl mb-6 font-semibold">Your Shopping Cart</h1>
                <Button variant="ghost" className="underline border-none" onClick={clearCart}>Clear Cart</Button>
            </div>
            <div className="space-y-6">
                {
                    items.map(({ product, quantity }) => {
                        return <div key={product.id} className="flex">

                            <img src={product.cover || "https://unifirst.com/wp-content/plugins/unifirst-elementor-addons/assets/images/placeholder.jpg"} alt="Product-photo"
                                className="w-28 h-[185px] object-cover rounded"
                            />

                            <div className="md:grid grid-cols-6 flex flex-col">
                                <div className="p-5 col-span-5">
                                    <h1 className="font-semibold">{product.title}</h1>
                                    <div className="flex gap-2">

                                        <Chip color="danger">{calDiscount(product.price)}% Off</Chip>
                                        <p className="line-through">{formatPrice(Number(product.price.mrp))}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <p className="font-bold">{formatPrice(Number(product.price.sale))}</p>
                                        <span>X {quantity}</span>
                                    </div>
                                </div>

                                <div className="col-span-1 flex justify-end gap-2 items-end p-5 md:p-0">
                                    <Button
                                        isIconOnly
                                        variant="solid"
                                        size="sm"
                                        onClick={() => updateCart({ product, quantity: -1 })}
                                        isLoading={loading}
                                    >
                                        <FaMinus />
                                    </Button>

                                    <Chip radius="sm" variant="bordered">{quantity}</Chip>

                                    <Button
                                        isIconOnly
                                        variant="solid"
                                        size="sm"
                                        onClick={() => updateCart({ product, quantity: 1 })}
                                        isLoading={loading}
                                    >
                                        <FaPlus />
                                    </Button>
                                    <Button
                                        isIconOnly
                                        variant="solid"
                                        size="sm"
                                        onClick={() => updateCart({ product, quantity: -quantity })}
                                        isLoading={loading}
                                    >
                                        <FaRegTrashCan />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    })
                }
            </div>

            <Divider className="my-6" />

            <div className="md:block flex justify-between items-end">
                <div className="text-right space-y-1">
                    <h3 className="font-bold text-xl">Cart Total</h3>
                    <Divider />
                    <p className="line-through italic">{formatPrice(subTotal)}</p>
                    <p className="font-semibold text-xl">{formatPrice(totalPrice)}</p>
                </div>

                <div className="text-right md:mt-3">
                    <Button color="danger" radius="sm" size="lg" isLoading={loading} startContent={<MdOutlineShoppingCartCheckout size={18} />}>
                        Checkout
                    </Button>

                    <div className="mt-3">
                        <Chip size="sm">
                            <p>You're saving total <span className="font-semibold">{calDiscount({ mrp: subTotal.toString(), sale: totalPrice.toString() })}%</span></p>
                        </Chip>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart;