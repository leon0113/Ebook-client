import { Spinner } from "@nextui-org/react";

export default function Loading() {
    return (
        <div className="h-screen flex items-center justify-center p-10">
            <Spinner label="Verifying..." color="success" size="lg" />
        </div>
    )
}
