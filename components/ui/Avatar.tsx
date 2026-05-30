import { cn } from "@/lib/utils";
import { forwardRef, type ReactNode } from "react";

interface AvatarProps {
  className?: string;
  children: ReactNode;
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, children }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className
      )}
    >
      {children}
    </div>
  )
);

Avatar.displayName = "Avatar";

interface AvatarImageProps {
  className?: string;
  src?: string;
  alt?: string;
}

const AvatarImage = forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, src, alt = "Avatar" }, ref) => (
    <img
      ref={ref}
      src={src}
      alt={alt}
      className={cn("aspect-square h-full w-full object-cover", className)}
    />
  )
);

AvatarImage.displayName = "AvatarImage";

interface AvatarFallbackProps {
  className?: string;
  children: ReactNode;
}

const AvatarFallback = forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ className, children }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-muted",
        className
      )}
    >
      {children}
    </div>
  )
);

AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
