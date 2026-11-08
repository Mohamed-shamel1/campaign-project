import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { CampaignMedia, NormalizedContact, ImportSummary } from '../../types';
import { formatFileSize } from '../../utils/formatters';
import {
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Users,
  Image as ImageIcon,
  MessageSquare,
  ShieldCheck,
  Code2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { WAPilotService } from '../../services/wapilotService';

interface Step5ReviewProps {
  campaignName: string;
  description: string;
  messageText: string;
  media: CampaignMedia | null;
  summary: ImportSummary | null;
  contacts: NormalizedContact[];
  onConfirmAndSave: (asStatus: 'draft' | 'ready') => void;
  isSaving: boolean;
}

export const Step5Review: React.FC<Step5ReviewProps> = ({
  campaignName,
  description,
  messageText,
  media,
  summary,
  contacts,
  onConfirmAndSave,
  isSaving,
}) => {
  const [showPayloadPreview, setShowPayloadPreview] = useState(false);
  const wapilotConfig = WAPilotService.getConfig();

  const validRecipients = contacts.filter(c => c.isValid && !c.isDuplicate);

  // Generate payload preview
  const payloadPreview = {
    campaignName,
    description: description || null,
    totalValidRecipients: validRecipients.length,
    recipientsSample: validRecipients.slice(0, 3).map(r => ({
      name: r.name,
      to: r.normalizedPhone,
      carrier: r.carrier,
    })),
    message: {
      text: messageText,
      hasMedia: Boolean(media),
      mediaName: media?.name || null,
    },
    targetEndpoint: '/api/wapilot/send-campaign',
    status: 'READY_FOR_SERVERLESS_DISPATCH',
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Executive Summary Card */}
      <Card>
        <div className="flex items-center gap-3 pb-4 mb-5 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              مراجعة وتأكيد الحملة التسويقية
            </h3>
            <p className="text-xs text-slate-500">
              يرجى مراجعة ملخص بيانات الحملة قبل حفظها وتجهيزها للإرسال
            </p>
          </div>
        </div>

        {/* Detailed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Item 1: Campaign Name */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">
              اسم الحملة والوصف
            </span>
            <div className="text-sm font-bold text-slate-900">{campaignName}</div>
            {description ? (
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{description}</p>
            ) : (
              <span className="text-xs text-slate-400 italic mt-1 block">بدون وصف داخلي</span>
            )}
          </div>

          {/* Item 2: Target Audience */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-slate-400">
                قائمة المستلمين المعتمدة
              </span>
              <Users className="w-4 h-4 text-brand-600" />
            </div>
            <div className="text-sm font-bold text-slate-900">
              {validRecipients.length} عميل (أرقام صالحة)
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400" />
              <span>
                المصدر: {summary?.fileName || 'ملف مستورد'} ({summary?.totalRows || 0} صف إجمالي)
              </span>
            </p>
          </div>

          {/* Item 3: Media Info */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-slate-400">
                الوسائط المرفقة
              </span>
              <ImageIcon className="w-4 h-4 text-purple-600" />
            </div>
            {media ? (
              <div>
                <div className="text-sm font-bold text-slate-900 truncate">{media.name}</div>
                <p className="text-xs text-slate-500 mt-1">الحجم: {formatFileSize(media.size)}</p>
              </div>
            ) : (
              <div className="text-xs text-slate-500 mt-1">
                رسالة نصية فقط (لا توجد صورة مرفقة)
              </div>
            )}
          </div>

          {/* Item 4: Message Text Summary */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-slate-400">
                محتوى الرسالة
              </span>
              <MessageSquare className="w-4 h-4 text-brand-600" />
            </div>
            <div className="text-sm font-bold text-slate-900">
              {messageText.length} حرف
            </div>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2 italic">
              "{messageText.substring(0, 70)}..."
            </p>
          </div>
        </div>

        {/* Honest Integration Notice */}
        <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed space-y-1">
              <div className="font-bold">حالة ربط خادم الإرسال (WAPilot API):</div>
              <p>
                {wapilotConfig.statusMessage}
              </p>
              <p className="text-amber-800 text-[11px]">
                يمكنك الآن حفظ الحملة كـ <strong>مسودة</strong> أو اعتمادها بحالة <strong>جاهزة للإرسال</strong>. سيتم حفظ كافة أرقام العملاء والوسائط محلياً، وتجهيز حزمة البيانات للإرسال الفعلي فور تشغيل الخادم السحابي.
              </p>
            </div>
          </div>
        </div>

        {/* Future Serverless Payload Preview Toggle */}
        <div className="mb-6 border border-slate-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setShowPayloadPreview(!showPayloadPreview)}
            className="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-brand-600" />
              معاينة حزمة البيانات البرمجية المعدة لنقطة نهاية Vercel Serverless Function
            </span>
            {showPayloadPreview ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>
          {showPayloadPreview && (
            <div className="p-4 bg-slate-900 text-slate-200 text-xs font-mono overflow-x-auto dir-ltr text-start">
              <pre>{JSON.stringify(payloadPreview, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            isLoading={isSaving}
            onClick={() => onConfirmAndSave('draft')}
          >
            حفظ كمسودة فقط
          </Button>

          <Button
            type="button"
            variant="primary"
            isLoading={isSaving}
            onClick={() => onConfirmAndSave('ready')}
            leftIcon={<ShieldCheck className="w-4 h-4" />}
          >
            تأكيد واعتماد الحملة (جاهزة للإرسال)
          </Button>
        </div>
      </Card>
    </div>
  );
};

