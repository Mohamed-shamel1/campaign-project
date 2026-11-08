import React from 'react';
import { Card } from '../common/Card';
import { Megaphone, FileText, Sparkles, Tag } from 'lucide-react';

interface Step1InfoProps {
  name: string;
  description: string;
  onChangeName: (value: string) => void;
  onChangeDescription: (value: string) => void;
}

export const Step1Info: React.FC<Step1InfoProps> = ({
  name,
  description,
  onChangeName,
  onChangeDescription,
}) => {
  const suggestedNames = [
    'خصومات منتجات العناية بالبشرة والواقي الشمسي',
    'عرض الجمعة البيضاء - مستحضرات التجميل والعطور',
    'حملة التوعية بالترطيب الموسمي لعملاء الصيدلية',
    'وصول الماركات الفرنسية الجديدة (لاروش وبايوديرما)',
  ];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Card>
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">المعلومات الأساسية للحملة</h3>
            <p className="text-xs text-slate-500">
              حدد اسماً واضحاً للحملة الترويجية لتمييزها في سجلات وتقارير الصيدلية
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Campaign Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
              اسم الحملة التسويقية <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => onChangeName(e.target.value)}
              placeholder="مثال: عرض الصيف على واقيات الشمس ومستحضرات الترطيب"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
            {name.trim() === '' && (
              <p className="text-[11px] text-amber-600 mt-1.5">
                اسم الحملة مطلوب للمتابعة والفرز لاحقاً.
              </p>
            )}

            {/* Suggestions */}
            <div className="mt-3">
              <span className="text-[11px] text-slate-400 block mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-brand-500" />
                اقتراحات سريعة لأسماء الحملات:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {suggestedNames.map((sug, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onChangeName(sug)}
                    className="text-[11px] px-2.5 py-1 bg-slate-50 hover:bg-brand-50 hover:text-brand-800 text-slate-600 border border-slate-200 rounded-lg transition-colors text-start"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Campaign Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                الوصف والملاحظات الداخلية (اختياري)
              </label>
              <span className="text-[11px] text-slate-400">خاص بإدارة الصيدلية فقط</span>
            </div>
            <textarea
              rows={3}
              value={description}
              onChange={e => onChangeDescription(e.target.value)}
              placeholder="اكتب أهداف الحملة، الشريحة المستهدفة من عملاء Odoo، أو أي تفاصيل داخلية لفريق الصيدلية..."
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </div>

          {/* Pharmacy Context Tip */}
          <div className="p-3.5 bg-brand-50/50 rounded-xl border border-brand-100 flex items-start gap-3">
            <Tag className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
            <div className="text-xs text-brand-900 leading-relaxed">
              <span className="font-bold">تنويه تسويقي للصيادلة:</span> يمكنك تصدير جهات الاتصال الخاصة بمنتجات التجميل والعناية مباشرة من نظام Odoo بصيغة Excel أو CSV واستيرادها في الخطوة التالية.
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

