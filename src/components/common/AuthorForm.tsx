import { Button, Input } from "@nextui-org/react";
import { FC, useCallback, useEffect, useState } from "react";
import { MdDeleteOutline, MdOutlineAdd } from "react-icons/md";
import { z } from "zod";
import useAuth from "../../hooks/useAuth";
import { parseError } from "../../utils/helper";
import RichEditor from "../rich-editor";
import ErrorList from "./ErrorList";

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
    socialLinks: Array<{
        id: string;
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

    const updateInitialSocialLinks = useCallback(() => {
        if (initialState) {
            const formattedLinks = initialState.socialLinks.map((link) => ({
                id: Number(link.id),
                value: link.value,
            }));
            setSocialLinks(formattedLinks);
        }
    }, [initialState]);



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
                // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
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
    }, [initialState, updateInitialSocialLinks]);

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