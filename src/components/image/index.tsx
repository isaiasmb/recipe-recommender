import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

const finishImageReady = (img: HTMLImageElement, onReady: () => void) => {
  const done = () => onReady()
  if (typeof img.decode === "function") {
    img.decode().then(done).catch(done)
  } else {
    done()
  }
}

type ImageProps = {
  src: string
  alt: string
  className?: string
}

const Image = ({ src, alt, className }: ImageProps) => {
  const [imageReady, setImageReady] = useState(false)

  useEffect(() => {
    setImageReady(false)
  }, [src])

  return (
    <div
      className={cn(
        "relative aspect-video w-full overflow-hidden rounded-t-xl bg-muted",
        className
      )}
    >
      <div
        className={cn(
          "absolute inset-0 z-20 overflow-hidden rounded-[inherit] transition-opacity duration-300",
          imageReady ? "pointer-events-none opacity-0" : "opacity-100"
        )}
        aria-hidden
      >
        <div className="absolute inset-0 bg-muted" />
        <div
          className="absolute inset-0 bg-linear-to-r from-muted via-background/90 to-muted bg-size-[200%_100%] dark:via-foreground/15"
          style={{
            animation: "meal-thumb-shimmer 1.8s ease-in-out infinite",
          }}
        />
      </div>

      <img
        src={src}
        alt={alt}
        className={cn(
          "absolute inset-0 z-10 h-full w-full object-cover transition-opacity duration-500",
          imageReady ? "opacity-100" : "opacity-0"
        )}
        decoding="async"
        loading="eager"
        onLoad={(e) =>
          finishImageReady(e.currentTarget, () => setImageReady(true))
        }
        onError={() => setImageReady(true)}
      />

      {imageReady && (
        <div
          className="pointer-events-none absolute inset-0 z-30 rounded-[inherit] bg-black/35"
          aria-hidden
        />
      )}
    </div>
  )
}

export default Image
