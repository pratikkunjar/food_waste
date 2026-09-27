import React, { useState } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  credit?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  credit,
  className = '',
  fallbackSrc = 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80',
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative overflow-hidden group">
      <img
        src={imgSrc}
        alt={alt || 'AnnaDhara authentic photographic asset'}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          if (imgSrc !== fallbackSrc) setImgSrc(fallbackSrc);
        }}
        className={`transition-all duration-500 ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
        } ${className}`}
        {...props}
      />
      {credit && (
        <span className="absolute bottom-1.5 right-2 px-2 py-0.5 text-[10px] rounded bg-slate-900/80 backdrop-blur text-slate-300 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          Photo: {credit} (Unsplash)
        </span>
      )}
    </div>
  );
};
