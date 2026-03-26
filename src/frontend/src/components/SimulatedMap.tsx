import { useEffect, useRef } from "react";

interface SimulatedMapProps {
  className?: string;
  showDriverDot?: boolean;
  compact?: boolean;
}

export default function SimulatedMap({
  className = "",
  showDriverDot = true,
  compact = false,
}: SimulatedMapProps) {
  const dotRef = useRef<SVGCircleElement>(null);
  const dotGlowRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    let frame: number;
    let t = 0;
    const animate = () => {
      t += 0.003;
      const progress = (Math.sin(t) + 1) / 2;
      const x = 80 + progress * 280;
      const y = compact ? 60 + progress * 60 : 80 + progress * 120;
      if (dotRef.current) {
        dotRef.current.setAttribute("cx", String(x));
        dotRef.current.setAttribute("cy", String(y));
      }
      if (dotGlowRef.current) {
        dotGlowRef.current.setAttribute("cx", String(x));
        dotGlowRef.current.setAttribute("cy", String(y));
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [compact]);

  const h = compact ? 180 : 320;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-[oklch(0.12_0.01_240)] ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(oklch(0.2 0.01 240 / 0.4) 1px, transparent 1px), linear-gradient(90deg, oklch(0.2 0.01 240 / 0.4) 1px, transparent 1px)",
        backgroundSize: compact ? "30px 30px" : "40px 40px",
      }}
    >
      <svg
        width="100%"
        height={h}
        viewBox={`0 0 440 ${h}`}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0"
        aria-label="Ride route map"
        role="img"
      >
        <title>Ride route map</title>
        {/* Road base */}
        <path
          d={
            compact
              ? "M 40 150 Q 150 80 220 100 Q 300 120 400 60"
              : "M 60 280 Q 160 180 220 200 Q 290 220 380 100"
          }
          stroke="oklch(0.35 0.015 240)"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
        />
        {/* Route line */}
        <path
          d={
            compact
              ? "M 40 150 Q 150 80 220 100 Q 300 120 400 60"
              : "M 60 280 Q 160 180 220 200 Q 290 220 380 100"
          }
          stroke="oklch(0.795 0.196 150 / 0.7)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="8 6"
          className="map-route"
        />
        {/* Start pin */}
        <circle
          cx={compact ? 40 : 60}
          cy={compact ? 150 : 280}
          r="14"
          fill="oklch(0.795 0.196 150 / 0.2)"
        />
        <circle
          cx={compact ? 40 : 60}
          cy={compact ? 150 : 280}
          r="8"
          fill="oklch(0.795 0.196 150)"
        />
        {/* End marker */}
        <rect
          x={compact ? 390 : 370}
          y={compact ? 48 : 88}
          width="20"
          height="24"
          rx="4"
          fill="oklch(0.726 0.146 165)"
        />
        <text
          x={compact ? 400 : 380}
          y={compact ? 64 : 104}
          textAnchor="middle"
          fontSize="10"
          fill="white"
          fontWeight="bold"
        >
          B
        </text>
        {/* Animated driver dot */}
        {showDriverDot && (
          <>
            <circle
              ref={dotGlowRef}
              cx="220"
              cy="200"
              r="16"
              fill="oklch(0.795 0.196 150 / 0.2)"
            />
            <circle
              ref={dotRef}
              cx="220"
              cy="200"
              r="8"
              fill="oklch(0.795 0.196 150)"
            />
          </>
        )}
      </svg>
      {/* Labels */}
      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-card/80 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur-sm">
        <span className="h-2 w-2 rounded-full bg-brand" />
        Pickup
      </div>
      <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-card/80 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur-sm">
        <span className="h-2 w-2 rounded-full bg-brand-teal" />
        Destination
      </div>
    </div>
  );
}
