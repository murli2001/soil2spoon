import { memo, useRef, useCallback } from 'react'

const EXTENSIONS_TO_TRY = ['.jpg', '.jpeg', '.png', '.webp']

function getAlternateUrls(src) {
  if (!src || typeof src !== 'string' || src.startsWith('http')) return []
  const lastDot = src.lastIndexOf('.')
  if (lastDot === -1) return []
  const base = src.slice(0, lastDot)
  const used = src.slice(lastDot).toLowerCase()
  return EXTENSIONS_TO_TRY.filter((ext) => ext !== used).map((ext) => base + ext)
}

function ProductImage({ src, fallbackSrc, alt, className }) {
  const tryIndex = useRef(0)
  const alternates = useRef(getAlternateUrls(src))

  const handleError = useCallback(
    (e) => {
      const img = e.target
      const alternatesList = alternates.current
      if (tryIndex.current < alternatesList.length) {
        img.src = alternatesList[tryIndex.current]
        tryIndex.current += 1
        return
      }
      if (fallbackSrc && img.src !== fallbackSrc) {
        img.src = fallbackSrc
      }
    },
    [fallbackSrc]
  )

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={handleError}
    />
  )
}

export default memo(ProductImage)
