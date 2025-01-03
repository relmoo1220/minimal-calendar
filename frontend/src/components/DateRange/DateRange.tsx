import React, { forwardRef, useState, useRef, useEffect } from "react";
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
  addMonths,
  subMonths,
} from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface InputDateProps {
  label?: string;
  error?: string;
  startDate: Date | null;
  endDate: Date | null;
  onDateChange?: (start: Date | null, end: Date | null) => void;
  className?: string;
}

const DateRange = forwardRef<HTMLDivElement, InputDateProps>((props, ref) => {
  const {
    label,
    error,
    startDate = null,
    endDate = null,
    onDateChange,
    className = "",
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [selecting, setSelecting] = useState<"start" | "end" | null>(null);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Generate year range
  const years = Array.from(
    { length: 21 },
    (_, i) => new Date().getFullYear() - 10 + i
  );

  // Generate months
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(2024, i, 1);
    return format(date, "MMMM");
  });

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

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleYearSelect = (year: number) => {
    setCurrentMonth(new Date(year, currentMonth.getMonth()));
    setShowYearPicker(false);
  };

  const handleMonthSelect = (monthIndex: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), monthIndex));
    setShowMonthPicker(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowMonthPicker(false);
        setShowYearPicker(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className={`flex flex-col gap-1 ${className}`}>
      <AnimatePresence>
        {label && (
          <motion.label
            initial={{ y: 0 }}
            animate={{ 
              y: isOpen || startDate || endDate ? -8 : 0,
              scale: isOpen || startDate || endDate ? 0.9 : 1 
            }}
            className="text-sm font-bold text-foreground origin-left mb-1"
          >
            {label}
          </motion.label>
        )}
      </AnimatePresence>
      <motion.div
        className="relative"
        initial={false}
        animate={{ y: error ? -4 : 0 }}
      >
        <motion.div
          animate={{
            scale: isOpen ? 1.02 : 1,
            borderColor: isOpen ? "var(--foreground)" : "transparent"
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div
            className={`w-full px-4 py-2 rounded-lg bg-foreground text-background border outline-none ${
              error ? "border-red-500" : "border-transparent"
            }`}
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          >
            {startDate ? format(startDate, "MMM dd, yyyy") : "Select dates"}
            {endDate && ` - ${format(endDate, "MMM dd, yyyy")}`}
          </div>
        </motion.div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-[calc(100%+4px)] left-0 bg-foreground rounded-lg shadow-lg z-50 p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 hover:bg-gray-300 hover:text-foreground rounded-lg"
                >
                  <ChevronLeftIcon className="w-5 h-5 text-background" />
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowMonthPicker(!showMonthPicker);
                      setShowYearPicker(false);
                    }}
                    className="text-background font-medium hover:bg-gray-300 px-2 py-1 rounded"
                  >
                    {format(currentMonth, "MMMM")}
                  </button>
                  <button
                    onClick={() => {
                      setShowYearPicker(!showYearPicker);
                      setShowMonthPicker(false);
                    }}
                    className="text-background font-medium hover:bg-gray-300 px-2 py-1 rounded"
                  >
                    {format(currentMonth, "yyyy")}
                  </button>
                </div>

                <button
                  onClick={handleNextMonth}
                  className="p-2 hover:bg-gray-300 hover:text-foreground rounded-lg"
                >
                  <ChevronRightIcon className="w-5 h-5 text-background" />
                </button>

                {showMonthPicker && (
                  <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-foreground shadow-xl rounded-lg p-2 z-[60] min-w-[250px]">
                    <div className="grid grid-cols-3 gap-2">
                      {months.map((month, index) => (
                        <button
                          key={month}
                          onClick={() => handleMonthSelect(index)}
                          className="px-2 py-1.5 text-sm text-background hover:bg-gray-300 rounded w-full text-center"
                        >
                          {format(new Date(2024, index), "MMM")}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {showYearPicker && (
                  <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-foreground shadow-xl rounded-lg p-2 z-[60] min-w-[250px]">
                    <div className="grid grid-cols-3 gap-2 max-h-[180px] overflow-y-auto px-1">
                      {years.map((year) => (
                        <button
                          key={year}
                          onClick={() => handleYearSelect(year)}
                          className="px-2 py-1.5 text-sm text-background hover:bg-gray-300 rounded w-full text-center"
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-1 text-sm text-red-500"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
});

DateRange.displayName = "DateRange";

export default DateRange;
