"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ImageWithFallbackProps
  extends Omit<ImageProps, "src" | "alt" | "width" | "height"> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  width?: number;
  height?: number;
}

export function ImageWithFallback({
  src,
  alt,
  fallbackSrc = "/images/placeholder.png",
  className,
  width,
  height,
  ...props
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);

  // If width and height are provided, use them
  if (width && height) {
    return (
      <Image
        {...props}
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        className={cn("object-cover", className)}
        onError={() => setImgSrc(fallbackSrc)}
      />
    );
  }

  // Otherwise use fill with proper parent positioning
  return (
    <div className={cn("relative w-full h-full", className)}>
      <Image
        {...props}
        src={imgSrc}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 100vw"
        className="object-cover"
        onError={() => setImgSrc(fallbackSrc)}
      />
    </div>
  );
}

export default ImageWithFallback;
