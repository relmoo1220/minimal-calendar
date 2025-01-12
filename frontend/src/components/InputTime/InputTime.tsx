import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClockIcon } from '@heroicons/react/24/outline';

interface InputTimeProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const InputTime = ({ label, value, onChange, error }: InputTimeProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTimeSelect = (type: 'hour' | 'minute', val: string) => {
    const [currentHour, currentMinute] = value.split(':');
    const newTime = type === 'hour' 
      ? `${val}:${currentMinute}`
      : `${currentHour}:${val}`;
    onChange(newTime);
  };

  return (
    <div className="flex flex-col gap-1" ref={containerRef}>
      <AnimatePresence>
        {label && (
          <motion.label
            initial={{ y: 0 }}
            animate={{ 
              y: isOpen || value ? -8 : 0,
              scale: isOpen || value ? 0.9 : 1 
            }}
            className="text-sm font-bold text-foreground origin-left"
          >
            {label}
          </motion.label>
        )}
      </AnimatePresence>

      <div className="relative">
        <motion.div
          animate={{
            scale: isFocused ? 1.02 : 1,
            borderColor: isFocused ? "var(--foreground)" : "transparent"
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div 
            className="w-full px-4 py-2 rounded-lg bg-foreground text-background border cursor-pointer flex items-center justify-between"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span>{value || "Select time"}</span>
            <ClockIcon className="w-5 h-5" />
          </div>
        </motion.div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute mt-1 w-full bg-foreground rounded-lg shadow-lg z-50 flex"
            >
              {/* Hours */}
              <div className="flex-1 max-h-[200px] overflow-y-auto border-r border-gray-200">
                {hours.map(hour => (
                  <motion.div
                    key={hour}
                    whileHover={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
                    className="px-4 py-2 cursor-pointer text-background"
                    onClick={() => handleTimeSelect('hour', hour)}
                  >
                    {hour}
                  </motion.div>
                ))}
              </div>
              
              {/* Minutes */}
              <div className="flex-1 max-h-[200px] overflow-y-auto">
                {minutes.map(minute => (
                  <motion.div
                    key={minute}
                    whileHover={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
                    className="px-4 py-2 cursor-pointer text-background"
                    onClick={() => handleTimeSelect('minute', minute)}
                  >
                    {minute}
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
      </div>
    </div>
  );
};

export default InputTime;