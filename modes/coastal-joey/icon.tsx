import { useId, type SVGProps } from "react";

export default function CoastalJoeyIcon(
  props: SVGProps<SVGSVGElement>,
) {
  const id = useId().replace(/:/g, "");
  const titleId = `coastal-joey-icon-${id}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={164}
      height={164}
      viewBox="0 0 164 164"
      role="img"
      aria-labelledby={titleId}
      {...props}
    >
      <title id={titleId}>Coastal Joey</title>

      <circle cx="82" cy="82" r="82" fill="#168C96" />
      <circle cx="126" cy="39" r="17" fill="#FFD66B" />

      <path
        d="M0 105c20-17 39-17 59 0s40 17 60 0 31-13 45-3v62H0z"
        fill="#BDE7F2"
      />
      <path
        d="M0 121c20-15 40-15 60 0s40 15 60 0 30-12 44-4v47H0z"
        fill="#FFFFFF"
        opacity="0.9"
      />

      <path
        d="M48 108c20-10 48-10 69 0-13 20-53 25-69 0z"
        fill="#F4DFB8"
        stroke="#0B6670"
        strokeWidth="5"
      />

      <path
        d="M69 92c-7-18-4-34 8-42 12 8 15 24 8 42z"
        fill="#D89A5B"
      />
      <path
        d="M69 56 59 28c-2-7 7-11 11-5l12 25z"
        fill="#D89A5B"
      />
      <path
        d="m85 56 11-28c3-7 12-3 10 4L91 58z"
        fill="#D89A5B"
      />
      <circle cx="77" cy="67" r="3.5" fill="#172033" />
      <circle cx="88" cy="67" r="3.5" fill="#172033" />
      <path
        d="M78 76c3 3 6 3 9 0"
        fill="none"
        stroke="#172033"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
