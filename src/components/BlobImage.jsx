"use client";

import MorphingBlob from "./MorphingBlob.jsx";

export default function BlobImage({
  src,
  alt = "",
  seed = 1,
  className = "",
  style = {},
  count = 5,
  duration = 6,
  extraPoints = 8,
  randomness = 4,
  objectPosition = "center",
  imgStyle = {},
}) {
  return (
    <MorphingBlob
      className={className}
      style={style}
      seed={seed}
      count={count}
      duration={duration}
      extraPoints={extraPoints}
      randomness={randomness}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition,
          display: "block",
          ...imgStyle,
        }}
      />
    </MorphingBlob>
  );
}
