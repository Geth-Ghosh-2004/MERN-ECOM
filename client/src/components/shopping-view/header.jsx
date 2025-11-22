import {
  HouseHeart,
  LogOut,
  Menu,
  ShieldUser,
  ShoppingCart,
} from "lucide-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
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
} from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { logoutUser } from "@/store/auth-slice";

/* ---------------------- MENU ITEMS ---------------------- */
function MenuItems() {
  return (
    <nav className="flex flex-col lg:flex-row gap-6 lg:items-center">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Link
          key={menuItem.id}
          to={menuItem.path}
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition"
        >
          {menuItem.label}
        </Link>
      ))}
    </nav>
  );
}

/* ---------------------- RIGHT SIDE CONTENT ---------------------- */
function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  return (
    <div className="flex items-center gap-4">
      {/* Cart Button */}
      <Button
        variant="outline"
        size="icon"
        className="rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
      >
        <ShoppingCart className="w-5 h-5" />
        <span className="sr-only">User Cart</span>
      </Button>

      {/* User Avatar Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar
            className="h-9 w-9 rounded-full bg-gradient-to-br from-zinc-900 to-zinc-700 
                       flex items-center justify-center cursor-pointer
                       hover:scale-105 transition-transform shadow-md"
          >
            <AvatarFallback className="text-white font-semibold">
              {user?.userName?.[0]?.toUpperCase() || "J"}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="right"
          align="end"
          className="w-56 p-3 shadow-xl border rounded-xl bg-background"
        >
          <DropdownMenuLabel className="text-sm text-muted-foreground">
            Logged in as{" "}
            <span className="font-medium text-foreground">
              {user?.userName}
            </span>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => navigate("/shop/account")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <ShieldUser className="h-5 w-5" />
            <span>Account</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleLogout}
            className="flex cursor-pointer items-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
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
    <header className="sticky top-0 z-40 w-full border-b bg-background/90 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* LEFT — LOGO */}
        <div className="flex items-center gap-2">
          <Link to="/shop/home" className="flex items-center gap-2">
            <HouseHeart className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Ecommerce</span>
          </Link>
        </div>

        {/* CENTER — NAV ITEMS */}
        <div className="hidden lg:flex flex-1 justify-center">
          <MenuItems />
        </div>

        {/* RIGHT — CART + USER */}
        <div className="hidden lg:flex items-center gap-4">
          {isAuthenticated ? <HeaderRightContent /> : null}
        </div>

        {/* MOBILE MENU BUTTON */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden rounded-full hover:bg-accent transition"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header Menu</span>
            </Button>
          </SheetTrigger>

          <SheetContent
            side="left"
            className="w-full max-w-xs p-6 space-y-6 bg-background"
          >
            <MenuItems />
            {isAuthenticated ? <HeaderRightContent /> : null}
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default ShoppingHeader;
