interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

/**
 * Logo principal de Portfólio — marca de cartas apiladas que forman una "P"
 * Colores: verde esmeralda + blanco + slate oscuro
 */
export const AppLogo = ({ size = 36, showText = false, className = '' }: LogoProps) => (
  <div className={`flex items-center gap-2.5 select-none ${className}`}>
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Portfólio logo"
    >
      {/* Tarjeta de fondo (gris) */}
      <rect x="6" y="10" width="26" height="22" rx="4" fill="#2d3748" opacity="0.5" transform="rotate(-6 6 10)" />
      {/* Tarjeta media */}
      <rect x="7" y="9" width="26" height="22" rx="4" fill="#1e293b" opacity="0.8" transform="rotate(-2 7 9)" />
      {/* Tarjeta principal */}
      <rect x="7" y="8" width="26" height="22" rx="4" fill="#0f172a" />
      {/* Franja verde superior */}
      <rect x="7" y="8" width="26" height="6" rx="4" fill="#22c55e" />
      <rect x="7" y="11" width="26" height="3" fill="#22c55e" />
      {/* Líneas de contenido */}
      <rect x="11" y="19" width="14" height="2" rx="1" fill="#e2e8f0" opacity="0.9" />
      <rect x="11" y="23" width="10" height="2" rx="1" fill="#94a3b8" opacity="0.7" />
      <rect x="11" y="27" width="7" height="1.5" rx="0.75" fill="#64748b" opacity="0.6" />
      {/* Punto avatar */}
      <circle cx="30" cy="14" r="3" fill="white" opacity="0.95" />
      <circle cx="30" cy="14" r="1.5" fill="#22c55e" />
    </svg>

    {showText && (
      <span className="font-bold text-xl tracking-tight">
        port<span className="text-green-400">fólio</span>
      </span>
    )}
  </div>
);

/** Versión solo texto para usar en contextos claros */
export const AppWordmark = ({ className = '' }: { className?: string }) => (
  <span className={`font-bold text-xl tracking-tight ${className}`}>
    port<span className="text-green-400">fólio</span>
  </span>
);
