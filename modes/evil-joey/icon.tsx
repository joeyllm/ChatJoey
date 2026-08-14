import { useId, type SVGProps } from "react";

export default function EvilJoeyIcon(props: SVGProps<SVGSVGElement>) {
  const id = useId().replace(/:/g, "");
  const titleId = `evil-joey-icon-title-${id}`;
  const clipId = `evil-joey-icon-clip-${id}`;

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
      <title id={titleId}>Evil Joey</title>
      <defs>
        <clipPath id={clipId}>
          <circle cx="0" cy="0" r="82" />
        </clipPath>
      </defs>
      <g transform="translate(82,82)">
        <circle cx="0" cy="0" r="82" fill="#C0392B" />
        <path d="M -18,-40 L -26,-64 L -10,-48 Z" fill="#F2B84B" />
        <path d="M 18,-40 L 26,-64 L 10,-48 Z" fill="#F2B84B" />
        <ellipse
          cx="-27"
          cy="-44"
          rx="9"
          ry="20"
          fill="#5A1F17"
          transform="rotate(-28,-27,-44)"
        />
        <ellipse
          cx="27"
          cy="-44"
          rx="9"
          ry="20"
          fill="#5A1F17"
          transform="rotate(28,27,-44)"
        />
        <ellipse cx="0" cy="42" rx="26" ry="22" fill="#5A1F17" />
        <circle cx="0" cy="-10" r="32" fill="#5A1F17" />
        <ellipse cx="0" cy="14" rx="13" ry="12" fill="#5A1F17" />
        <circle cx="-27" cy="34" r="8" fill="#5A1F17" />
        <circle cx="27" cy="34" r="8" fill="#5A1F17" />
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
          rx="4.2"
          ry="1.6"
          fill="#F6EEE3"
          transform="rotate(8,13,-6)"
        />
        <path
          d="M -10,22 Q 2,32 16,18"
          fill="none"
          stroke="#F6EEE3"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
