// Minimal brand mark. Tight tracking, a single hairline peak glyph. Meant to feel
// considered but never shouty — a logo that gets out of the way of photography.
const Wordmark = ({ size = 'md', className = '' }) => {
  const dim = size === 'lg' ? 28 : size === 'sm' ? 16 : 20;
  const text = size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-sm' : 'text-base';
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="peak-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5f5f7" />
            <stop offset="100%" stopColor="#9ec8ff" />
          </linearGradient>
        </defs>
        <path
          d="M3 25 L12 11 L17 18 L21 13 L29 25 Z"
          fill="url(#peak-grad)"
        />
        <circle cx="22" cy="7.5" r="1.6" fill="#f5f5f7" />
      </svg>
      <span className={`display ${text} text-frost-50`}>
        Kirneshflix
      </span>
    </div>
  );
};

export default Wordmark;
