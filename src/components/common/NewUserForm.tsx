import { Avatar, Button, Input } from "@nextui-org/react";
import { ChangeEventHandler, FC, FormEventHandler, useState } from "react";
import { parseError } from "../../utils/helper";

interface INewUserForm {
    name?: string;
    avatar?: string;
    onSubmit(data: FormData): Promise<void>;
    title: string;
    btnTitle: string;
}

type newUserInfo = {
    name: string;
    avatar?: File
}

const NewUserForm: FC<INewUserForm> = ({ name, avatar, onSubmit, title, btnTitle }) => {

    const [userInfo, setUserInfo] = useState<newUserInfo>({ name: '' });
    const [localAvatar, setLocalAvatar] = useState('');
    const [invalidForm, setInvalidForm] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
        const { name, value, files } = target;

        if (name === 'name') {
            setUserInfo({ ...userInfo, name: value })
        };

        if (name === 'avatar' && files) {
            const file = files[0]
            setUserInfo({ ...userInfo, avatar: file });
            setLocalAvatar(URL.createObjectURL(file));
        }
    };

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        if (userInfo.name.trim().length < 3) {
            return setInvalidForm(true);
        } else {
            setInvalidForm(false)
        }

        formData.append("name", userInfo.name);

        if (userInfo.avatar?.type.startsWith("image")) {
            formData.append("avatar", userInfo.avatar);
        }
        setLoading(true);
        try {
            await onSubmit(formData);
        } catch (error) {
            parseError(error);
        } finally {
            setLoading(false);
        }

    }



    return (
        <div className="flex-1 flex justify-center items-center">
            <div className="w-96 border-2 p-5 rounded-md flex flex-col justify-center items-center">
                <h1 className="text-center text-xl font-semibold">{title}</h1>
                <form onSubmit={handleSubmit} className="w-full space-y-6 mt-6">
                    <label htmlFor="avatar" className="cursor-pointer flex justify-center items-center">
                        <Avatar
                            isBordered
                            radius="sm"
                            name={userInfo.name || name}
                            src={localAvatar || avatar}
                        />
                        <input
                            accept="image/*"
                            hidden
                            type="file"
                            name="avatar"
                            id="avatar"
                            onChange={handleChange}
                        />

                    </label>

                    <Input
                        type="text"
                        label="Full name"
                        name="name"
                        placeholder="Enter your full name"
                        variant="bordered"
                        value={userInfo.name || name}
                        onChange={handleChange}
                        isInvalid={invalidForm}
                        errorMessage='Name must be 3 character long'
                    />
                    <Button isLoading={loading} type='submit' className="w-full">{btnTitle}</Button>
                </form>
            </div>
        </div>
    )
};

export default NewUserForm;