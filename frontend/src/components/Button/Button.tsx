import { motion } from "framer-motion";
import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  disabled?: boolean;
  variant?: 'light' | 'dark';
}

const variantStyles = {
  light: 'bg-foreground text-background',
  dark: 'bg-background text-foreground',
};

const Button = ({ 
  children, 
  onClick, 
  className = "", 
  disabled = false,
  variant = 'light' 
}: ButtonProps) => {
  return (
    <motion.button
      className={`px-4 py-2 rounded-lg ${variantStyles[variant]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
};

export default Button;
