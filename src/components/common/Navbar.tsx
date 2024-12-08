import {
  Badge,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Navbar as NextUINav,
} from "@nextui-org/react";
import { FC, useState } from "react";
import { FaBookOpen } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { Link } from "react-router-dom";
import useCart from "../../hooks/useCart";
import ProfileOptions from "../profile/ProfileOptions";
import DarkModeSwitch from "./DarkModeSwitch";
import { TfiMenuAlt } from "react-icons/tfi";
import MobileNav from "../MobileNav";
import { RxCross2 } from "react-icons/rx";
import SearchForm from "../SearchForm";



const Navbar: FC = () => {
  const { totalCount } = useCart();
  const [showNav, setShowNav] = useState(false);

  const handleCloseNav = () => {
    setShowNav(false);
  };

  const handleOpenNav = () => {
    setShowNav(true);
  }

  return (
    <>
      <NextUINav>
        <NavbarBrand>
          <Link to="/" className="flex items-center justify-center space-x-2 text-yellow-500">
            <FaBookOpen size={24} className="hidden sm:flex" />
            <p className="font-bold text-inherit">Bookie</p>
          </Link>
        </NavbarBrand>

        {/* Search input field  */}
        <NavbarContent className="w-full" justify="center">
          <SearchForm />
        </NavbarContent>

        <NavbarContent justify="end">
          <NavbarItem className="hidden md:flex">
            <DarkModeSwitch />
          </NavbarItem>
          {/* cart item */}
          <NavbarItem className="hidden md:flex">
            <Link to="/cart">
              <Badge content={totalCount} color="danger" shape="circle">
                <FaCartShopping size={24} />
              </Badge>
            </Link>
          </NavbarItem>
          {/* profile item  */}
          <NavbarItem className="hidden md:flex">
            <ProfileOptions />
          </NavbarItem>

          {/* Mobile nav menu  */}
          <NavbarItem className="flex md:hidden cursor-pointer transition-all" onClick={handleOpenNav}>
            {
              !showNav ? <TfiMenuAlt size={22} /> : <RxCross2 size={22} />
            }
          </NavbarItem>
        </NavbarContent>
      </NextUINav>

      {/* Mobile nav  */}
      <MobileNav visible={showNav} onClose={handleCloseNav} totalCount={totalCount} />
    </>
  );
};

export default Navbar;