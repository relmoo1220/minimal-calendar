import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";

interface DropdownProps {
  label?: string;
  items: string[];
  onSelect?: (item: string) => void;
  onRemove?: (item: string) => void;
  placeholder?: string;
  className?: string;
  value?: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  enableRemove?: boolean;
}

const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      label,
      items,
      onSelect,
      onRemove,
      placeholder = "Select an option",
      className = "",
      value,
      isOpen,
      onOpenChange,
      enableRemove = false,
    },
    ref
  ) => {
    const handleSelect = (item: string) => {
      onOpenChange(false);
      onSelect?.(item);
    };

    return (
      <div className={`flex flex-col gap-1 ${className}`}>
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
        
        <div className="relative" ref={ref}>
          <motion.div
            animate={{
              scale: isOpen ? 1.02 : 1,
              borderColor: isOpen ? "var(--foreground)" : "transparent"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <button
              onClick={() => onOpenChange(!isOpen)}
              className="w-full px-4 py-2 bg-foreground text-background border rounded-lg text-start"
            >
              {value || placeholder}
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                className="absolute right-4"
              >
                ▼
              </motion.span>
            </button>
          </motion.div>

          <AnimatePresence>
            {isOpen && (
              
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute w-full mt-1 bg-foreground border rounded-md shadow-lg z-10"
              >
                {items.length === 0 ? (
                  <div className="px-4 py-2 text-background cursor-default">
                    Nothing here
                  </div>
                ) : (
                  items.map((item, index) => (
                    <motion.li
                      key={index}
                      className="px-4 py-2 cursor-pointer text-[#0a0a0a] flex justify-between items-center hover:bg-gray-200"
                    >
                      <span onClick={() => handleSelect(item)}>{item}</span>
                      {enableRemove && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemove?.(item);
                          }}
                          className="p-1 hover:bg-red-600 hover:text-foreground rounded-full"
                        >
                          ×
                        </button>
                      )}
                    </motion.li>
                  ))
                )}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }
);

export default Dropdown;
