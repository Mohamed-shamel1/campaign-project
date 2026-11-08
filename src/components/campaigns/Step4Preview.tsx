import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { WhatsAppPreview } from '../whatsapp/WhatsAppPreview';
import { CampaignMedia, NormalizedContact } from '../../types';
import {
  Users,
  MessageSquare,
  Edit3,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface Step4PreviewProps {
  campaignName: string;
  messageText: string;
  media: CampaignMedia | null;
  contacts: NormalizedContact[];
  onGoToStep: (stepNumber: number) => void;
}

export const Step4Preview: React.FC<Step4PreviewProps> = ({
  campaignName,
  messageText,
  media,
  contacts,
  onGoToStep,
}) => {
  const validContacts = contacts.filter(c => c.isValid && !c.isDuplicate);

  // Group by carrier
  const carrierDistribution = validContacts.reduce((acc, curr) => {
    const carrier = curr.carrier || 'دولي / أخرى';
    acc[carrier] = (acc[carrier] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
      {/* Right Column (WhatsApp Simulator Phone) */}
      <div className="lg:col-span-6 flex flex-col items-center">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between mb-3 px-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              المعاينة الحية على واتساب
            </span>
            <span className="text-[11px] text-slate-400">
              المظهر الفعلي لهاتف العميل
            </span>
          </div>

          <WhatsAppPreview
            messageText={messageText}
            mediaUrl={media?.url}
            mediaFileName={media?.name}
            recipientCount={validContacts.length}
            pharmacyName="صيدلية التجميل والعناية"
          />
        </div>
      </div>

      {/* Left Column (Campaign & Audience Summary) */}
      <div className="lg:col-span-6 space-y-6">
        {/* Campaign Brief Card */}
        <Card>
          <div className="flex items-start justify-between pb-3 mb-3 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-semibold text-brand-700 uppercase tracking-wider">
                بيانات الحملة
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">{campaignName}</h3>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onGoToStep(1)}
              leftIcon={<Edit3 className="w-3.5 h-3.5" />}
            >
              تعديل الاسم
            </Button>
          </div>

          {/* Quick Audience Breakdown */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-brand-600" />
                المستلمون الفعليون المعتمدون:
              </span>
              <span className="text-base font-bold text-slate-900">
                {validContacts.length} عميل
              </span>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-200/60">
              <div className="text-[11px] text-slate-500 font-medium mb-1">
                توزيع شبكات المحمول المصرية:
              </div>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(carrierDistribution).map(([carrier, count]) => (
                  <div
                    key={carrier}
                    className="flex items-center justify-between px-2.5 py-1.5 bg-white rounded-lg border border-slate-200/80 text-xs"
                  >
                    <span className="text-slate-600">{carrier}</span>
                    <span className="font-bold text-slate-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Message Content Review */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-brand-600" />
                خصائص الرسالة الترويجية
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onGoToStep(3)}
                leftIcon={<Edit3 className="w-3.5 h-3.5" />}
              >
                تعديل الرسالة
              </Button>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1.5 text-slate-600 border border-slate-200/60">
              <div className="flex items-center justify-between">
                <span>طول نص الرسالة:</span>
                <span className="font-semibold text-slate-900">{messageText.length} حرف</span>
              </div>
              <div className="flex items-center justify-between">
                <span>الصورة المرفقة:</span>
                <span className="font-semibold text-slate-900">
                  {media ? media.name : 'بدون صورة مرفقة'}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Validation Assurance */}
        <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-900 leading-relaxed">
            <strong>تم فحص قائمة المستلمين بدقة:</strong> تم استبعاد كافة الأرقام الأرضية وغير المكتملة والمكررة لضمان أعلى جودة في وصول رسائل واتساب لعملاء الصيدلية.
          </div>
        </div>
      </div>
    </div>
  );
};
