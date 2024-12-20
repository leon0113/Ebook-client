import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
    User,
} from "@nextui-org/react";
import { FC } from "react";
import { Link } from "react-router-dom";
import { Profile } from "../../store/slice/auth.slice";

interface Props {
    profile: Profile;
    signOut(): void;
}

interface LinkProps {
    title: string;
    to: string;
}

const DropdownLink: FC<LinkProps> = ({ title, to }) => {
    return (
        <Link className="px-2 py-1.5 w-full block" to={to}>
            {title}
        </Link>
    );
};

const ProfileMenu: FC<Props> = ({ profile, signOut }) => {
    const { email, name, role, avatar } = profile

    return (
        <div className="flex items-center gap-4">
            <Dropdown placement="bottom-start">
                <DropdownTrigger>
                    <User
                        as="button"
                        avatarProps={{
                            isBordered: false,
                            src: avatar,
                        }}
                        className="transition-transform font-semibold"
                        name={name}
                    />
                </DropdownTrigger>
                <DropdownMenu aria-label="User Actions" variant="flat">
                    <DropdownSection showDivider>
                        <DropdownItem
                            textValue="just to remove warning"
                            key="profile"
                            className="h-14 gap-2"
                        >
                            <div>
                                <p className="font-semibold">Signed in as:</p>
                                <p className="font-bold">{email}</p>
                            </div>
                        </DropdownItem>
                        <DropdownItem key="my_library" textValue="library" className="p-0">
                            <DropdownLink title="My Library" to="/library" />
                        </DropdownItem>
                        <DropdownItem textValue="orders" key="orders" className="p-0">
                            <DropdownLink title="My Orders" to="/orders" />
                        </DropdownItem>
                    </DropdownSection>

                    {role === "author" ? (
                        <DropdownSection showDivider>
                            <DropdownItem textValue="author" key="author" className="p-0">
                                <DropdownLink title="Author Profile" to={`/author/${profile?.authorId}`} />
                            </DropdownItem>
                            <DropdownItem
                                textValue="Create New Book"
                                key="create_new_book"
                                className="p-0"
                            >
                                <DropdownLink title="Create New Book" to="/create-new-book" />
                            </DropdownItem>
                        </DropdownSection>
                    ) : (
                        <DropdownItem textValue="empty item" className="p-0"></DropdownItem>
                    )}
                    <DropdownItem key="profile" textValue="my_profile" className="p-0">
                        <DropdownLink title="Profile" to="/profile" />
                    </DropdownItem>
                    <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
                    <DropdownItem onClick={signOut} key="logout" color="danger">
                        Log Out
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    );
};

export default ProfileMenu;