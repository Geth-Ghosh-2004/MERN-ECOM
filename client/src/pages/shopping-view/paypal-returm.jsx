import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { capturePayment } from "@/store/shop/order-slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { checkAuth } from "@/store/auth-slice";

function PaypalReturnPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paymentId = params.get("paymentId");
  const payerId = params.get("PayerID");

  useEffect(() => {
    console.log("visited return page");
    // Re-check auth when PayPal redirects back to ensure cookie is sent
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (paymentId && payerId) {
      const orderIdStr = sessionStorage.getItem("currentOrderId");
      if (!orderIdStr) {
        console.error("Order ID not found in sessionStorage");
        return;
      }

      try {
        const orderId = JSON.parse(orderIdStr);
        dispatch(capturePayment({ paymentId, payerId, orderId }))
          .then((data) => {
            if (data?.payload?.success) {
              sessionStorage.removeItem("currentOrderId");
              window.location.href = "/shop/paypal-success";
            } else {
              console.error("Payment capture failed:", data?.payload);
            }
          })
          .catch((error) => {
            console.error("Error capturing payment:", error);
          });
      } catch (error) {
        console.error("Error parsing order ID:", error);
      }
    }
  }, [paymentId, payerId, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md rounded-2xl shadow-lg border bg-white">
        <CardHeader className="flex flex-col items-center gap-4 py-10">
          {/* Loader */}
          <div className="h-12 w-12 rounded-full border-4 border-gray-300 border-t-black animate-spin" />

          <CardTitle className="text-lg font-semibold text-center">
            Processing Payment
          </CardTitle>

          <p className="text-sm text-gray-500 text-center">
            Please wait while we confirm your payment.
            <br />
            Do not refresh or close this page.
          </p>
        </CardHeader>
      </Card>
    </div>
  );
}

export default PaypalReturnPage;
