import { useId, type SVGProps } from "react";

export default function OutbackJoeyIcon(props: SVGProps<SVGSVGElement>) {
  const id = useId().replace(/:/g, "");
  const titleId = `outback-joey-icon-title-${id}`;
  const skyId = `outback-joey-sky-${id}`;

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
      <title id={titleId}>Outback Joey</title>
      <defs>
        <linearGradient id={skyId} x1="82" y1="4" x2="82" y2="160" gradientUnits="userSpaceOnUse">
          <stop stopColor="#27324a" />
          <stop offset="0.52" stopColor="#b84c35" />
          <stop offset="1" stopColor="#edaa59" />
        </linearGradient>
      </defs>
      <circle cx="82" cy="82" r="80" fill={`url(#${skyId})`} />
      <circle cx="111" cy="54" r="22" fill="#ffd980" />
      <path d="M2 112c20-13 36-17 55-10 17 7 32 6 47-1 21-10 39-5 58 8v53H2v-50Z" fill="#9b3f2b" />
      <path d="M2 129c24-10 47-8 66 1 16 8 32 8 48 0 15-7 30-7 46 0v32H2v-33Z" fill="#63311f" />
      <path d="M43 93c2-11 7-18 14-23 5 7 8 15 8 25-8-3-15-3-22-2Z" fill="#41271f" />
      <path d="M55 71v36M47 85h8M55 91h10" fill="none" stroke="#41271f" strokeWidth="5" strokeLinecap="round" />
      <circle cx="82" cy="82" r="80" fill="none" stroke="#f4c77b" strokeWidth="4" />
    </svg>
  );
}
