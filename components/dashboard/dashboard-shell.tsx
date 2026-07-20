"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { MenuIcon, CloseIcon } from "@/components/dashboard/icons";

export interface DashboardShellProps {
  children: React.ReactNode;
  /** Rendered server-side (it wraps a Server Action form) and passed
   *  through opaquely — this Client Component never inspects it. */
  logoutSlot: React.ReactNode;
}

export function DashboardShell({ children, logoutSlot }: DashboardShellProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-ivory-200/10 bg-crimson-950/80 backdrop-blur-xl">
        <Container size="wide" className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              className="-ml-2 flex h-10 w-10 items-center justify-center rounded-xl text-ivory-200 transition-colors hover:bg-white/[0.06] lg:hidden"
              aria-label="Open navigation menu"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
            <Link
              href="/dashboard"
              className="font-display text-lg tracking-wide text-ivory-50"
            >
              SolidW
            </Link>
          </div>
          {logoutSlot}
        </Container>
      </header>

      <div className="flex">
        <aside className="sticky top-20 hidden h-[calc(100vh-5rem)] w-64 shrink-0 border-r border-ivory-200/10 px-4 py-8 lg:block">
          <SidebarNav />
        </aside>

        <main className="min-w-0 flex-1">
          <Container size="wide" className="py-12 lg:py-16">
            {children}
          </Container>
        </main>
      </div>

      <AnimatePresence>
        {isMobileNavOpen && (
          <motion.div
            key="mobile-nav-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setIsMobileNavOpen(false)}
            className="fixed inset-0 z-40 bg-crimson-950/70 backdrop-blur-sm lg:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMobileNavOpen && (
          <motion.div
            key="mobile-nav-panel"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto border-r border-gold-400/15 bg-crimson-900/95 p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.65)] backdrop-blur-xl lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Dashboard navigation"
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-lg text-ivory-50">SolidW</span>
              <button
                type="button"
                onClick={() => setIsMobileNavOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-ivory-200 hover:bg-white/[0.06]"
                aria-label="Close navigation menu"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-8">
              <SidebarNav onNavigate={() => setIsMobileNavOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
