import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCampaigns } from '../hooks/useCampaigns';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { StatCard } from '../components/common/StatCard';
import { CampaignStatusBadge } from '../components/common/Badge';
import { WhatsAppPreview } from '../components/whatsapp/WhatsAppPreview';
import { ContactsTable } from '../components/campaigns/ContactsTable';
import { formatDate } from '../utils/formatters';
import {
  ArrowRight,
  Trash2,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Radio,
  FileSpreadsheet,
  Smartphone,
  Users,
} from 'lucide-react';

export const CampaignDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCampaign, deleteCampaign } = useCampaigns();
  const [mobileTab, setMobileTab] = useState<'details' | 'preview'>('details');

  const campaign = id ? getCampaign(id) : undefined;

  if (!campaign) {
    return (
      <Card className="text-center py-16 max-w-xl mx-auto space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
        <h3 className="text-lg font-bold text-slate-800">الحملة المطلوبة غير موجودة</h3>
        <p className="text-sm text-slate-500">
          قد تكون الحملة تم حذفها أو أن الرابط غير صحيح.
        </p>
        <Link to="/campaigns">
          <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4 rtl:rotate-180" />}>
            العودة لقائمة الحملات
          </Button>
        </Link>
      </Card>
    );
  }

  const validRecipients = campaign.recipients.filter(r => r.isValid && !r.isDuplicate);
  const invalidRecipients = campaign.recipients.filter(r => !r.isValid);
  const duplicateRecipients = campaign.recipients.filter(r => r.isDuplicate);

  const handleDelete = () => {
    if (window.confirm(`هل أنت متأكد من حذف الحملة "${campaign.name}"؟`)) {
      deleteCampaign(campaign.id);
      navigate('/campaigns');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto min-w-0">
      {/* Top Breadcrumb & Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-slate-200/80 min-w-0">
        <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          <Link to="/campaigns" className="shrink-0 mt-0.5 sm:mt-0">
            <Button
              variant="outline"
              size="sm"
              rightIcon={<ArrowRight className="w-4 h-4 rtl:rotate-180" />}
              className="text-xs px-2.5 py-1.5"
            >
              الحملات
            </Button>
          </Link>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-base sm:text-2xl font-bold text-slate-900 tracking-tight break-words">
                {campaign.name}
              </h1>
              <CampaignStatusBadge status={campaign.status} />
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-1">
              <span className="flex items-center gap-1 shrink-0">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                تاريخ الإنشاء: {formatDate(campaign.createdAt)}
              </span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="font-mono text-[10px] sm:text-[11px] text-slate-400 truncate max-w-[200px] sm:max-w-xs">
                المعرف: {campaign.id}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="text-rose-600 hover:text-rose-700 border-rose-200 hover:bg-rose-50 text-xs px-3 py-1.5"
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
          >
            حذف الحملة
          </Button>
        </div>
      </div>

      {/* Recipient Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 min-w-0">
        <StatCard
          title="المستلمون المعتمدون"
          value={validRecipients.length}
          subtext="أرقام صالحة ومؤكدة"
          icon={<CheckCircle2 className="w-5 h-5" />}
          iconBgColor="bg-emerald-50 text-emerald-700"
        />

        <StatCard
          title="إجمالي الصفوف"
          value={campaign.recipients.length}
          subtext={campaign.importSummary?.fileName || 'ملف جهات الاتصال'}
          icon={<FileSpreadsheet className="w-5 h-5" />}
          iconBgColor="bg-brand-50 text-brand-700"
        />

        <StatCard
          title="أرقام غير صالحة"
          value={invalidRecipients.length}
          subtext="تم استبعادها بدقة"
          icon={<AlertTriangle className="w-5 h-5" />}
          iconBgColor="bg-rose-50 text-rose-700"
        />

        <StatCard
          title="أرقام مكررة"
          value={duplicateRecipients.length}
          subtext="منع تكرار الإرسال"
          icon={<Copy className="w-5 h-5" />}
          iconBgColor="bg-amber-50 text-amber-700"
        />
      </div>

      {/* Message Sending Status Breakdown (Honest Real Data) */}
      <Card className="min-w-0 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-100 gap-1.5">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              إحصائيات إرسال رسائل الواتساب
            </h3>
            <p className="text-xs text-slate-500">
              حالة تسليم الرسائل الفعلية عبر بوابة WAPilot v2
            </p>
          </div>
          <span className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium self-start sm:self-auto">
            تحديث مباشر
          </span>
        </div>

        {campaign.status === 'ready' || campaign.status === 'draft' ? (
          <div className="p-3 sm:p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5 sm:gap-3">
            <Radio className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 leading-relaxed space-y-1">
              <span className="font-bold text-slate-900 block">
                الحملة في حالة ({campaign.status === 'ready' ? 'جاهزة للإرسال' : 'مسودة'}):
              </span>
              <p>
                لم يتم إطلاق بث الرسائل بعد. لا توجد أي بيانات وهمية أو رسائل مسجلة كمرسلة.
                ستظهر أرقام الرسائل المرسلة والمسلمة والمقروءة هنا فور بدء إرسال الحملة عبر نقطة النهاية السحابية لـ WAPilot.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
            <div className="p-3 bg-slate-50 rounded-lg text-center">
              <span className="text-xs text-slate-500">تم الإرسال</span>
              <div className="text-lg font-bold text-slate-900">{campaign.stats.sent}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg text-center">
              <span className="text-xs text-slate-500">تم التسليم</span>
              <div className="text-lg font-bold text-emerald-700">{campaign.stats.delivered}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg text-center">
              <span className="text-xs text-slate-500">تمت القراءة</span>
              <div className="text-lg font-bold text-blue-700">{campaign.stats.read}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg text-center">
              <span className="text-xs text-slate-500">فشل الإرسال</span>
              <div className="text-lg font-bold text-rose-700">{campaign.stats.failed}</div>
            </div>
          </div>
        )}
      </Card>

      {/* Mobile Segmented View Control (Exclusively for Mobile < lg) */}
      <div className="flex items-center p-1 bg-slate-200/80 rounded-xl lg:hidden text-xs font-semibold gap-1">
        <button
          type="button"
          onClick={() => setMobileTab('details')}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            mobileTab === 'details'
              ? 'bg-white text-slate-900 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4 text-brand-600" />
          <span>سجل المستلمين والبيانات</span>
          <span className="bg-brand-50 text-brand-700 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
            {validRecipients.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            mobileTab === 'preview'
              ? 'bg-white text-slate-900 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Smartphone className="w-4 h-4 text-emerald-600" />
          <span>معاينة واتساب الحية</span>
        </button>
      </div>

      {/* Main Grid: Message Preview + Contacts Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start min-w-0">
        
        {/* Contacts Details & Campaign Log Column (Desktop: Right Column / Mobile: Tab 1) */}
        <div className={`lg:col-span-7 space-y-6 min-w-0 w-full ${mobileTab === 'details' ? 'block' : 'hidden lg:block'}`}>
          {/* Campaign Details Info Card */}
          <Card className="min-w-0 overflow-hidden">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              تفاصيل وملخص الحملة
            </h4>
            <div className="space-y-3 text-xs">
              {campaign.description && (
                <div className="p-3 bg-slate-50 rounded-lg text-slate-600 border border-slate-200/60 leading-relaxed break-words">
                  <strong className="text-slate-800 block mb-0.5">الوصف الداخلي:</strong> {campaign.description}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60 min-w-0">
                  <span className="text-slate-400 block mb-0.5">الملف المصدر:</span>
                  <span className="font-semibold text-slate-900 truncate block" title={campaign.importSummary?.fileName}>
                    {campaign.importSummary?.fileName || 'تم الاستيراد محلياً'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60 min-w-0">
                  <span className="text-slate-400 block mb-0.5">الصورة الترويجية:</span>
                  <span className="font-semibold text-slate-900 truncate block" title={campaign.media?.name}>
                    {campaign.media ? campaign.media.name : 'لا توجد وسائط مرفقة'}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Recipient Contacts Table */}
          <Card className="min-w-0 overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-100 gap-2">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  قائمة جهات الاتصال المسجلة في الحملة
                </h4>
                <p className="text-xs text-slate-500">
                  فحص دقيق لكافة أرقام الهواتف المستوردة وحالتها الفنية
                </p>
              </div>
              <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200 self-start sm:self-auto">
                {validRecipients.length} رقم معتمد
              </span>
            </div>

            <ContactsTable contacts={campaign.recipients} />
          </Card>
        </div>

        {/* WhatsApp Preview Column (Desktop: Left Column / Mobile: Tab 2) */}
        <div className={`lg:col-span-5 flex flex-col items-center min-w-0 w-full ${mobileTab === 'preview' ? 'block' : 'hidden lg:block'}`}>
          <div className="w-full max-w-sm lg:sticky lg:top-24">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-bold text-slate-700">
                معاينة رسالة الحملة المعتمدة
              </span>
              <span className="text-[11px] text-slate-400">
                مظهر المحادثة لدى المستلم
              </span>
            </div>
            <WhatsAppPreview
              messageText={campaign.messageText}
              mediaUrl={campaign.media?.url}
              mediaFileName={campaign.media?.name}
              recipientCount={validRecipients.length}
            />
          </div>
        </div>

      </div>
    </div>
  );
};
