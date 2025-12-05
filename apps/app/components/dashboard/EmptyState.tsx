'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';

type Action = {
  label: string;
  href: string;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
};

type EmptyStateProps = {
  title: string;
  description?: string | ReactNode;
  primaryAction?: Action;
  secondaryAction?: Action;
  tertiaryAction?: Action;
};

export function EmptyState({
  title,
  description,
  primaryAction,
  secondaryAction,
  tertiaryAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/80 px-10 py-16 text-center shadow-sm dark:bg-zinc-900/20">
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      {description ? (
        <div className="mt-3 max-w-md text-sm text-muted-foreground">{description}</div>
      ) : null}
      <div className="mt-6 flex w-full flex-wrap justify-center gap-3 text-sm">
        {primaryAction ? (
          <Button
            asChild
            variant={primaryAction.variant ?? 'default'}
            className="rounded-full px-6"
          >
            <Link href={primaryAction.href}>{primaryAction.label}</Link>
          </Button>
        ) : null}
        {secondaryAction ? (
          <Button
            asChild
            variant={secondaryAction.variant ?? 'outline'}
            className="rounded-full px-6"
          >
            <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
          </Button>
        ) : null}
        {tertiaryAction ? (
          <Button
            asChild
            variant={tertiaryAction.variant ?? 'ghost'}
            className="rounded-full px-6"
          >
            <Link href={tertiaryAction.href}>{tertiaryAction.label}</Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
