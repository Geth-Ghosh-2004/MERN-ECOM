import {
  CircleCheckBig,
  LayoutDashboard,
  ShoppingBasket,
  UserStar,
} from "lucide-react";
import React, { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

// Sidebar menu items list
export const adminSidebarMenuItem = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/Admin/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    id: "products",
    label: "Products",
    path: "/Admin/products",
    icon: <ShoppingBasket />,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/Admin/orders",
    icon: <CircleCheckBig />,
  },
];

// Menu items component (used for both mobile & desktop)
function MenuItems({ setOpen }) {
  const navigate = useNavigate();

  return (
    <nav className="mt-8 flex flex-col gap-3">
      {adminSidebarMenuItem.map((menuItem) => (
        <div
          key={menuItem.id}
          onClick={() => {
            navigate(menuItem.path);
            if (setOpen) setOpen(false); // ✅ only close if setOpen exists
          }}
          className="flex text-lg items-center gap-3 rounded-md px-3 py-2 cursor-pointer hover:bg-gray-100 transition text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          {menuItem.icon}
          <span className="font-medium">{menuItem.label}</span>
        </div>
      ))}
    </nav>
  );
}

// Main Sidebar component
const AdminSidebar = ({ open, setOpen }) => {
  const navigate = useNavigate();

  return (
    <Fragment>
      {/* ✅ Mobile Sidebar (Drawer) */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b">
              <SheetTitle className="flex gap-2 mt-5 mb-5 items-center">
                <UserStar />
                <span>Admin Panel</span>
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />{" "}
            {/* ✅ passes setOpen for closing */}
          </div>
        </SheetContent>
      </Sheet>

      {/* ✅ Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex">
        <div
          onClick={() => navigate("/Admin/dashboard")}
          className="flex cursor-pointer items-center gap-2 mb-4"
        >
          <UserStar />
          <h1 className="text-2xl font-extrabold">Admin Panel</h1>
        </div>
        <MenuItems setOpen={setOpen} /> {/* ✅ consistent prop passing */}
      </aside>
    </Fragment>
  );
};

export default AdminSidebar;
