"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, Shield, Radio } from "lucide-react";
import { MOCK_ALERTS } from "@/data/mockWaterData";

interface HeaderProps {
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const activeAlerts = MOCK_ALERTS.filter((a) => a.status === "active").slice(0, 4);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString("en-IN", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/90 px-4 sm:px-6 backdrop-blur-md">
      {/* Left side title / status */}
      <div className="flex items-center gap-3 pl-12 lg:pl-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-[#0f2942] tracking-tight">
              {title || "National Water Surveillance Portal"}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 border border-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Telemetry Live
            </span>
          </div>
          <p className="text-[11px] text-slate-500 hidden md:block">
            Ministry of Jal Shakti • Decision Support System
          </p>
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Clock */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200/80 font-mono">
          <Radio className="h-3.5 w-3.5 text-teal-600" />
          <span>{currentTime || "Loading..."}</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotificationMenu(!showNotificationMenu)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
              {activeAlerts.length}
            </span>
          </button>

          {/* Notification dropdown */}
          {showNotificationMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-200 bg-white p-3 shadow-xl z-50 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Active Priority Alerts ({activeAlerts.length})
                </span>
                <Link
                  href="/dashboard/alerts"
                  onClick={() => setShowNotificationMenu(false)}
                  className="text-xs text-teal-600 hover:underline font-medium"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {activeAlerts.map((alert) => (
                  <Link
                    key={alert.id}
                    href="/dashboard/alerts"
                    onClick={() => setShowNotificationMenu(false)}
                    className="block rounded-lg p-2.5 hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold text-rose-700 line-clamp-1">
                        {alert.title}
                      </span>
                      <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.5 rounded font-mono shrink-0">
                        CRITICAL
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                      {alert.sourceName} • {alert.district}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Action: {alert.recommendedAction.slice(0, 60)}...
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Officer Profile */}
        <div className="flex items-center gap-2 border-l border-slate-200 pl-2 sm:pl-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0f2942] text-white font-semibold text-xs shadow-xs">
            <Shield className="h-4 w-4 text-cyan-300" />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-900 leading-tight">
              Dr. S. K. Verma
            </p>
            <p className="text-[10px] text-slate-500 leading-tight">
              Chief Surveillance Officer
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
