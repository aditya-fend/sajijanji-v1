"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";

import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

interface NavItem {
  title: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
  },
  {
    title: "Undangan",
    href: "/dashboard/undangan",
  },
  {
    title: "Tambah Undangan",
    href: "/dashboard/undangan/create",
  },
  {
    title: "Tema",
    href: "/dashboard/tema",
  },
  {
    title: "Tambah Tema",
    href: "/tema/baru",
  },
  {
    title: "Tools",
    href: "/dashboard/tools",
  },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border/40 bg-card/50 backdrop-blur-xl">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-2 px-6 border-b border-border/40">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <span className="font-caveat text-2xl font-bold tracking-wide text-foreground leading-none">
            Saji Janji
          </span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
            Studio Admin
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Button
                key={item.href}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-all duration-200",
                  isActive
                    ? "bg-secondary text-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                )}
              >
                <Link href={item.href}>
                  <span>{item.title}</span>
                </Link>
              </Button>
            );
          })}
        </div>
      </ScrollArea>

      <Separator className="bg-border/40" />

      {/* Footer Info */}
      <div className="p-4 text-center">
        <p className="text-[11px] text-muted-foreground/70">
          Studio Edition v1.0
        </p>
      </div>
    </aside>
  );
}
