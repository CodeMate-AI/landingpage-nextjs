"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, RotateCcw } from "lucide-react";

interface DatePickerProps {
  value: string;
  onChange: (dateStr: string) => void;
  placeholder?: string;
  className?: string;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const SHORT_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// Get current date in UTC
function getUTCToday(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

// Format UTC Date object to "Aug 21, 2026"
function formatUTCDate(d: Date): string {
  const month = SHORT_MONTHS[d.getUTCMonth()];
  const day = d.getUTCDate();
  const year = d.getUTCFullYear();
  return `${month} ${day}, ${year}`;
}

// Parse string like "Aug 15, 2026" or "2026-08-15" into UTC Date
function parseUTCDateString(str: string): Date | null {
  if (!str || !str.trim()) return null;
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    return new Date(Date.UTC(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate()));
  }
  return null;
}

export function DatePicker({
  value,
  onChange,
  placeholder,
  className = "",
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [popoverCoords, setPopoverCoords] = useState<{ top: number; left: number; width: number }>({
    top: 0,
    left: 0,
    width: 320,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Today in UTC
  const utcToday = useMemo(() => getUTCToday(), []);
  const todayFormatted = useMemo(() => formatUTCDate(utcToday), [utcToday]);
  const resolvedPlaceholder = placeholder || todayFormatted;

  // Calendar navigation state (viewed month & year in UTC)
  const [viewYear, setViewYear] = useState<number>(() => utcToday.getUTCFullYear());
  const [viewMonth, setViewMonth] = useState<number>(() => utcToday.getUTCMonth());

  // Reset calendar view to current UTC date whenever opened
  useEffect(() => {
    if (isOpen) {
      const parsed = parseUTCDateString(value);
      if (parsed) {
        setViewYear(parsed.getUTCFullYear());
        setViewMonth(parsed.getUTCMonth());
      } else {
        setViewYear(utcToday.getUTCFullYear());
        setViewMonth(utcToday.getUTCMonth());
      }
    }
  }, [isOpen, value, utcToday]);

  // Recalculate popover position relative to input trigger
  const updatePosition = useCallback(() => {
    if (!inputRef.current) return;
    const rect = inputRef.current.getBoundingClientRect();
    const popoverWidth = Math.min(Math.max(rect.width, 300), 340);
    const spaceBelow = window.innerHeight - rect.bottom;
    const popoverHeight = 340;

    let top = rect.bottom + 6;
    if (spaceBelow < popoverHeight && rect.top > popoverHeight) {
      top = rect.top - popoverHeight - 6;
    }

    let left = rect.left;
    if (left + popoverWidth > window.innerWidth - 16) {
      left = window.innerWidth - popoverWidth - 16;
    }
    if (left < 16) {
      left = 16;
    }

    setPopoverCoords({ top, left, width: popoverWidth });
  }, []);

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
    }
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen, updatePosition]);

  // Close calendar on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        popoverRef.current &&
        !popoverRef.current.contains(target) &&
        inputRef.current &&
        !inputRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // Generate days grid for viewed month (UTC)
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(Date.UTC(viewYear, viewMonth, 1)).getUTCDay();
    const daysInCurrentMonth = new Date(Date.UTC(viewYear, viewMonth + 1, 0)).getUTCDate();
    const daysInPrevMonth = new Date(Date.UTC(viewYear, viewMonth, 0)).getUTCDate();

    const days: {
      dayNumber: number;
      isCurrentMonth: boolean;
      date: Date;
    }[] = [];

    // Previous month trailing days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevDate = new Date(Date.UTC(viewMonth === 0 ? viewYear - 1 : viewYear, viewMonth === 0 ? 11 : viewMonth - 1, dayNum));
      days.push({ dayNumber: dayNum, isCurrentMonth: false, date: prevDate });
    }

    // Current month days
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      const curDate = new Date(Date.UTC(viewYear, viewMonth, i));
      days.push({ dayNumber: i, isCurrentMonth: true, date: curDate });
    }

    // Next month leading days to complete grid
    const remainingCells = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remainingCells; i++) {
      const nextDate = new Date(Date.UTC(viewMonth === 11 ? viewYear + 1 : viewYear, viewMonth === 11 ? 0 : viewMonth + 1, i));
      days.push({ dayNumber: i, isCurrentMonth: false, date: nextDate });
    }

    return days;
  }, [viewYear, viewMonth]);

  const handleSelectDate = (date: Date) => {
    onChange(formatUTCDate(date));
    setIsOpen(false);
  };

  const handleToday = () => {
    const now = getUTCToday();
    setViewYear(now.getUTCFullYear());
    setViewMonth(now.getUTCMonth());
    onChange(formatUTCDate(now));
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange("");
    setIsOpen(false);
  };

  // Only check if date is current UTC date
  const isTodayDate = (d: Date) => {
    return (
      d.getUTCDate() === utcToday.getUTCDate() &&
      d.getUTCMonth() === utcToday.getUTCMonth() &&
      d.getUTCFullYear() === utcToday.getUTCFullYear()
    );
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Input container */}
      <div className="relative flex items-center" ref={inputRef}>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={resolvedPlaceholder}
          suppressHydrationWarning
          className="w-full rounded-lg border border-[#27272a] bg-[#18181b] p-3 pr-11 text-white placeholder:text-neutral-500 focus:border-blue-500/60 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all text-sm sm:text-base"
        />
        <button
          type="button"
          onClick={() => {
            updatePosition();
            setIsOpen((prev) => !prev);
          }}
          title="Open calendar"
          aria-label="Open calendar"
          className="absolute right-2.5 flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
        >
          <CalendarIcon className="h-4.5 w-4.5 text-blue-400" />
        </button>
      </div>

      {/* Popover via React Portal */}
      {mounted && isOpen && createPortal(
        <div
          ref={popoverRef}
          style={{
            position: "fixed",
            top: `${popoverCoords.top}px`,
            left: `${popoverCoords.left}px`,
            width: `${popoverCoords.width}px`,
            zIndex: 99999,
          }}
          className="rounded-xl border border-[#27272a] bg-[#18181b] p-4 shadow-[0_25px_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150 select-none"
        >
          {/* Sleek Header with Prev/Next and Clean Month-Year Label (No Clunky OS Select) */}
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={prevMonth}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#27272a] bg-[#27272a]/40 text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
              title="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="text-sm font-semibold text-white tracking-wide">
              {MONTHS[viewMonth]} {viewYear}
            </div>

            <button
              type="button"
              onClick={nextMonth}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#27272a] bg-[#27272a]/40 text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
              title="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-neutral-400 mb-1.5">
            {WEEKDAYS.map((day) => (
              <div key={day} className="py-0.5">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid - Only Current Date is Highlighted */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((item, idx) => {
              const isToday = isTodayDate(item.date);

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectDate(item.date)}
                  className={`flex h-8 w-full items-center justify-center rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                    isToday
                      ? "bg-blue-600 font-bold text-white shadow-md shadow-blue-600/40 ring-1 ring-blue-400"
                      : item.isCurrentMonth
                      ? "text-neutral-200 hover:bg-neutral-800 hover:text-white"
                      : "text-neutral-600 hover:bg-neutral-900/60 hover:text-neutral-400"
                  }`}
                >
                  {item.dayNumber}
                </button>
              );
            })}
          </div>

          {/* Footer Actions */}
          <div className="mt-3.5 flex items-center justify-between border-t border-[#27272a] pt-3 text-xs">
            <button
              type="button"
              onClick={handleToday}
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-semibold text-blue-400 hover:bg-blue-500/10 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3 w-3 text-blue-400" />
              Today
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-neutral-400 hover:bg-red-500/10 hover:text-red-400 transition-colors cursor-pointer"
            >
              <X className="h-3 w-3" />
              Clear
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
