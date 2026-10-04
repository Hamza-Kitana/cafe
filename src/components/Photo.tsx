import type { CSSProperties } from "react";
import type { Img } from "@/data/images";

type Props = {
  img: Img;
  alt: string;
  className?: string;
  style?: CSSProperties;
  sizes?: string;
  priority?: boolean;
};

export function Photo({
  img,
  alt,
  className = "",
  style,
  sizes = "100vw",
  priority = false,
}: Props) {
  return (
    <img
      src={img.src}
      srcSet={img.srcSet}
      sizes={sizes}
      width={img.width}
      height={img.height}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "auto"}
      draggable={false}
      className={className}
      style={style}
    />
  );
}
