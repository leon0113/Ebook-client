/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Card, CardBody, Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { Book } from "epubjs";
import { FC, useEffect, useState } from "react";

interface Props {
    book?: Book;
    notes?: string[];
    onNoteClick?(path: string): void;
    isOpen?: boolean;
    onClose?(): void;
}

const NotesModal: FC<Props> = ({ book, notes, onNoteClick, isOpen, onClose }) => {

    const [data, setData] = useState<{ note: string; cfi: string }[]>([]);

    useEffect(() => {
        if (!notes || !book) return;

        const fetchNotes = async () => {
            const newNotes = await Promise.all(
                notes.map(async (cfi) => {
                    const note = (await book.getRange(cfi)).toString();
                    return { note, cfi };
                })
            );
            setData(newNotes);
        };

        fetchNotes();
        // const newNotes = Promise.all(
        //     notes.map(async (cfi) => {
        //         const note = (await book.getRange(cfi)).toString();
        //         return { note, cfi };
        //     })
        // );

        // newNotes.then(setData);
    }, [notes, book])

    return (
        <Modal size="full" isOpen={isOpen} onClose={onClose}>
            <ModalContent className="flex flex-col gap-5 items-center justify-center">
                <ModalHeader>Your Notes & Highlighted texts</ModalHeader>
                <ModalBody>
                    {
                        data.map(item => {
                            return <Card key={item.cfi} className="max-w-2xl">
                                <CardBody
                                    className="cursor-pointer"
                                    onClick={() => {
                                        onNoteClick && onNoteClick(item.cfi)
                                        onClose && onClose();
                                    }}>
                                    <p className="line-clamp-3">{item.note}</p>
                                </CardBody>
                            </Card>
                        })
                    }
                </ModalBody>
            </ModalContent>
        </Modal>
    )
};

export default NotesModal;
