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
import ProfileOptions from "../profile/ProfileOptions";



const Navbar: FC = () => {

  return (
    <NextUINav>
      <NavbarBrand>
        <Link to="/" className="flex items-center justify-center space-x-2">
          <FaBookReader size={24} />
          <p className="font-bold text-inherit">Store</p>
        </Link>
      </NavbarBrand>

      <NavbarContent justify="end">
        {/* cart item */}
        <NavbarItem>
          <Link to="/cart">
            <Badge content="0" color="danger" shape="circle">
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