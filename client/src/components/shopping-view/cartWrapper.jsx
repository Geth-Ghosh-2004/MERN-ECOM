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
    <SheetContent className="sm:max-w-md bg-white p-6">
      <SheetHeader>
        <SheetTitle className="text-lg font-semibold">Your Cart</SheetTitle>
      </SheetHeader>

      <div>
        {cartItems && cartItems.length > 0
          ? cartItems.map((item) => <UserCartItems cartItem={item} />)
          : null}
      </div>

      {/* TOTAL ROW */}
      <div className="mt-6 flex justify-between text-base font-semibold">
        <span>Total</span>
        <span>${totalCartAmount}</span>
      </div>

      {/* CHECKOUT BUTTON */}
      <Button
        onClick={() => {
          navigate("/shop/checkout");
          setOpenCartSheet(false);
        }}
        className="w-full mt-6 bg-black text-white h-12 rounded-md hover:bg-black/80"
      >
        Checkout
      </Button>
    </SheetContent>
  );
}

export default UserCartWrapper;
