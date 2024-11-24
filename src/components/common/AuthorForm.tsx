import { Button, Input } from "@nextui-org/react";
import { FC, useEffect, useState } from "react";
import { MdDelete, MdDeleteOutline, MdOutlineAdd } from "react-icons/md";
import useAuth from "../../hooks/useAuth";
import RichEditor from "../rich-editor";
import { z } from "zod";
import ErrorList from "./ErrorList";
import { parseError } from "../../utils/helper";

export interface IAuthorInfo {
    name: string;
    about: string;
    socialLinks: Array<{
        id: number;
        value: string;
    } | undefined>;
}

export interface InitialState {
    id: string;
    name: string;
    about: string;
    socials: Array<{
        id: number;
        value: string;
    }>;
    books: string;
}



interface Props {
    btnTitle: string;
    onSubmit(data: IAuthorInfo): Promise<void>;
    initialState?: InitialState
};


const newAuthorSchema = z.object({
    name: z.string({
        required_error: "Name is missing!",
        invalid_type_error: "Invalid name"
    }).trim().min(3, "Too short name"),
    about: z.string({
        required_error: "About is missing!",
        invalid_type_error: "Invalid about"
    }).trim().min(100, "Please write at least 100 characters about yourself"),
    socialLinks: z.array(z.object({
        id: z.number(),
        value: z
            .string()
            .url("Provide a valid URL"),
    }).optional())
});

const AuthorForm: FC<Props> = ({ btnTitle, onSubmit, initialState }) => {

    const [socialLinks, setSocialLinks] = useState([{ id: Date.now(), value: "" }]);
    const [about, setAbout] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string[] }>();
    const [loading, setLoading] = useState(false);
    const { profile } = useAuth();

    const addLinksFields = () => {
        setSocialLinks([...socialLinks, { id: Date.now(), value: "" }]);
    };

    const deleteLinksFields = (id: number) => {
        setSocialLinks(socialLinks.filter((link) => link.id !== id));
    };

    const updateSocialLinks = (id: number, value: string) => {
        setSocialLinks(
            socialLinks.map((link) =>
                link.id === id ? { ...link, value } : link
            )
        );
    };

    const updateInitialSocialLinks = () => {
        if (initialState) {
            const formattedLinks = initialState.socials.map((link) => ({
                id: Number(link.id),
                value: link.value,
            }));
            setSocialLinks(formattedLinks);
        }
    };



    const handleSubmit = async () => {

        try {
            setLoading(true);
            const links: IAuthorInfo['socialLinks'] = [];

            socialLinks.forEach((link) => {
                if (link.value.length > 0) {
                    links.push(link)
                }
            })

            const data = {
                name: profile?.name!,
                about,
                socialLinks: links
            };

            const result = newAuthorSchema.safeParse(data);

            if (!result.success) {
                return setErrors(result.error.flatten().fieldErrors)
            }
            await onSubmit(data);
        } catch (error) {
            parseError(error)
        } finally {
            setLoading(false)
        }
    };


    useEffect(() => {
        if (initialState) {
            setAbout(initialState.about)
            updateInitialSocialLinks();
        }
    }, [initialState]);

    return (
        <div className="p-4 space-y-6">
            <p>
                Name: <span className="font-semibold text-lg">{profile?.name}</span>
            </p>

            <RichEditor
                value={about}
                onChange={(value) => setAbout(value)}
                editable
                placeholder="Tell readers about yourself..............."
                isInvalid={errors?.about ? true : false}
                errorMessage={<ErrorList errors={errors?.about} />}
            />

            <div className="flex flex-col space-y-3">
                <p className="text-sm font-semibold">Social Links:</p>
                <ErrorList errors={errors?.socialLinks} />
                {
                    socialLinks && socialLinks.map((link) => {
                        return <div
                            key={link.id}
                            className="flex gap-1"
                        >
                            <Input
                                placeholder="https://x.com/@username"
                                onChange={(e) => updateSocialLinks(link.id, e.target.value)}
                                value={link.value}
                            />
                            {
                                socialLinks.length > 1 && (
                                    <Button onClick={() => deleteLinksFields(link.id)} isIconOnly>
                                        <MdDeleteOutline className="text-red-400" />
                                    </Button>
                                )
                            }
                        </div>
                    })
                }

                <div className="flex justify-center">
                    <Button onClick={addLinksFields} isIconOnly>
                        <MdOutlineAdd className="text-green-600" />
                    </Button>
                </div>
            </div>
            <Button
                isLoading={loading}
                onClick={handleSubmit}
            >
                {btnTitle}
            </Button>
        </div>
    )
}

export default AuthorForm;