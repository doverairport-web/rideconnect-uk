"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type Props = Omit<ImageProps, "src" | "alt"> & {
  src?: string | null;
  alt: string;
};

/** Renders Next/Image only when src is present; hides on load error (no broken placeholders). */
export function KthSafeImage({ src, alt, className, ...props }: Props) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) return null;

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      {...props}
    />
  );
}
