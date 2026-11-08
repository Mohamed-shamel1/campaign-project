import React, { useRef } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { CampaignMedia } from '../../types';
import { formatFileSize } from '../../utils/formatters';
import {
  MessageSquare,
  Image as ImageIcon,
  Trash2,
  UploadCloud,
  Bold,
  Sparkles,
  Info,
} from 'lucide-react';

interface Step3ComposeProps {
  messageText: string;
  media: CampaignMedia | null;
  onChangeMessageText: (value: string) => void;
  onUpdateMedia: (media: CampaignMedia | null) => void;
}

export const Step3Compose: React.FC<Step3ComposeProps> = ({
  messageText,
  media,
  onChangeMessageText,
  onUpdateMedia,
}) => {
  const [isDraggingImage, setIsDraggingImage] = React.useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleDragOverImage = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingImage(true);
  };

  const handleDragLeaveImage = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingImage(false);
  };

  const handleDropImage = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingImage(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('يرجى اختيار ملف صورة صالح (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('الحد الأقصى لحجم الصورة هو 5 ميجابايت.');
      return;
    }

    const reader = new FileReader();
    reader.onload = e => {
      if (e.target?.result) {
        onUpdateMedia({
          url: e.target.result as string,
          name: file.name,
          size: file.size,
          type: file.type,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const insertTextAtCursor = (insertion: string) => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = messageText.substring(0, start);
    const after = messageText.substring(end);
    const newText = before + insertion + after;
    onChangeMessageText(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + insertion.length, start + insertion.length);
    }, 0);
  };

  const sampleCosmeticsTemplates = [
    {
      title: 'عرض العناية بالبشرة والجمال',
      text: `أهلاً بكِ عميلتنا العزيزة 🌸
يسر صيدليات الفؤاد تقديم خصم خاص 20% على أشهر منتجات العناية بالبشرة والترطيب (لاروش بوزيه، بايوديرما، وسيراف).
*العرض سارٍ بفروع صيدليات الفؤاد وحتى نفاد الكمية!*
لطلب التوصيل المنزلي أو الاستفسار، تفضلي بالرد على هذه الرسالة.`,
    },
    {
      title: 'إشعار توفر منتج وحجز استشارة',
      text: `مرحباً بكِ من صيدليات الفؤاد ✨
يسعدنا إبلاغك بتوفر دفعة جديدة ومضمونة من سيروم الهيالورونيك وفيتامين سي الأصلي.
احجزي عبوتك الآن من أقرب فرع لصيدليات الفؤاد واستمتعي باستشارة مجانية من فريقنا الصيدلي المتخصص.`,
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Message Text Editor */}
      <Card>
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">نص الرسالة الترويجية</h3>
              <p className="text-xs text-slate-500">
                قم بصياغة الرسالة التي ستصل للعملاء عبر تطبيق واتساب
              </p>
            </div>
          </div>

          {/* Quick formatting toolbar */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => insertTextAtCursor('*نص عريض*')}
              className="p-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors flex items-center gap-1"
              title="نص عريض في واتساب"
            >
              <Bold className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">عريض</span>
            </button>

            <button
              type="button"
              onClick={() => insertTextAtCursor('{اسم_العميل}')}
              className="px-2 py-1.5 text-xs font-medium text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg border border-brand-200 transition-colors"
              title="تخصيص باسم العميل"
            >
              + اسم العميل
            </button>
          </div>
        </div>

        {/* Text Area */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            rows={7}
            value={messageText}
            onChange={e => onChangeMessageText(e.target.value)}
            placeholder="اكتب رسالتك الترويجية هنا... يمكنك استخدام فواصل الأسطر، الرموز، والروابط."
            className="w-full p-4 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-sans leading-relaxed"
          />

          {/* Character and Line Counter */}
          <div className="flex items-center justify-between mt-2 text-xs text-slate-400 px-1">
            <div className="flex items-center gap-3">
              <span>عدد الحروف: <strong className="text-slate-700">{messageText.length}</strong></span>
              <span>عدد الأسطر: <strong className="text-slate-700">{messageText ? messageText.split('\n').length : 0}</strong></span>
            </div>
            <span className="text-[11px] text-slate-400">
              تدعم رسائل واتساب النصوص الطويلة والتنسيقات
            </span>
          </div>
        </div>

        {/* Cosmetics Templates */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-700 mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            نماذج رسائل مقترحة لصيدليات التجميل:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {sampleCosmeticsTemplates.map((template, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-brand-300 transition-all cursor-pointer group"
                onClick={() => onChangeMessageText(template.text)}
              >
                <div className="text-xs font-bold text-slate-800 group-hover:text-brand-700 mb-1 flex items-center justify-between">
                  <span>{template.title}</span>
                  <span className="text-[10px] text-brand-600 font-medium">استخدام النموذج ←</span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {template.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Promotional Image Upload */}
      <Card>
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                الصورة الترويجية المرفقة (اختياري)
              </h3>
              <p className="text-xs text-slate-500">
                أرفق بنر العرض الترويجي أو صورة المنتجات لزيادة تفاعل العملاء
              </p>
            </div>
          </div>
          {media && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onUpdateMedia(null)}
              className="text-rose-600 hover:text-rose-700 border-rose-200 hover:bg-rose-50"
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            >
              حذف الصورة
            </Button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
          className="hidden"
        />

        {media ? (
          /* Image Preview and Info */
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="w-full sm:w-48 h-36 rounded-lg overflow-hidden bg-white border border-slate-200 shrink-0 shadow-xs flex items-center justify-center">
              <img
                src={media.url}
                alt={media.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 space-y-2 text-start w-full">
              <div>
                <h4 className="text-xs font-bold text-slate-900 truncate">{media.name}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  الحجم: {formatFileSize(media.size)} | النوع: {media.type}
                </p>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  leftIcon={<UploadCloud className="w-3.5 h-3.5" />}
                >
                  استبدال الصورة
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onUpdateMedia(null)}
                  className="text-rose-600"
                >
                  إلغاء الإرفاق
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* Empty Image Dropzone */
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOverImage}
            onDragLeave={handleDragLeaveImage}
            onDrop={handleDropImage}
            className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all text-center ${
              isDraggingImage
                ? 'border-purple-600 bg-purple-100/50 ring-4 ring-purple-100'
                : 'border-slate-300 hover:border-purple-400 bg-slate-50/50 hover:bg-purple-50/20'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2.5">
              <UploadCloud className="w-6 h-6" />
            </div>
            <h4 className="text-xs font-bold text-slate-800 mb-0.5">
              اضغط لرفع صورة ترويجية أو اسحبها هنا
            </h4>
            <p className="text-[11px] text-slate-400 mb-3">
              الصيغ المدعومة: JPG، PNG، WebP (حتى 5 ميجابايت)
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              leftIcon={<ImageIcon className="w-3.5 h-3.5" />}
            >
              استعراض الصور
            </Button>
          </div>
        )}

        <div className="mt-3 text-[11px] text-slate-500 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>
            عند إرفاق صورة، ستظهر كرسالة وسائط رئيسية ويكون نص الرسالة هو الوصف المرفق بها (Caption) على واتساب.
          </span>
        </div>
      </Card>
    </div>
  );
};

