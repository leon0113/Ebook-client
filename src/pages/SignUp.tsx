import { Button, Input } from "@nextui-org/react";
import { FC, FormEventHandler, useState } from "react";
import client from "../api/client";
import { RiMailCheckLine } from "react-icons/ri";

const emailRegex = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$");

const SignUp: FC = () => {

    const [email, setEmail] = useState('');
    const [invalidForm, setInvalidForm] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showSuccessResponse, setShowSuccessResponse] = useState(false);

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        if (!emailRegex.test(email)) {
            return setInvalidForm(true)
        }
        setInvalidForm(false);
        setLoading(true);
        try {
            await client.post('/auth/generate-link', {
                email
            });
            setShowSuccessResponse(true);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            setErrorMessage(error.response.data.err.email[0]);
        } finally {
            setLoading(false);
        }

    };

    if (showSuccessResponse) return <div className="flex-1 flex flex-col justify-center items-center">
        <RiMailCheckLine size={80} className="animate-bounce text-green-500" />
        <p className="text-lg font-semibold">Please check your email for the magic link</p>
    </div>

    return (
        <div className="flex-1 flex items-center justify-center">
            <div className=" flex flex-col items-center justify-center w-96 border-2 p-5 rounded-md">

                <img src="https://images.unsplash.com/photo-1519791883288-dc8bd696e667?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="book image" className="w-full h-44" />
                <h1 className="text-center text-xl font-semibold">Books open doors to knowledge, imagination, and endless possibilities.</h1>
                <p className="text-center text-sm text-slate-400 mt-2">Unlock your potential with this password less signup</p>

                <form className="w-full space-y-6 mt-6" onSubmit={handleSubmit}>

                    <Input
                        label="Email"
                        placeholder="your.name@gmail.com"
                        variant="bordered"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        isInvalid={invalidForm}
                        errorMessage='Invalid email address'
                    />

                    <Button isLoading={loading} type="submit" className="w-full">
                        Send the link!
                    </Button>
                </form>
                <div>
                    {errorMessage && <p className="text-red-500 text-sm mt-2">Something wrong with your mail. Check again!</p>}
                </div>
            </div>
        </div>
    )
}

export default SignUp


