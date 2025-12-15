import { Dialog, DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { setProductDetails } from "@/store/shop/products-slice";
import StarRatingComponent from "../common/star-rating";
import { addReview, getReviews } from "@/store/shop/review-slice";

function ProductDetailsDialog({ open, setOPen, productDetails }) {
  const [reviewMsgg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);
  const { toast } = useToast();

  /* close dialog if product missing */
  useEffect(() => {
    if (!productDetails) setOPen(false);
  }, [productDetails]);

  /* fetch reviews */
  useEffect(() => {
    if (productDetails?._id) {
      dispatch(getReviews(productDetails._id));
    }
  }, [productDetails]);

  function handleRatingChange(value) {
    setRating(value);
  }

  function handleAddReview() {
    dispatch(
      addReview({
        productId: productDetails._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsgg,
        reviewValue: rating,
      })
    ).then((res) => {
      if (res?.payload?.success) {
        dispatch(getReviews(productDetails._id));
        setRating(0);
        setReviewMsg("");
        toast({
          title: "Review added Successfully",
        });
      }
    });
  }

  function handleAddToCart(id, stock) {
    const items = cartItems.items || [];
    const found = items.find((i) => i.productId === id);

    if (found && found.quantity + 1 > stock) {
      toast({
        title: `Only ${found.quantity} quantity can be added`,
        variant: "destructive",
      });
      return;
    }

    dispatch(addToCart({ userId: user?.id, productId: id, quantity: 1 })).then(
      (res) => {
        if (res?.payload?.success) {
          dispatch(fetchCartItems(user?.id));
          toast({ title: "Product added to cart" });
        }
      }
    );
  }

  function handleDialogChange(isOpen) {
    if (!isOpen) {
      dispatch(setProductDetails());
      setRating(0);
      setReviewMsg("");
    }
    setOPen(isOpen);
  }

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="max-w-[780px] p-5 rounded-2xl bg-white shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] gap-6">
          {/* IMAGE */}
          <div className="bg-gray-100 rounded-xl flex items-center justify-center p-4">
            <img
              src={productDetails?.image}
              alt={productDetails?.title}
              className="w-full max-h-[280px] object-contain rounded-lg"
            />
          </div>

          {/* DETAILS */}
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-gray-900">
              {productDetails?.title}
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              {productDetails?.description}
            </p>

            {/* PRICE */}
            <div className="flex items-center gap-3 mt-3">
              <span
                className={`text-lg font-semibold ${
                  productDetails?.salePrice
                    ? "line-through text-gray-400"
                    : "text-gray-900"
                }`}
              >
                ${productDetails?.price}
              </span>

              {productDetails?.salePrice > 0 && (
                <span className="text-xl font-bold text-green-600">
                  ${productDetails.salePrice}
                </span>
              )}
            </div>

            {/* STATIC RATING */}
            <div className="flex items-center gap-2 mt-2">
              <StarRatingComponent rating={averageReview} />

              <span className="text-xs text-gray-500">{averageReview}</span>
            </div>

            {/* CART */}
            {productDetails?.totalStock === 0 ? (
              <Button className="mt-4 py-2 rounded-lg opacity-60">
                Out of Stock
              </Button>
            ) : (
              <Button
                className="mt-4 py-2 rounded-lg"
                onClick={() =>
                  handleAddToCart(productDetails._id, productDetails.totalStock)
                }
              >
                Add to Cart
              </Button>
            )}

            <Separator className="my-4" />

            {/* REVIEWS */}
            <h3 className="text-sm font-semibold mb-2">Reviews</h3>

            <div className="max-h-[180px] overflow-y-auto space-y-3 pr-2">
              {reviews && reviews.length > 0 ? (
                reviews.map((review) => (
                  <div
                    key={review._id}
                    className="flex gap-3 p-4 border rounded-xl bg-white shadow-sm"
                  >
                    <Avatar className="w-9 h-9">
                      <AvatarFallback className="bg-gray-200 font-semibold">
                        {review.userName?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900">
                          {review.userName}
                        </p>
                        <StarRatingComponent
                          rating={review.reviewValue}
                          readOnly
                          size={14}
                        />
                      </div>

                      <p className="mt-1 text-sm text-gray-600">
                        {review.reviewMessage}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No reviews yet</p>
              )}
            </div>

            {/* WRITE REVIEW */}
            <div className="mt-5 border rounded-xl p-4 bg-gray-50">
              <p className="text-sm font-semibold mb-3">Write a Review</p>

              <StarRatingComponent
                rating={rating}
                handleRatingChange={handleRatingChange}
              />

              <textarea
                rows="3"
                value={reviewMsgg}
                onChange={(e) => setReviewMsg(e.target.value)}
                placeholder="Share your experience with this product..."
                className="
                  w-full mt-3 p-3 text-sm
                  border rounded-lg bg-white
                  focus:outline-none focus:ring-2 focus:ring-black/80
                  resize-none
                "
              />

              <Button
                onClick={handleAddReview}
                disabled={!reviewMsgg.trim() || rating === 0}
                className="mt-3 w-full py-2 rounded-lg"
              >
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
