import { Button, Input } from "@nextui-org/react";
import { FC } from "react";

const SignUp: FC = () => {
    return (
        <div className="flex-1 flex items-center justify-center">
            <div className=" flex flex-col items-center justify-center w-96 border-2 p-5 rounded-md">
                <img src="https://images.unsplash.com/photo-1519791883288-dc8bd696e667?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="book image" className="w-full h-44" />
                <h1 className="text-center text-xl font-semibold">Books open doors to knowledge, imagination, and endless possibilities.</h1>
                <p className="text-center text-sm text-slate-400 mt-2">Unlock your potential with this password less signup</p>
                <form className="w-full space-y-6 mt-6">
                    <Input
                        type="email"
                        label="Email"
                        placeholder="your.name@gmail.com"
                        variant="bordered"
                    />
                    <Button type="submit" className="w-full">
                        Send the link!
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default SignUp


