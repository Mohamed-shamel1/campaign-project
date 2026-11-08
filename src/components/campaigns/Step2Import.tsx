import React, { useState, useRef } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { ContactsTable } from './ContactsTable';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Users,
  Sparkles,
  Columns,
  Info,
  Phone,
  ClipboardPaste,
} from 'lucide-react';
import {
  parseFileToRows,
  processContactRows,
  detectPhoneColumn,
  detectNameColumn,
  parseRawPastedNumbers,
} from '../../utils/fileParser';
import { NormalizedContact, ImportSummary } from '../../types';
import { formatFileSize } from '../../utils/formatters';

type ImportMode = 'names_and_phones' | 'phones_only' | 'manual_paste';

interface Step2ImportProps {
  summary: ImportSummary | null;
  contacts: NormalizedContact[];
  onImportComplete: (summary: ImportSummary, contacts: NormalizedContact[]) => void;
}

export const Step2Import: React.FC<Step2ImportProps> = ({
  summary,
  contacts,
  onImportComplete,
}) => {
  const [importMode, setImportMode] = useState<ImportMode>('names_and_phones');
  const [isParsing, setIsParsing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [rawRows, setRawRows] = useState<Record<string, any>[] | null>(null);
  const [headers, setHeaders] = useState<string[]>(summary?.columns || []);
  const [selectedPhoneCol, setSelectedPhoneCol] = useState<string>(summary?.selectedPhoneColumn || '');
  const [selectedNameCol, setSelectedNameCol] = useState<string>(summary?.selectedNameColumn || '');
  const [currentFileName, setCurrentFileName] = useState<string>(summary?.fileName || '');
  const [currentFileSize, setCurrentFileSize] = useState<number>(summary?.fileSize || 0);
  const [defaultNamePrefix, setDefaultNamePrefix] = useState<string>('عميل الصيدلية');

  // Manual paste state
  const [manualText, setManualText] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsParsing(true);
    setErrorMessage(null);

    try {
      const { headers: parsedHeaders, rows: parsedRows } = await parseFileToRows(file);
      
      const phoneCol = detectPhoneColumn(parsedHeaders);
      // If mode is 'phones_only', do not select a name column
      const nameCol = importMode === 'phones_only' ? '' : detectNameColumn(parsedHeaders);

      setRawRows(parsedRows);
      setHeaders(parsedHeaders);
      setSelectedPhoneCol(phoneCol);
      setSelectedNameCol(nameCol);
      setCurrentFileName(file.name);
      setCurrentFileSize(file.size);

      // Process rows immediately
      const result = processContactRows(
        parsedRows,
        phoneCol,
        nameCol,
        file.name,
        file.size,
        parsedHeaders,
        defaultNamePrefix
      );

      onImportComplete(result.summary, result.records);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'حدث خطأ أثناء قراءة الملف. يرجى التأكد من صحة صيغة CSV أو XLSX.';
      setErrorMessage(msg);
    } finally {
      setIsParsing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // Re-process if user changes phone or name column selection
  const handleColumnSelectionChange = (newPhoneCol: string, newNameCol: string) => {
    if (!rawRows || rawRows.length === 0) return;

    setSelectedPhoneCol(newPhoneCol);
    setSelectedNameCol(newNameCol);

    const result = processContactRows(
      rawRows,
      newPhoneCol,
      newNameCol,
      currentFileName,
      currentFileSize,
      headers,
      defaultNamePrefix
    );

    onImportComplete(result.summary, result.records);
  };

  // Manual paste processor
  const handleProcessManualText = () => {
    if (!manualText.trim()) {
      setErrorMessage('يرجى لصق أو كتابة أرقام الهواتف أولاً.');
      return;
    }

    setIsParsing(true);
    setErrorMessage(null);

    try {
      const result = parseRawPastedNumbers(manualText, defaultNamePrefix);
      setRawRows(result.rawRows);
      setHeaders(result.headers);
      setSelectedPhoneCol('رقم الهاتف');
      setSelectedNameCol('اسم العميل');
      setCurrentFileName('إدخال_يدوي_مباشر.csv');
      setCurrentFileSize(manualText.length);

      onImportComplete(result.summary, result.records);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'حدث خطأ أثناء معالجة الأرقام المدخلة.';
      setErrorMessage(msg);
    } finally {
      setIsParsing(false);
    }
  };

  // Demo sample: Names + Phones (Odoo model)
  const loadDemoWithNames = () => {
    const demoRows = [
      { 'اسم العميل': 'سارة أحمد', 'رقم الهاتف': '01012345678', 'المنتج المفضل': 'سيروم هيالورونيك' },
      { 'اسم العميل': 'منى إبراهيم', 'رقم الهاتف': '+201123456789', 'المنتج المفضل': 'كريم ترطيب سيراف' },
      { 'اسم العميل': 'ريم خالد', 'رقم الهاتف': '01223456780', 'المنتج المفضل': 'واقي شمس لاروش' },
      { 'اسم العميل': 'هدى محمود', 'رقم الهاتف': '01551234567', 'المنتج المفضل': 'غسول بايوديرما' },
      { 'اسم العميل': 'منى إبراهيم (مكرر)', 'رقم الهاتف': '01123456789', 'المنتج المفضل': 'مرطب شفايف' },
      { 'اسم العميل': 'نورهان علاء', 'رقم الهاتف': '1098765432', 'المنتج المفضل': 'فيتامين سي' },
      { 'اسم العميل': 'أميرة حسن (ناقص)', 'رقم الهاتف': '0105432', 'المنتج المفضل': 'كولاجين للبشرة' },
      { 'اسم العميل': 'ياسمين السيد (أرضي)', 'رقم الهاتف': '0223987654', 'المنتج المفضل': 'مجموعة عناية' },
      { 'اسم العميل': 'دينا فؤاد', 'رقم الهاتف': '01012345678', 'المنتج المفضل': 'تونر نياكيناميد' },
      { 'اسم العميل': 'مروة عبد الرحمن', 'رقم الهاتف': '٠١٠٦٧٨٩١٢٣٤', 'المنتج المفضل': 'سيروم ريتينول' },
    ];

    const demoHeaders = ['اسم العميل', 'رقم الهاتف', 'المنتج المفضل'];
    setImportMode('names_and_phones');
    setRawRows(demoRows);
    setHeaders(demoHeaders);
    setSelectedPhoneCol('رقم الهاتف');
    setSelectedNameCol('اسم العميل');
    setCurrentFileName('عملاء_صيدليات_الفؤاد_Odoo.xlsx');
    setCurrentFileSize(28672);

    const result = processContactRows(
      demoRows,
      'رقم الهاتف',
      'اسم العميل',
      'عملاء_صيدليات_الفؤاد_Odoo.xlsx',
      28672,
      demoHeaders,
      'عميل'
    );

    onImportComplete(result.summary, result.records);
  };

  // Demo sample: Phones ONLY (single column, no names)
  const loadDemoPhonesOnly = () => {
    const demoRows = [
      { 'رقم الموبايل': '01099887766' },
      { 'رقم الموبايل': '01155443322' },
      { 'رقم الموبايل': '01233221100' },
      { 'رقم الموبايل': '01511223344' },
      { 'رقم الموبايل': '01099887766' }, // duplicate
      { 'رقم الموبايل': '0104433' }, // invalid short
      { 'رقم الموبايل': '٠١١٩٩٨٨٢٢١١' }, // arabic indic
      { 'رقم الموبايل': '1288776655' }, // 10 digits missing 0
    ];

    const demoHeaders = ['رقم الموبايل'];
    setImportMode('phones_only');
    setRawRows(demoRows);
    setHeaders(demoHeaders);
    setSelectedPhoneCol('رقم الموبايل');
    setSelectedNameCol('');
    setCurrentFileName('أرقام_عملاء_صيدليات_الفؤاد_فقط.xlsx');
    setCurrentFileSize(16384);

    const result = processContactRows(
      demoRows,
      'رقم الموبايل',
      '',
      'أرقام_عملاء_صيدليات_الفؤاد_فقط.xlsx',
      16384,
      demoHeaders,
      'عميلة صيدليات الفؤاد'
    );

    onImportComplete(result.summary, result.records);
  };

  return (
    <div className="space-y-6">
      {/* Mode Selection Cards: Names + Phones vs Phones Only vs Manual Paste */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Option 1: Names and Phones */}
        <div
          onClick={() => {
            setImportMode('names_and_phones');
            if (rawRows && headers.length > 1) {
              const nameCol = detectNameColumn(headers);
              handleColumnSelectionChange(selectedPhoneCol, nameCol);
            }
          }}
          className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
            importMode === 'names_and_phones'
              ? 'border-brand-600 bg-brand-50/50 shadow-xs ring-2 ring-brand-100'
              : 'border-slate-200/90 bg-white hover:border-slate-300'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </span>
              {importMode === 'names_and_phones' && (
                <span className="w-2 h-2 rounded-full bg-brand-600"></span>
              )}
            </div>
            <h4 className="text-xs font-bold text-slate-900 mb-1">
              أرقام وأسماء العملاء
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              ملف من Odoo يحتوي على الاسم ورقم الهاتف. يتيح تخصيص الرسالة باسم كل عميل.
            </p>
          </div>
          <span className="text-[10px] text-brand-700 font-semibold mt-3 block">
            {importMode === 'names_and_phones' ? '✓ الخيار النشط حالياً' : 'اختيار هذا النمط ←'}
          </span>
        </div>

        {/* Option 2: Phones ONLY */}
        <div
          onClick={() => {
            setImportMode('phones_only');
            if (rawRows) {
              handleColumnSelectionChange(selectedPhoneCol, '');
            }
          }}
          className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
            importMode === 'phones_only'
              ? 'border-brand-600 bg-brand-50/50 shadow-xs ring-2 ring-brand-100'
              : 'border-slate-200/90 bg-white hover:border-slate-300'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Phone className="w-4 h-4" />
              </span>
              {importMode === 'phones_only' && (
                <span className="w-2 h-2 rounded-full bg-brand-600"></span>
              )}
            </div>
            <h4 className="text-xs font-bold text-slate-900 mb-1">
              أرقام هواتف فقط (بدون أسماء)
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              ملف يحتوي على قائمة أرقام مجردة (عمود واحد). يتم فحص الأرقام وتسمية المستلمين تلقائياً.
            </p>
          </div>
          <span className="text-[10px] text-brand-700 font-semibold mt-3 block">
            {importMode === 'phones_only' ? '✓ الخيار النشط حالياً' : 'اختيار هذا النمط ←'}
          </span>
        </div>

        {/* Option 3: Manual Paste */}
        <div
          onClick={() => setImportMode('manual_paste')}
          className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
            importMode === 'manual_paste'
              ? 'border-brand-600 bg-brand-50/50 shadow-xs ring-2 ring-brand-100'
              : 'border-slate-200/90 bg-white hover:border-slate-300'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                <ClipboardPaste className="w-4 h-4" />
              </span>
              {importMode === 'manual_paste' && (
                <span className="w-2 h-2 rounded-full bg-brand-600"></span>
              )}
            </div>
            <h4 className="text-xs font-bold text-slate-900 mb-1">
              لصق أو كتابة الأرقام يدوياً
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              إدخال مباشر بدون ملف. الصق قائمة هواتف بسرعة (رقم في كل سطر أو مفصولة بفواصل).
            </p>
          </div>
          <span className="text-[10px] text-brand-700 font-semibold mt-3 block">
            {importMode === 'manual_paste' ? '✓ الخيار النشط حالياً' : 'اختيار هذا النمط ←'}
          </span>
        </div>
      </div>

      {/* Main Upload or Paste Area */}
      {importMode === 'manual_paste' ? (
        /* Manual Paste Box */
        <Card>
          <div className="flex items-center gap-2.5 pb-3 mb-4 border-b border-slate-100">
            <ClipboardPaste className="w-5 h-5 text-brand-600" />
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                لصق أو كتابة أرقام الهواتف مباشرة
              </h4>
              <p className="text-xs text-slate-500">
                اكتب أو الصق الأرقام (رقم في كل سطر)، أو بصيغة (الاسم - الرقم)
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <textarea
              rows={6}
              value={manualText}
              onChange={e => setManualText(e.target.value)}
              placeholder={`مثال:\n01012345678\n01123456789\nسارة أحمد - 01223456780\n01551234567`}
              className="w-full p-3.5 text-xs font-mono bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 leading-relaxed"
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-700 whitespace-nowrap">
                  تسمية المستلم الافتراضية:
                </label>
                <input
                  type="text"
                  value={defaultNamePrefix}
                  onChange={e => setDefaultNamePrefix(e.target.value)}
                  placeholder="عميلة الصيدلية"
                  className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg max-w-[160px]"
                />
              </div>

              <Button
                type="button"
                variant="primary"
                size="sm"
                isLoading={isParsing}
                onClick={handleProcessManualText}
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                فحص ومعالجة الأرقام المدخلة
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        /* File Upload Dropzone */
        <Card>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl transition-all text-center ${
              isDragging
                ? 'border-brand-600 bg-brand-50/60 ring-4 ring-brand-100'
                : 'border-slate-300 hover:border-brand-500 bg-slate-50/60'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv, .xlsx, .xls, .txt, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center mb-3 shadow-sm">
              <UploadCloud className="w-7 h-7" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold mb-2 bg-white border border-slate-200 text-slate-700 shadow-xs">
              {importMode === 'names_and_phones' ? (
                <>
                  <Users className="w-3.5 h-3.5 text-brand-600" />
                  <span>النمط المختار: ملف يحتوي على (الاسم + الهاتف)</span>
                </>
              ) : (
                <>
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>النمط المختار: ملف يحتوي على (أرقام فقط - عمود واحد)</span>
                </>
              )}
            </div>

            <h4 className="text-base font-bold text-slate-900 mb-1">
              اسحب وأفلت ملف جهات الاتصال هنا، أو اضغط للاختيار
            </h4>
            <p className="text-xs text-slate-500 max-w-md mb-4 leading-relaxed">
              يدعم الملفات بصيغة CSV أو Excel (.xlsx, .xls) وقوائم الأرقام المصدرة من Odoo أو أي نظام صيدلية آخر
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <Button
                type="button"
                variant="primary"
                size="sm"
                isLoading={isParsing}
                onClick={() => fileInputRef.current?.click()}
                leftIcon={<FileSpreadsheet className="w-4 h-4" />}
              >
                اختيار ملف من جهازك
              </Button>

              {/* Sample 1: Names + Phones */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={loadDemoWithNames}
                leftIcon={<Sparkles className="w-3.5 h-3.5 text-brand-600" />}
              >
                تجربة ملف (أسماء + أرقام)
              </Button>

              {/* Sample 2: Phones ONLY */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={loadDemoPhonesOnly}
                leftIcon={<Phone className="w-3.5 h-3.5 text-emerald-600" />}
              >
                تجربة ملف (أرقام فقط)
              </Button>
            </div>

            {currentFileName && (
              <div className="mt-4 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>
                  تم تحميل الملف: <strong>{currentFileName}</strong> ({formatFileSize(currentFileSize)})
                </span>
              </div>
            )}

            {errorMessage && (
              <div className="mt-4 px-4 py-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Summary and Column Mapping Section */}
      {summary && contacts.length > 0 && (
        <>
          {/* Metrics Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-subtle">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-medium">إجمالي السجلات</span>
                <Users className="w-4 h-4 text-slate-400" />
              </div>
              <div className="text-xl font-bold text-slate-900">{summary.totalRows}</div>
              <p className="text-[11px] text-slate-400 mt-0.5">سجل تم قراءته من الملف</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-emerald-200/80 shadow-subtle bg-emerald-50/20">
              <div className="flex items-center justify-between text-emerald-700 mb-1">
                <span className="text-xs font-semibold">أرقام صالحة للإرسال</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-xl font-bold text-emerald-800">{summary.validCount}</div>
              <p className="text-[11px] text-emerald-600 mt-0.5">مطابقة للشبكات المصرية E.164</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-rose-200/80 shadow-subtle bg-rose-50/20">
              <div className="flex items-center justify-between text-rose-700 mb-1">
                <span className="text-xs font-semibold">أرقام غير صالحة</span>
                <AlertTriangle className="w-4 h-4 text-rose-600" />
              </div>
              <div className="text-xl font-bold text-rose-800">{summary.invalidCount}</div>
              <p className="text-[11px] text-rose-600 mt-0.5">نواقص أو صيغ غير مقبولة</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-amber-200/80 shadow-subtle bg-amber-50/20">
              <div className="flex items-center justify-between text-amber-700 mb-1">
                <span className="text-xs font-semibold">أرقام مكررة</span>
                <Copy className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-xl font-bold text-amber-800">{summary.duplicateCount}</div>
              <p className="text-[11px] text-amber-600 mt-0.5">تم استبعاد التكرار تلقائياً</p>
            </div>
          </div>

          {/* Column Selector Configuration (Only if multiple columns or names_and_phones mode) */}
          <Card>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Columns className="w-4 h-4 text-brand-600" />
                <h4 className="text-xs font-bold text-slate-800">
                  تحديد ومطابقة أعمدة البيانات
                </h4>
              </div>
              <span className="text-[11px] text-slate-400">
                {importMode === 'phones_only'
                  ? 'نمط أرقام فقط: تم تعيين عمود الهاتف مباشرة'
                  : 'يمكنك مراجعة وتعديل تعيين الأعمدة أدناه'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  عمود رقم الهاتف <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedPhoneCol}
                  onChange={e =>
                    handleColumnSelectionChange(e.target.value, selectedNameCol)
                  }
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                >
                  {headers.map(col => (
                    <option key={col} value={col}>
                      {col} {col === selectedPhoneCol ? '(العمود المحدد)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {importMode === 'names_and_phones' ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    عمود اسم العميل (اختياري)
                  </label>
                  <select
                    value={selectedNameCol}
                    onChange={e =>
                      handleColumnSelectionChange(selectedPhoneCol, e.target.value)
                    }
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  >
                    <option value="">-- بدون عمود اسم (تسمية تلقائية) --</option>
                    {headers.map(col => (
                      <option key={col} value={col}>
                        {col} {col === selectedNameCol ? '(تم التعرف عليه)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    الاسم الافتراضي للمستلمين
                  </label>
                  <input
                    type="text"
                    value={defaultNamePrefix}
                    onChange={e => {
                      setDefaultNamePrefix(e.target.value);
                      if (rawRows) {
                        const result = processContactRows(
                          rawRows,
                          selectedPhoneCol,
                          '',
                          currentFileName,
                          currentFileSize,
                          headers,
                          e.target.value
                        );
                        onImportComplete(result.summary, result.records);
                      }
                    }}
                    placeholder="عميل الصيدلية"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    سيتم تسمية المستلمين مثل: {defaultNamePrefix} #1، {defaultNamePrefix} #2
                  </p>
                </div>
              )}
            </div>

            <div className="mt-3 text-[11px] text-slate-500 flex items-center gap-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>
                سيتم إرسال الرسائل للأرقام <strong>الصالحة فقط</strong> ({summary.validCount} عميل). تم استبعاد النواقص والتكرار مع حفظ الأسباب بالكامل في الجدول أدناه.
              </span>
            </div>
          </Card>

          {/* Detailed Review Table */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-slate-900">
                مراجعة وتدقيق جهات الاتصال المستوردة
              </h4>
              <span className="text-xs text-slate-400">
                إجمالي المعروض: {contacts.length} جهة اتصال
              </span>
            </div>
            <ContactsTable contacts={contacts} />
          </Card>
        </>
      )}
    </div>
  );
};
