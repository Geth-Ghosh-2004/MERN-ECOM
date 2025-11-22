import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

function ShoppingProductTile({ product, handleGetProductDetails }) {
  const hasSale = product?.salePrice > 0;

  return (
    <Card className="w-full max-w-sm ms-auto rounded-lg overflow-hidden shadow-sm">
      <div
        onClick={() => handleGetProductDetails(product?._id)}
        className="relative"
      >
        <img
          className="w-full h-[300px] object-cover"
          src={product?.image}
          alt={product?.title}
        />

        {hasSale && (
          <Badge className="absolute top-2 left-2 bg-red-600 hover:bg-red-700">
            Sale
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        {/* Product Title */}
        <h2 className="text-lg font-bold mb-2 truncate">{product?.title}</h2>

        {/* Category + Brand */}
        <div className="flex justify-between text-sm text-muted-foreground mb-3">
          <span>{categoryOptionsMap[product?.category]}</span>
          <span>{brandOptionsMap[product?.brand]}</span>
        </div>

        {/* Pricing */}
        <div className="flex justify-between items-center">
          <span
            className={`text-lg font-semibold text-primary ${
              hasSale ? "line-through opacity-60" : ""
            }`}
          >
            ₹{product?.price}
          </span>

          {hasSale && (
            <span className="text-lg font-semibold text-primary">
              ₹{product?.salePrice}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button className="w-full">Add to Cart</Button>
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
