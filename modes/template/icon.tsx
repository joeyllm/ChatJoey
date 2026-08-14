import { useId, type SVGProps } from "react";

/**
 * Placeholder badge icon — replace with your mode's own art. Keep the same
 * component shape (accepts SVGProps, spread onto the root <svg>) so it drops
 * into the sidebar mark and chat avatar slots without other changes.
 */
export default function TemplateIcon(props: SVGProps<SVGSVGElement>) {
  const id = useId().replace(/:/g, "");
  const titleId = `template-icon-title-${id}`;

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
      <title id={titleId}>Template Joey</title>
      <circle cx="82" cy="82" r="82" fill="#8a8f9c" />
      <text
        x="82"
        y="100"
        textAnchor="middle"
        fontFamily="Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif"
        fontSize="72"
        fontWeight="700"
        fill="#ffffff"
      >
        ?
      </text>
    </svg>
  );
}
