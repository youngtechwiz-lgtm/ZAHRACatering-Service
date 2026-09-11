import React from 'react';

export interface SectionHeadingProps {
  subtitle?: string;
  title: string;
  description?: string;
  align?: 'center' | 'left';
  theme?: 'light' | 'dark';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  subtitle,
  title,
  description,
  align = 'center',
  theme = 'light',
  className = '',
}) => {
  const isCenter = align === 'center';
  const isDark = theme === 'dark';

  return (
    <div className={`mb-12 md:mb-16 ${isCenter ? 'text-center max-w-3xl mx-auto' : 'max-w-2xl'} ${className}`}>
      {subtitle && (
        <div className={`inline-flex items-center gap-2 mb-3.5 ${isCenter ? 'justify-center' : ''}`}>
          <span className="h-px w-6 bg-[#D4AF37]"></span>
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#B8860B]">
            {subtitle}
          </span>
          <span className="h-px w-6 bg-[#D4AF37]"></span>
        </div>
      )}
      <h2
        className={`text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight mb-4 ${
          isDark ? 'text-white' : 'text-[#121212]'
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className={`text-base sm:text-lg leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
          {description}
        </p>
      )}
    </div>
  );
};
