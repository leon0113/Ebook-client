import { Divider } from "@nextui-org/react";
import { FC, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import client from "../api/client";
import SkePayments from "../components/skeletons/SkePayments";
import { formatPrice, parseError } from "../utils/helper";

interface IPaymentRes {
    orders: {
        cover: string;
        id: string;
        price: string;
        quantity: number;
        slug: string;
        title: string;
        totalPrice: string;
    }[],
    totalAmount: string
}

const PaymentSuccess: FC = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState<IPaymentRes>();

    useEffect(() => {
        if (!sessionId) return;

        const fetchOrderDetails = async () => {
            try {
                const { data } = await client.post('/order/success', { sessionId });
                setOrder(data);
            } catch (error) {
                parseError(error)
            } finally {
                setLoading(false);
            }
        };
        fetchOrderDetails();
    }, [sessionId])

    if (loading) return <SkePayments />

    return (
        <div className="p-5 lg:p-0">
            <h1 className="font-bold text-2xl mt-10 text-center">Congrats!!! Your Order is <span className="text-green-500">Successful</span>. 🤩</h1>
            <div className="p-5 mt-10 flex flex-col items-center">
                {
                    order?.orders.map((item) => {
                        return <div key={item.id} className="w-96">
                            <div className="flex gap-3">
                                <img
                                    src={item.cover}
                                    alt={item.title}
                                    className="w-28 h-40 rounded object-cover"
                                />
                                <div className="p-3 flex-1">
                                    <Link className="line-clamp-1 font-bold text-xl underline hover:text-slate-700" to={`/book/${item.slug}`}>
                                        {item.title}
                                    </Link>
                                    <p>{formatPrice(Number(item.price))}</p>
                                    <p>Qty: {item.quantity}</p>
                                </div>
                            </div>

                            <Divider className="my-5" />

                        </div>
                    })
                }

                <div className="w-96 flex gap-2 items-center justify-between font-semibold">
                    <p>Total Amount:</p>
                    <p>{formatPrice(Number(order?.totalAmount))}</p>
                </div>
                <Link to='/orders' className="mt-10 underline italic text-sky-700">Go to orders</Link>
            </div>


        </div>
    )
}

export default PaymentSuccess