import { useEffect, useState, type CSSProperties } from 'react';

export type OptimizedSliderImageProps = {
  src: string;
  alt: string;
  className?: string;
  onError?: () => void;
  width?: number;
  height?: number;
  objectFit?: 'cover' | 'contain' | 'fill';
  objectPosition?: string;
};

export function OptimizedSliderImage({
  src,
  alt,
  className = '',
  onError,
  width = 300,
  height = 400,
  objectFit = 'cover',
  objectPosition = 'center',
}: OptimizedSliderImageProps) {
  const [imageState, setImageState] = useState({
    isLoading: true,
    hasError: false,
    naturalWidth: 0,
    naturalHeight: 0,
  });

  useEffect(() => {
    const img = new Image();

    const handleLoad = () => {
      setImageState({
        isLoading: false,
        hasError: false,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
      });
    };

    const handleError = () => {
      setImageState((prev) => ({ ...prev, isLoading: false, hasError: true }));
      onError?.();
    };

    img.onload = handleLoad;
    img.onerror = handleError;
    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, onError]);

  if (imageState.hasError) return null;

  // 이미지 비율 계산
  const calculateDimensions = () => {
    if (!imageState.naturalWidth || !imageState.naturalHeight) {
      return { width, height };
    }

    const imageRatio = imageState.naturalWidth / imageState.naturalHeight;
    const containerRatio = width / height;

    if (objectFit === 'contain') {
      if (imageRatio > containerRatio) {
        // 이미지가 더 넓은 경우
        return {
          width,
          height: width / imageRatio,
        };
      } else {
        // 이미지가 더 높은 경우
        return {
          width: height * imageRatio,
          height,
        };
      }
    }

    return { width, height };
  };

  const dimensions = calculateDimensions();

  const imageStyles: CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit,
    objectPosition,
    opacity: imageState.isLoading ? 0 : 1,
    transition: 'opacity 0.3s ease-in-out',
  };

  // webp 이미지 URL 생성 함수
  const getWebpUrl = (url: string) => {
    const baseUrl = url.split('?')[0];
    return `${baseUrl}?format=webp&w=${dimensions.width}&h=${dimensions.height}&q=75`;
  };

  return (
    <div
      className={`relative ${className}`}
      style={{
        width: dimensions.width,
        height: dimensions.height,
        margin: '0 auto',
        overflow: 'hidden',
      }}
    >
      <picture>
        <source srcSet={getWebpUrl(src)} type="image/webp" />
        <img
          src={src}
          alt={alt}
          style={imageStyles}
          loading="lazy"
          className="rounded-lg"
        />
      </picture>
    </div>
  );
}
