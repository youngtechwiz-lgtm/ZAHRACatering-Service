import React from 'react';
import { Card } from '../common/Card';

interface AdminStatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  subtitle?: string;
  badge?: {
    text: string;
    type?: 'positive' | 'neutral' | 'alert';
  };
}

export const AdminStatsCard: React.FC<AdminStatsCardProps> = ({
  title,
  value,
  icon,
  subtitle,
  badge,
}) => {
  const badgeStyles = {
    positive: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    neutral: 'bg-neutral-100 text-neutral-600 border-neutral-200',
    alert: 'bg-amber-50 text-amber-700 border-amber-200',
  };

  return (
    <Card variant="elevated" hoverEffect={false} className="p-6 bg-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-3xl font-serif font-bold text-neutral-900 mt-1">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-neutral-400 mt-1">{subtitle}</p>
          )}
        </div>

        <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] border border-[#D4AF37]/30 flex items-center justify-center text-xl text-[#D4AF37] shadow-inner">
          {icon}
        </div>
      </div>

      {badge && (
        <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center">
          <span
            className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
              badgeStyles[badge.type || 'neutral']
            }`}
          >
            {badge.text}
          </span>
        </div>
      )}
    </Card>
  );
};
