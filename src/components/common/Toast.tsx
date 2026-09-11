import React, { useEffect } from 'react';
import { IoCheckmarkCircle, IoAlertCircle, IoInformationCircle, IoClose } from 'react-icons/io5';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const icons = {
    success: <IoCheckmarkCircle className="text-xl text-emerald-500 shrink-0" />,
    error: <IoAlertCircle className="text-xl text-rose-500 shrink-0" />,
    info: <IoInformationCircle className="text-xl text-blue-500 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-200 bg-white text-neutral-800',
    error: 'border-rose-200 bg-white text-neutral-800',
    info: 'border-blue-200 bg-white text-neutral-800',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex max-w-md items-center gap-3 rounded-2xl border p-4 shadow-xl backdrop-blur-md animate-in slide-in-from-bottom-5 duration-300">
      <div className={`flex w-full items-center gap-3 ${borders[type]}`}>
        {icons[type]}
        <p className="text-sm font-medium leading-relaxed">{message}</p>
        <button
          onClick={onClose}
          className="ml-auto text-neutral-400 hover:text-neutral-700 p-1"
          aria-label="Dismiss notification"
        >
          <IoClose className="text-lg" />
        </button>
      </div>
    </div>
  );
};
