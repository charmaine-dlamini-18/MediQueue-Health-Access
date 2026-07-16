import type { ReactNode } from "react";
import { motion } from "framer-motion";

export function PageHeader({ icon: Icon, title, description, children }: { icon: any; title: string; description: string; children?: ReactNode }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-xl sm:text-2xl font-bold tracking-tight font-display">{title}</h1>
          <p className="text-sm text-muted-foreground truncate sm:whitespace-normal">{description}</p>
        </div>
      </div>
      {children}
    </motion.header>
  );
}

export function PageContainer({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8 space-y-6">{children}</div>;
}