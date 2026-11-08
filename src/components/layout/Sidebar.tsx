import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Megaphone,
  PlusCircle,
  Settings,
  Sparkles,
  Radio,
  ExternalLink,
  X,
} from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { pharmacyName, wapilot } = useSettings();

  const navItems = [
    {
      to: '/',
      label: 'لوحة التحكم',
      icon: <LayoutDashboard className="w-5 h-5" />,
      end: true,
    },
    {
      to: '/campaigns',
      label: 'الحملات التسويقية',
      icon: <Megaphone className="w-5 h-5" />,
      end: true,
    },
    {
      to: '/campaigns/create',
      label: 'إنشاء حملة جديدة',
      icon: <PlusCircle className="w-5 h-5 text-brand-500" />,
      highlight: true,
    },
    {
      to: '/settings',
      label: 'الإعدادات والربط',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-xs transition-opacity duration-200"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 start-0 z-50 w-72 bg-white border-e border-slate-200/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen
            ? 'translate-x-0'
            : 'rtl:translate-x-full ltr:-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 px-5 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-700 to-brand-900 flex items-center justify-center text-white shadow-sm ring-2 ring-brand-100 shrink-0">
              <Sparkles className="w-5 h-5 text-pink-200" />
            </div>
            <div className="min-w-0">
              <h1 className="font-bold text-slate-900 text-sm sm:text-base leading-tight tracking-tight truncate">
                {pharmacyName || 'صيدلية التجميل والعناية'}
              </h1>
              <p className="text-[11px] font-medium text-slate-400 truncate">
                تسويق واتساب لمستحضرات التجميل
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 shrink-0 transition-colors"
            aria-label="إغلاق القائمة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-5 px-3.5 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            القائمة الرئيسية
          </div>

          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-50 text-brand-900 font-semibold shadow-xs border border-brand-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={
                      isActive
                        ? 'text-brand-700'
                        : item.highlight
                        ? 'text-brand-600'
                        : 'text-slate-400'
                    }
                  >
                    {item.icon}
                  </span>
                  <span className="flex-1">{item.label}</span>
                  {item.highlight && !isActive && (
                    <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* WhatsApp Connection Status Card */}
        <div className="p-4 border-t border-slate-100">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-slate-400" />
                حالة الربط (WAPilot)
              </span>
              <span
                className={`w-2 h-2 rounded-full ${
                  wapilot.isConnected ? 'bg-emerald-500' : 'bg-amber-400'
                }`}
              />
            </div>
            <p className="text-[11px] text-slate-500 leading-normal mb-2.5">
              {wapilot.isConnected
                ? 'متصل عبر نقطة النهاية السحابية'
                : 'الربط غير مفعل (جاهز للربط المستقبلي)'}
            </p>
            <NavLink
              to="/settings"
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-brand-700 hover:text-brand-800 transition-colors"
            >
              إعدادات الربط البرمجي
              <ExternalLink className="w-3 h-3" />
            </NavLink>
          </div>
        </div>

        {/* Pharmacy Meta Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-white flex items-center justify-between text-[11px] text-slate-400">
          <span>النسخة v1.0.0</span>
          <span className="truncate max-w-[120px]">{pharmacyName}</span>
        </div>
      </aside>
    </>
  );
};
