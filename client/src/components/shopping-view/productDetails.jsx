import { Dialog, DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { setProductDetails } from "@/store/shop/products-slice";

function ProductDetailsDialog({ open, setOPen, productDetails }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);

  const { toast } = useToast();

  useEffect(() => {
    if (!productDetails) {
      setOPen(false);
    }
  }, [productDetails]);

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];
    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );

      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `only${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });
          return;
        }
      }
    }
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product added to cart",
        });
      }
    });
  }

  function handleDialogChange(isOpen) {
    if (!isOpen) {
      dispatch(setProductDetails());
    }
    setOPen(isOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent
        onInteractOutside={() => handleDialogChange(false)}
        onEscapeKeyDown={() => handleDialogChange(false)}
        className="max-w-[850px] p-6 rounded-xl shadow-xl bg-white"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT IMAGE */}
          <div className="rounded-xl overflow-hidden border bg-gray-100 shadow-sm">
            <img
              src={productDetails?.image}
              alt={productDetails?.title}
              className="w-full h-full object-cover aspect-square"
            />
          </div>

          {/* RIGHT DETAILS */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold">{productDetails?.title}</h1>

            <p className="text-gray-500 text-sm mt-1">
              {productDetails?.description}
            </p>

            <div className="mt-4 flex items-center gap-4">
              <p
                className={`text-2xl font-bold ${
                  productDetails?.salePrice > 0
                    ? "line-through text-gray-400"
                    : "text-primary"
                }`}
              >
                ${productDetails?.price}
              </p>

              {productDetails?.salePrice > 0 && (
                <p className="text-3xl font-extrabold text-green-600">
                  ${productDetails?.salePrice}
                </p>
              )}
            </div>

            {/* Stars */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>
              <span className="text-sm text-gray-500">(4.5)</span>
            </div>

            {productDetails?.totalStock === 0 ? (
              <Button className="mt-4 py-4 text-sm rounded-lg opacity-60 cursore-not-allowed">
                Out of Stock
              </Button>
            ) : (
              <Button
                onClick={() =>
                  handleAddToCart(
                    productDetails?._id,
                    productDetails?.totalStock
                  )
                }
                className="mt-4 py-4 text-sm rounded-lg"
              >
                Add to Cart
              </Button>
            )}

            <Separator className="my-5" />

            <h3 className="text-lg font-semibold mb-3">Reviews</h3>

            <div className="max-h-[200px] overflow-y-auto space-y-4 pr-2">
              {[1, 2, 3].map((review, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg border bg-gray-50"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarFallback>JG</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <h3 className="font-semibold">Jeet Ghosh</h3>

                    <div className="flex text-yellow-500 mt-1">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} size={14} fill="currentColor" />
                      ))}
                    </div>

                    <p className="text-xs text-gray-600 mt-1">
                      This is an awesome product.
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 p-3 border rounded-lg bg-gray-50">
              <h4 className="font-semibold text-sm mb-2">Write a Review</h4>

              <textarea
                rows="2"
                placeholder="Write your review..."
                className="w-full p-2 border rounded-lg bg-white text-sm outline-none"
              />

              <Button className="mt-2 w-full py-3 text-sm rounded-lg">
                Submit Review
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
