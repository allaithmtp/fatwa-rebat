import React, { useState, useEffect } from 'react';
import { Fatwa, Category } from '../types';

interface AddEditFatwaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (fatwa: Fatwa) => void;
  fatwaToEdit?: Fatwa | null;
  categories: Category[];
  existingFatwaIds: number[];
}

export const AddEditFatwaModal: React.FC<AddEditFatwaModalProps> = ({
  isOpen,
  onClose,
  onSave,
  fatwaToEdit,
  categories,
  existingFatwaIds,
}) => {
  const [activeTab, setActiveTab] = useState<'ar' | 'en' | 'id'>('ar');
  const [id, setId] = useState<number>(1043);
  const [category, setCategory] = useState<string>('المعاملات المالية والتجارة');
  const [views, setViews] = useState<number>(100);

  // Arabic Fields (Required)
  const [arTitle, setArTitle] = useState('');
  const [arDate, setArDate] = useState('');
  const [arQuestioner, setArQuestioner] = useState('');
  const [arQuestion, setArQuestion] = useState('');
  const [arAnswer, setArAnswer] = useState('');
  const [arReferences, setArReferences] = useState<string[]>(['']);

  // English Fields (Optional)
  const [enTitle, setEnTitle] = useState('');
  const [enDate, setEnDate] = useState('');
  const [enQuestioner, setEnQuestioner] = useState('');
  const [enQuestion, setEnQuestion] = useState('');
  const [enAnswer, setEnAnswer] = useState('');
  const [enReferences, setEnReferences] = useState<string[]>(['']);

  // Indonesian Fields (Optional)
  const [idTitle, setIdTitle] = useState('');
  const [idDate, setIdDate] = useState('');
  const [idQuestioner, setIdQuestioner] = useState('');
  const [idQuestion, setIdQuestion] = useState('');
  const [idAnswer, setIdAnswer] = useState('');
  const [idReferences, setIdReferences] = useState<string[]>(['']);

  useEffect(() => {
    if (fatwaToEdit) {
      setId(fatwaToEdit.id);
      setCategory(fatwaToEdit.category);
      setViews(fatwaToEdit.views || 0);

      // AR
      setArTitle(fatwaToEdit.ar.title || '');
      setArDate(fatwaToEdit.ar.date || '');
      setArQuestioner(fatwaToEdit.ar.questioner || '');
      setArQuestion(fatwaToEdit.ar.question || '');
      setArAnswer(fatwaToEdit.ar.answer || '');
      setArReferences(fatwaToEdit.ar.references && fatwaToEdit.ar.references.length > 0 ? fatwaToEdit.ar.references : ['']);

      // EN
      setEnTitle(fatwaToEdit.en?.title || '');
      setEnDate(fatwaToEdit.en?.date || '');
      setEnQuestioner(fatwaToEdit.en?.questioner || '');
      setEnQuestion(fatwaToEdit.en?.question || '');
      setEnAnswer(fatwaToEdit.en?.answer || '');
      setEnReferences(fatwaToEdit.en?.references && fatwaToEdit.en?.references.length > 0 ? fatwaToEdit.en.references : ['']);

      // ID
      setIdTitle(fatwaToEdit.idLang?.title || '');
      setIdDate(fatwaToEdit.idLang?.date || '');
      setIdQuestioner(fatwaToEdit.idLang?.questioner || '');
      setIdQuestion(fatwaToEdit.idLang?.question || '');
      setIdAnswer(fatwaToEdit.idLang?.answer || '');
      setIdReferences(fatwaToEdit.idLang?.references && fatwaToEdit.idLang?.references.length > 0 ? fatwaToEdit.idLang.references : ['']);
    } else {
      // New fatwa defaults
      const nextId = existingFatwaIds.length > 0 ? Math.max(...existingFatwaIds) + 1 : 1050;
      setId(nextId);
      setCategory(categories.find(c => c.id !== 'الكل')?.id || 'المعاملات المالية والتجارة');
      setViews(1);

      // Auto date
      const todayHijri = 'ربيع الثاني 1447 هـ';
      setArTitle('');
      setArDate(todayHijri);
      setArQuestioner('مستفتٍ من حضرموت');
      setArQuestion('');
      setArAnswer('');
      setArReferences(['منهاج الطالبين للإمام النووي.', 'تحفة المحتاج لابن حجر الهيتمي.']);

      setEnTitle('');
      setEnDate('');
      setEnQuestioner('');
      setEnQuestion('');
      setEnAnswer('');
      setEnReferences(['']);

      setIdTitle('');
      setIdDate('');
      setIdQuestioner('');
      setIdQuestion('');
      setIdAnswer('');
      setIdReferences(['']);
    }
  }, [fatwaToEdit, isOpen, existingFatwaIds, categories]);

  if (!isOpen) return null;

  const handleAddRef = (lang: 'ar' | 'en' | 'id') => {
    if (lang === 'ar') setArReferences([...arReferences, '']);
    if (lang === 'en') setEnReferences([...enReferences, '']);
    if (lang === 'id') setIdReferences([...idReferences, '']);
  };

  const handleUpdateRef = (lang: 'ar' | 'en' | 'id', index: number, value: string) => {
    if (lang === 'ar') {
      const copy = [...arReferences];
      copy[index] = value;
      setArReferences(copy);
    } else if (lang === 'en') {
      const copy = [...enReferences];
      copy[index] = value;
      setEnReferences(copy);
    } else {
      const copy = [...idReferences];
      copy[index] = value;
      setIdReferences(copy);
    }
  };

  const handleRemoveRef = (lang: 'ar' | 'en' | 'id', index: number) => {
    if (lang === 'ar') {
      if (arReferences.length <= 1) return;
      setArReferences(arReferences.filter((_, i) => i !== index));
    } else if (lang === 'en') {
      setEnReferences(enReferences.filter((_, i) => i !== index));
    } else {
      setIdReferences(idReferences.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!arTitle.trim() || !arQuestion.trim() || !arAnswer.trim()) {
      alert('يرجى ملء الحقول الأساسية في تبويب اللغة العربية (العنوان، نص السؤال، نص الجواب).');
      return;
    }

    const cleanedArRefs = arReferences.map(r => r.trim()).filter(Boolean);
    const cleanedEnRefs = enReferences.map(r => r.trim()).filter(Boolean);
    const cleanedIdRefs = idReferences.map(r => r.trim()).filter(Boolean);

    const updatedFatwa: Fatwa = {
      id: Number(id) || Math.floor(1000 + Math.random() * 9000),
      category,
      views: Number(views) || 0,
      ar: {
        title: arTitle.trim(),
        date: arDate.trim() || '1447 هـ',
        questioner: arQuestioner.trim() || 'مستفتٍ',
        question: arQuestion.trim(),
        answer: arAnswer.trim(),
        references: cleanedArRefs.length > 0 ? cleanedArRefs : ['المراجع الشرعية المعتمدة بالرباط']
      },
      en: enTitle.trim() ? {
        title: enTitle.trim(),
        date: enDate.trim() || '1447 AH',
        questioner: enQuestioner.trim() || 'Questioner',
        question: enQuestion.trim(),
        answer: enAnswer.trim(),
        references: cleanedEnRefs
      } : undefined,
      idLang: idTitle.trim() ? {
        title: idTitle.trim(),
        date: idDate.trim() || '1447 H',
        questioner: idQuestioner.trim() || 'Penanya',
        question: idQuestion.trim(),
        answer: idAnswer.trim(),
        references: cleanedIdRefs
      } : undefined
    };

    onSave(updatedFatwa);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border-2 border-gold-500 overflow-hidden my-auto text-gray-800">
        
        {/* Modal Header */}
        <div className="islamic-pattern p-5 text-white flex justify-between items-center border-b-2 border-gold-500 shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border-2 border-gold-400 flex items-center justify-center text-gold-400">
              <i className="fa-solid fa-scale-balanced"></i>
            </div>
            <div>
              <h3 className="font-bold text-lg font-serif text-white">
                {fatwaToEdit ? `تعديل الفتوى رقم #${fatwaToEdit.id}` : 'إضافة فتوى شرعية جديدة'}
              </h3>
              <p className="text-xs text-gray-200">
                إدخال تفاصيل الفتوى، السؤال، الجواب المحرر، والمصادر الفقهية المعتمدة
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          
          {/* General Metadata: ID, Category, Views */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-200">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                رقم الفتوى (#) <span className="text-red-500">*</span>
              </label>
              <input 
                type="number"
                required
                value={id}
                onChange={(e) => setId(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none font-mono text-sm font-bold text-gray-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                الباب الفقهي / القسم <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none text-sm font-medium text-gray-800"
              >
                {categories.filter(c => c.id !== 'الكل').map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name.ar}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                عدد المشاهدات (افتراضي)
              </label>
              <input 
                type="number"
                value={views}
                onChange={(e) => setViews(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none font-mono text-sm text-gray-800"
              />
            </div>
          </div>

          {/* Language Selection Tabs */}
          <div className="border-b border-gray-200 flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('ar')}
              className={`pb-3 px-4 font-bold text-sm border-b-2 transition flex items-center gap-2 ${
                activeTab === 'ar'
                  ? 'border-emerald-850 text-emerald-850 bg-emerald-50/50 rounded-t-lg'
                  : 'border-transparent text-gray-500 hover:text-emerald-850'
              }`}
            >
              <span>العربية (الأساسية)</span>
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('en')}
              className={`pb-3 px-4 font-bold text-sm border-b-2 transition flex items-center gap-2 ${
                activeTab === 'en'
                  ? 'border-emerald-850 text-emerald-850 bg-emerald-50/50 rounded-t-lg'
                  : 'border-transparent text-gray-500 hover:text-emerald-850'
              }`}
            >
              <span>English (Optional)</span>
              {enTitle && <i className="fa-solid fa-check text-xs text-green-600"></i>}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('id')}
              className={`pb-3 px-4 font-bold text-sm border-b-2 transition flex items-center gap-2 ${
                activeTab === 'id'
                  ? 'border-emerald-850 text-emerald-850 bg-emerald-50/50 rounded-t-lg'
                  : 'border-transparent text-gray-500 hover:text-emerald-850'
              }`}
            >
              <span>Indonesia (Optional)</span>
              {idTitle && <i className="fa-solid fa-check text-xs text-green-600"></i>}
            </button>
          </div>

          {/* Arabic Form Fields */}
          {activeTab === 'ar' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    عنوان الفتوى <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: حكم صلاة الجمعة خلف الإمام..."
                    value={arTitle}
                    onChange={(e) => setArTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 focus:bg-white border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none text-gray-800 transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      اسم / كنية المستفتي
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: مستفتٍ من الشحر"
                      value={arQuestioner}
                      onChange={(e) => setArQuestioner(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 focus:bg-white border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none text-gray-800 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      تاريخ الصدور
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: 15 ربيع الثاني 1447 هـ"
                      value={arDate}
                      onChange={(e) => setArDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 focus:bg-white border border-gray-300 text-sm font-mono focus:ring-2 focus:ring-emerald-700 focus:outline-none text-gray-800 transition"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  نص سؤال المستفتي <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="نص السؤال كما ورد من المستفتي..."
                  value={arQuestion}
                  onChange={(e) => setArQuestion(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-gray-50 focus:bg-white border border-gray-300 text-sm leading-relaxed focus:ring-2 focus:ring-emerald-700 focus:outline-none text-gray-800 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  نص الجواب المحرر المعتمد من دائرة الفتاوى <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={8}
                  required
                  placeholder="الحمد لله رب العالمين... الجواب المؤصل..."
                  value={arAnswer}
                  onChange={(e) => setArAnswer(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-gray-50 focus:bg-white border border-gray-300 font-serif text-base leading-relaxed focus:ring-2 focus:ring-emerald-700 focus:outline-none text-gray-800 transition"
                />
              </div>

              {/* References Manager */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-gray-700">
                    المراجع والمصادر الفقهية المعتمدة
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddRef('ar')}
                    className="text-xs text-emerald-850 hover:underline font-bold flex items-center gap-1"
                  >
                    <i className="fa-solid fa-plus text-gold-500"></i>
                    <span>إضافة مرجع آخر</span>
                  </button>
                </div>
                {arReferences.map((ref, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      placeholder={`مرجع ${idx + 1}: مثل: منهاج الطالبين للإمام النووي...`}
                      value={ref}
                      onChange={(e) => handleUpdateRef('ar', idx, e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-gray-50 focus:bg-white border border-gray-300 text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none text-gray-800 transition"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveRef('ar', idx)}
                      className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-xl transition"
                      title="حذف"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* English Form Fields */}
          {activeTab === 'en' && (
            <div className="space-y-4" dir="ltr">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    English Title
                  </label>
                  <input
                    type="text"
                    placeholder="Ruling on..."
                    value={enTitle}
                    onChange={(e) => setEnTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 focus:bg-white border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none text-gray-800 transition"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Questioner
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Questioner from Ash-Shihr"
                      value={enQuestioner}
                      onChange={(e) => setEnQuestioner(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 focus:bg-white border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none text-gray-800 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rabi' al-Thani 1447 AH"
                      value={enDate}
                      onChange={(e) => setEnDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 focus:bg-white border border-gray-300 text-sm font-mono focus:ring-2 focus:ring-emerald-700 focus:outline-none text-gray-800 transition"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Question Text (English)
                </label>
                <textarea
                  rows={3}
                  value={enQuestion}
                  onChange={(e) => setEnQuestion(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-gray-50 focus:bg-white border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none text-gray-800 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Answer Text (English)
                </label>
                <textarea
                  rows={6}
                  value={enAnswer}
                  onChange={(e) => setEnAnswer(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-gray-50 focus:bg-white border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none text-gray-800 transition"
                />
              </div>

              {/* References */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-gray-700">
                    References (English)
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddRef('en')}
                    className="text-xs text-emerald-850 hover:underline font-bold"
                  >
                    + Add Reference
                  </button>
                </div>
                {enReferences.map((ref, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={ref}
                      onChange={(e) => handleUpdateRef('en', idx, e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-gray-50 focus:bg-white border border-gray-300 text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none text-gray-800 transition"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveRef('en', idx)}
                      className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-xl"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Indonesian Form Fields */}
          {activeTab === 'id' && (
            <div className="space-y-4" dir="ltr">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Judul Fatwa (Indonesia)
                  </label>
                  <input
                    type="text"
                    placeholder="Hukum..."
                    value={idTitle}
                    onChange={(e) => setIdTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 focus:bg-white border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none text-gray-800 transition"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Penanya
                    </label>
                    <input
                      type="text"
                      placeholder="Penanya dari Asy-Syihr"
                      value={idQuestioner}
                      onChange={(e) => setIdQuestioner(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 focus:bg-white border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none text-gray-800 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Tanggal
                    </label>
                    <input
                      type="text"
                      placeholder="Rabiul Akhir 1447 H"
                      value={idDate}
                      onChange={(e) => setIdDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 focus:bg-white border border-gray-300 text-sm font-mono focus:ring-2 focus:ring-emerald-700 focus:outline-none text-gray-800 transition"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Teks Pertanyaan (Indonesia)
                </label>
                <textarea
                  rows={3}
                  value={idQuestion}
                  onChange={(e) => setIdQuestion(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-gray-50 focus:bg-white border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none text-gray-800 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Teks Jawaban (Indonesia)
                </label>
                <textarea
                  rows={6}
                  value={idAnswer}
                  onChange={(e) => setIdAnswer(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-gray-50 focus:bg-white border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none text-gray-800 transition"
                />
              </div>

              {/* References */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-gray-700">
                    Referensi Kitab (Indonesia)
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddRef('id')}
                    className="text-xs text-emerald-850 hover:underline font-bold"
                  >
                    + Tambah Referensi
                  </button>
                </div>
                {idReferences.map((ref, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={ref}
                      onChange={(e) => handleUpdateRef('id', idx, e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-gray-50 focus:bg-white border border-gray-300 text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none text-gray-800 transition"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveRef('id', idx)}
                      className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-xl"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-gray-200 flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition border border-gray-200"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 rounded-xl bg-emerald-850 hover:bg-emerald-900 text-white font-bold text-sm shadow-md hover:shadow-lg transition flex items-center gap-2 border border-gold-500/40"
            >
              <i className="fa-solid fa-floppy-disk text-gold-400"></i>
              <span>{fatwaToEdit ? 'حفظ تعديلات الفتوى' : 'إضافة ونشر الفتوى الآن'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
