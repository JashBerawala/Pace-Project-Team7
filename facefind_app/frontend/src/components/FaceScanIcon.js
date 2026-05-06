import React from 'react';

/**
 * Futuristic face-scan SVG icon used as the FaceFind brand mark.
 * Drop-in replacement for the old "F" letter box.
 */
export default function FaceScanIcon({ size = 28, animated = false, className = '' }) {
  // Unique gradient IDs per instance to avoid SVG defs conflicts
  const uid = React.useId().replace(/:/g, '');

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${animated ? 'icon-glitch' : ''} ${className}`}
    >
      {/* Corner scan brackets */}
      <path d="M2 9V3h6"   stroke={`url(#${uid}g1)`} strokeWidth="2"   strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M34 9V3h-6" stroke={`url(#${uid}g1)`} strokeWidth="2"   strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 27v6h6"  stroke={`url(#${uid}g1)`} strokeWidth="2"   strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M34 27v6h-6" stroke={`url(#${uid}g1)`} strokeWidth="2"  strokeLinecap="round" strokeLinejoin="round"/>

      {/* Face outline — dashed ellipse */}
      <ellipse cx="18" cy="16" rx="8" ry="9"
        stroke={`url(#${uid}g2)`} strokeWidth="1.4" strokeDasharray="2 1.5" fill="none"/>

      {/* Eyes */}
      <circle cx="14.5" cy="14" r="1.5" fill={`url(#${uid}g1)`}/>
      <circle cx="21.5" cy="14" r="1.5" fill={`url(#${uid}g1)`}/>

      {/* Smile arc */}
      <path d="M14 19.5 Q18 22.5 22 19.5"
        stroke={`url(#${uid}g1)`} strokeWidth="1.2" strokeLinecap="round" fill="none"/>

      {/* Horizontal scan line across face */}
      <line x1="10" y1="16" x2="26" y2="16"
        stroke={`url(#${uid}g3)`} strokeWidth="1" strokeDasharray="1.5 1" opacity="0.85"/>

      {/* Center dot */}
      <circle cx="18" cy="16" r="1" fill="#f59e0b" opacity="0.6"/>

      <defs>
        <linearGradient id={`${uid}g1`} x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f59e0b"/>
          <stop offset="1" stopColor="#ef4444"/>
        </linearGradient>
        <linearGradient id={`${uid}g2`} x1="10" y1="7" x2="26" y2="25" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f59e0b" stopOpacity="0.7"/>
          <stop offset="1" stopColor="#ef4444" stopOpacity="0.4"/>
        </linearGradient>
        <linearGradient id={`${uid}g3`} x1="10" y1="16" x2="26" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f59e0b" stopOpacity="0"/>
          <stop offset="0.5" stopColor="#f59e0b"/>
          <stop offset="1" stopColor="#f59e0b" stopOpacity="0"/>
        </linearGradient>
      </defs>
    </svg>
  );
}