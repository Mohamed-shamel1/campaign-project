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
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-fouad-dark via-slate-900 to-brand-900 text-white p-5 sm:p-8 shadow-card border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl space-y-3">
            {/* Pill Tag with Logo */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-rose-100 font-medium">
              <div className="h-5 w-8 rounded bg-white p-0.5 flex items-center justify-center shrink-0">
                <img src="/logo.png" alt="صيدليات الفؤاد" className="h-full w-full object-contain" />
              </div>
              <span>صيدليات الفؤاد | AL Fouad PHARMACIES - قسم العناية والتجميل</span>
            </div>

            <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              منصة إدارة حملات واتساب - صيدليات الفؤاد
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              استورد أرقام عملائك من نظام Odoo، ودقق أرقام الهواتف المصرية بنقرة واحدة، وقم بإنشاء رسائل تسويقية احترافية مع معاينة حية للمستلم.
            </p>

            <div className="pt-2">
              <Link to="/campaigns/create" className="inline-block w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full sm:w-auto bg-brand-600 hover:bg-brand-500 text-white shadow-glow font-bold border-none text-sm px-6 py-2.5"
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  بدء حملة تسويقية جديدة الآن
                </Button>
              </Link>
            </div>
          </div>

          {/* Clean Official Logo Card on Desktop (No inverted watermarks!) */}
          <div className="hidden lg:flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shrink-0 shadow-lg">
            <div className="w-44 h-22 bg-white rounded-xl p-2.5 shadow-md flex items-center justify-center">
              <img
                src="/logo.png"
                alt="شعار صيدليات الفؤاد"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="mt-2 text-center">
              <span className="text-[11px] font-bold text-white block">
                صيدليات الفؤاد
              </span>
              <span className="text-[10px] text-rose-300 block">
                البوابة التسويقية المعتمدة
              </span>
            </div>
          </div>
        </div>

        {/* Subtle background crimson glow */}
        <div className="absolute top-0 end-1/4 w-96 h-96 rounded-full bg-brand-600/15 blur-3xl pointer-events-none" />
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

        <Link to="/settings" className="shrink-0 self-end sm:self-auto">
          <Button
            variant="outline"
            size="sm"
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
          iconBgColor="bg-purple-50 text-purple-700"
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
                          <span className="inline-flex items-center gap-1 text-purple-700 font-medium">
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
                          <Button variant="ghost" size="sm" className="text-brand-700">
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
