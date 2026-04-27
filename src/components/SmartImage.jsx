import { useState } from 'react';

const SmartImage = ({
  src,
  alt = '',
  palette,
  className = '',
  imgClassName = '',
  priority = false,
  onClick,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const from = palette?.from || '#180e3c';
  const to   = palette?.to   || '#0f0a24';

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onClick={onClick}
      style={{
        background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
      }}
    >
      {!failed && (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full object-cover img-blur-up ${loaded ? 'loaded' : ''} ${imgClassName}`}
        />
      )}
    </div>
  );
};

export default SmartImage;
