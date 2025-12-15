import {
  HouseHeart,
  LogOut,
  Menu,
  ShieldUser,
  ShoppingCart,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cartWrapper";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";

/* ---------------------- MENU ITEMS ---------------------- */
function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filter");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? { category: [getCurrentMenuItem.id] }
        : null;

    sessionStorage.setItem("filter", JSON.stringify(currentFilter));
    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(
          new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
        )
      : navigate(getCurrentMenuItem.path);
  }

  return (
    <nav className="flex flex-col lg:flex-row gap-6 lg:items-center">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          key={menuItem.id}
          onClick={() => handleNavigate(menuItem)}
          className="
            text-sm font-medium
            text-muted-foreground
            hover:text-foreground
            relative cursor-pointer
            after:absolute after:left-0 after:-bottom-1
            after:h-[2px] after:w-0 after:bg-primary
            hover:after:w-full after:transition-all
          "
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  );
}

/* ---------------------- RIGHT SIDE CONTENT ---------------------- */
function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  useEffect(() => {
    dispatch(fetchCartItems(user?.id));
  }, [dispatch]);

  return (
    <div className="flex items-center gap-3">
      {/* CART */}
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="ghost"
          size="icon"
          className="relative rounded-full hover:bg-accent"
        >
          <ShoppingCart className="h-5 w-5" />

          {/* badge */}
          {cartItems?.items?.length > 0 && (
            <span
              className="
                absolute -top-1 -right-1
                h-5 min-w-[20px]
                rounded-full
                bg-primary text-primary-foreground
                text-xs font-bold
                flex items-center justify-center
              "
            >
              {cartItems.items.length}
            </span>
          )}
        </Button>

        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={cartItems?.items || []}
        />
      </Sheet>

      {/* USER */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar
            className="
              h-9 w-9
              cursor-pointer
              bg-gradient-to-br from-neutral-900 to-neutral-700
              shadow-md
              hover:scale-105 transition
            "
          >
            <AvatarFallback className="text-white font-bold bg-black">
              {user?.userName?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-56 rounded-xl p-2 shadow-xl"
        >
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Signed in as
            <div className="font-medium text-foreground">{user?.userName}</div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => navigate("/shop/account")}
            className="gap-2 cursor-pointer"
          >
            <ShieldUser className="h-4 w-4" />
            Account
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleLogout}
            className="
              gap-2 cursor-pointer
              text-red-500
              focus:text-red-500
            "
          >
            <LogOut className="h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

/* ---------------------- MAIN HEADER ---------------------- */
const ShoppingHeader = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <header
      className="
        sticky top-0 z-40
        w-full border-b
        bg-background/80
        backdrop-blur-lg
      "
    >
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* LOGO */}
        <Link
          to="/shop/home"
          className="flex items-center gap-2 font-bold text-lg"
        >
          <HouseHeart className="h-6 w-6 text-primary" />
          Ecommerce
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden lg:flex flex-1 justify-center">
          <MenuItems />
        </div>

        {/* DESKTOP RIGHT */}
        <div className="hidden lg:flex">
          {isAuthenticated && <HeaderRightContent />}
        </div>

        {/* MOBILE */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="p-6 space-y-6">
            <MenuItems />
            {isAuthenticated && <HeaderRightContent />}
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default ShoppingHeader;
