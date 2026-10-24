"use client";

import { useEffect, useRef } from "react";

type Props = { blob: Blob; alt: string; className?: string };

// Blob を object URL にして表示し、不要になったら解放する（解放しないとメモリに残り続ける）
export function BlobImage({ blob, alt, className }: Props) {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const url = URL.createObjectURL(blob);
    if (ref.current) ref.current.src = url;
    return () => URL.revokeObjectURL(url);
  }, [blob]);

  // next/image は Blob の object URL を最適化できないため素の img を使う
  // eslint-disable-next-line @next/next/no-img-element
  return <img ref={ref} alt={alt} className={className} />;
}
