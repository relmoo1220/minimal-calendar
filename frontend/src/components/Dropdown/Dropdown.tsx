import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";

interface DropdownProps {
  items: string[];
  onSelect?: (item: string) => void;
  placeholder?: string;
  className?: string;
  value?: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(({
  items,
  onSelect,
  placeholder = "Select an option",
  className = "",
  value,
  isOpen,
  onOpenChange
}, ref) => {
  const handleSelect = (item: string) => {
    onOpenChange(false);
    onSelect?.(item);
  };

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        onClick={() => onOpenChange(!isOpen)}
        className="w-full px-4 py-2 bg-foreground text-background border rounded-md shadow-sm flex justify-between items-center"
      >
        <span>{value || placeholder}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▼
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute w-full mt-1 bg-foreground border rounded-md shadow-lg z-10"
          >
            {items.map((item, index) => (
              <motion.li
                key={index}
                whileHover={{ backgroundColor: "#e0e0e0" }}
                onClick={() => handleSelect(item)}
                className="px-4 py-2 cursor-pointer text-[#0a0a0a]"
              >
                {item}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
});

export default Dropdown;
