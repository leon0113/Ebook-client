import { FC, useEffect, useState } from "react";
import client from "../api/client";
import { formatPrice, parseError } from "../utils/helper";
import SkeOrders from "../components/skeletons/SkeOrders";
import { Link } from "react-router-dom";
import { IoCloseOutline } from "react-icons/io5";
import { Chip, Divider } from "@nextui-org/react";
import dateFormat from 'dateformat'
import GenreTitle from "../components/common/GenreTitle";

interface IOrdersRes {
    id: string;
    stripeCustomerId?: string;
    paymentId?: string;
    totalAmount: string;
    paymentStatus?: string;
    date: Date;
    orderItems: {
        id?: string;
        title: string;
        cover?: string;
        slug: string;
        price: string;
        quantity: number;
        totalPrice: string;
    }[];
}

const Orders: FC = () => {
    const [loading, setLoading] = useState(true);
    const [userOrders, setUserOrders] = useState<IOrdersRes[]>([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await client.get('/order');
                setUserOrders(data.orders);
            } catch (error) {
                parseError(error)
            } finally {
                setLoading(false)
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <SkeOrders />

    return (
        <div className="p-5 lg:p-0">
            <h1 className="text-xl font-semibold my-10">My Orders</h1>
            {userOrders?.map((order) => {
                return (
                    <div key={order.id}>
                        <GenreTitle title={dateFormat(order.date, "mmmm d yyyy")} />
                        {order.orderItems.map((product) => {
                            return (
                                <div key={product.id}>
                                    <div className="flex p-5">
                                        <img
                                            src={product.cover}
                                            alt={product.title}
                                            className="w-24 rounded"
                                        />

                                        <div className="px-5">
                                            <Link
                                                to={`/book/${product.slug}`}
                                                className="text-lg font-bold underline"
                                            >
                                                {product.title}
                                            </Link>

                                            <div className="flex items-center space-x-0.5">
                                                <p className="font-semibold">
                                                    {formatPrice(Number(product.price))}
                                                </p>
                                                <IoCloseOutline />
                                                <p>{product.quantity} pcs</p>
                                            </div>

                                            <Chip color="danger" radius="sm" className="mt-2">
                                                {formatPrice(Number(product.totalPrice))}
                                            </Chip>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <Divider className="w-10/12" />
                                    </div>
                                </div>
                            );
                        })}

                        <div className="text-right space-y-1 py-6">
                            <p className="font-semibold text-xl">
                                Total Amount: {formatPrice(Number(order.totalAmount))}
                            </p>
                            <p>Payment Status: {order.paymentStatus?.toUpperCase()}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    )
}

export default Orders;