import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Megaphone,
  PlusCircle,
  Settings,
  Radio,
  ExternalLink,
  X,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';

interface SidebarProps {
  isOpen: boolean; // For mobile off-canvas drawer
  onClose: () => void;
  isCollapsed: boolean; // For desktop collapsed icon rail
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
}) => {
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
      icon: <PlusCircle className="w-5 h-5 text-brand-600" />,
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
        className={`fixed top-0 bottom-0 start-0 z-50 bg-white border-e border-slate-200/80 flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? 'lg:w-20' : 'lg:w-72'
        } ${
          /* Mobile Drawer visibility */
          isOpen
            ? 'w-72 translate-x-0'
            : 'w-72 max-lg:rtl:translate-x-full max-lg:ltr:-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div
          className={`h-20 px-3.5 flex items-center border-b border-slate-100 bg-white transition-all ${
            isCollapsed ? 'justify-center' : 'justify-between'
          }`}
        >
          {isCollapsed ? (
            /* Collapsed Compact Logo */
            <div
              className="h-10 w-10 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shadow-2xs shrink-0 cursor-pointer hover:border-brand-300 transition-colors"
              title={`${pharmacyName} - انقر لتوسيع القائمة`}
              onClick={onToggleCollapse}
            >
              <img
                src="/logo.png"
                alt="لوجو صيدليات الفؤاد"
                className="h-full w-full object-contain"
              />
            </div>
          ) : (
            /* Expanded Full Logo Header */
            <>
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-11 w-16 rounded-xl bg-white border border-slate-200/90 p-1 flex items-center justify-center shadow-2xs shrink-0 overflow-hidden">
                  <img
                    src="/logo.png"
                    alt="لوجو صيدليات الفؤاد"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <h1 className="font-bold text-slate-900 text-sm leading-tight tracking-tight truncate">
                    {pharmacyName || 'صيدليات الفؤاد'}
                  </h1>
                  <p className="text-[10px] font-bold text-brand-600 truncate uppercase tracking-wider">
                    AL Fouad PHARMACIES
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    تسويق واتساب - قسم التجميل
                  </p>
                </div>
              </div>

              {/* Close on mobile */}
              <button
                onClick={onClose}
                className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 shrink-0 transition-colors"
                aria-label="إغلاق القائمة"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-4 px-2.5 space-y-1.5 overflow-y-auto">
          {!isCollapsed && (
            <div className="px-3 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              القائمة الرئيسية
            </div>
          )}

          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              title={isCollapsed ? item.label : undefined}
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className={({ isActive }) =>
                `flex items-center rounded-xl text-sm font-medium transition-all group ${
                  isCollapsed
                    ? 'justify-center p-2.5'
                    : 'gap-3 px-3.5 py-2.5'
                } ${
                  isActive
                    ? 'bg-brand-50 text-brand-900 font-bold shadow-2xs border border-brand-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`shrink-0 transition-transform group-hover:scale-105 ${
                      isActive
                        ? 'text-brand-600'
                        : item.highlight
                        ? 'text-brand-600'
                        : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  >
                    {item.icon}
                  </span>

                  {!isCollapsed && (
                    <>
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.highlight && !isActive && (
                        <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0"></span>
                      )}
                    </>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* WhatsApp Connection Status Card */}
        <div className={`p-2.5 border-t border-slate-100 ${isCollapsed ? 'text-center' : ''}`}>
          {isCollapsed ? (
            /* Collapsed Status Dot */
            <div
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-center cursor-pointer"
              title={`حالة الربط: ${wapilot.isConnected ? 'متصل' : 'غير متصل'}`}
            >
              <span
                className={`w-3 h-3 rounded-full ${
                  wapilot.isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
                }`}
              />
            </div>
          ) : (
            /* Expanded Status Card */
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-slate-400" />
                  حالة الربط (WAPilot)
                </span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    wapilot.isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
                  }`}
                />
              </div>
              <p className="text-[11px] text-slate-500 leading-normal mb-2">
                {wapilot.isConnected
                  ? 'متصل عبر نقطة النهاية السحابية'
                  : 'الربط غير مفعل (جاهز للربط المستقبلي)'}
              </p>
              <NavLink
                to="/settings"
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-700 hover:text-brand-800 transition-colors"
              >
                إعدادات الربط البرمجي
                <ExternalLink className="w-3 h-3" />
              </NavLink>
            </div>
          )}
        </div>

        {/* Collapse / Expand Toggle Button Footer (Desktop only) */}
        <div className="hidden lg:flex px-3 py-2.5 border-t border-slate-100 bg-white items-center justify-between">
          {!isCollapsed && (
            <span className="text-[11px] font-medium text-slate-400">
              طي القائمة الجانبية
            </span>
          )}
          <button
            type="button"
            onClick={onToggleCollapse}
            className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors ${
              isCollapsed ? 'mx-auto' : ''
            }`}
            title={isCollapsed ? 'توسيع القائمة الجانبية' : 'طي القائمة الجانبية'}
          >
            {isCollapsed ? (
              <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
            ) : (
              <ChevronRight className="w-4 h-4 rtl:rotate-180" />
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
