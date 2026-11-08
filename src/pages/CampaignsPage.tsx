import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCampaigns } from '../hooks/useCampaigns';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { CampaignStatusBadge } from '../components/common/Badge';
import { formatDate } from '../utils/formatters';
import {
  Megaphone,
  Plus,
  Search,
  Users,
  Image as ImageIcon,
  ArrowUpLeft,
  Trash2,
  Calendar,
} from 'lucide-react';

export const CampaignsPage: React.FC = () => {
  const { campaigns, deleteCampaign } = useCampaigns();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ready' | 'draft' | 'completed'>('all');

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(c => {
      if (statusFilter !== 'all' && c.status !== statusFilter) {
        return false;
      }
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(query);
        const matchesDesc = (c.description || '').toLowerCase().includes(query);
        return matchesName || matchesDesc;
      }
      return true;
    });
  }, [campaigns, statusFilter, searchTerm]);

  const handleDelete = (e: React.MouseEvent, id: string, name: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`هل أنت متأكد من رغبتك في حذف الحملة "${name}"؟`)) {
      deleteCampaign(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Title and Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            الحملات التسويقية
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            إدارة كافة الحملات التسويقية المعدة والمحفوظة لعملاء الصيدلية
          </p>
        </div>

        <Link to="/campaigns/create">
          <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
            إنشاء حملة تسويقية جديدة
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-subtle">
        {/* Status Filters */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              statusFilter === 'all'
                ? 'bg-brand-50 text-brand-900 font-bold border border-brand-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            الكل ({campaigns.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('ready')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              statusFilter === 'ready'
                ? 'bg-brand-50 text-brand-900 font-bold border border-brand-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            جاهزة للإرسال ({campaigns.filter(c => c.status === 'ready').length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('draft')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              statusFilter === 'draft'
                ? 'bg-brand-50 text-brand-900 font-bold border border-brand-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            مسودات ({campaigns.filter(c => c.status === 'draft').length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="بحث باسم الحملة أو الوصف..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full ps-9 pe-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>
      </div>

      {/* Campaigns Listing */}
      {campaigns.length === 0 ? (
        <EmptyState
          icon={<Megaphone className="w-6 h-6" />}
          title="لم تقم بإنشاء أي حملات تسويقية بعد"
          description="يمكنك البدء الآن بإنشاء حملة تسويقية لمنتجات التجميل، واستيراد جهات الاتصال من ملف Odoo، ومعاينة الرسائل بشكل واقعي."
          action={
            <Link to="/campaigns/create">
              <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                بدء إنشاء أول حملة
              </Button>
            </Link>
          }
        />
      ) : filteredCampaigns.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-sm text-slate-500">لا توجد حملات تطابق كلمة البحث أو التصفية المختارة</p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}
            className="mt-3 text-xs font-semibold text-brand-700 hover:underline"
          >
            إعادة تعيين الفلاتر
          </button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCampaigns.map(camp => {
            const validCount = camp.recipients.filter(r => r.isValid && !r.isDuplicate).length;
            return (
              <div
                key={camp.id}
                className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-subtle hover:border-brand-300 hover:shadow-card transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Meta */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <CampaignStatusBadge status={camp.status} size="sm" />
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(camp.createdAt)}
                    </span>
                  </div>

                  {/* Title and Description */}
                  <Link to={`/campaigns/${camp.id}`} className="block group">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand-700 transition-colors line-clamp-1">
                      {camp.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed min-h-[36px]">
                      {camp.description || 'حملة تسويقية عبر تطبيق واتساب لعملاء الصيدلية'}
                    </p>
                  </Link>

                  {/* Media and Audience Stats */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <Users className="w-3.5 h-3.5 text-brand-600" />
                        المستلمون المعتمدون:
                      </span>
                      <span className="font-bold text-slate-900">{validCount} عميل</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <ImageIcon className="w-3.5 h-3.5 text-purple-600" />
                        الوسائط المرفقة:
                      </span>
                      <span className="font-medium text-slate-700 truncate max-w-[140px]">
                        {camp.media ? camp.media.name : 'رسالة نصية فقط'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={e => handleDelete(e, camp.id, camp.name)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="حذف الحملة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <Link to={`/campaigns/${camp.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      rightIcon={<ArrowUpLeft className="w-3.5 h-3.5" />}
                    >
                      عرض التفاصيل
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
