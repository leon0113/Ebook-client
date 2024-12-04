import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { Book } from "epubjs";
import { FC } from "react";

interface Props {
    book?: Book;
    notes?: string[];
    onNoteClick?(path: string): void;
    isOpen?: boolean;
    onClose?(): void;
}

const NotesModal: FC<Props> = ({ isOpen, onClose }) => {
    return (
        <Modal size="full" isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader>Your Notes & Highlighted texts</ModalHeader>
                <ModalBody>
                    notes
                </ModalBody>
            </ModalContent>
        </Modal>
    )
};

export default NotesModal;
