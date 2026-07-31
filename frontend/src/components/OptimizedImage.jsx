import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { ImageOff } from 'lucide-react';

/**
 * Detects if a URL is a Cloudinary URL and extracts the base, existing path, and filename.
 */
function parseCloudinaryUrl(src) {
  if (!src || typeof src !== 'string') return null;

  try {
    // Match: https://res.cloudinary.com/{cloud}/image/upload/{existingTransforms}/{public_id}.{ext}
    const uploadMatch = src.match(
      /^(https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)((?:[^/]+\/)*?)([^/]+)$/
    );
    
    if (uploadMatch) {
      const existingTransforms = uploadMatch[2] || '';
      
      // Check if it's already transformed (contains known transformation patterns like f_auto, w_500, etc.)
      // We look for segments that contain comma-separated key_value pairs or single key_value pairs typical of cloudinary
      const isTransformed = existingTransforms.split('/').some(segment => 
        /^(?:[a-z]{1,3}_[\w\-:\.]+(?:,|$))+/.test(segment)
      );

      return {
        base: uploadMatch[1],
        existingTransforms,
        publicIdWithExt: uploadMatch[3],
        isTransformed
      };
    }
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Cloudinary parsing error:', err);
    }
  }
  return null;
}

/**
 * Builds a Cloudinary URL with the given transformations.
 */
function buildCloudinaryUrl(parsed, opts = {}) {
  try {
    const {
      width,
      height,
      aspectRatio,
      crop = 'fill',
      gravity = 'auto',
      quality = 'auto',
      format = 'auto',
      dpr = 'auto',
      blur = false,
      extra = '',
    } = opts;

    const parts = [`f_${format}`, `q_${quality}`, `dpr_${dpr}`];
    if (crop) parts.push(`c_${crop}`);
    if (gravity) parts.push(`g_${gravity}`);
    if (width) parts.push(`w_${width}`);
    if (height) {
      parts.push(`h_${height}`);
    } else if (aspectRatio) {
      parts.push(`ar_${aspectRatio.replace('/', ':')}`);
    }
    if (blur) {
      parts.push('e_blur:1800', 'q_10');
      const idx = parts.findIndex(p => p.startsWith('w_'));
      if (idx !== -1) parts[idx] = 'w_40';
      const hidx = parts.findIndex(p => p.startsWith('h_'));
      if (hidx !== -1) parts.splice(hidx, 1);
    }
    if (extra) parts.push(extra);

    // IMPORTANT: Include parsed.existingTransforms to preserve folders and version numbers
    return `${parsed.base}${parts.join(',')}/${parsed.existingTransforms}${parsed.publicIdWithExt}`;
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Cloudinary build error:', err);
    }
    throw err;
  }
}

/**
 * Generates srcSet entries for responsive images.
 */
function buildSrcSet(parsed, opts, widths = [400, 600, 800, 1200]) {
  try {
    return widths
      .map((w) => {
        const url = buildCloudinaryUrl(parsed, { ...opts, width: w, height: undefined, crop: 'fill' });
        return `${url} ${w}w`;
      })
      .join(', ');
  } catch (err) {
    return undefined;
  }
}

const DEFAULT_SIZES = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';

const OptimizedImage = React.memo(function OptimizedImage({
  src,
  alt = '',
  width,
  height,
  aspectRatio = '10/7',
  crop = 'fill',
  gravity = 'auto',
  fetchpriority = 'low',
  sizes = DEFAULT_SIZES,
  className = '',
  imgClassName = '',
  objectFit = 'cover',
  showBlurPlaceholder = true,
}) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const [useOriginalFallback, setUseOriginalFallback] = useState(false);

  // Reset state if src changes
  useEffect(() => {
    setLoaded(false);
    setErrored(false);
    setUseOriginalFallback(false);
  }, [src]);

  const parsed = useMemo(() => parseCloudinaryUrl(src), [src]);

  const transformOpts = useMemo(
    () => ({ width, height, aspectRatio, crop, gravity }),
    [width, height, aspectRatio, crop, gravity]
  );

  const optimizedSrc = useMemo(() => {
    if (!parsed || parsed.isTransformed) return src;
    try {
      return buildCloudinaryUrl(parsed, transformOpts);
    } catch (e) {
      return src; // Fallback to original if transformation fails
    }
  }, [parsed, src, transformOpts]);

  const srcSet = useMemo(() => {
    if (!parsed || parsed.isTransformed) return undefined;
    return buildSrcSet(parsed, transformOpts);
  }, [parsed, transformOpts]);

  const blurSrc = useMemo(() => {
    if (!parsed || parsed.isTransformed || !showBlurPlaceholder) return null;
    try {
      return buildCloudinaryUrl(parsed, { ...transformOpts, blur: true });
    } catch (e) {
      return null;
    }
  }, [parsed, showBlurPlaceholder, transformOpts]);

  const handleLoad = useCallback(() => setLoaded(true), []);
  
  const handleError = useCallback(() => {
    // If it fails on the optimized Cloudinary URL, retry with the original URL
    if (parsed && !parsed.isTransformed && !useOriginalFallback) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Failed to load optimized image, retrying with original: ${src}`);
      }
      setUseOriginalFallback(true);
      return;
    }
    // If it fails on the original (or it's already using fallback), show error placeholder
    setErrored(true);
    setLoaded(true);
  }, [parsed, useOriginalFallback, src]);

  const currentSrc = useOriginalFallback ? src : optimizedSrc;
  const currentSrcSet = useOriginalFallback ? undefined : srcSet;

  if (errored) {
    return (
      <div
        className={`flex items-center justify-center bg-muted/30 text-muted-foreground/40 ${className}`}
        style={{ aspectRatio }}
        role="img"
        aria-label={alt || 'Image unavailable'}
      >
        <ImageOff size={32} strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden bg-muted/20 ${className}`}
      style={{ aspectRatio }}
    >
      {/* Blur placeholder */}
      {blurSrc && !loaded && !useOriginalFallback && (
        <img
          src={blurSrc}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full scale-110"
          style={{ objectFit, filter: 'blur(10px)' }}
          loading="eager"
          decoding="sync"
        />
      )}

      {/* Skeleton pulse */}
      {!blurSrc && !loaded && (
        <div className="absolute inset-0 bg-muted/30 animate-pulse" />
      )}

      {/* Main image */}
      <img
        src={currentSrc}
        srcSet={currentSrcSet}
        sizes={currentSrcSet ? sizes : undefined}
        alt={alt}
        loading={fetchpriority === 'high' ? 'eager' : 'lazy'}
        decoding="async"
        fetchpriority={fetchpriority}
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full transition-opacity duration-200 ease-out ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${imgClassName}`}
        style={{ objectFit }}
      />
    </div>
  );
});

export default OptimizedImage;
