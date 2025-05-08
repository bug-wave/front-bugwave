"use client";
import React, { useState, useEffect } from "react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";

interface StarRatingProps {
  initialRating?: number;
  totalStars?: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
  showValue?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  initialRating = 0,
  totalStars = 5,
  onChange,
  readOnly = false,
  size = "md",
  color = "#FFD700", // Cor dourada
  className = "",
  showValue = true,
}) => {
  const [rating, setRating] = useState<number>(initialRating);
  const [hover, setHover] = useState<number | null>(null);

  // Atualizar o rating quando o initialRating mudar
  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  const handleClick = (value: number) => {
    if (readOnly) return;

    setRating(value);
    if (onChange) {
      onChange(value);
    }
  };

  // Determinar o tamanho das estrelas com base no prop size
  const getStarSize = (): number => {
    switch (size) {
      case "sm":
        return 16;
      case "md":
        return 24;
      case "lg":
        return 32;
      default:
        return 24;
    }
  };

  const starSize = getStarSize();

  // Renderizar as estrelas
  const renderStars = () => {
    const stars = [];

    for (let i = 1; i <= totalStars; i++) {
      const value = i;
      const hoverRating = hover !== null ? hover : rating;

      stars.push(
        <span
          key={i}
          className={`cursor-${
            readOnly ? "default" : "pointer"
          } transition-colors duration-200`}
          onClick={() => handleClick(value)}
          onMouseEnter={() => !readOnly && setHover(value)}
          onMouseLeave={() => !readOnly && setHover(null)}
        >
          {hoverRating >= i ? (
            <FaStar size={starSize} color={color} className="inline-block" />
          ) : hoverRating >= i - 0.5 ? (
            <FaStarHalfAlt
              size={starSize}
              color={color}
              className="inline-block"
            />
          ) : (
            <FaRegStar size={starSize} color={color} className="inline-block" />
          )}
        </span>
      );
    }

    return stars;
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex">{renderStars()}</div>
      {showValue && (
        <span className="text-gray-700 font-medium ml-2">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};


export default StarRating;

