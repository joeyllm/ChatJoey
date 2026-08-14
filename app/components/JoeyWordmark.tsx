import { useId, type SVGProps } from "react";

export default function JoeyWordmark(props: SVGProps<SVGSVGElement>) {
  const titleId = useId();
  const inkClass = `joey-ink-${useId().replace(/:/g, "")}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={256}
      height={76}
      viewBox="0 0 256 76"
      role="img"
      aria-labelledby={titleId}
      {...props}
    >
      <title id={titleId}>JoeyLLM</title>
      <style>{`.${inkClass} { fill: #172033; }`}</style>
      <text
        x="128"
        y="54"
        textAnchor="middle"
        fontFamily="Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif"
        fontSize="56"
        fontWeight="500"
        letterSpacing="-1.5"
      >
        <tspan className={inkClass}>Joey</tspan>
        <tspan fill="#C9762F">LLM</tspan>
      </text>
    </svg>
  );
}
