import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PaymentSuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("visited success page");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md rounded-2xl shadow-lg border bg-white p-10 text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-16 w-16 text-emerald-500" />
        </div>

        <CardHeader className="p-0">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
            Payment Successful 🎉
          </CardTitle>
        </CardHeader>

        <p className="mt-3 text-sm text-gray-500">
          Your payment has been completed successfully. You can view your order
          details anytime from your account.
        </p>

        <Button
          className="mt-6 w-full h-11 text-base font-semibold"
          onClick={() => navigate("/shop/account")}
        >
          View Orders
        </Button>
      </Card>
    </div>
  );
}

export default PaymentSuccessPage;
