"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Droplets,
  AlertTriangle,
  BarChart3,
  FileCheck2,
  Settings,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeAlertCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeAlertCount = 6 }) => {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    {
      label: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "Water Sources",
      href: "/dashboard/sources",
      icon: Droplets,
    },
    {
      label: "Alerts",
      href: "/dashboard/alerts",
      icon: AlertTriangle,
      badge: activeAlertCount > 0 ? activeAlertCount : undefined,
      badgeVariant: "critical" as const,
    },
    {
      label: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
    },
    {
      label: "Laboratory Reports",
      href: "#laboratory",
      icon: FileCheck2,
      isPlaceholder: true,
    },
    {
      label: "Settings & System",
      href: "#settings",
      icon: Settings,
      isPlaceholder: true,
    },
  ];

  const isActive = (item: typeof navItems[0]) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };

  const navContent = (
    <div className="flex h-full flex-col justify-between bg-[#0f2942] text-white">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 text-[#0f2942] shadow-md shadow-cyan-900/40 font-bold">
            <Droplets className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-tight text-white">
                JalSuraksha
              </span>
              <span className="rounded bg-teal-500/20 px-1.5 py-0.2 text-[10px] font-semibold text-teal-300 border border-teal-500/30">
                GOVT
              </span>
            </div>
            <p className="text-[11px] text-slate-300 tracking-wide font-normal">
              Water Decision Support Portal
            </p>
          </div>
        </div>

        {/* Department Badge */}
        <div className="mx-4 my-4 rounded-lg bg-white/5 p-3 border border-white/10 text-xs">
          <div className="flex items-center gap-2 text-cyan-300 font-medium mb-1">
            <ShieldCheck className="h-4 w-4" />
            <span>Govt of India Surveillance</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-tight">
            Central Ground Water & Rural Supply Decision Engine
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5 px-3 py-2">
          {navItems.map((item) => {
            const active = isActive(item);
            const Icon = item.icon;

            if (item.isPlaceholder) {
              return (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors cursor-pointer select-none"
                  onClick={() => alert(`${item.label} module is connected in the PHED integration phase.`)}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-slate-400" />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-slate-300">Phase 2</span>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                  active
                    ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-sm font-semibold"
                    : "text-slate-200 hover:bg-white/10 hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "h-4 w-4 transition-colors",
                      active ? "text-white" : "text-slate-300"
                    )}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[11px] font-bold text-white shadow-xs animate-soft-pulse">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="border-t border-white/10 p-4">
        <div className="rounded-lg bg-white/5 p-3 text-xs border border-white/10">
          <div className="flex items-center justify-between text-slate-300 mb-1">
            <span className="font-semibold text-white">Smart India Hackathon</span>
            <span className="text-[10px] text-teal-300 font-mono">SIH 2026</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Intelligent decision support for water security and public health safety.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 z-30 shadow-xl">
        {navContent}
      </aside>

      {/* Mobile Menu Trigger button */}
      <div className="lg:hidden fixed top-3 left-3 z-40">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0f2942] text-white shadow-md border border-white/20"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer Backdrop and Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative flex w-72 max-w-[80vw] flex-col z-50 animate-in slide-in-from-left duration-200">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
