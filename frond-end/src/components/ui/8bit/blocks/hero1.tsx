import type { ReactNode } from "react";

import { cn } from "#/lib/utils.ts";

import { Badge } from "#/components/ui/8bit/badge.tsx";
import { Button } from "#/components/ui/8bit/button.tsx";
import { CircuitPattern } from "#/components/ui/circuit-board";

import "#/components/ui/8bit/styles/retro.css";

interface HeroBadge {
  label: string;
  variant?: "default" | "destructive" | "outline" | "secondary";
}

interface HeroAction {
  href?: string;
  label: string;
  onClick?: () => void;
  variant?: "default" | "destructive" | "ghost" | "outline" | "secondary";
}

interface Hero1Props {
  actions?: HeroAction[];
  badges?: HeroBadge[];
  children?: ReactNode;
  className?: string;
  description?: string;
  subtitle?: string;
  title: string;
}

export default function Hero1({
  title,
  subtitle,
  description,
  actions = [],
  badges = [],
  className,
  children,
}: Hero1Props) {
  return (
    <section
      className={cn(
        "relative w-full overflow-hidden px-4 py-16 md:py-24",
        className,
      )}
    >
      {/* Scanline overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, currentColor 2px, currentColor 3px)",
        }}
      />

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Badges */}
        {badges.length > 0 && (
          <div className="mb-6 flex flex-wrap justify-center gap-4">
            {badges.map((badge) => (
              <Badge key={badge.label} variant={badge.variant}>
                {badge.label}
              </Badge>
            ))}
          </div>
        )}

        {/* Circuit-board background (decorative) */}
        <div className="absolute inset-x-0 top-64 pointer-events-none -z-10 flex justify-center opacity-30">
          <div className="w-full max-w-4xl">
            <CircuitPattern pattern="url-flow" width={960} height={260} />
          </div>
        </div>

        {/* Title (particle typography) */}
        <div className="retro mb-4 font-bold text-3xl tracking-tight md:text-5xl lg:text-6xl">
          {title}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <p className="retro mb-4 text-muted-foreground text-xs md:text-sm">
            {subtitle}
          </p>
        )}

        {/* Description */}
        {description && (
          <p className="mx-auto mb-8 max-w-2xl text-muted-foreground retro text-[9px] leading-relaxed">
            {description}
          </p>
        )}

        {/* Actions */}
        {actions.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4">
            {actions.map((action) =>
              action.href ? (
                <Button asChild key={action.label} variant={action.variant}>
                  <a href={action.href}>{action.label}</a>
                </Button>
              ) : (
                <Button
                  key={action.label}
                  onClick={action.onClick}
                  variant={action.variant}
                >
                  {action.label}
                </Button>
              ),
            )}
          </div>
        )}

        {/* Optional extra content */}
        {children}
      </div>
    </section>
  );
}
