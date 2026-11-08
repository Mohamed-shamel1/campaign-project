import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { NormalizedContact } from '../../types';
import { ContactStatusBadge, CarrierBadge } from '../common/Badge';
import { formatPhoneDisplay } from '../../utils/phone';
import { Search, AlertCircle, CheckCircle2, Copy, Download } from 'lucide-react';

interface ContactsTableProps {
  contacts: NormalizedContact[];
  maxDisplay?: number;
}

export const ContactsTable: React.FC<ContactsTableProps> = ({
  contacts,
  maxDisplay = 100,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'valid' | 'invalid' | 'duplicate'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const counts = useMemo(() => {
    return {
      all: contacts.length,
      valid: contacts.filter(c => c.isValid && !c.isDuplicate).length,
      invalid: contacts.filter(c => !c.isValid).length,
      duplicate: contacts.filter(c => c.isDuplicate).length,
    };
  }, [contacts]);

  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      // Tab filter
      if (activeTab === 'valid' && (!contact.isValid || contact.isDuplicate)) return false;
      if (activeTab === 'invalid' && contact.isValid) return false;
      if (activeTab === 'duplicate' && !contact.isDuplicate) return false;

      // Search filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = contact.name.toLowerCase().includes(query);
        const matchesRaw = contact.rawPhone.toLowerCase().includes(query);
        const matchesNorm = contact.normalizedPhone.toLowerCase().includes(query);
        return matchesName || matchesRaw || matchesNorm;
      }

      return true;
    });
  }, [contacts, activeTab, searchTerm]);

  const displayedList = filteredContacts.slice(0, maxDisplay);

  const handleExportExcel = () => {
    const exportData = filteredContacts.map((c, i) => ({
      'م': i + 1,
      'اسم العميل': c.name,
      'الرقم الأصلي بالملف': c.rawPhone,
      'الرقم المعياري (+20)': c.normalizedPhone,
      'الشبكة': c.carrier || 'غير محدد',
      'الحالة': c.status === 'valid' ? 'صالح' : c.status === 'duplicate' ? 'مكرر' : 'غير صالح',
      'ملاحظات الفحص': c.errorMessage || 'جاهز للإرسال عبر واتساب',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'جهات_الاتصال');
    XLSX.writeFile(workbook, `تقرير_جهات_الاتصال_${activeTab}_${Date.now()}.xlsx`);
  };

  return (
    <div className="space-y-4">
      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            الكل ({counts.all})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('valid')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'valid'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-emerald-700 hover:text-emerald-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            صالحة للإرسال ({counts.valid})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('invalid')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'invalid'
                ? 'bg-white text-rose-800 shadow-xs'
                : 'text-rose-700 hover:text-rose-900'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            غير صالحة ({counts.invalid})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('duplicate')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'duplicate'
                ? 'bg-white text-amber-800 shadow-xs'
                : 'text-amber-700 hover:text-amber-900'
            }`}
          >
            <Copy className="w-3.5 h-3.5 text-amber-600" />
            مكررة ({counts.duplicate})
          </button>
        </div>

        {/* Search & Export Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="بحث بالاسم أو الرقم..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full ps-9 pe-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <button
            type="button"
            onClick={handleExportExcel}
            className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 shadow-xs"
            title="تصدير السجلات الحالية كملف Excel"
          >
            <Download className="w-3.5 h-3.5 text-brand-600" />
            <span className="hidden sm:inline">تصدير Excel</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-slate-200/80 bg-white">
        <table className="w-full text-start text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-semibold">
              <th className="py-2.5 px-3 text-start w-12">#</th>
              <th className="py-2.5 px-3 text-start">اسم العميل</th>
              <th className="py-2.5 px-3 text-start">الرقم في الملف</th>
              <th className="py-2.5 px-3 text-start">الرقم المعياري (+20)</th>
              <th className="py-2.5 px-3 text-start">الشبكة</th>
              <th className="py-2.5 px-3 text-start">الحالة</th>
              <th className="py-2.5 px-3 text-start">ملاحظات الفحص والتحقق</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {displayedList.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  لا توجد سجلات تطابق معايير التصفية الحالية
                </td>
              </tr>
            ) : (
              displayedList.map((contact, index) => (
                <tr
                  key={contact.id || index}
                  className={`hover:bg-slate-50/60 transition-colors ${
                    !contact.isValid
                      ? 'bg-rose-50/30'
                      : contact.isDuplicate
                      ? 'bg-amber-50/30'
                      : ''
                  }`}
                >
                  <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">
                    {index + 1}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-900">
                    {contact.name || 'عميل'}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-600 dir-ltr text-end sm:text-start">
                    {contact.rawPhone || '—'}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-900 dir-ltr text-end sm:text-start">
                    {contact.normalizedPhone ? formatPhoneDisplay(contact.normalizedPhone) : '—'}
                  </td>
                  <td className="py-2.5 px-3">
                    <CarrierBadge carrier={contact.carrier} />
                  </td>
                  <td className="py-2.5 px-3">
                    <ContactStatusBadge status={contact.status} />
                  </td>
                  <td className="py-2.5 px-3 text-slate-500">
                    {contact.errorMessage ? (
                      <span
                        className={`inline-flex items-center gap-1 ${
                          contact.status === 'invalid'
                            ? 'text-rose-600 font-medium'
                            : 'text-amber-700'
                        }`}
                      >
                        {contact.status === 'invalid' && (
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        )}
                        {contact.errorMessage}
                      </span>
                    ) : (
                      <span className="text-emerald-700 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        جاهز للإرسال عبر واتساب
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filteredContacts.length > maxDisplay && (
        <p className="text-center text-xs text-slate-400">
          يتم عرض أول {maxDisplay} سجل من أصل {filteredContacts.length} سجلاً لتسريع استجابة الصفحة
        </p>
      )}
    </div>
  );
};
