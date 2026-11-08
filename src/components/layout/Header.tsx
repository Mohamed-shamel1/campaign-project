import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Plus, ShieldCheck } from 'lucide-react';
import { Button } from '../common/Button';
import { useSettings } from '../../hooks/useSettings';

interface HeaderProps {
  onOpenSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSidebar }) => {
  const location = useLocation();
  const { pharmacyName } = useSettings();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return {
          title: 'لوحة التحكم والمؤشرات',
          subtitle: `نظرة عامة على نشاط وحملات واتساب لعملاء ${pharmacyName}`,
        };
      case '/campaigns':
        return {
          title: 'سجل الحملات التسويقية',
          subtitle: 'إدارة واستعراض الحملات المعدة والجاهزة للإرسال',
        };
      case '/campaigns/create':
        return {
          title: 'إنشاء حملة تسويقية جديدة',
          subtitle: 'معالج استيراد أرقام العملاء من ملفات Odoo وإعداد الرسالة',
        };
      case '/settings':
        return {
          title: 'الإعدادات والربط البرمجي',
          subtitle: `تهيئة معايير الربط وهوية ${pharmacyName}`,
        };
      default:
        if (location.pathname.startsWith('/campaigns/')) {
          return {
            title: 'تفاصيل الحملة ومستلميها',
            subtitle: 'مراجعة بيانات الحملة وقائمة العملاء المستهدفين',
          };
        }
        return {
          title: 'مدير حملات واتساب',
          subtitle: pharmacyName,
        };
    }
  };

  const { title, subtitle } = getPageTitle();
  const isCreatePage = location.pathname === '/campaigns/create';

  return (
    <header className="h-16 sm:h-20 bg-white border-b border-slate-200/80 sticky top-0 z-30 px-3.5 sm:px-8 flex items-center justify-between">
      {/* Mobile Toggle + Page Title */}
      <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none transition-colors shrink-0"
          aria-label="فتح القائمة الجانبية"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h2 className="text-base sm:text-xl font-bold text-slate-900 tracking-tight truncate">
            {title}
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 hidden sm:block truncate mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Security badge indicating local file processing */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>المعالجة محلية وآمنة</span>
        </div>

        {!isCreatePage && (
          <Link to="/campaigns/create">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              className="shadow-sm text-xs sm:text-sm px-2.5 py-1.5 sm:px-3 sm:py-2"
            >
              <span className="hidden sm:inline">حملة تسويقية جديدة</span>
              <span className="sm:hidden">حملة جديدة</span>
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
};
