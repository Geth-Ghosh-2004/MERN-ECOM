import React, { useState } from "react";
import img from "../../assets/account.jpg";
import Address from "@/components/shopping-view/address";
import { useDispatch, useSelector } from "react-redux";
import UserCartItems from "@/components/shopping-view/cartItems";
import { Button } from "@/components/ui/button";
import { createNewOrder } from "@/store/shop/order-slice";
import { useToast } from "@/hooks/use-toast";

const ShoppingCheckout = () => {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();

  console.log(currentSelectedAddress, "cartItems");

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem.price) *
              currentItem.quantity,
          0
        )
      : 0;
  function handleInitiatePaypalPayment() {
    if (cartItems.length === 0) {
      toast({
        title: "Your cart is empty.please add items to proceed",
        variant: "destructive",
      });

      return;
    }
    if (!currentSelectedAddress) {
      alert("Please select an address first");
      return;
    }

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,

      cartItems: cartItems.items.map((item) => ({
        productId: item.productId,
        title: item.title,
        image: item.image,
        price: item.salePrice > 0 ? item.salePrice : item.price,
        quantity: item.quantity,
      })),

      addressInfo: {
        addressId: currentSelectedAddress._id,
        address: currentSelectedAddress.address,
        city: currentSelectedAddress.city,
        pincode: currentSelectedAddress.pincode,
        phone: currentSelectedAddress.phone,
        notes: currentSelectedAddress.notes || "",
      },

      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      console.log(data, "jeet");
      if (data?.payload?.success) {
        setIsPaymentStart(true);
      } else {
        setIsPaymentStart(false);
      }
    });
  }
  if (approvalURL) {
    window.location.href = approvalURL;
  }
  return (
    <div className="flex flex-col">
      {/* COVER IMAGE */}
      <div className="relative h-[280px] sm:h-[320px] w-full overflow-hidden shadow-lg">
        <img
          className="h-full w-full object-cover object-center brightness-95"
          src={img}
          alt="Checkout Banner"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8 px-6 pb-10">
        {/* ADDRESS SECTION */}
        <div className="bg-white shadow-md rounded-xl p-5 border border-gray-200 hover:shadow-lg transition-all duration-200">
          <Address setCurrentSelectedAddress={setCurrentSelectedAddress} />
        </div>

        {/* CART ITEMS */}
        <div className="flex flex-col gap-4 bg-white shadow-md rounded-xl p-5 border border-gray-200 hover:shadow-lg transition-all duration-200">
          {cartItems?.items?.length > 0 ? (
            cartItems.items.map((cartItem) => (
              <UserCartItems key={cartItem._id} cartItem={cartItem} />
            ))
          ) : (
            <div className="text-gray-500 text-sm text-center py-4">
              No items in your cart.
            </div>
          )}

          {/* TOTAL SECTION */}
          <div className="mt-6 flex justify-between items-center text-lg font-bold border-t pt-4">
            <span>Total</span>
            <span className="text-emerald-600">${totalCartAmount}</span>
          </div>
          <div>
            {" "}
            <Button
              onClick={handleInitiatePaypalPayment}
              className="mt-4 w-full"
            >
              Checkout With Paypal
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCheckout;
