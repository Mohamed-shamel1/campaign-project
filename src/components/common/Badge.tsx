import React from 'react';
import { ContactStatus, CampaignStatus, CarrierType } from '../../types';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'carrier';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  const variantClasses = {
    default: 'bg-slate-100 text-slate-700 border border-slate-200/80',
    primary: 'bg-brand-50 text-brand-800 border border-brand-200',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200',
    danger: 'bg-rose-50 text-rose-800 border border-rose-200',
    info: 'bg-sky-50 text-sky-800 border border-sky-200',
    carrier: 'bg-slate-50 text-slate-700 border border-slate-200',
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizeClasses} ${variantClasses} ${className}`}
    >
      {children}
    </span>
  );
};

export const ContactStatusBadge: React.FC<{ status: ContactStatus; size?: 'sm' | 'md' }> = ({
  status,
  size = 'sm',
}) => {
  switch (status) {
    case 'valid':
      return (
        <Badge variant="success" size={size}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
          صالح
        </Badge>
      );
    case 'duplicate':
      return (
        <Badge variant="warning" size={size}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block"></span>
          مكرر
        </Badge>
      );
    case 'invalid':
      return (
        <Badge variant="danger" size={size}>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block"></span>
          غير صالح
        </Badge>
      );
  }
};

export const CampaignStatusBadge: React.FC<{ status: CampaignStatus; size?: 'sm' | 'md' }> = ({
  status,
  size = 'md',
}) => {
  switch (status) {
    case 'draft':
      return (
        <Badge variant="default" size={size}>
          مسودة
        </Badge>
      );
    case 'ready':
      return (
        <Badge variant="primary" size={size}>
          جاهزة للإرسال
        </Badge>
      );
    case 'scheduled':
      return (
        <Badge variant="info" size={size}>
          مجدولة
        </Badge>
      );
    case 'completed':
      return (
        <Badge variant="success" size={size}>
          مكتملة
        </Badge>
      );
    case 'failed':
      return (
        <Badge variant="danger" size={size}>
          فشلت
        </Badge>
      );
  }
};

export const CarrierBadge: React.FC<{ carrier?: CarrierType; size?: 'sm' | 'md' }> = ({
  carrier,
  size = 'sm',
}) => {
  if (!carrier) return null;

  const colorStyles: Record<CarrierType, string> = {
    'فودافون': 'text-red-700 bg-red-50 border-red-200',
    'أورنج': 'text-orange-700 bg-orange-50 border-orange-200',
    'إتصالات': 'text-emerald-700 bg-emerald-50 border-emerald-200',
    'وي': 'text-purple-700 bg-purple-50 border-purple-200',
    'دولي / أخرى': 'text-slate-700 bg-slate-50 border-slate-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${colorStyles[carrier]} ${
        size === 'sm' ? 'text-[11px]' : ''
      }`}
    >
      {carrier}
    </span>
  );
};

