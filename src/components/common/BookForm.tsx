import { Autocomplete, AutocompleteItem, Button, DatePicker, Input } from "@nextui-org/react";
import { ChangeEventHandler, FC, FormEventHandler, useEffect, useState } from "react";
import { genreList, genres, languageList, languages } from "../../utils/data";
import PosterSelector from "../PosterSelector";
import RichEditor from "../rich-editor";
import { parseDate } from "@internationalized/date";
import { z } from "zod";
import ErrorList from "./ErrorList";
import clsx from "clsx";
import { parseError } from "../../utils/helper";
import toast from "react-hot-toast";

export interface InitialBookToUpdate {
    id: string;
    slug: string;
    title: string;
    description: string;
    genre: string;
    language: string;
    cover?: string;
    price: { mrp: string; sale: string };
    publicationName: string;
    publishedAt: string;
}

interface Props {
    title: string;
    submitBtnTitle: string;
    initialState?: InitialBookToUpdate;
    onSubmit(formData: FormData): Promise<void>
}

interface DefaultForm {
    file?: File | null;
    cover?: File;
    title: string;
    description: string;
    publicationName: string;
    publishedAt?: string;
    genre: string;
    language: string;
    mrp: string;
    sale: string;
}

const defaultBookInfo = {
    title: "",
    description: "",
    language: "",
    genre: "",
    mrp: "",
    publicationName: "",
    sale: "",
};

interface ICreateBook {
    title: string;
    description: string;
    language: string;
    publishedAt?: string;
    publicationName: string;
    genre: string;
    price: {
        mrp: number;
        sale: number;
    };
    fileInfo: {
        type: string;
        name: string;
        size: number;
    };
};

interface IUpdateBook {
    title: string;
    description: string;
    language: string;
    publishedAt?: string;
    publicationName: string;
    genre: string;
    slug: string,
    price: {
        mrp: number;
        sale: number;
    };
    fileInfo?: {
        type: string;
        name: string;
        size: number;
    };
};


const commonBookSchema = {
    title: z.string().trim().min(5, "Title is too short!"),
    description: z.string().trim().min(5, "Description is too short!"),
    genre: z.enum(genreList, { message: "Please select a genre!" }),
    language: z.enum(languageList, { message: "Please select a language!" }),
    publicationName: z
        .string({ required_error: "Invalid publication name!" })
        .trim()
        .min(3, "Publication name is too short!"),
    publishedAt: z.string({ required_error: "Publish date is missing!" }).trim(),
    price: z
        .object({
            mrp: z
                .number({ required_error: "MRP is missing!" })
                .refine((val) => val > 0, "MRP is missing!"),
            sale: z
                .number({ required_error: "Sale price is missing!" })
                .refine((val) => val > 0, "Sale price is missing!"),
        })
        .refine((price) => price.sale <= price.mrp, "Invalid sale price!"),
};

const fileInfoSchema = z.object({
    name: z
        .string({ required_error: "File name is missing!" })
        .min(1, "File name is missing!"),
    type: z
        .string({ required_error: "File type is missing!" })
        .min(1, "File type is missing!"),
    size: z
        .number({ required_error: "File size is missing!" })
        .refine((val) => val > 0, "Invalid file size!"),
});

const newBookSchema = z.object({
    ...commonBookSchema,
    fileInfo: fileInfoSchema,
});
const updateBookSchema = z.object({
    ...commonBookSchema,
    fileInfo: fileInfoSchema.optional(),
});


const BookForm: FC<Props> = ({ title, submitBtnTitle, onSubmit, initialState }) => {

    const [bookInfo, setBookInfo] = useState<DefaultForm>(defaultBookInfo);
    const [cover, setCover] = useState("");
    const [isUpdate, setIsUpdate] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string[] | undefined }>();
    const [busy, setBusy] = useState(false);


    const handleTextChange: ChangeEventHandler<HTMLInputElement> = ({
        target,
    }) => {
        const { value, name } = target;
        // console.log(name, value);
        setBookInfo({ ...bookInfo, [name]: value });
    };

    const handleFileChange: ChangeEventHandler<HTMLInputElement> = ({
        target,
    }) => {
        const { files, name } = target;

        if (!files) return;

        const file = files[0];

        if (name === "cover" && file?.size) {
            try {
                setCover(URL.createObjectURL(file));
            } catch (error) {
                parseError(error);
                setCover("");
            }
        }

        setBookInfo({ ...bookInfo, [name]: file });
    };

    const handleBookCreate = async () => {
        setBusy(true);
        try {
            const formData = new FormData();
            const { file, cover } = bookInfo;

            // validate book file (must be epub type)
            if (file?.type !== 'application/epub+zip') {
                return setErrors({ ...errors, file: ["Please select a valid (.epub) file "] })
            } else {
                setErrors({ ...errors, file: undefined })
            }

            if (file) {
                formData.append("book", file);
            }

            // validate cover image (must be a image)
            if (cover && !cover.type.startsWith("image/")) {
                return setErrors({ ...errors, cover: ["Please select a valid image"] })
            } else {
                setErrors({ ...errors, cover: undefined })
            }

            if (cover) {
                formData.append("cover", cover)
            };

            // validate data for create book
            const bookToUpload: ICreateBook = {
                title: bookInfo.title,
                description: bookInfo.description,
                genre: bookInfo.genre,
                language: bookInfo.language,
                publicationName: bookInfo.publicationName,
                publishedAt: bookInfo.publishedAt,
                price: {
                    mrp: Number(bookInfo.mrp),
                    sale: Number(bookInfo.sale),
                },
                fileInfo: {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                },
            }

            const result = newBookSchema.safeParse(bookToUpload);
            if (!result.success) {
                return setErrors(result.error.flatten().fieldErrors);
            };

            for (const key in bookToUpload) {
                type keyType = keyof typeof bookToUpload;
                const value = bookToUpload[key as keyType];

                if (typeof value === "string") {
                    formData.append(key, value);
                }

                if (typeof value === "object") {
                    formData.append(key, JSON.stringify(value));
                }
            }

            await onSubmit(formData);
            toast('Book uploaded successfully', { duration: 3000 })
            setBookInfo({ ...defaultBookInfo, description: '', language: '', genre: '', file: null });
            setCover('');
            // window.location.reload();

        } catch (error) {
            parseError(error);
        } finally {
            setBusy(false);
        }

    };

    useEffect(() => {
        if (initialState) {
            setIsUpdate(true);

            const {
                title,
                description,
                language,
                genre,
                publicationName,
                publishedAt,
                price,
                cover,
            } = initialState;

            setBookInfo({
                title,
                description,
                language,
                genre,
                publicationName,
                publishedAt,
                mrp: price.mrp,
                sale: price.sale,
            });

            if (cover) setCover(cover);
        }
    }, [initialState])

    const handleBookUpdate = async () => {
        setBusy(true);
        try {
            const formData = new FormData();
            const { file, cover } = bookInfo;

            // validate book file (must be epub type)
            if (file && file?.type !== 'application/epub+zip') {
                return setErrors({ ...errors, file: ["Please select a valid (.epub) file "] })
            } else {
                setErrors({ ...errors, file: undefined })
            }

            if (file) {
                formData.append("book", file);
            }

            // validate cover image (must be a image)
            if (cover && !cover.type.startsWith("image/")) {
                return setErrors({ ...errors, cover: ["Please select a valid image"] })
            } else {
                setErrors({ ...errors, cover: undefined })
            }

            if (cover) {
                formData.append("cover", cover)
            };

            // validate data for create book
            const bookToUpload: IUpdateBook = {
                title: bookInfo.title,
                description: bookInfo.description,
                genre: bookInfo.genre,
                language: bookInfo.language,
                publicationName: bookInfo.publicationName,
                publishedAt: bookInfo.publishedAt,
                // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                slug: initialState?.slug!,
                price: {
                    mrp: Number(bookInfo.mrp),
                    sale: Number(bookInfo.sale),
                },
            };

            if (file) {
                bookToUpload.fileInfo = {
                    name: file?.name,
                    size: file.size,
                    type: file.type,
                }
            }

            const result = updateBookSchema.safeParse(bookToUpload);
            if (!result.success) {
                return setErrors(result.error.flatten().fieldErrors);
            };

            for (const key in bookToUpload) {
                type keyType = keyof typeof bookToUpload;
                const value = bookToUpload[key as keyType];

                if (typeof value === "string") {
                    formData.append(key, value);
                }

                if (typeof value === "object") {
                    formData.append(key, JSON.stringify(value));
                }
            }

            await onSubmit(formData);
            setBookInfo({ ...defaultBookInfo, description: '', language: '', genre: '', file: null });
            setCover('');
            // window.location.reload();

        } catch (error) {
            parseError(error);
        } finally {
            setBusy(false);
        }
    };

    const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        if (isUpdate) {
            handleBookUpdate();
        } else {
            handleBookCreate();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-10 space-y-6">
            <h1 className="pb-6 font-semibold text-2xl w-full">{title}</h1>

            <div>
                <label className={clsx(errors?.file && 'text-red-500')} htmlFor="file">
                    <span>Select File: </span>
                    <input
                        accept="application/epub+zip"
                        type="file"
                        name="file"
                        id="file"
                        onChange={handleFileChange}
                    />
                </label>
                <ErrorList errors={errors?.file} />
            </div>

            <PosterSelector
                src={cover}
                name="cover"
                isInvalid={errors?.cover ? true : false}
                fileName={bookInfo.cover?.name}
                errorMessage={<ErrorList errors={errors?.cover} />}
                onChange={handleFileChange}
            />

            <Input
                type="text"
                name="title"
                isRequired
                label="Book Title"
                placeholder="Think & Grow Rich"
                value={bookInfo.title}
                onChange={handleTextChange}
                isInvalid={errors?.title ? true : false}
                errorMessage={<ErrorList errors={errors?.title} />}
            />

            <RichEditor
                placeholder="About Book..."
                value={bookInfo.description}
                editable
                onChange={(des) => setBookInfo({ ...bookInfo, description: des })}
                isInvalid={errors?.description ? true : false}
                errorMessage={<ErrorList errors={errors?.description} />}
            />

            <Input
                name="publicationName"
                type="text"
                label="Publication Name"
                isRequired
                placeholder="Penguin Book"
                value={bookInfo.publicationName}
                onChange={handleTextChange}
                isInvalid={errors?.publicationName ? true : false}
                errorMessage={<ErrorList errors={errors?.publicationName} />}
            />

            <DatePicker
                onChange={(date) => {
                    setBookInfo({ ...bookInfo, publishedAt: date.toString() });
                }}
                value={bookInfo.publishedAt ? parseDate(bookInfo.publishedAt) : null}
                label="Publish Date"
                showMonthAndYearPickers
                isRequired
                isInvalid={errors?.publishedAt ? true : false}
                errorMessage={<ErrorList errors={errors?.publishedAt} />}
            />


            <Autocomplete
                label="Language"
                placeholder="Select a Language"
                defaultSelectedKey={bookInfo.language}
                selectedKey={bookInfo.language}
                onSelectionChange={(key = '') => {
                    setBookInfo({ ...bookInfo, language: key as string })
                }}
                isRequired
                isInvalid={errors?.language ? true : false}
                errorMessage={<ErrorList errors={errors?.language} />}
            >
                {languages.map((item) => {
                    return (
                        <AutocompleteItem value={item.name} key={item.name}>
                            {item.name}
                        </AutocompleteItem>
                    );
                })}
            </Autocomplete>

            <Autocomplete
                label="Genre"
                placeholder="Select a Genre"
                defaultSelectedKey={bookInfo.genre}
                selectedKey={bookInfo.genre}
                onSelectionChange={(key = '') => {
                    setBookInfo({ ...bookInfo, genre: key as string })
                }}
                isInvalid={errors?.genre ? true : false}
                errorMessage={<ErrorList errors={errors?.genre} />}
                isRequired
            >
                {genres.map((item) => {
                    return (
                        <AutocompleteItem value={item.name} key={item.name}>
                            {item.name}
                        </AutocompleteItem>
                    );
                })}
            </Autocomplete>
            <div>
                <div className="bg-default-100 rounded-md py-2 px-3">
                    <p className={clsx("text-xs pl-3", errors?.price && "text-red-400")}>
                        Price*
                    </p>

                    <div className="flex space-x-6 mt-2">
                        <Input
                            name="mrp"
                            type="number"
                            label="MRP"
                            isRequired
                            placeholder="0.00"
                            value={bookInfo.mrp}
                            onChange={handleTextChange}
                            startContent={
                                <div className="pointer-events-none flex items-center">
                                    <span className="text-default-400 text-small">$</span>
                                </div>
                            }
                            isInvalid={errors?.price ? true : false}
                        />
                        <Input
                            name="sale"
                            type="number"
                            label="Sale Price"
                            isRequired
                            placeholder="0.00"
                            value={bookInfo.sale}
                            onChange={handleTextChange}
                            startContent={
                                <div className="pointer-events-none flex items-center">
                                    <span className="text-default-400 text-small">$</span>
                                </div>
                            }
                            isInvalid={errors?.price ? true : false}
                        />
                    </div>
                </div>
                <div className="p-2">
                    <ErrorList errors={errors?.price} />
                </div>
            </div>
            <Button isLoading={busy} type="submit" className="w-full">{submitBtnTitle}</Button>
        </form>
    );
};

export default BookForm;