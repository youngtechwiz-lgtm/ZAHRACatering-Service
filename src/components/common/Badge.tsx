import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'charcoal' | 'green' | 'red' | 'blue' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'gold',
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 tracking-wider uppercase font-bold',
    md: 'text-xs px-3 py-1 font-medium',
  };

  const variantStyles = {
    gold: 'bg-[#D4AF37]/15 text-[#8F7418] border border-[#D4AF37]/30',
    charcoal: 'bg-[#1E1E1E] text-[#D4AF37] border border-[#D4AF37]/20',
    green: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    red: 'bg-rose-50 text-rose-700 border border-rose-200',
    blue: 'bg-blue-50 text-blue-700 border border-blue-200',
    neutral: 'bg-neutral-100 text-neutral-700 border border-neutral-200',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
