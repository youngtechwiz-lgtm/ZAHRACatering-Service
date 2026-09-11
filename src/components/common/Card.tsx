import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'glass' | 'dark' | 'outline';
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  hoverEffect = true,
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-2xl transition-all duration-300 overflow-hidden';

  const variantStyles = {
    elevated: 'bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] border border-neutral-100',
    glass: 'bg-white/80 backdrop-blur-md border border-[#D4AF37]/20 shadow-lg',
    dark: 'bg-[#181818] border border-neutral-800 text-white shadow-xl',
    outline: 'bg-transparent border border-neutral-200',
  };

  const hoverStyles = hoverEffect
    ? 'hover:-translate-y-1.5 hover:shadow-[0_12px_30px_-8px_rgba(212,175,55,0.15)] hover:border-[#D4AF37]/40'
    : '';

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${className}`} {...props}>
      {children}
    </div>
  );
};
