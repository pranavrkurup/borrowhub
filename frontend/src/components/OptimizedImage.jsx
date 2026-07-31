import React, { useState, useCallback, useMemo } from 'react';
import { ImageOff } from 'lucide-react';

/**
 * Detects if a URL is a Cloudinary URL and extracts the base + public ID.
 * Supports both res.cloudinary.com and cloudinary fetch URLs.
 * Returns null for non-Cloudinary URLs.
 */
function parseCloudinaryUrl(src) {
  if (!src || typeof src !== 'string') return null;

  // Match: https://res.cloudinary.com/{cloud}/image/upload/{...}/{public_id}.{ext}
  const uploadMatch = src.match(
    /^(https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)((?:[^/]+\/)*?)([^/]+)$/
  );
  if (uploadMatch) {
    return {
      base: uploadMatch[1],
      existingTransforms: uploadMatch[2] || '',
      publicIdWithExt: uploadMatch[3],
    };
  }
  return null;
}

/**
 * Builds a Cloudinary URL with the given transformations.
 * @param {object} parsed - Output from parseCloudinaryUrl
 * @param {object} opts - { width, height, crop, gravity, quality, format, dpr, extra }
 */
function buildCloudinaryUrl(parsed, opts = {}) {
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
    // Override width for tiny placeholder
    const idx = parts.findIndex(p => p.startsWith('w_'));
    if (idx !== -1) parts[idx] = 'w_40';
    const hidx = parts.findIndex(p => p.startsWith('h_'));
    if (hidx !== -1) parts.splice(hidx, 1);
  }
  if (extra) parts.push(extra);

  return `${parsed.base}${parts.join(',')}/${parsed.publicIdWithExt}`;
}

/**
 * Generates srcSet entries for responsive images.
 */
function buildSrcSet(parsed, opts, widths = [400, 600, 800, 1200]) {
  return widths
    .map((w) => {
      const url = buildCloudinaryUrl(parsed, { ...opts, width: w, height: undefined, crop: 'fill' });
      return `${url} ${w}w`;
    })
    .join(', ');
}

// Default sizes for responsive grid layouts
const DEFAULT_SIZES = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';

/**
 * OptimizedImage — Source-agnostic image component with Cloudinary optimizations.
 *
 * Features:
 * - Cloudinary URL transformation (auto format, quality, responsive widths)
 * - Blur placeholder → sharp fade transition
 * - Responsive srcSet generation
 * - Lazy loading with decoding="async"
 * - CSS aspect-ratio to prevent CLS
 * - Error fallback with styled placeholder
 * - Works with Cloudinary, local, and external URLs
 *
 * @param {string} src - Image source URL
 * @param {string} alt - Alt text
 * @param {number} width - Desired display width (for Cloudinary transform)
 * @param {number} height - Desired display height (for Cloudinary transform, optional)
 * @param {string} aspectRatio - CSS aspect-ratio (e.g. "10/7", "1/1", "16/9")
 * @param {string} crop - Cloudinary crop mode (default: "fill")
 * @param {string} gravity - Cloudinary gravity (default: "auto")
 * @param {string} fetchpriority - "high" | "low" | "auto"
 * @param {string} sizes - Responsive sizes attribute
 * @param {string} className - Additional CSS classes for the container
 * @param {string} imgClassName - Additional CSS classes for the img element
 * @param {string} objectFit - CSS object-fit value (default: "cover")
 * @param {boolean} showBlurPlaceholder - Whether to show blur placeholder (default: true)
 */
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

  const handleLoad = useCallback(() => setLoaded(true), []);
  const handleError = useCallback(() => {
    setErrored(true);
    setLoaded(true); // Remove loading state
  }, []);

  const parsed = useMemo(() => parseCloudinaryUrl(src), [src]);

  const transformOpts = useMemo(
    () => ({ width, height, aspectRatio, crop, gravity }),
    [width, height, aspectRatio, crop, gravity]
  );

  // Compute optimized URL (Cloudinary) or use original
  const optimizedSrc = useMemo(() => {
    if (!parsed) return src;
    return buildCloudinaryUrl(parsed, transformOpts);
  }, [parsed, src, transformOpts]);

  // Compute srcSet for responsive images
  const srcSet = useMemo(() => {
    if (!parsed) return undefined;
    return buildSrcSet(parsed, transformOpts);
  }, [parsed, transformOpts]);

  // Compute tiny blur placeholder URL
  const blurSrc = useMemo(() => {
    if (!parsed || !showBlurPlaceholder) return null;
    return buildCloudinaryUrl(parsed, { ...transformOpts, blur: true });
  }, [parsed, showBlurPlaceholder, transformOpts]);

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
      {/* Blur placeholder (Cloudinary only) */}
      {blurSrc && !loaded && (
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

      {/* Skeleton pulse when no blur available */}
      {!blurSrc && !loaded && (
        <div className="absolute inset-0 bg-muted/30 animate-pulse" />
      )}

      {/* Main image */}
      <img
        src={optimizedSrc}
        srcSet={srcSet}
        sizes={srcSet ? sizes : undefined}
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
