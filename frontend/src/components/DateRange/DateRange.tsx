import React, { forwardRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isWithinInterval,
  isBefore,
  isAfter,
} from "date-fns";

interface InputDateProps {
  label?: string;
  error?: string;
  startDate: Date | null;
  endDate: Date | null;
  onDateChange?: (start: Date | null, end: Date | null) => void;
  className?: string;
}

const DateRange = forwardRef<HTMLDivElement, InputDateProps>(
  (
    {
      label,
      error,
      startDate = null,
      endDate = null,
      onDateChange,
      className = "",
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [hoverDate, setHoverDate] = useState<Date | null>(null);
    const [selecting, setSelecting] = useState<"start" | "end" | null>(null);

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const isStartDate = (date: Date) => startDate && isSameDay(date, startDate);
    const isEndDate = (date: Date) => endDate && isSameDay(date, endDate);
    const isInRange = (date: Date) => {
      if (isStartDate(date) || isEndDate(date)) return false;

      if (selecting === "end" && startDate && hoverDate) {
        return (
          isWithinInterval(date, {
            start: startDate,
            end: hoverDate,
          }) &&
          !isSameDay(date, startDate) &&
          !isSameDay(date, hoverDate)
        );
      }

      if (startDate && endDate) {
        return (
          isWithinInterval(date, {
            start: startDate,
            end: endDate,
          }) &&
          !isSameDay(date, startDate) &&
          !isSameDay(date, endDate)
        );
      }

      return false;
    };

    const handleDateClick = (date: Date) => {
      if (!selecting || selecting === "start") {
        onDateChange?.(date, null);
        setSelecting("end");
      } else {
        if (isBefore(date, startDate!)) {
          onDateChange?.(date, startDate);
        } else {
          onDateChange?.(startDate, date);
        }
        setSelecting(null);
        setIsOpen(false);
      }
    };

    return (
      <div ref={ref} className={className}>
        {label && (
          <label className="block text-sm font-medium mb-1">{label}</label>
        )}
        <div className="relative">
          <div
            className="px-4 py-2 rounded-lg bg-foreground text-background cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            {startDate ? format(startDate, "MMM dd, yyyy") : "Select dates"}
            {endDate && ` - ${format(endDate, "MMM dd, yyyy")}`}
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-[calc(100%+4px)] p-4 left-0 bg-foreground rounded-lg shadow-lg z-50"
              >
                <div className="grid grid-cols-7 gap-1">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                    <div
                      key={day}
                      className="text-center text-sm text-background font-bold"
                    >
                      {day}
                    </div>
                  ))}
                  {days.map((date) => (
                    <motion.div
                      key={date.toString()}
                      onMouseEnter={() => setHoverDate(date)}
                      onMouseLeave={() => setHoverDate(null)}
                      className={`
                        p-2 text-center rounded-lg cursor-pointer
                        ${
                          isStartDate(date) || isEndDate(date)
                            ? "bg-background text-foreground"
                            : isInRange(date)
                            ? "bg-gray-300 text-background"
                            : "text-background hover:bg-gray-300"
                        }
                      `}
                      onClick={() => handleDateClick(date)}
                    >
                      {format(date, "d")}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }
);

DateRange.displayName = "DateRange";

export default DateRange;
