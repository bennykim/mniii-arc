import { useEffect, useState, type CSSProperties } from 'react';

type FullscreenImageProps = {
  src: string;
  srcSet?: string;
  alt: string;
  className?: string;
  fitMode?: 'cover' | 'contain';
  containerStyle?: CSSProperties;
  onError?: () => void;
  zIndex?: number;
};

export function FullscreenImage({
  src,
  srcSet,
  alt,
  className = '',
  fitMode = 'cover',
  containerStyle,
  onError,
  zIndex = -1,
}: FullscreenImageProps) {
  const [imageState, setImageState] = useState({
    isLoading: true,
    hasError: false,
  });

  useEffect(() => {
    const img = new Image();

    const handleLoad = () => {
      setImageState({ isLoading: false, hasError: false });
    };

    const handleError = () => {
      setImageState({ isLoading: false, hasError: true });
      onError?.();
    };

    img.onload = handleLoad;
    img.onerror = handleError;

    if (srcSet) {
      img.srcset = srcSet;
    }
    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, srcSet, onError]);

  if (imageState.hasError) return null;

  const containerStyles: CSSProperties = {
    position: 'fixed',
    inset: 0,
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    zIndex,
    ...containerStyle,
  };

  const imageStyles: CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    objectFit: fitMode,
    opacity: imageState.isLoading ? 0 : 1,
    transition: 'opacity 0.3s ease-in-out',
  };

  return (
    <div style={containerStyles} className={className}>
      <picture>
        {srcSet && <source srcSet={srcSet} type="image/webp" />}
        <img src={src} alt={alt} style={imageStyles} loading="eager" />
      </picture>
    </div>
  );
}
