import { useId, type SVGProps } from "react";

export default function EcoJoeyIcon(props: SVGProps<SVGSVGElement>) {
  const id = useId().replace(/:/g, "");
  const titleId = `eco-joey-icon-title-${id}`;

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
      <title id={titleId}>Eco Joey</title>
      <circle cx="82" cy="82" r="82" fill="#28573a" />
      <circle cx="82" cy="82" r="66" fill="#d8ead1" />
      <path
        d="M82 126c-18-18-26-35-24-51 2-17 14-30 36-39 21 22 27 41 20 58-5 13-16 23-32 32Z"
        fill="#3f7d4f"
      />
      <path
        d="M82 126c4-31 10-55 27-79"
        fill="none"
        stroke="#f8fbf5"
        strokeLinecap="round"
        strokeWidth="8"
      />
      <path
        d="M74 68c-15-3-28 2-39 15 8 16 19 25 33 27 12 1 23-3 34-13C96 81 87 71 74 68Z"
        fill="#7aaa5c"
      />
      <path
        d="M101 94c15 1 27-5 36-19-10-15-22-22-36-21-12 1-22 7-30 19 8 13 18 20 30 21Z"
        fill="#94bf70"
      />
      <path
        d="M41 86c26 3 47 11 62 25"
        fill="none"
        stroke="#f8fbf5"
        strokeLinecap="round"
        strokeWidth="6"
      />
    </svg>
  );
}
