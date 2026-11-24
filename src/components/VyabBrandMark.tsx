import React, { useState } from 'react';

interface VyabLogoProps {
  className?: string;
  compact?: boolean;
}

/**
 * Official VYAB 4-color speech-bubble geometric wordmark
 */
export function VyabWordmark({ className = '', compact = false }: VyabLogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <svg
        width={compact ? '60' : '76'}
        height={compact ? '24' : '30'}
        viewBox="0 0 136 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        {/* V - VYAB Coral with speech bubble */}
        <path d="M2 6H12.5L21 36L25.5 22H36L26 48H15L2 6Z" fill="#F04533" />
        <path d="M21 6H38V17H32L29.5 21L27 17H21V6Z" fill="#F04533" />
        <circle cx="26" cy="11.5" r="1.5" fill="white" />
        <circle cx="29.8" cy="11.5" r="1.5" fill="white" />
        <circle cx="33.6" cy="11.5" r="1.5" fill="white" />

        {/* Y - EU Cobalt Blue */}
        <path d="M44 6H54.5L62 22.5L69.5 6H80L67 31.5V48H57V31.5L44 6Z" fill="#1C69C7" />

        {/* A - Sunshine Ribbon Yellow with speech bubble */}
        <path d="M94.5 6H104.5L117 48H106.5L99.5 22L92.5 48H82L94.5 6Z" fill="#FFD014" />
        <path d="M79 29H95V38.5H83L80.5 42L81 38.5H79V29Z" fill="#FFD014" />
        <circle cx="84.5" cy="33.8" r="1.3" fill="white" />
        <circle cx="88" cy="33.8" r="1.3" fill="white" />
        <circle cx="91.5" cy="33.8" r="1.3" fill="white" />

        {/* B - Youth Emerald Green */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M119 6H131C136.5 6 139.5 9.2 139.5 14.5C139.5 18.2 137.8 20.8 134.8 22.2C138.6 23.5 140.5 26.8 140.5 31.2C140.5 38.5 135.8 48 126.5 48H119V6ZM127.5 14V21H130.5C132.4 21 133.5 19.6 133.5 17.5C133.5 15.4 132.4 14 130.5 14H127.5ZM127.5 28V39.5H130.8C133.2 39.5 134.5 37.8 134.5 33.8C134.5 30 133.2 28 130.8 28H127.5Z"
          fill="#1CD07A"
          transform="translate(-6, 0)"
        />
      </svg>
    </span>
  );
}

/**
 * Clean vector European Union 12-star Flag + Global Gateway co-branding mark
 */
export function EuGlobalGatewayMark({ dark = false }: { dark?: boolean }) {
  const stars = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 - 90) * (Math.PI / 180);
    return {
      cx: 18 + Math.cos(angle) * 7.4,
      cy: 12 + Math.sin(angle) * 7.4,
    };
  });

  return (
    <span className="inline-flex items-center gap-2.5 select-none">
      <svg width="36" height="24" viewBox="0 0 36 24" fill="none" aria-hidden="true" className="shrink-0 rounded-[2px]">
        <rect width="36" height="24" fill="#003399" />
        {stars.map((s, idx) => (
          <circle key={idx} cx={s.cx} cy={s.cy} r="1.25" fill="#FFD014" />
        ))}
      </svg>
      <span
        className={`text-left leading-[1.1] font-display text-xs font-bold tracking-tight ${
          dark ? 'text-white' : 'text-[#00104E]'
        }`}
      >
        Global
        <br />
        Gateway
      </span>
    </span>
  );
}

/**
 * Signature 4-color VYAB rounded squares bar from every official slide
 */
export function FourColorMark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`} aria-hidden="true">
      <span className="w-3 h-3 rounded-[3px] bg-[#F04533]" />
      <span className="w-3 h-3 rounded-[3px] bg-[#1C69C7]" />
      <span className="w-3 h-3 rounded-[3px] bg-[#FFD014]" />
      <span className="w-3 h-3 rounded-[3px] bg-[#1CD07A]" />
    </span>
  );
}

/**
 * Official VYAB Slanted Twin Yellow Bars Kicker (seen on PDF pages 20, 21, 29, 30, 34, 39)
 */
export function VyabKicker({
  label,
  variant = 'navy-bar',
  className = '',
}: {
  label: string;
  variant?: 'navy-bar' | 'light' | 'on-dark';
  className?: string;
}) {
  const bars = (
    <span
      className={`inline-block w-8 h-[5px] rounded-full shrink-0 ${
        variant === 'light' ? 'bg-[#2442D6]' : variant === 'on-dark' ? 'bg-[#FFD014]' : 'bg-white'
      }`}
      aria-hidden="true"
    />
  );

  if (variant === 'navy-bar') {
    return (
      <div
        className={`inline-flex items-center gap-3 px-4 py-2 bg-[#2442D6] text-white text-[11px] sm:text-xs font-bold tracking-[0.14em] uppercase ${className}`}
      >
        {bars}
        <span>{label}</span>
      </div>
    );
  }

  if (variant === 'on-dark') {
    return (
      <div
        className={`inline-flex items-center gap-3 text-[#FFD014] text-xs font-bold tracking-[0.14em] uppercase ${className}`}
      >
        {bars}
        <span>{label}</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-3 text-[#2442D6] text-[11px] sm:text-xs font-bold tracking-[0.16em] uppercase ${className}`}
    >
      {bars}
      <span>{label}</span>
    </div>
  );
}

/**
 * Official VYAB Yellow Swallowtail Ribbon Banner (seen on PDF pages 1, 12, 15, 33, 38)
 */
export function VyabRibbon({
  children,
  textColor = '#00104E',
  className = '',
}: {
  children: React.ReactNode;
  textColor?: string;
  className?: string;
}) {
  return (
    <div
      className={`vyab-ribbon inline-flex items-center justify-center bg-[#FFD014] px-8 sm:px-12 py-2.5 sm:py-3 font-display font-extrabold tracking-[0.06em] uppercase shadow-md ${className}`}
      style={{ color: textColor }}
    >
      {children}
    </div>
  );
}

/**
 * Official VYAB Concentric Cobalt Corner Rings
 */
export function VyabConcentricRings({
  className = '',
  strokeColor = '#123985',
}: {
  className?: string;
  strokeColor?: string;
}) {
  return (
    <svg
      className={`pointer-events-none select-none ${className}`}
      viewBox="0 0 360 360"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="180" cy="180" r="152" stroke={strokeColor} strokeWidth="28" />
      <circle cx="180" cy="180" r="96" stroke={strokeColor} strokeWidth="28" />
    </svg>
  );
}

/**
 * Official VYAB Twin Coral Red Corner Circles (seen on bottom-right of PDF pages 1, 20, 23, 38, 39)
 */
export function VyabCoralCircles({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`pointer-events-none select-none ${className}`}
      viewBox="0 0 260 120"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="64" cy="108" r="32" fill="#F04533" />
      <circle cx="182" cy="118" r="78" fill="#F04533" />
    </svg>
  );
}

interface FramedPhotoProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  fallbackTitle?: string;
  framed?: boolean;
}

/**
 * Zero-broken-image resilient photo container aligned with VYAB brand geometry
 */
export function FramedPhoto({
  src,
  alt,
  className = '',
  imgClassName = '',
  fallbackTitle,
  framed = true,
}: FramedPhotoProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center bg-[#00104E] text-white/90 p-6 text-center rounded-xl ${className}`}
      >
        <FourColorMark className="mb-3" />
        <span className="font-display text-base font-bold">{fallbackTitle || alt}</span>
      </div>
    );
  }

  return (
    <div
      className={`${
        framed ? 'editorial-frame' : 'relative overflow-hidden'
      } bg-[#00104E]/8 ${className}`}
    >
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className={`w-full h-full object-cover transition-transform duration-700 ease-out ${imgClassName}`}
      />
    </div>
  );
}
