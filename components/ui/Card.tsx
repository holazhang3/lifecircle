import { cn } from "@/lib/utils";
import { forwardRef, type ReactNode } from "react";

interface CardProps {
  className?: string;
  children: ReactNode;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-medium",
        className
      )}
    >
      {children}
    </div>
  )
);

Card.displayName = "Card";

interface CardContentProps {
  className?: string;
  children: ReactNode;
}

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children }, ref) => (
    <div ref={ref} className={cn("p-4 sm:p-6", className)}>
      {children}
    </div>
  )
);

CardContent.displayName = "CardContent";

interface CardHeaderProps {
  className?: string;
  children: ReactNode;
}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-4 sm:p-6", className)}>
      {children}
    </div>
  )
);

CardHeader.displayName = "CardHeader";

interface CardTitleProps {
  className?: string;
  children: ReactNode;
}

const CardTitle = forwardRef<HTMLParagraphElement, CardTitleProps>(
  ({ className, children }, ref) => (
    <h3
      ref={ref}
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    >
      {children}
    </h3>
  )
);

CardTitle.displayName = "CardTitle";

interface CardDescriptionProps {
  className?: string;
  children: ReactNode;
}

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, children }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
    >
      {children}
    </p>
  )
);

CardDescription.displayName = "CardDescription";

export { Card, CardContent, CardHeader, CardTitle, CardDescription };
