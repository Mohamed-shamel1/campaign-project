import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Megaphone,
  Plus,
  Settings,
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg px-2 py-1.5 flex items-center justify-around select-none">
      {/* Dashboard */}
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            isActive
              ? 'text-brand-700 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <LayoutDashboard className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] mt-0.5">الرئيسية</span>
          </>
        )}
      </NavLink>

      {/* Campaigns List */}
      <NavLink
        to="/campaigns"
        end
        className={({ isActive }) =>
          `flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            isActive
              ? 'text-brand-700 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <Megaphone className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] mt-0.5">الحملات</span>
          </>
        )}
      </NavLink>

      {/* Center New Campaign Button */}
      <NavLink
        to="/campaigns/create"
        className="flex flex-col items-center justify-center -mt-5"
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-700 to-brand-600 text-white flex items-center justify-center shadow-lg shadow-brand-500/30 border-4 border-slate-50 active:scale-95 transition-transform">
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </div>
        <span className="text-[10px] font-bold text-brand-800 mt-0.5">حملة جديدة</span>
      </NavLink>

      {/* Settings */}
      <NavLink
        to="/settings"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            isActive
              ? 'text-brand-700 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <Settings className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] mt-0.5">الإعدادات</span>
          </>
        )}
      </NavLink>
    </nav>
  );
};

