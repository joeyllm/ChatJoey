import { useId, type SVGProps } from "react";

export default function SportsJoeyIcon(props: SVGProps<SVGSVGElement>) {
  const id = useId().replace(/:/g, "");
  const titleId = `sports-joey-icon-title-${id}`;

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
      <title id={titleId}>Sports Joey</title>
      <circle cx="82" cy="82" r="82" fill="#1F8A45" />
      <path
        d="M 29 112 C 48 78 83 55 127 46"
        fill="none"
        stroke="#FFE071"
        strokeLinecap="round"
        strokeWidth="16"
      />
      <circle cx="101" cy="66" r="35" fill="#FFFFFF" />
      <path
        d="M 74 49 C 92 58 109 78 118 99"
        fill="none"
        stroke="#1F8A45"
        strokeLinecap="round"
        strokeWidth="8"
      />
      <path
        d="M 74 83 C 91 73 109 66 132 64"
        fill="none"
        stroke="#1F8A45"
        strokeLinecap="round"
        strokeWidth="8"
      />
      <path
        d="M 88 32 L 98 48 L 116 50 L 104 64 L 108 82 L 88 73 L 70 82 L 74 64 L 62 50 L 80 48 Z"
        fill="#FFE071"
      />
      <circle cx="57" cy="99" r="13" fill="#146332" />
    </svg>
  );
}
