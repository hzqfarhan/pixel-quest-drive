'use client';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      {/* Pixel tombstone SVG */}
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mb-4"
        style={{ imageRendering: 'pixelated' }}
      >
        {/* Tombstone body */}
        <rect x="16" y="20" width="48" height="48" fill="#B0BEC5" />
        <rect x="20" y="12" width="40" height="12" fill="#B0BEC5" />
        <rect x="24" y="8" width="32" height="8" fill="#B0BEC5" />
        {/* Top rounded */}
        <rect x="28" y="4" width="24" height="4" fill="#B0BEC5" />
        {/* Shadow */}
        <rect x="16" y="20" width="4" height="48" fill="#90A4AE" />
        <rect x="60" y="20" width="4" height="48" fill="#78909C" />
        {/* RIP text */}
        <rect x="28" y="24" width="4" height="12" fill="#546E7A" />
        <rect x="32" y="24" width="4" height="4" fill="#546E7A" />
        <rect x="32" y="32" width="4" height="4" fill="#546E7A" />
        <rect x="40" y="24" width="4" height="12" fill="#546E7A" />
        <rect x="48" y="24" width="4" height="12" fill="#546E7A" />
        <rect x="48" y="24" width="8" height="4" fill="#546E7A" />
        <rect x="52" y="24" width="4" height="8" fill="#546E7A" />
        <rect x="48" y="28" width="8" height="4" fill="#546E7A" />
        {/* Ground */}
        <rect x="4" y="68" width="72" height="8" fill="#795548" />
        <rect x="0" y="72" width="80" height="8" fill="#5D4037" />
        {/* Grass */}
        <rect x="8" y="66" width="4" height="4" fill="#4CAF50" />
        <rect x="28" y="64" width="4" height="6" fill="#4CAF50" />
        <rect x="60" y="66" width="4" height="4" fill="#4CAF50" />
      </svg>

      <div className="text-[12px] font-pixel text-[var(--pixel-gray)] text-center mb-2">
        THIS DUNGEON IS EMPTY
      </div>
      <div className="text-[8px] font-pixel text-[var(--pixel-gray)] text-center opacity-60">
        No loot was found in this area...
      </div>
    </div>
  );
}
