import React from 'react';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  fullScreen = false,
}) => {
  const sizeMap = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  const content = (
    <div className="flex flex-col items-center justify-center p-6 gap-3">
      <div
        className={`${sizeMap[size]} rounded-full border-[#D4AF37] border-t-transparent animate-spin`}
      />
      {text && <p className="text-sm font-medium text-neutral-600">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FAF7F2]/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
};
