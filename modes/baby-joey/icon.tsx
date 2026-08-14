import { useId, type SVGProps } from "react";

export default function JoeyIcon(props: SVGProps<SVGSVGElement>) {
  const titleId = useId();
  const clipId = useId();

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
      <title id={titleId}>JoeyLLM</title>
      <defs>
        <clipPath id={clipId}>
          <circle cx="0" cy="0" r="82" />
        </clipPath>
      </defs>
      <g transform="translate(82,82)">
        <circle cx="0" cy="0" r="82" fill="#C9762F" />
        <ellipse
          cx="-27"
          cy="-44"
          rx="9"
          ry="20"
          fill="#8C5D38"
          transform="rotate(-28,-27,-44)"
        />
        <ellipse
          cx="27"
          cy="-44"
          rx="9"
          ry="20"
          fill="#8C5D38"
          transform="rotate(28,27,-44)"
        />
        <ellipse cx="0" cy="42" rx="26" ry="22" fill="#8C5D38" />
        <circle cx="0" cy="-10" r="32" fill="#8C5D38" />
        <ellipse cx="0" cy="14" rx="13" ry="12" fill="#8C5D38" />
        <circle cx="-27" cy="34" r="8" fill="#8C5D38" />
        <circle cx="27" cy="34" r="8" fill="#8C5D38" />
        <path
          d="M -90,8 Q 0,80 90,8 L 90,100 L -90,100 Z"
          fill="#F6EEE3"
          clipPath={`url(#${clipId})`}
        />
        <ellipse
          cx="-13"
          cy="-6"
          rx="5"
          ry="5.8"
          fill="#F6EEE3"
          transform="rotate(-8,-13,-6)"
        />
        <ellipse
          cx="13"
          cy="-6"
          rx="5"
          ry="5.8"
          fill="#F6EEE3"
          transform="rotate(8,13,-6)"
        />
        <ellipse cx="0" cy="12" rx="4.5" ry="3.4" fill="#F6EEE3" />
      </g>
    </svg>
  );
}
