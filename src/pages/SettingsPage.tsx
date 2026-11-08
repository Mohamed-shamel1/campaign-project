import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { WAPilotService } from '../services/wapilotService';
import { useSettings } from '../hooks/useSettings';
import {
  Radio,
  ShieldCheck,
  Server,
  Building,
  CheckCircle2,
  AlertCircle,
  Lock,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings } = useSettings();

  const [pharmacyName, setPharmacyName] = useState(settings.pharmacyName || 'صيدليات الفؤاد');
  const [defaultCountryCode, setDefaultCountryCode] = useState(settings.defaultCountryCode || '+20');
  const [apiUrl, setApiUrl] = useState(settings.wapilot.apiUrl || 'https://api.wapilot.net/v2');
  const [instanceId, setInstanceId] = useState(settings.wapilot.instanceId || '');
  const [isTesting, setIsTesting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testResult, setTestResult] = useState<{ isConnected: boolean; message: string } | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Update centralized reactive settings
    updateSettings({
      pharmacyName: pharmacyName.trim() || 'صيدليات الفؤاد',
      defaultCountryCode: defaultCountryCode.trim() || '+20',
      wapilot: {
        ...settings.wapilot,
        apiUrl,
        instanceId,
      },
    });

    WAPilotService.saveConfig({
      apiUrl,
      instanceId,
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await WAPilotService.checkConnection();
      setTestResult(res);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          إعدادات التطبيق وهوية الصيدلية
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          تهيئة اسم الصيدلية، كود الدولة، ومعايير ربط بوابة WAPilot v2
        </p>
      </div>

      {/* Integration Status Notice */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-200/80 shadow-subtle">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Radio className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-amber-950">
                حالة الربط البرمجي: غير مفعل (جاهز للتكامل السحابي)
              </h3>
            </div>
            <p className="text-xs text-amber-900/90 leading-relaxed">
              وفقاً للمعايير الأمنية، يتم تخزين مفاتيح الربط البرمجي (API Keys) بصورة حصرية عبر دوال خادم آمنة (Vercel Serverless Functions) لمنع تسريب الرموز السرية داخل متصفح المستخدم النهائي.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Pharmacy Identity Settings (First Card) */}
        <Card>
          <div className="flex items-center gap-3 pb-4 mb-5 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-700 to-brand-900 text-white flex items-center justify-center shadow-xs">
              <Building className="w-5 h-5 text-pink-200" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">بيانات وهوية الصيدلية</h3>
              <p className="text-xs text-slate-500">
                الاسم الذي يظهر في رأس الموقع، القائمة الجانبية، ومحاكي رسائل واتساب للعملاء
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                اسم الصيدلية أو العلامة التجارية <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={pharmacyName}
                onChange={e => setPharmacyName(e.target.value)}
                placeholder="مثال: ڤيتا روز فارماسي / صيدلية العناية والتجميل"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                تعديل الاسم هنا ينعكس فوراً في شريط الموقع ومحاكي رسائل واتساب.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                كود الدولة الافتراضي
              </label>
              <input
                type="text"
                value={defaultCountryCode}
                onChange={e => setDefaultCountryCode(e.target.value)}
                placeholder="+20"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-mono dir-ltr text-end sm:text-start"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                كود الدولة الافتراضي لجمهورية مصر العربية (+20) لمعايرة الأرقام المحلية.
              </p>
            </div>
          </div>
        </Card>

        {/* WAPilot Configuration Card */}
        <Card>
          <div className="flex items-center gap-3 pb-4 mb-5 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                إعدادات بوابة WAPilot API v2
              </h3>
              <p className="text-xs text-slate-500">
                المعايير المعتمدة للإرسال عبر خدمة WAPilot
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* API Endpoint URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                عنوان نقطة النهاية (API Base URL)
              </label>
              <input
                type="text"
                value={apiUrl}
                onChange={e => setApiUrl(e.target.value)}
                placeholder="https://api.wapilot.net/v2"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-mono dir-ltr text-end sm:text-start"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                الرابط الرسمي لإصدار WAPilot API v2 المعتمد
              </p>
            </div>

            {/* Instance ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                معرف المثيل (WAPilot Instance ID)
              </label>
              <input
                type="text"
                value={instanceId}
                onChange={e => setInstanceId(e.target.value)}
                placeholder="مثال: instance_6782abc1234"
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                المعرف المخصص لحساب واتساب الخاص بصيدليتك في منصة WAPilot
              </p>
            </div>

            {/* Secret Token Field (Protected) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  الرمز السري للربط (API Secret Key)
                </label>
                <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  محمي برمجياً
                </span>
              </div>
              <input
                type="password"
                disabled
                value="••••••••••••••••••••••••••••••••"
                className="w-full px-3.5 py-2 text-xs bg-slate-100 border border-slate-300 rounded-lg text-slate-500 cursor-not-allowed font-mono"
              />
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>
                  يتم تمرير هذا المفتاح حصرياً عبر متغير البيئة <code>WAPILOT_API_KEY</code> في خادم Vercel Serverless للحفاظ على أمان بيانات الصيدلية.
                </span>
              </p>
            </div>
          </div>

          {/* Test & Save Actions */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              isLoading={isTesting}
              onClick={handleTestConnection}
              leftIcon={<Radio className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              فحص الاتصال البرمجي
            </Button>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              {saveSuccess && (
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  تم حفظ وتحديث الإعدادات بنجاح
                </span>
              )}

              <Button type="submit" variant="primary" size="sm" className="w-full sm:w-auto font-bold">
                حفظ كافة التغييرات
              </Button>
            </div>
          </div>

          {/* Test Result Display */}
          {testResult && (
            <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 mb-0.5">نتيجة فحص الاتصال:</strong>
                {testResult.message}
              </div>
            </div>
          )}
        </Card>
      </form>
    </div>
  );
};
