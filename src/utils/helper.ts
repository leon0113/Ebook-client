import { AxiosError } from "axios";
import toast from "react-hot-toast";

interface ApiError {
    error?: string;
    message?: string;
    errors?: Record<string, string[]>
}

export const parseError = (error: unknown) => {
    if (error instanceof AxiosError) {
        const data = error.response?.data as ApiError;
        if (data.errors) {
            // this means it's an array of objects with error
            const messages = Object.values(data.errors).flat();
            return messages.map((msg) => {
                toast(msg)
            })
        }

        if (data.error) {
            // this means it's a single error message
            return toast(data.error)
        }
        if (data.message) {
            // this means it's a single error message
            return toast(data.message)
        }
    };

    if (error instanceof Error) {
        return toast(error.message)
    };

    toast('Something went wrong!')
};


export const calDiscount = (price: { mrp: string; sale: string }) => {
    const { mrp, sale } = price;
    const mrpNum = Number(mrp);
    const saleNum = Number(sale);

    return Math.round(((mrpNum - saleNum) / mrpNum) * 100)
};


export const formatPrice = (amount: number) => {
    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    });

    return formatter.format(amount);
};
