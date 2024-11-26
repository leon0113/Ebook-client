import {
  Badge,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Navbar as NextUINav,
} from "@nextui-org/react";
import { FC } from "react";
import { FaBookReader } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { Link } from "react-router-dom";
import useCart from "../../hooks/useCart";
import ProfileOptions from "../profile/ProfileOptions";
import DarkModeSwitch from "./DarkModeSwitch";



const Navbar: FC = () => {
  const { totalCount } = useCart()


  return (
    <NextUINav>
      <NavbarBrand>
        <Link to="/" className="flex items-center justify-center space-x-2">
          <FaBookReader size={24} />
          <p className="font-bold text-inherit">Store</p>
        </Link>
      </NavbarBrand>

      <NavbarContent justify="end">
        <NavbarItem>
          <DarkModeSwitch />
        </NavbarItem>
        {/* cart item */}
        <NavbarItem>
          <Link to="/cart">
            <Badge content={totalCount} color="danger" shape="circle">
              <FaCartShopping size={24} />
            </Badge>
          </Link>
        </NavbarItem>
        {/* profile item  */}
        <NavbarItem>
          <ProfileOptions />
        </NavbarItem>
      </NavbarContent>
    </NextUINav>
  );
};

export default Navbar;