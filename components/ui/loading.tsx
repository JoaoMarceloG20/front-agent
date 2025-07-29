"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingProps {
  variant?: "spinner" | "pulse" | "skeleton" | "dots";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  text?: string;
}

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
  avatar?: boolean;
}

interface LoadingDotsProps {
  className?: string;
}

// Componente principal de Loading
export function Loading({
  variant = "spinner",
  size = "md",
  className,
  text,
}: LoadingProps) {
  const baseClasses = "flex items-center justify-center";

  switch (variant) {
    case "spinner":
      return (
        <div className={cn(baseClasses, className)}>
          <LoadingSpinner size={size} />
          {text && <span className="ml-2 text-muted-foreground">{text}</span>}
        </div>
      );
    case "pulse":
      return (
        <div className={cn(baseClasses, className)}>
          <LoadingPulse size={size} />
          {text && <span className="ml-2 text-muted-foreground">{text}</span>}
        </div>
      );
    case "skeleton":
      return <LoadingSkeleton className={className} />;
    case "dots":
      return (
        <div className={cn(baseClasses, className)}>
          <LoadingDots />
          {text && <span className="ml-2 text-muted-foreground">{text}</span>}
        </div>
      );
    default:
      return (
        <div className={cn(baseClasses, className)}>
          <LoadingSpinner size={size} />
          {text && <span className="ml-2 text-muted-foreground">{text}</span>}
        </div>
      );
  }
}

// Spinner com ícone do Lucide
export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  return (
    <Loader2
      className={cn(
        "animate-spin text-primary",
        sizeClasses[size],
        className
      )}
    />
  );
}

// Pulse loading
export function LoadingPulse({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  return (
    <div
      className={cn(
        "rounded-full bg-primary animate-pulse",
        sizeClasses[size],
        className
      )}
    />
  );
}

// Skeleton loading
export function LoadingSkeleton({
  className,
  lines = 3,
  avatar = false,
}: LoadingSkeletonProps) {
  return (
    <div className={cn("animate-pulse space-y-3", className)}>
      {avatar && (
        <div className="flex items-center space-x-4">
          <div className="rounded-full bg-muted h-12 w-12"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      )}
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-4 bg-muted rounded",
              i === lines - 1 ? "w-2/3" : "w-full"
            )}
          />
        ))}
      </div>
    </div>
  );
}

// Dots loading
export function LoadingDots({ className }: LoadingDotsProps) {
  return (
    <div className={cn("flex space-x-1", className)}>
      <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
    </div>
  );
}

// Loading overlay para páginas inteiras
export function LoadingOverlay({
  isLoading = false,
  children,
  text = "Carregando...",
}: {
  isLoading?: boolean;
  children: React.ReactNode;
  text?: string;
}) {
  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div className="opacity-50 pointer-events-none">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="flex flex-col items-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-muted-foreground">{text}</p>
        </div>
      </div>
    </div>
  );
}

// Loading para tabelas
export function LoadingTable({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="animate-pulse space-y-2">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="h-4 bg-muted rounded flex-1"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// Loading para cards
export function LoadingCard({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse", className)}>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-muted rounded w-full"></div>
            <div className="h-3 bg-muted rounded w-full"></div>
            <div className="h-3 bg-muted rounded w-2/3"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading para listas
export function LoadingList({ items = 3 }: { items?: number }) {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4">
          <div className="h-10 w-10 bg-muted rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Loading para botões
export function LoadingButton({
  children,
  isLoading = false,
  className,
  ...props
}: {
  children: React.ReactNode;
  isLoading?: boolean;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
      {children}
    </button>
  );
}

// Loading para páginas inteiras
export function LoadingPage({ text = "Carregando página..." }: { text?: string }) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}
