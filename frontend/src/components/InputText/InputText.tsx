import React, { forwardRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface InputTextProps {
  label?: string;
  placeholder?: string;
  error?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const InputText = forwardRef<HTMLInputElement, InputTextProps>(
  ({ label, placeholder, error, value, onChange, className = "" }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        <AnimatePresence>
          {label && (
            <motion.label
              initial={{ y: 0 }}
              animate={{ 
                y: isFocused || value ? -8 : 0,
                scale: isFocused || value ? 0.9 : 1 
              }}
              className="text-sm font-bold text-foreground origin-left"
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
              scale: isFocused ? 1.02 : 1,
              borderColor: isFocused ? "var(--foreground)" : "transparent"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <input
              ref={ref}
              className={`w-full px-4 py-2 rounded-lg bg-foreground text-background border outline-none focus:outline-none ${
                error ? "border-red-500" : "border-transparent"
              }`}
              placeholder={!value ? placeholder : ""}
              value={value}
              onChange={onChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              style={{ 
                // Remove WebKit's default focus styles
                WebkitTapHighlightColor: 'transparent',
              }}
            />
          </motion.div>
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
  }
);

InputText.displayName = "InputText";

export default InputText;