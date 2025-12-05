'use client';

import { ReactNode } from 'react';

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
};

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md">
      <div>
        {subtitle ? (
          <p className="text-xs font-medium text-muted-foreground">
            {subtitle}
          </p>
        ) : null}
        <h1 className="text-lg font-bold tracking-tight text-foreground">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-3">{actions}</div>
    </header>
  );
}
