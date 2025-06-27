import { cn } from "@/lib/utils";
import { StarIcon } from "lucide-react";
import React from "react";

export const RatingIcons = ({
  className,
  rating,
}: {
  rating: number | null;
  className?: string;
}) => {
  if (rating == null || rating < 1 || rating > 5) {
    return "Unrated";
  }

  const stars: React.ReactNode[] = [];

  for (let i = 1; i <= 5; i++) {
    stars.push(
      <StarIcon
        key={i}
        className={cn("size-4", rating >= i && "fill-current", className)}
      />
    );
  }

  return (
    <div className="flex gap-1">
      {stars}
      <span className="sr-only">{rating} out of 5</span>
    </div>
  );
};
