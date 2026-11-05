import React, { useState, useEffect } from 'react';
import { Fatwa, Category } from '../types';
import { autoTranslateFatwa, translateOffline, translateReferenceItem, translateQuestioner, translateDate } from '../utils/translator';

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
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [arModified, setArModified] = useState<boolean>(false);
  const [enManuallyEdited, setEnManuallyEdited] = useState<boolean>(false);
  const [idManuallyEdited, setIdManuallyEdited] = useState<boolean>(false);

  // Arabic Fields (Required)
  const [arTitle, setArTitle] = useState('');
  const [arDate, setArDate] = useState('');
  const [arQuestioner, setArQuestioner] = useState('');
  const [arQuestion, setArQuestion] = useState('');
  const [arAnswer, setArAnswer] = useState('');
  const [arReferences, setArReferences] = useState<string[]>(['']);

  // English Fields (Auto-translated)
  const [enTitle, setEnTitle] = useState('');
  const [enDate, setEnDate] = useState('');
  const [enQuestioner, setEnQuestioner] = useState('');
  const [enQuestion, setEnQuestion] = useState('');
  const [enAnswer, setEnAnswer] = useState('');
  const [enReferences, setEnReferences] = useState<string[]>(['']);

  // Indonesian Fields (Auto-translated)
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
    setArModified(false);
    setEnManuallyEdited(false);
    setIdManuallyEdited(false);
  }, [fatwaToEdit, isOpen, existingFatwaIds, categories]);

  if (!isOpen) return null;

  const handleAutoTranslate = async (showSuccessMsg = false) => {
    if (!arTitle.trim()) {
      if (showSuccessMsg) alert('يرجى كتابة عنوان الفتوى بالعربية أولاً للبدء بالترجمة التلقائية.');
      return;
    }
    setIsTranslating(true);
    try {
      const res = await autoTranslateFatwa({
        title: arTitle.trim(),
        questioner: arQuestioner.trim() || 'مستفتٍ',
        date: arDate.trim() || '1447 هـ',
        question: arQuestion.trim() || arTitle.trim(),
        answer: arAnswer.trim() || arTitle.trim(),
        references: arReferences.map(r => r.trim()).filter(Boolean),
      });

      setEnTitle(res.en.title);
      setEnQuestioner(res.en.questioner);
      setEnDate(res.en.date);
      setEnQuestion(res.en.question);
      setEnAnswer(res.en.answer);
      setEnReferences(res.en.references.length > 0 ? res.en.references : ['']);

      setIdTitle(res.idLang.title);
      setIdQuestioner(res.idLang.questioner);
      setIdDate(res.idLang.date);
      setIdQuestion(res.idLang.question);
      setIdAnswer(res.idLang.answer);
      setIdReferences(res.idLang.references.length > 0 ? res.idLang.references : ['']);
      setArModified(false);

      if (showSuccessMsg) {
        alert('تمت ترجمة كافة الحقول (العنوان، السائل، التاريخ، السؤال، الجواب، والمراجع) بنجاح إلى الإنجليزية والإندونيسية!');
      }
    } catch {
      // Offline fallback
      setEnTitle(translateOffline(arTitle, 'en'));
      setEnQuestioner(translateQuestioner(arQuestioner || 'مستفتٍ', 'en'));
      setEnDate(translateDate(arDate || '1447 هـ', 'en'));
      setEnQuestion(translateOffline(arQuestion, 'en'));
      setEnAnswer(translateOffline(arAnswer, 'en'));
      setEnReferences(arReferences.map(r => translateReferenceItem(r, 'en')).filter(Boolean));

      setIdTitle(translateOffline(arTitle, 'id'));
      setIdQuestioner(translateQuestioner(arQuestioner || 'مستفتٍ', 'id'));
      setIdDate(translateDate(arDate || '1447 هـ', 'id'));
      setIdQuestion(translateOffline(arQuestion, 'id'));
      setIdAnswer(translateOffline(arAnswer, 'id'));
      setIdReferences(arReferences.map(r => translateReferenceItem(r, 'id')).filter(Boolean));
      setArModified(false);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleAddRef = (lang: 'ar' | 'en' | 'id') => {
    if (lang === 'ar') {
      setArReferences([...arReferences, '']);
      setArModified(true);
    }
    if (lang === 'en') {
      setEnReferences([...enReferences, '']);
      setEnManuallyEdited(true);
    }
    if (lang === 'id') {
      setIdReferences([...idReferences, '']);
      setIdManuallyEdited(true);
    }
  };

  const handleUpdateRef = (lang: 'ar' | 'en' | 'id', index: number, value: string) => {
    if (lang === 'ar') {
      const copy = [...arReferences];
      copy[index] = value;
      setArReferences(copy);
      setArModified(true);
    } else if (lang === 'en') {
      const copy = [...enReferences];
      copy[index] = value;
      setEnReferences(copy);
      setEnManuallyEdited(true);
    } else {
      const copy = [...idReferences];
      copy[index] = value;
      setIdReferences(copy);
      setIdManuallyEdited(true);
    }
  };

  const handleRemoveRef = (lang: 'ar' | 'en' | 'id', index: number) => {
    if (lang === 'ar') {
      if (arReferences.length <= 1) return;
      setArReferences(arReferences.filter((_, i) => i !== index));
      setArModified(true);
    } else if (lang === 'en') {
      setEnReferences(enReferences.filter((_, i) => i !== index));
      setEnManuallyEdited(true);
    } else {
      setIdReferences(idReferences.filter((_, i) => i !== index));
      setIdManuallyEdited(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!arTitle.trim() || !arQuestion.trim() || !arAnswer.trim()) {
      alert('يرجى ملء الحقول الأساسية في تبويب اللغة العربية (العنوان، نص السؤال، نص الجواب).');
      return;
    }

    setIsTranslating(true);
    const cleanedArRefs = arReferences.map(r => r.trim()).filter(Boolean);

    // Auto-translate all 6 fields from Arabic to ensure no field is left in Arabic
    const autoTrans = await autoTranslateFatwa({
      title: arTitle.trim(),
      questioner: arQuestioner.trim() || 'مستفتٍ',
      date: arDate.trim() || '1447 هـ',
      question: arQuestion.trim(),
      answer: arAnswer.trim(),
      references: cleanedArRefs.length > 0 ? cleanedArRefs : ['المراجع الشرعية المعتمدة بالرباط'],
    });

    // Helper: checks if a string is already translated to Latin script (no Arabic characters)
    const isTranslated = (str: string) => Boolean(str && str.trim() && !/[\u0600-\u06FF]/.test(str));

    const finalEn = {
      title: (!arModified && enManuallyEdited && isTranslated(enTitle)) ? enTitle.trim() : autoTrans.en.title,
      questioner: (!arModified && enManuallyEdited && isTranslated(enQuestioner)) ? enQuestioner.trim() : autoTrans.en.questioner,
      date: (!arModified && enManuallyEdited && isTranslated(enDate)) ? enDate.trim() : autoTrans.en.date,
      question: (!arModified && enManuallyEdited && isTranslated(enQuestion)) ? enQuestion.trim() : autoTrans.en.question,
      answer: (!arModified && enManuallyEdited && isTranslated(enAnswer)) ? enAnswer.trim() : autoTrans.en.answer,
      references: (!arModified && enManuallyEdited && enReferences.filter(r => isTranslated(r)).length > 0)
        ? enReferences.map(r => isTranslated(r) ? r.trim() : translateReferenceItem(r.trim(), 'en')).filter(Boolean)
        : autoTrans.en.references,
    };

    const finalId = {
      title: (!arModified && idManuallyEdited && isTranslated(idTitle)) ? idTitle.trim() : autoTrans.idLang.title,
      questioner: (!arModified && idManuallyEdited && isTranslated(idQuestioner)) ? idQuestioner.trim() : autoTrans.idLang.questioner,
      date: (!arModified && idManuallyEdited && isTranslated(idDate)) ? idDate.trim() : autoTrans.idLang.date,
      question: (!arModified && idManuallyEdited && isTranslated(idQuestion)) ? idQuestion.trim() : autoTrans.idLang.question,
      answer: (!arModified && idManuallyEdited && isTranslated(idAnswer)) ? idAnswer.trim() : autoTrans.idLang.answer,
      references: (!arModified && idManuallyEdited && idReferences.filter(r => isTranslated(r)).length > 0)
        ? idReferences.map(r => isTranslated(r) ? r.trim() : translateReferenceItem(r.trim(), 'id')).filter(Boolean)
        : autoTrans.idLang.references,
    };

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
      en: finalEn,
      idLang: finalId
    };

    setIsTranslating(false);
    onSave(updatedFatwa);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-modal-backdrop">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border-2 border-gold-500 overflow-hidden my-auto text-gray-800 animate-modal-card">
        
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

          {/* Auto-Translation Notification Banner */}
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 border border-emerald-300 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-850 text-gold-400 flex items-center justify-center shrink-0 shadow-xs">
                <i className="fa-solid fa-wand-magic-sparkles text-sm"></i>
              </div>
              <div>
                <span className="font-bold text-emerald-950 block text-xs sm:text-sm">
                  الترجمة التلقائية الفورية مفعلة (يكفي كتابة الفتوى بالعربية فقط)
                </span>
                <span className="text-[11px] text-gray-600 block">
                  سيتم توليد الترجمتين الإنجليزية والإندونيسية وتحديثهما آلياً فور الحفظ لتتواكب مع أي تعديلات دون الحاجة لكتابتهما يدوياً.
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleAutoTranslate(true)}
              disabled={isTranslating || !arTitle.trim()}
              className="px-3.5 py-1.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-emerald-950 font-bold text-xs shadow-xs transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              title="توليد ومعاينة الترجمة الفورية الآن"
            >
              <i className={`fa-solid ${isTranslating ? 'fa-spinner fa-spin' : 'fa-language'}`}></i>
              <span>{isTranslating ? 'جارٍ الترجمة...' : 'معاينة الترجمة الآلية الآن'}</span>
            </button>
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
              onClick={() => {
                if ((!enTitle || /[\u0600-\u06FF]/.test(enTitle) || !enAnswer || /[\u0600-\u06FF]/.test(enAnswer)) && arTitle.trim()) {
                  handleAutoTranslate();
                }
                setActiveTab('en');
              }}
              className={`pb-3 px-4 font-bold text-sm border-b-2 transition flex items-center gap-2 ${
                activeTab === 'en'
                  ? 'border-emerald-850 text-emerald-850 bg-emerald-50/50 rounded-t-lg'
                  : 'border-transparent text-gray-500 hover:text-emerald-850'
              }`}
            >
              <span>English</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-normal px-2 py-0.5 rounded-full">
                {enTitle && !/[\u0600-\u06FF]/.test(enTitle) ? 'مترجم آلياً' : 'تلقائي'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                if ((!idTitle || /[\u0600-\u06FF]/.test(idTitle) || !idAnswer || /[\u0600-\u06FF]/.test(idAnswer)) && arTitle.trim()) {
                  handleAutoTranslate();
                }
                setActiveTab('id');
              }}
              className={`pb-3 px-4 font-bold text-sm border-b-2 transition flex items-center gap-2 ${
                activeTab === 'id'
                  ? 'border-emerald-850 text-emerald-850 bg-emerald-50/50 rounded-t-lg'
                  : 'border-transparent text-gray-500 hover:text-emerald-850'
              }`}
            >
              <span>Indonesia</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-normal px-2 py-0.5 rounded-full">
                {idTitle && !/[\u0600-\u06FF]/.test(idTitle) ? 'مترجم آلياً' : 'تلقائي'}
              </span>
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
                    onChange={(e) => {
                      setArTitle(e.target.value);
                      setArModified(true);
                    }}
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
                      onChange={(e) => {
                        setArQuestioner(e.target.value);
                        setArModified(true);
                      }}
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
                      onChange={(e) => {
                        setArDate(e.target.value);
                        setArModified(true);
                      }}
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
                  onChange={(e) => {
                    setArQuestion(e.target.value);
                    setArModified(true);
                  }}
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
                  onChange={(e) => {
                    setArAnswer(e.target.value);
                    setArModified(true);
                  }}
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
              {/* Quick Re-translate Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 border border-emerald-200 rounded-2xl text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-emerald-850 text-gold-400 flex items-center justify-center text-xs shadow-xs">
                    <i className="fa-solid fa-language"></i>
                  </span>
                  <div>
                    <span className="font-bold text-emerald-950 block">
                      Auto-translated from Arabic content
                    </span>
                    <span className="text-[11px] text-gray-500 block">
                      All fields are translated automatically. You can also re-sync with any changes made to Arabic.
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleAutoTranslate(true)}
                  disabled={isTranslating || !arTitle.trim()}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-850 text-gold-300 hover:bg-emerald-800 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50 shadow-xs"
                >
                  <i className={`fa-solid ${isTranslating ? 'fa-spinner fa-spin' : 'fa-arrows-rotate'}`}></i>
                  <span>{isTranslating ? 'Translating...' : 'Re-translate from Arabic'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    English Title
                  </label>
                  <input
                    type="text"
                    placeholder="Ruling on..."
                    value={enTitle}
                    onChange={(e) => {
                      setEnTitle(e.target.value);
                      setEnManuallyEdited(true);
                    }}
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
                      onChange={(e) => {
                        setEnQuestioner(e.target.value);
                        setEnManuallyEdited(true);
                      }}
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
                      onChange={(e) => {
                        setEnDate(e.target.value);
                        setEnManuallyEdited(true);
                      }}
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
                  onChange={(e) => {
                    setEnQuestion(e.target.value);
                    setEnManuallyEdited(true);
                  }}
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
                  onChange={(e) => {
                    setEnAnswer(e.target.value);
                    setEnManuallyEdited(true);
                  }}
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
              {/* Quick Re-translate Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 border border-emerald-200 rounded-2xl text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-emerald-850 text-gold-400 flex items-center justify-center text-xs shadow-xs">
                    <i className="fa-solid fa-language"></i>
                  </span>
                  <div>
                    <span className="font-bold text-emerald-950 block">
                      Diterjemahkan otomatis dari bahasa Arab
                    </span>
                    <span className="text-[11px] text-gray-500 block">
                      Semua kolom terjemahan sinkron otomatis tanpa perlu menulis manual.
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleAutoTranslate(true)}
                  disabled={isTranslating || !arTitle.trim()}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-850 text-gold-300 hover:bg-emerald-800 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50 shadow-xs"
                >
                  <i className={`fa-solid ${isTranslating ? 'fa-spinner fa-spin' : 'fa-arrows-rotate'}`}></i>
                  <span>{isTranslating ? 'Menerjemahkan...' : 'Perbarui terjemahan sekarang'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Judul Fatwa (Indonesia)
                  </label>
                  <input
                    type="text"
                    placeholder="Hukum..."
                    value={idTitle}
                    onChange={(e) => {
                      setIdTitle(e.target.value);
                      setIdManuallyEdited(true);
                    }}
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
                      onChange={(e) => {
                        setIdQuestioner(e.target.value);
                        setIdManuallyEdited(true);
                      }}
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
                      onChange={(e) => {
                        setIdDate(e.target.value);
                        setIdManuallyEdited(true);
                      }}
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
                  onChange={(e) => {
                    setIdQuestion(e.target.value);
                    setIdManuallyEdited(true);
                  }}
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
                  onChange={(e) => {
                    setIdAnswer(e.target.value);
                    setIdManuallyEdited(true);
                  }}
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
