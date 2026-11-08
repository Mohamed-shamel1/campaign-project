import React from 'react';
import {
  Wifi,
  Battery,
  Phone,
  Video,
  MoreVertical,
  CheckCheck,
  ChevronRight,
  Paperclip,
  Camera,
  Mic,
  Sparkles,
} from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';

interface WhatsAppPreviewProps {
  messageText: string;
  mediaUrl?: string | null;
  mediaFileName?: string;
  pharmacyName?: string;
  recipientCount?: number;
}

export const WhatsAppPreview: React.FC<WhatsAppPreviewProps> = ({
  messageText,
  mediaUrl,
  mediaFileName,
  pharmacyName: propPharmacyName,
  recipientCount,
}) => {
  const { pharmacyName: settingsPharmacyName } = useSettings();
  const brandName = propPharmacyName || settingsPharmacyName || 'صيدلية التجميل والعناية';

  // Format text to handle simple markdown bold (*text*) and customer name variable substitution
  const renderFormattedText = (text: string) => {
    if (!text) {
      return (
        <span className="text-slate-400 italic">
          اكتب نص الرسالة في الخطوة السابقة لتظهر المعاينة هنا...
        </span>
      );
    }

    // Replace {اسم_العميل} with realistic sample name in preview
    const processedText = text.replace(/\{اسم_العميل\}|\{الاسم\}/g, 'سارة أحمد');

    // Split text by lines
    const lines = processedText.split('\n');
    return lines.map((line, lineIdx) => {
      // Simple bold replacement: *bold text*
      const parts = line.split(/(\*[^*]+\*)/g);
      return (
        <React.Fragment key={lineIdx}>
          {parts.map((part, partIdx) => {
            if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
              return (
                <strong key={partIdx} className="font-bold">
                  {part.slice(1, -1)}
                </strong>
              );
            }
            return <span key={partIdx}>{part}</span>;
          })}
          {lineIdx < lines.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  const currentTime = new Intl.DateTimeFormat('ar-EG', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date());

  return (
    <div className="flex flex-col items-center w-full">
      {/* Target audience banner if provided */}
      {recipientCount !== undefined && (
        <div className="w-full max-w-[310px] sm:max-w-[350px] mb-3 px-3 py-2 bg-brand-50 border border-brand-200/80 rounded-xl text-xs text-brand-900 flex items-center justify-between shadow-xs">
          <span className="font-medium">معاينة الحملة للمستلمين:</span>
          <span className="font-bold bg-white px-2 py-0.5 rounded border border-brand-200">
            {recipientCount} عميل
          </span>
        </div>
      )}

      {/* Phone Mockup Frame */}
      <div className="w-full max-w-[310px] sm:max-w-[350px] bg-slate-900 rounded-[36px] sm:rounded-[38px] p-2 sm:p-2.5 shadow-2xl border-4 border-slate-800">
        {/* Screen Bezel */}
        <div className="bg-[#efeae2] rounded-[28px] sm:rounded-[30px] overflow-hidden flex flex-col h-[500px] sm:h-[580px] relative shadow-inner">
          
          {/* Top Status Bar */}
          <div className="bg-[#075E54] text-white px-4 sm:px-5 pt-2 pb-1 text-[11px] flex items-center justify-between select-none">
            <span className="font-semibold tracking-tight">10:24</span>
            <div className="flex items-center gap-1.5 opacity-90">
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* WhatsApp Chat Header */}
          <div className="bg-[#075E54] text-white px-2.5 sm:px-3 py-2.5 flex items-center justify-between shadow-md select-none">
            <div className="flex items-center gap-2 min-w-0">
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer opacity-80 shrink-0" />
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-700 border border-white/20 flex items-center justify-center text-white font-bold text-xs shadow-sm shrink-0">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-200" />
              </div>
              <div className="flex flex-col leading-tight min-w-0">
                <span className="font-semibold text-xs text-white truncate max-w-[120px] sm:max-w-[150px]">
                  {brandName}
                </span>
                <span className="text-[9px] sm:text-[10px] text-emerald-200 truncate">حساب تجاري متصل</span>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 opacity-90 shrink-0">
              <Video className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <MoreVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>

          {/* Chat Body with WhatsApp Pattern */}
          <div className="flex-1 overflow-y-auto p-2.5 sm:p-3 flex flex-col justify-end whatsapp-chat-bg">
            {/* Date Tag */}
            <div className="self-center mb-3">
              <span className="bg-white/80 backdrop-blur-sm text-slate-600 text-[10px] px-2.5 py-0.5 rounded-md shadow-xs font-medium">
                اليوم
              </span>
            </div>

            {/* Outgoing Message Bubble (Right-aligned in RTL, or sender bubble) */}
            <div className="self-start max-w-[90%] sm:max-w-[88%] bg-[#e7fedb] rounded-xl rounded-tr-none p-2 shadow-sm border border-emerald-100 text-slate-900 text-xs relative group transition-all">
              
              {/* Promotional Media Image Preview */}
              {mediaUrl && (
                <div className="mb-2 -mx-1 -mt-1 rounded-lg overflow-hidden bg-slate-100 border border-emerald-200/50">
                  <img
                    src={mediaUrl}
                    alt={mediaFileName || 'صورة العرض الترويجي'}
                    className="w-full max-h-40 sm:max-h-44 object-cover"
                  />
                  {mediaFileName && (
                    <div className="px-2 py-1 bg-black/40 text-[9px] sm:text-[10px] text-white truncate">
                      {mediaFileName}
                    </div>
                  )}
                </div>
              )}

              {/* Message Body */}
              <div className="leading-relaxed whitespace-pre-wrap break-words text-[12px] sm:text-[13px] px-1 pt-0.5 text-slate-800">
                {renderFormattedText(messageText)}
              </div>

              {/* Bubble Meta (Time + Double Check) */}
              <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-500 font-sans select-none">
                <span>{currentTime}</span>
                <CheckCheck className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Chat Mock Input Footer */}
          <div className="bg-[#f0f2f5] p-2 flex items-center gap-1.5 border-t border-slate-200 select-none">
            <div className="flex-1 bg-white rounded-full px-3 py-1 sm:py-1.5 flex items-center justify-between text-slate-400 text-xs shadow-xs border border-slate-200/60 min-w-0">
              <span className="truncate text-[11px] sm:text-xs">اكتب رسالة...</span>
              <div className="flex items-center gap-1.5 sm:gap-2 text-slate-400 shrink-0">
                <Paperclip className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </div>
            </div>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#128C7E] flex items-center justify-center text-white shrink-0 shadow-sm">
              <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>

          {/* Home Indicator Bar */}
          <div className="bg-[#f0f2f5] pb-1.5 flex justify-center">
            <div className="w-20 sm:w-24 h-1 bg-slate-300 rounded-full"></div>
          </div>

        </div>
      </div>
    </div>
  );
};
