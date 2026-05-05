/**
 * OurozMark – Brand monogram (stylized Tifinagh Yaz / OUROZ "K")
 * Renders as inline SVG with maroon→gold gradient stroke.
 */
interface OurozMarkProps {
  size?: number;
  className?: string;
  /** Override stroke width in viewBox units (default 8) */
  strokeWidth?: number;
}

export default function OurozMark({ size = 64, className, strokeWidth = 8 }: OurozMarkProps) {
  const id = 'ouroz-mark-grad';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="OUROZ"
      role="img"
    >
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#C85A5A" />
          <stop offset="50%" stopColor="#A63D3D" />
          <stop offset="100%" stopColor="#7F9460" />
        </linearGradient>
      </defs>
      {/* Base shape matching Tifinagh Yaz (ⵣ) */}
      
      {/* Central vertical line */}
      <path
        d="M32 10 V54"
        stroke={`url(#${id})`}
        strokeWidth={strokeWidth}
        strokeLinecap="square"
      />
      
      {/* Top arc */}
      <path
        d="M16 16 C 16 32, 48 32, 48 16"
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth={strokeWidth}
        strokeLinecap="square"
      />
      
      {/* Bottom arc */}
      <path
        d="M16 48 C 16 32, 48 32, 48 48"
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth={strokeWidth}
        strokeLinecap="square"
      />
    </svg>
  );
}
