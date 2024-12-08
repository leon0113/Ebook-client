import {
    Badge,
    Button,
    Divider,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Navbar as NextUINav,
    User
} from "@nextui-org/react";
import clsx from "clsx";
import { FC } from "react";
import { FaBookOpen } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { Link } from "react-router-dom";
import useCart from "../hooks/useCart";
import DarkModeSwitch from "./common/DarkModeSwitch";
import useAuth from "../hooks/useAuth";

interface Props {
    visible: boolean;
    onClose(): void;
    totalCount?: number | string;
}

const MobileNav: FC<Props> = ({ visible, onClose }) => {

    const { totalCount } = useCart();
    const { profile, signOut } = useAuth();

    const name = profile?.name || '';
    const avatar = profile?.avatar || '';

    const navOptions = [
        {
            label: 'My Library',
            path: '/library'
        },
        {
            label: 'My Orders',
            path: '/orders'
        },
        {
            label: 'Profile',
            path: '/profile'
        },
        {
            label: 'Help & Feedback',
            path: '/'
        },
        {
            label: 'My Library',
            path: '/library'
        },
    ];

    const authorNavOptions = [
        {
            label: 'Author Profile',
            path: `/author/${profile?.authorId}`
        },
        {
            label: 'Create New Book',
            path: '/create-new-book'
        },
    ]

    return (
        <div>
            <div className={clsx(visible ? 'left-0' : '-left-full', "fixed bottom-0 top-0 w-3/4 z-[100] bg-slate-50 dark:bg-slate-900 transition-all flex flex-col")}>
                {/* Mobile Navbar header  */}
                <div className="pt-10 px-5 space-y-3">
                    <div className="flex justify-between items-center">
                        <NextUINav onClick={onClose} className="bg-slate-50 dark:bg-slate-900">
                            <NavbarBrand>
                                <Link to="/" className="flex items-center justify-center space-x-2 text-yellow-500">
                                    <FaBookOpen size={24} />
                                    <p className="font-bold text-inherit">Bookie</p>
                                </Link>
                            </NavbarBrand>

                            <NavbarContent>
                                <NavbarItem>
                                    <DarkModeSwitch />
                                </NavbarItem>
                                {/* cart item */}
                                <NavbarItem >
                                    <Link to="/cart">
                                        <Badge content={totalCount} color="danger" shape="circle">
                                            <FaCartShopping size={24} />
                                        </Badge>
                                    </Link>
                                </NavbarItem>
                            </NavbarContent>
                        </NextUINav>
                    </div>
                    <Divider />

                    {/* Mobile Navbar lists  */}
                    <div>
                        {
                            profile && navOptions.map((option, index) => {
                                return <Link onClick={onClose} key={index} className="px-2 py-1.5 w-full block rounded-md hover:bg-slate-300 cursor-pointer font-semibold" to={option.path}>
                                    {option.label}
                                </Link>
                            })
                        }

                        {
                            profile && profile?.role === 'author' && authorNavOptions.map((option, index) => {
                                return <Link onClick={onClose} key={index} className="px-2 py-1.5 w-full block rounded-md hover:bg-slate-300 cursor-pointer font-semibold" to={option.path}>
                                    {option.label}
                                </Link>
                            })
                        }
                    </div>
                </div>

                {/* user profile info  */}
                <div className="mt-auto mb-5 px-5">
                    {
                        profile ? (
                            <div className="flex flex-col gap-5">
                                <User
                                    as="button"
                                    avatarProps={{
                                        isBordered: false,
                                        src: avatar,
                                    }}
                                    className="transition-transform text-lg font-semibold pb-2 justify-start font-semibold"
                                    name={name || ''}
                                />

                                <Button onClick={signOut} variant="bordered">Logout</Button>
                            </div>
                        ) : (
                            <Button as={Link} to='sign-up' variant="bordered" className="flex">Sign Up / In</Button>
                        )
                    }



                </div>
            </div>


            {/* background  */}
            <div className={clsx(visible ? 'fixed' : 'hidden', "inset-0 z-50 dark:bg-slate-50 bg-slate-900 bg-opacity-50 dark:bg-opacity-50 backdrop-blur")}
                onClick={onClose}
            />
        </div>
    )
};

export default MobileNav;
