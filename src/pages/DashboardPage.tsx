import React from 'react';
import { Link } from 'react-router-dom';
import { useCampaigns } from '../hooks/useCampaigns';
import { Card } from '../components/common/Card';
import { StatCard } from '../components/common/StatCard';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { CampaignStatusBadge } from '../components/common/Badge';
import { formatDate } from '../utils/formatters';
import { WAPilotService } from '../services/wapilotService';
import {
  Megaphone,
  Users,
  CheckCircle2,
  Clock,
  Plus,
  Radio,
  ArrowUpLeft,
  ExternalLink,
  ShieldCheck,
  Smartphone,
  ChevronLeft,
  Sparkles,
  FileSpreadsheet,
  Lock,
  Layers,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { campaigns } = useCampaigns();
  const wapilotConfig = WAPilotService.getConfig();

  // Calculate real metrics from existing campaigns
  const totalCampaigns = campaigns.length;
  const readyCampaigns = campaigns.filter(c => c.status === 'ready').length;
  const draftCampaigns = campaigns.filter(c => c.status === 'draft').length;
  const totalAudience = campaigns.reduce((acc, c) => {
    const validCount = c.recipients.filter(r => r.isValid && !r.isDuplicate).length;
    return acc + validCount;
  }, 0);

  const recentCampaigns = campaigns.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* =========================================================================
          EXCLUSIVE HERO SECTION - AL FOUAD PHARMACIES BESPOKE COMMAND BANNER
         ========================================================================= */}
      <div 
        className="relative overflow-hidden rounded-3xl text-white p-6 sm:p-8 lg:p-10 shadow-2xl border border-slate-800/80 select-none"
        style={{
          backgroundColor: '#0a0d11',
          backgroundImage: 'radial-gradient(ellipse 80% 50% at 90% 0%, rgba(236,30,40,0.18) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 10% 100%, rgba(15,23,42,0.6) 0%, transparent 60%)',
        }}
      >
        {/* Subtle Architectural Dot Matrix Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Ambient Corner Crimson Reflection */}
        <div 
          className="absolute -top-32 -end-32 w-80 h-80 rounded-full pointer-events-none opacity-25 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #ec1e28 0%, transparent 70%)',
          }}
        />

        {/* Content Layout Grid */}
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          
          {/* Right Column: Hero Content & Actions */}
          <div className="max-w-2xl space-y-5">
            
            {/* Top Badges Row */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Official Brand Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.07] backdrop-blur-md border border-white/10 text-xs text-slate-200">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ec1e28] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ec1e28]"></span>
                </span>
                <span className="font-semibold tracking-wide">صيدليات الفؤاد | AL Fouad PHARMACIES</span>
              </div>

              {/* Cosmetics Division Pill */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-950/40 border border-red-800/30 text-xs text-rose-300 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                <span>قسم العناية والتجميل</span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              منظومة إطلاق وتسويق عروض واتساب
              <span className="block mt-1.5 bg-gradient-to-r from-[#ec1e28] via-[#ff545e] to-rose-400 bg-clip-text text-transparent">
                المخصصة لعملاء صيدليات الفؤاد
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed max-w-xl">
              استورد قوائم العملاء المصدّرة من نظام Odoo، دقق أرقام الهواتف المصرية بنقرة واحدة مع استبعاد التكرار والأخطاء، وصِغ رسائل تسويقية تفاعلية بمعاينة حية للمستلم قبل البث.
            </p>

            {/* Key Value Capabilities Micro-Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-[11px] text-slate-300">
                <FileSpreadsheet className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>استيراد Odoo (CSV/XLSX)</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-[11px] text-slate-300">
                <Smartphone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>معايرة E.164 لشبكات مصر</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-[11px] text-slate-300">
                <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>معالجة آمنة محلية 100%</span>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <Link to="/campaigns/create" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full sm:w-auto bg-[#ec1e28] hover:bg-[#d0151f] text-white shadow-[0_4px_20px_rgba(236,30,40,0.45)] font-bold border-none text-sm px-6 py-3 rounded-xl transition-all"
                  leftIcon={<Plus className="w-4 h-4 stroke-[2.5]" />}
                >
                  بدء حملة تسويقية جديدة الآن
                </Button>
              </Link>

              <Link to="/campaigns" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="md"
                  className="w-full sm:w-auto text-slate-200 hover:text-white border-slate-700/80 bg-white/[0.03] hover:bg-white/[0.07] text-sm px-5 py-3 rounded-xl transition-all"
                  leftIcon={<ChevronLeft className="w-4 h-4 rtl:rotate-180" />}
                >
                  استعراض سجل الحملات
                </Button>
              </Link>
            </div>
          </div>

          {/* Left Column: Exclusive Al Fouad Brand Showcase Card */}
          <div className="hidden lg:flex flex-col items-center justify-center p-5 rounded-2xl bg-[#12161c]/95 border border-slate-700/70 shadow-2xl backdrop-blur-xl shrink-0 w-72 text-center">
            
            {/* Crisp Official Logo Container */}
            <div className="w-40 h-20 bg-white rounded-xl p-2.5 shadow-md flex items-center justify-center border border-slate-200/90">
              <img
                src="/logo.png"
                alt="شعار صيدليات الفؤاد الرسمي"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Brand Title */}
            <div className="mt-3.5">
              <span className="text-xs font-bold text-white block">
                صيدليات الفؤاد
              </span>
              <span className="text-[10px] font-bold text-[#ec1e28] uppercase tracking-wider block mt-0.5">
                AL FOUAD PHARMACIES • MARKETING
              </span>
            </div>

            {/* Live Engine Status Matrix */}
            <div className="mt-4 pt-3 border-t border-slate-800/90 w-full space-y-2.5 text-start text-[11px]">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  محرك التحقق (E.164):
                </span>
                <span className="font-bold text-emerald-400">نشط ومعتمد</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Smartphone className="w-3.5 h-3.5 text-rose-400" />
                  الشبكات المدعومة:
                </span>
                <span className="text-[10px] font-semibold text-slate-200">010, 011, 012, 015</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  حالة ربط WAPilot:
                </span>
                <span className="text-[10px] font-medium text-amber-400">تكامل سحابي جاهز</span>
              </div>
            </div>

            {/* Official Badge Footer */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 w-full text-center">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
                <Lock className="w-3 h-3 text-emerald-400" />
                معالجة وتشفير محلي آمن في المتصفح
              </span>
            </div>

          </div>

        </div>
      </div>

      {/* WhatsApp Connection Status Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                حالة ربط بوابة واتساب (WAPilot API v2)
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">
                غير متصل
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              {wapilotConfig.statusMessage}
            </p>
          </div>
        </div>

        <Link to="/settings" className="w-full sm:w-auto shrink-0 self-stretch sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-auto font-medium"
            rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
          >
            إعدادات بوابة الإرسال
          </Button>
        </Link>
      </div>

      {/* Key Real Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="إجمالي الحملات"
          value={totalCampaigns}
          subtext={totalCampaigns === 0 ? 'لا توجد حملات مسجلة بعد' : 'حملة تسويقية'}
          icon={<Megaphone className="w-5 h-5" />}
          iconBgColor="bg-brand-50 text-brand-700"
        />

        <StatCard
          title="الحملات المكتملة والمجهزة"
          value={readyCampaigns}
          subtext="جاهزة للإرسال السحابي"
          icon={<CheckCircle2 className="w-5 h-5" />}
          iconBgColor="bg-emerald-50 text-emerald-700"
        />

        <StatCard
          title="المسودات قيد الإعداد"
          value={draftCampaigns}
          subtext="يمكن تعديلها في أي وقت"
          icon={<Clock className="w-5 h-5" />}
          iconBgColor="bg-amber-50 text-amber-700"
        />

        <StatCard
          title="إجمالي المستهدفين المعتمدين"
          value={totalAudience}
          subtext="عملاء بأرقام صالحة"
          icon={<Users className="w-5 h-5" />}
          iconBgColor="bg-slate-100 text-slate-700"
        />
      </div>

      {/* Recent Campaigns Section */}
      <Card>
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">آخر الحملات التسويقية</h3>
            <p className="text-xs text-slate-500">
              استعراض الحملات الحديثة وقوائم المستلمين المعتمدة
            </p>
          </div>
          {totalCampaigns > 0 && (
            <Link
              to="/campaigns"
              className="text-xs font-semibold text-brand-700 hover:text-brand-800 flex items-center gap-1"
            >
              عرض كافة الحملات
              <ArrowUpLeft className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {totalCampaigns === 0 ? (
          <EmptyState
            icon={<Megaphone className="w-6 h-6" />}
            title="لا توجد حملات تسويقية بعد"
            description="ابدأ الآن بإنشاء أول حملة تسويقية، واستورد جهات الاتصال الخاصة بصيدليتك من ملف CSV أو Excel."
            action={
              <Link to="/campaigns/create">
                <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                  إنشاء حملة تسويقية جديدة
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-semibold">
                  <th className="py-3 px-4 text-start">اسم الحملة</th>
                  <th className="py-3 px-4 text-start">الحالة</th>
                  <th className="py-3 px-4 text-start">عدد المستلمين</th>
                  <th className="py-3 px-4 text-start">الوسائط المرفقة</th>
                  <th className="py-3 px-4 text-start">تاريخ الإعداد</th>
                  <th className="py-3 px-4 text-start">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentCampaigns.map(camp => {
                  const validCount = camp.recipients.filter(r => r.isValid && !r.isDuplicate).length;
                  return (
                    <tr key={camp.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        <Link
                          to={`/campaigns/${camp.id}`}
                          className="hover:text-brand-700 transition-colors"
                        >
                          {camp.name}
                        </Link>
                        {camp.description && (
                          <span className="block text-[11px] text-slate-400 font-normal truncate max-w-xs">
                            {camp.description}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <CampaignStatusBadge status={camp.status} />
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {validCount} عميل
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {camp.media ? (
                          <span className="inline-flex items-center gap-1 text-slate-800 font-medium">
                            {camp.media.name}
                          </span>
                        ) : (
                          <span className="text-slate-400">نصية فقط</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-sans">
                        {formatDate(camp.createdAt)}
                      </td>
                      <td className="py-3 px-4">
                        <Link to={`/campaigns/${camp.id}`}>
                          <Button variant="ghost" size="sm" className="text-brand-700 font-semibold">
                            عرض التفاصيل
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
