import React, { useState, useEffect } from 'react';
import { ResearchStudy } from '../types';
import { autoTranslateResearch, translateOffline } from '../utils/translator';

interface AddEditResearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (research: ResearchStudy) => void;
  researchToEdit?: ResearchStudy | null;
}

export const AddEditResearchModal: React.FC<AddEditResearchModalProps> = ({
  isOpen,
  onClose,
  onSave,
  researchToEdit,
}) => {
  const [badge, setBadge] = useState('');
  const [pages, setPages] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [desc, setDesc] = useState('');
  const [summary, setSummary] = useState('');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  useEffect(() => {
    if (researchToEdit) {
      setBadge(researchToEdit.ar.badge || '');
      setPages(researchToEdit.ar.pages || '');
      setTitle(researchToEdit.ar.title || '');
      setAuthor(researchToEdit.ar.author || '');
      setDesc(researchToEdit.ar.desc || '');
      setSummary(researchToEdit.ar.summary || '');
    } else {
      setBadge('دراسة فقهية محكمة');
      setPages('50 صفحة');
      setTitle('');
      setAuthor('إعداد: دائرة الفتاوى والبحوث');
      setDesc('');
      setSummary('');
    }
  }, [researchToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) {
      alert('يرجى كتابة عنوان البحث وملخصه.');
      return;
    }

    setIsTranslating(true);
    let enObj = researchToEdit?.en;
    let idObj = researchToEdit?.idLang;

    try {
      const autoTrans = await autoTranslateResearch({
        badge: badge.trim() || 'بحث علمي',
        pages: pages.trim() || 'عدد الصفحات',
        title: title.trim(),
        author: author.trim() || 'لجنة البحوث بالرباط',
        desc: desc.trim() || title.trim(),
        summary: summary.trim(),
      });
      enObj = autoTrans.en;
      idObj = autoTrans.idLang;
    } catch {
      enObj = {
        badge: translateOffline(badge || 'بحث علمي', 'en'),
        pages: translateOffline(pages || '50 صفحة', 'en'),
        title: translateOffline(title, 'en'),
        author: translateOffline(author || 'لجنة البحوث بالرباط', 'en'),
        desc: translateOffline(desc || title, 'en'),
        summary: translateOffline(summary, 'en'),
      };
      idObj = {
        badge: translateOffline(badge || 'بحث علمي', 'id'),
        pages: translateOffline(pages || '50 صفحة', 'id'),
        title: translateOffline(title, 'id'),
        author: translateOffline(author || 'لجنة البحوث بالرباط', 'id'),
        desc: translateOffline(desc || title, 'id'),
        summary: translateOffline(summary, 'id'),
      };
    }

    const updatedResearch: ResearchStudy = {
      id: researchToEdit ? researchToEdit.id : `res-${Date.now()}`,
      ar: {
        badge: badge.trim() || 'بحث علمي',
        pages: pages.trim() || 'عدد الصفحات',
        title: title.trim(),
        author: author.trim() || 'لجنة البحوث بالرباط',
        desc: desc.trim() || title.trim(),
        summary: summary.trim(),
      },
      en: enObj,
      idLang: idObj,
    };

    setIsTranslating(false);
    onSave(updatedResearch);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-modal-backdrop">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border-2 border-gold-500 overflow-hidden my-auto text-gray-800 animate-modal-card">
        
        {/* Header */}
        <div className="islamic-pattern p-5 text-white flex justify-between items-center border-b-2 border-gold-500 shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border-2 border-gold-400 flex items-center justify-center text-gold-400">
              <i className="fa-solid fa-book-bookmark"></i>
            </div>
            <div>
              <h3 className="font-bold text-lg font-serif text-white">
                {researchToEdit ? 'تعديل البحث العلمي' : 'إضافة بحث علمي / دراسة جديدة'}
              </h3>
              <p className="text-xs text-gray-200">
                إضافة إصدارات وبحوث دائرة الفتاوى والبحوث برباط المصطفى
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-4">
          
          {/* Auto-Translation Banner */}
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 border border-emerald-300 rounded-2xl p-3.5 flex items-center gap-3 text-xs shadow-xs">
            <div className="w-8 h-8 rounded-xl bg-emerald-850 text-gold-400 flex items-center justify-center shrink-0 shadow-xs">
              <i className="fa-solid fa-wand-magic-sparkles text-sm"></i>
            </div>
            <div>
              <span className="font-bold text-emerald-950 block text-xs sm:text-sm">
                الترجمة التلقائية مفعلة (يكفي إدخال بيانات البحث بالعربية فقط)
              </span>
              <span className="text-[11px] text-gray-600 block">
                سيتم توليد ترجمة البحث وملخصه تلقائياً للغتين الإنجليزية والإندونيسية لتتواكب مع أي تعديلات تجريها.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                تصنيف البحث / الشارة (Badge) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="مثال: فقه النوازل المالية"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 focus:bg-white border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none text-sm text-gray-800 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                عدد الصفحات / الحجم
              </label>
              <input
                type="text"
                placeholder="مثال: 45 صفحة"
                value={pages}
                onChange={(e) => setPages(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 focus:bg-white border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none text-sm text-gray-800 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              عنوان البحث والدراسة <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="مثال: أحكام النوازل المستجدة في المعاملات المالية المعاصرة..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 focus:bg-white border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none text-sm font-bold text-gray-800 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              الجهة المعدة / الباحث
            </label>
            <input
              type="text"
              placeholder="مثال: إعداد: دائرة الفتاوى والبحوث بالرباط"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 focus:bg-white border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none text-sm text-gray-800 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              وصف موجز يظهر في البطاقة
            </label>
            <textarea
              rows={2}
              placeholder="نبذة سريعة عن موضوع البحث..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full p-3 rounded-xl bg-gray-50 focus:bg-white border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none text-sm text-gray-800 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              الملخص الكامل للبحث (يظهر عند الضغط على "قراءة الملخص") <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={8}
              required
              placeholder="الفصل الأول: ... الفصل الثاني: ... أهم النتائج والتوصيات الفقهية..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-gray-50 focus:bg-white border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none font-serif text-base leading-relaxed text-gray-800 transition"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition border border-gray-200"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-7 py-2.5 rounded-xl bg-emerald-850 hover:bg-emerald-900 text-white font-bold text-sm shadow-md transition flex items-center gap-2 border border-gold-500/40"
            >
              <i className="fa-solid fa-floppy-disk text-gold-400"></i>
              <span>{researchToEdit ? 'حفظ تعديلات البحث' : 'نشر البحث الآن'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
