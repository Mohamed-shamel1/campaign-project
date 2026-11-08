import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  trend?: {
    text: string;
    isPositive?: boolean;
  };
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtext,
  icon,
  iconBgColor = 'bg-brand-50 text-brand-700',
  trend,
  className = '',
}) => {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200/80 p-3.5 sm:p-5 shadow-subtle flex flex-col justify-between transition-all hover:border-slate-300 min-w-0 overflow-hidden ${className}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
        <span className="text-xs sm:text-sm font-medium text-slate-500 truncate" title={title}>
          {title}
        </span>
        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 ${iconBgColor}`}>
          {icon}
        </div>
      </div>
      <div className="min-w-0">
        <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">{value}</div>
        {(subtext || trend) && (
          <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-1.5 text-[11px] sm:text-xs text-slate-500 min-w-0">
            {trend && (
              <span
                className={`font-medium shrink-0 ${
                  trend.isPositive ? 'text-emerald-600' : 'text-slate-600'
                }`}
              >
                {trend.text}
              </span>
            )}
            {subtext && (
              <span className="truncate block" title={subtext}>
                {subtext}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

