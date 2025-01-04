import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  format, 
  startOfWeek, 
  addDays, 
  startOfMonth, 
  endOfMonth, 
  endOfWeek, 
  addMonths,
  subMonths,
  addYears,
  subYears,
  startOfYear,
  endOfYear,
  eachMonthOfInterval,
  eachWeekOfInterval,
  isSameDay 
} from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Button from "@/components/Button/Button";

export type CalendarMode = 'Year' | 'Month' | 'Week' | 'Day';

interface CalendarEvent {
  id: string;
  title: string;
  tag: string;
  description: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
}

interface CalendarProps {
  mode: CalendarMode;
  selectedDate: Date; // Add selected date prop
  events?: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onViewChange?: (newMode: CalendarMode, date: Date) => void;
  className?: string;
}

const Calendar: React.FC<CalendarProps> = ({
  mode,
  selectedDate,
  events = [],
  onEventClick,
  onViewChange,
  className = '',
}) => {
  const [currentDate, setCurrentDate] = useState(selectedDate);
  const [hoveredEvent, setHoveredEvent] = useState<CalendarEvent | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ top: number, left: number }>({ top: 0, left: 0 });

  // Update currentDate when selectedDate changes
  useEffect(() => {
    setCurrentDate(selectedDate);
  }, [selectedDate]);

  const getHeaderText = () => {
    switch (mode) {
      case 'Year':
        return format(currentDate, 'yyyy');
      case 'Month':
        return format(currentDate, 'MMMM yyyy');
      case 'Week':
        const weekStart = startOfWeek(currentDate);
        const weekEnd = endOfWeek(currentDate);
        return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
      case 'Day':
        return format(currentDate, 'EEEE, MMMM d, yyyy');
      default:
        return format(currentDate, 'MMMM yyyy');
    }
  };

  const handlePrevious = () => {
    switch (mode) {
      case 'Year':
        setCurrentDate(subYears(currentDate, 1));
        break;
      case 'Month':
        setCurrentDate(subMonths(currentDate, 1));
        break;
      case 'Week':
        setCurrentDate(addDays(currentDate, -7));
        break;
      case 'Day':
        setCurrentDate(addDays(currentDate, -1));
        break;
    }
  };

  const handleNext = () => {
    switch (mode) {
      case 'Year':
        setCurrentDate(addYears(currentDate, 1));
        break;
      case 'Month':
        setCurrentDate(addMonths(currentDate, 1));
        break;
      case 'Week':
        setCurrentDate(addDays(currentDate, 7));
        break;
      case 'Day':
        setCurrentDate(addDays(currentDate, 1));
        break;
    }
  };

  const handleGoUp = () => {
    switch (mode) {
      case 'Day':
        onViewChange?.('Week', currentDate);
        break;
      case 'Week':
        onViewChange?.('Month', currentDate);
        break;
      case 'Month':
        onViewChange?.('Year', currentDate);
        break;
    }
  };

  const handleDateClick = (date: Date, newMode: CalendarMode) => {
    setCurrentDate(date);
    onViewChange?.(newMode, date);
  };

  const handleEventHover = (event: CalendarEvent, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredEvent(event);
    setHoverPosition({
      top: rect.bottom,
      left: rect.left
    });
  };

  const renderEventPopup = () => {
    if (!hoveredEvent) return null;

    return (
      <div 
        className="fixed bg-foreground text-background p-4 rounded-lg shadow-xl z-50 min-w-[250px]"
        style={{ 
          top: `${hoverPosition.top}px`, 
          left: `${hoverPosition.left}px` 
        }}
      >
        <div className="text-sm space-y-2">
          <p><span className="font-bold">Tag:</span> {hoveredEvent.tag}</p>
          <p><span className="font-bold">Description:</span> {hoveredEvent.description}</p>
          <p><span className="font-bold">Date:</span> {format(hoveredEvent.startDate, 'MMM dd, yyyy')}</p>
          <p><span className="font-bold">Time:</span> {hoveredEvent.startTime} - {hoveredEvent.endTime}</p>
        </div>
      </div>
    );
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center p-4 border-b border-background">
      <div className="flex items-center gap-2">
        <Button onClick={handlePrevious} className="p-2 hover:bg-gray-300 rounded-full">
          <ChevronLeftIcon className="w-5 h-5 text-background" />
        </Button>
        <h2 className="text-xl font-semibold text-background">
          {getHeaderText()}
        </h2>
        <Button onClick={handleNext} className="p-2 hover:bg-gray-300 rounded-full">
          <ChevronRightIcon className="w-5 h-5 text-background" />
        </Button>
      </div>
      {mode !== 'Year' && (
        <Button
          onClick={handleGoUp}
          className="px-3 py-1 text-sm border border-background rounded-full hover:bg-gray-300 text-background"
        >
          View {mode === 'Day' ? 'Week' : mode === 'Week' ? 'Month' : 'Year'}
        </Button>
      )}
    </div>
  );

  const renderYearView = () => {
    const months = eachMonthOfInterval({
      start: startOfYear(currentDate),
      end: endOfYear(currentDate)
    });

    return (
      <div className="grid grid-cols-4 gap-4 p-4">
        {months.map(month => (
          <div 
            key={month.toString()}
            className="p-4 border border-gray-300 rounded-lg hover:bg-gray-300 cursor-pointer text-background"
            onClick={() => onViewChange?.('Month', month)}
          >
            <h3 className="font-semibold">{format(month, 'MMMM')}</h3>
            <div className="text-sm opacity-60">
              {events.filter(event => 
                format(event.startDate, 'M') === format(month, 'M')
              ).length} events
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderMonthView = () => {
    const weeks = eachWeekOfInterval({
      start: startOfMonth(currentDate),
      end: endOfMonth(currentDate)
    });

    return (
      <div className="grid grid-cols-7 gap-1 p-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-semibold p-2 text-background">{day}</div>
        ))}
        {weeks.map(week => (
          Array.from({ length: 7 }, (_, i) => addDays(week, i)).map(day => (
            <div 
              key={day.toString()}
              onClick={() => handleDateClick(day, 'Week')}
              className={`p-2 border border-gray-300 rounded-lg cursor-pointer
                ${format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd') 
                  ? 'bg-gray-300' 
                  : 'hover:bg-gray-300'}`}
            >
              <div className="font-semibold">{format(day, 'd')}</div>
              {events
                .filter(event => format(event.startDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'))
                .map(event => (
                  <div 
                    key={event.id}
                    className="text-sm p-1 my-1 bg-blue-100 rounded"
                    onClick={() => onEventClick?.(event)}
                    onMouseEnter={(e) => handleEventHover(event, e)}
                    onMouseLeave={() => setHoveredEvent(null)}
                  >
                    {event.title}
                  </div>
                ))
              }
            </div>
          ))
        ))}
      </div>
    );
  };

  const renderWeekView = () => {
    const days = Array.from(
      { length: 7 }, 
      (_, i) => addDays(startOfWeek(currentDate), i)
    );

    return (
      <div className="grid grid-cols-7 gap-1 p-4">
        {days.map(day => (
          <div 
            key={day.toString()} 
            className="border border-gray-300 rounded-lg cursor-pointer"
            onClick={() => onViewChange?.('Day', day)}
          >
            <div className="text-center font-semibold p-2 border-b border-gray-300">
              {format(day, 'EEE d')}
            </div>
            <div className="min-h-[500px] p-2 hover:bg-gray-300">
              {events
                .filter(event => format(event.startDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'))
                .map(event => (
                  <div 
                    key={event.id}
                    className="text-sm p-2 my-1 bg-blue-100 rounded-lg"
                    onClick={() => onEventClick?.(event)}
                    onMouseEnter={(e) => handleEventHover(event, e)}
                    onMouseLeave={() => setHoveredEvent(null)}
                  >
                    {event.title}
                  </div>
                ))
              }
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderDayView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div className="grid grid-cols-[100px_1fr] h-[600px] overflow-y-auto">
        <div className="grid grid-rows-24 gap-0">
          {hours.map(hour => (
            <div key={hour} className="h-20 border-b border-gray-300 p-2 text-sm text-gray-500">
              {format(new Date().setHours(hour), 'ha')}
            </div>
          ))}
        </div>
        <div className="grid grid-rows-24 gap-0">
          {hours.map(hour => (
            <div key={hour} className="h-20 border-b border-l border-gray-300 p-2">
              {events
                .filter(event => 
                  format(event.startDate, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd') &&
                  new Date(event.startDate).getHours() === hour
                )
                .map(event => (
                  <div 
                    key={event.id}
                    className="bg-blue-100 p-2 rounded cursor-pointer"
                    onClick={() => onEventClick?.(event)}
                    onMouseEnter={(e) => handleEventHover(event, e)}
                    onMouseLeave={() => setHoveredEvent(null)}
                  >
                    {event.title}
                  </div>
                ))
              }
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`relative bg-foreground rounded-lg shadow text-background ${className}`}>
      {renderHeader()}
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {(() => {
            switch (mode) {
              case 'Year':
                return renderYearView();
              case 'Month':
                return renderMonthView();
              case 'Week':
                return renderWeekView();
              case 'Day':
                return renderDayView();
              default:
                return renderMonthView();
            }
          })()}
        </motion.div>
      </AnimatePresence>
      {hoveredEvent && renderEventPopup()}
    </div>
  );
};

export default Calendar;