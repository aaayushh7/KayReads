'use client';

import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  editable?: boolean;
  onChange?: (rating: number) => void;
}

export default function StarRating({
  rating,
  maxRating = 5,
  size = 24,
  editable = false,
  onChange,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = React.useState(0);

  const handleClick = (selectedRating: number) => {
    if (editable && onChange) {
      onChange(selectedRating);
    }
  };

  const handleMouseEnter = (selectedRating: number) => {
    if (editable) {
      setHoverRating(selectedRating);
    }
  };

  const handleMouseLeave = () => {
    if (editable) {
      setHoverRating(0);
    }
  };

  const displayRating = editable && hoverRating > 0 ? hoverRating : rating;

  return (
    <div className="flex items-center gap-1">
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = displayRating >= starValue;
        const isHalf = displayRating >= starValue - 0.5 && displayRating < starValue;

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            className={`${
              editable ? 'cursor-pointer hover:scale-110' : 'cursor-default'
            } transition-transform duration-150 focus:outline-none`}
            disabled={!editable}
          >
            {isFilled ? (
              <FaStar size={size} className="text-gold" />
            ) : isHalf ? (
              <FaStarHalfAlt size={size} className="text-gold" />
            ) : (
              <FaRegStar size={size} className="text-gold/30" />
            )}
          </button>
        );
      })}
      <span className="ml-2 text-sm text-charcoal/70 font-medium">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

