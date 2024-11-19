import { Avatar, Button, Input } from "@nextui-org/react";
import { FC } from "react";

const NewUser: FC = () => {
    return (
        <div className="flex-1 flex justify-center items-center">
            <div className="w-96 border-2 p-5 rounded-md flex flex-col justify-center items-center">
                <h1 className="text-center text-xl font-semibold">You're almost there, Please fill out the form below</h1>
                <form className="w-full space-y-6 mt-6">
                    <label htmlFor="avatar" className="cursor-pointer flex justify-center items-center">
                        <Avatar
                            isBordered
                            radius="sm"
                            name="Dp"
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTL_JlCFnIGX5omgjEjgV9F3sBRq14eTERK9w&s"
                        />

                        <input
                            accept="image/*"
                            hidden
                            type="file"
                            name="avatar"
                            id="avatar" />
                    </label>

                    <Input
                        type="text"
                        label="Full name"
                        placeholder="Enter your full name"
                        variant="bordered"
                    />
                    <Button type='submit' className="w-full">Sign Me Up! </Button>
                </form>
            </div>
        </div>
    )
};

export default NewUser;