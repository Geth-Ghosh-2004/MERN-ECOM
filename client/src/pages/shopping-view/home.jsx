import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BabyIcon,
  Cat,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleStar,
  CloudLightning,
  MapPinCheckInside,
  Omega,
  Origami,
  Shirt,
  ShirtIcon,
  UmbrellaIcon,
  WatchIcon,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { getFeatureImages } from "@/store/common";

import ShoppingProductTile from "@/components/shopping-view/productTile";
import ProductDetailsDialog from "@/components/shopping-view/productDetails";
import { useToast } from "@/hooks/use-toast";

const categoriesWithIcon = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: CloudLightning },
  { id: "kids", label: "Kids", icon: BabyIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
  { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
];

const brandWithIcon = [
  { id: "nike", label: "Nike", icon: MapPinCheckInside },
  { id: "adidas", label: "Adidas", icon: Shirt },
  { id: "puma", label: "Puma", icon: Origami },
  { id: "levi", label: "Levi's", icon: CircleStar },
  { id: "zara", label: "Zara", icon: Cat },
  { id: "h&m", label: "H&M", icon: Omega },
];

function ShoppingHome() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { user } = useSelector((state) => state.auth);
  const { featureImageList } = useSelector((state) => state.commonFeature);

  /* ---------------- NAVIGATION ---------------- */
  function handleNavigateToListingPage(item, section) {
    sessionStorage.setItem("filter", JSON.stringify({ [section]: [item.id] }));
    navigate("/shop/listing");
  }

  /* ---------------- PRODUCT ---------------- */
  function handleGetProductDetails(productId) {
    dispatch(fetchProductDetails(productId));
  }

  function handleAddToCart(productId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId,
        quantity: 1,
      })
    ).then((res) => {
      if (res?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({ title: "Product added to cart" });
      }
    });
  }

  /* ---------------- AUTO SLIDER ---------------- */
  useEffect(() => {
    if (!featureImageList?.length) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featureImageList.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [featureImageList]);

  /* ---------------- DATA FETCH ---------------- */
  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
    dispatch(getFeatureImages());
  }, [dispatch]);

  useEffect(() => {
    if (productDetails) setOpenDetailsDialog(true);
  }, [productDetails]);

  /* ---------------- RENDER ---------------- */
  return (
    <div className="flex flex-col min-h-screen">
      {/* FEATURE IMAGE SLIDER */}
      <div className="relative w-full h-[600px] overflow-hidden">
        {featureImageList?.map((item, index) => (
          <img
            key={item._id || index}
            src={item.image}
            className={`absolute w-full h-full object-cover transition-opacity duration-700 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {featureImageList?.length > 1 && (
          <>
            <Button
              size="icon"
              variant="outline"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80"
              onClick={() =>
                setCurrentSlide(
                  (prev) =>
                    (prev - 1 + featureImageList.length) %
                    featureImageList.length
                )
              }
            >
              <ChevronLeftIcon />
            </Button>

            <Button
              size="icon"
              variant="outline"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80"
              onClick={() =>
                setCurrentSlide((prev) => (prev + 1) % featureImageList.length)
              }
            >
              <ChevronRightIcon />
            </Button>
          </>
        )}
      </div>

      {/* CATEGORY */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categoriesWithIcon.map((item) => (
            <Card
              key={item.id}
              onClick={() => handleNavigateToListingPage(item, "category")}
              className="cursor-pointer hover:shadow-lg"
            >
              <CardContent className="flex flex-col items-center p-6">
                <item.icon className="w-12 h-12 mb-3 text-primary" />
                <span className="font-bold">{item.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* BRAND */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {brandWithIcon.map((item) => (
            <Card
              key={item.id}
              onClick={() => handleNavigateToListingPage(item, "brand")}
              className="cursor-pointer hover:shadow-lg"
            >
              <CardContent className="flex flex-col items-center p-6">
                <item.icon className="w-12 h-12 mb-3 text-primary" />
                <span className="font-bold">{item.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FEATURE PRODUCTS */}
      <section className="py-12">
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productList?.map((product) => (
            <ShoppingProductTile
              key={product._id}
              product={product}
              handleAddToCart={handleAddToCart}
              handleGetProductDetails={handleGetProductDetails}
            />
          ))}
        </div>
      </section>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOPen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
