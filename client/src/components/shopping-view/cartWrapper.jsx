import React from "react";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import UserCartItems from "./cartItems";
import { useNavigate } from "react-router-dom";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();
  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem.price) *
              currentItem.quantity,
          0
        )
      : 0;

  return (
    <SheetContent className="sm:max-w-md bg-white p-0 flex flex-col">
      {/* HEADER */}
      <SheetHeader className="px-6 py-4 border-b">
        <SheetTitle className="text-lg font-semibold tracking-tight">
          Your Cart
        </SheetTitle>
      </SheetHeader>

      {/* CART ITEMS (SCROLLABLE) */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {cartItems && cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div
              key={item.productId}
              className="
            rounded-xl border p-3
            hover:shadow-sm transition
            bg-gray-50
          "
            >
              <UserCartItems cartItem={item} />
            </div>
          ))
        ) : (
          <div className="text-center text-muted-foreground mt-16">
            <p className="text-sm">Your cart is empty</p>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="border-t px-6 py-4 space-y-4 bg-white">
        {/* TOTAL */}
        <div className="flex justify-between text-base font-semibold">
          <span>Total</span>
          <span>${totalCartAmount}</span>
        </div>

        {/* CHECKOUT */}
        <Button
          onClick={() => {
            navigate("/shop/checkout");
            setOpenCartSheet(false);
          }}
          className="
        w-full h-12 rounded-xl
        bg-black text-white
        text-sm font-semibold
        hover:bg-black/90
        transition
      "
        >
          Checkout
        </Button>
      </div>
    </SheetContent>
  );
}

export default UserCartWrapper;
