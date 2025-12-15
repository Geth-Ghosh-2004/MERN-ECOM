import { StarIcon } from "lucide-react";
import { Button } from "../ui/button";

function StarRatingComponent({ rating, handleRatingChange }) {
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <Button
          key={star}
          variant="outline"
          size="icon"
          onClick={() => handleRatingChange(star)}
          className="rounded-full"
        >
          <StarIcon
            className={`w-5 h-5 ${
              star <= rating ? "fill-black text-black" : "text-black"
            }`}
          />
        </Button>
      ))}
    </div>
  );
}

export default StarRatingComponent;
