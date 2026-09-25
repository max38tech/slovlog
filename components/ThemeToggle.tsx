"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { Sun, Moon, Laptop, Check } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  if (!mounted) {
    return (
      <div className={`w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 ${className}`} />
    );
  }

  const options = [
    {
      value: "system",
      label: "System",
      description: `Default (${resolvedTheme === "dark" ? "Dark" : "Light"})`,
      icon: Laptop,
    },
    {
      value: "light",
      label: "Light",
      description: "Day in the Alps",
      icon: Sun,
    },
    {
      value: "dark",
      label: "Dark",
      description: "Midnight Slovenia",
      icon: Moon,
    },
  ];

  const currentIcon =
    theme === "system" ? (
      <Laptop className="w-4 h-4 text-slate-600 dark:text-slate-300" />
    ) : resolvedTheme === "dark" ? (
      <Moon className="w-4 h-4 text-blue-400" />
    ) : (
      <Sun className="w-4 h-4 text-amber-500" />
    );

  return (
    <div className={`relative inline-block ${className}`} ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-xs hover:shadow transition-all duration-200 flex items-center justify-center group"
        title={`Theme: ${theme || "system"}. Click to change.`}
        aria-label="Toggle display theme"
        aria-expanded={isOpen}
      >
        <span className="transition-transform duration-300 group-hover:scale-110">
          {currentIcon}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800/80">
            Appearance
          </div>

          <div className="p-1 space-y-0.5">
            {options.map((opt) => {
              const Icon = opt.icon;
              const isSelected = theme === opt.value;

              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    setTheme(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-colors text-left ${
                    isSelected
                      ? "bg-slovenia-blue/10 dark:bg-slovenia-blue/20 text-slovenia-blue dark:text-blue-300 font-semibold"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isSelected
                          ? "text-slovenia-blue dark:text-blue-300"
                          : "text-slate-400 dark:text-slate-500"
                      }`}
                    />
                    <div>
                      <div>{opt.label}</div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">
                        {opt.description}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-slovenia-blue dark:text-blue-300 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
