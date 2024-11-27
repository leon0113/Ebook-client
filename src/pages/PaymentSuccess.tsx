import { FC, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { parseError } from "../utils/helper";
import client from "../api/client";
import Loading from "../components/common/Loading";

const PaymentSuccess: FC = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!sessionId) return;

        const fetchOrderDetails = async () => {
            try {
                const { data } = await client.post('/order/success', { sessionId });
                console.log(data);
            } catch (error) {
                parseError(error)
            } finally {
                setLoading(false);
            }
        };
        fetchOrderDetails();
    }, [sessionId])

    if (loading) <Loading />

    return (
        <div>

        </div>
    )
}

export default PaymentSuccess