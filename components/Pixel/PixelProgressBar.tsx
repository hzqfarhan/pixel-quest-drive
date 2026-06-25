'use client';

interface PixelProgressBarProps {
  value: number;
  max: number;
  color?: string;
  label?: string;
  showText?: boolean;
  height?: number;
  className?: string;
}

export default function PixelProgressBar({
  value,
  max,
  color = 'var(--pixel-yellow)',
  label,
  showText = true,
  height = 20,
  className = '',
}: PixelProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {label && (
        <span className="text-[8px] font-pixel uppercase whitespace-nowrap min-w-[24px]">
          {label}
        </span>
      )}
      <div
        className="flex-1 relative"
        style={{
          height: `${height}px`,
          border: '3px solid var(--pixel-shadow)',
          background: '#2a2a3e',
        }}
      >
        {/* Fill bar with animated stripes */}
        <div
          className="h-full relative overflow-hidden transition-all duration-300"
          style={{
            width: `${percentage}%`,
            background: color,
          }}
        >
          {/* Stripe overlay */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(
                90deg,
                transparent,
                transparent 6px,
                rgba(255,255,255,0.15) 6px,
                rgba(255,255,255,0.15) 8px
              )`,
              animation: 'progress-stripe 0.5s linear infinite',
            }}
          />
        </div>

        {/* Value text */}
        {showText && (
          <span
            className="absolute inset-0 flex items-center justify-center text-[7px] font-pixel text-white"
            style={{
              textShadow: '1px 1px 0 rgba(0,0,0,0.8)',
            }}
          >
            {value}/{max}
          </span>
        )}
      </div>
    </div>
  );
}
