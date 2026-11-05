import React, { useState } from 'react';
import {
  Fatwa,
  Category,
  ResearchStudy,
  TrackingItem,
  SiteSettings,
  AdminAccount,
} from '../types';
import { translateOffline } from '../utils/translator';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentAdminEmail: string;
  primaryAdminName: string;
  primaryAdminEmail: string;
  primaryAdminCode: string;
  onChangePrimaryName: (name: string) => void;
  onChangePrimaryAdmin: (email: string) => void;
  onChangePrimaryCode: (code: string) => void;
  adminAccounts: AdminAccount[];
  onAddAdminAccount: (account: AdminAccount) => void;
  onRemoveAdminAccount: (email: string) => void;
  settings: SiteSettings;
  onUpdateSettings: (newSettings: SiteSettings) => void;
  categories: Category[];
  onAddCategory: (cat: Category) => void;
  onEditCategory: (cat: Category) => void;
  onDeleteCategory: (catId: string) => void;
  fatwas: Fatwa[];
  onOpenAddFatwa: () => void;
  onOpenEditFatwa: (fatwa: Fatwa) => void;
  onDeleteFatwa: (fatwaId: number) => void;
  researches: ResearchStudy[];
  onOpenAddResearch: () => void;
  onOpenEditResearch: (res: ResearchStudy) => void;
  onDeleteResearch: (resId: string) => void;
  trackingInquiries: TrackingItem[];
  onUpdateInquiry: (updated: TrackingItem) => void;
  onDeleteInquiry: (code: string) => void;
  onLogout: () => void;
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetDefaults: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  currentAdminEmail,
  primaryAdminName,
  primaryAdminEmail,
  primaryAdminCode,
  onChangePrimaryName,
  onChangePrimaryAdmin,
  onChangePrimaryCode,
  adminAccounts,
  onAddAdminAccount,
  onRemoveAdminAccount,
  settings,
  onUpdateSettings,
  categories,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  fatwas,
  onOpenAddFatwa,
  onOpenEditFatwa,
  onDeleteFatwa,
  researches,
  onOpenAddResearch,
  onOpenEditResearch,
  onDeleteResearch,
  trackingInquiries,
  onUpdateInquiry,
  onDeleteInquiry,
  onLogout,
  onExportData,
  onImportData,
  onResetDefaults,
}) => {
  const [activeTab, setActiveTab] = useState<
    'settings' | 'categories' | 'fatwas' | 'research' | 'istiftaa' | 'admins' | 'backup'
  >('settings');

  // Local settings state
  const [localSettings, setLocalSettings] = useState<SiteSettings>(settings);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Category modal / editing state
  const [newCatId, setNewCatId] = useState('');
  const [newCatNameAr, setNewCatNameAr] = useState('');
  const [newCatNameEn, setNewCatNameEn] = useState('');
  const [newCatNameId, setNewCatNameId] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('fa-book');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Admin credentials state
  const [newPrimaryNameInput, setNewPrimaryNameInput] = useState(primaryAdminName);
  const [newPrimaryInput, setNewPrimaryInput] = useState(primaryAdminEmail);
  const [newPrimaryCodeInput, setNewPrimaryCodeInput] = useState(primaryAdminCode);
  const [showPrimaryCode, setShowPrimaryCode] = useState(false);

  // New admin inputs (Name, Email, Code)
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminCode, setNewAdminCode] = useState('');
  const [showNewAdminCode, setShowNewAdminCode] = useState(false);

  // Fatwas search in admin
  const [adminFatwaSearch, setAdminFatwaSearch] = useState('');

  // Answering inquiry in admin
  const [selectedInquiry, setSelectedInquiry] = useState<TrackingItem | null>(null);
  const [inquiryAnswerText, setInquiryAnswerText] = useState('');
  const [inquiryStatusStep, setInquiryStatusStep] = useState<1 | 2 | 3>(3);
  const [inquiryStatusText, setInquiryStatusText] = useState('');

  if (!isOpen) return null;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(localSettings);
    setSaveSuccessMsg('تم حفظ وتحديث إعدادات الموقع بنجاح!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('يرجى اختيار ملف صورة صالح (PNG, JPG, SVG, WebP)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 2 ميجابايت لضمان سرعة تحميل الموقع.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setLocalSettings((prev) => ({
        ...prev,
        logoImage: dataUrl,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveUploadedLogo = () => {
    setLocalSettings((prev) => ({
      ...prev,
      logoImage: undefined,
    }));
  };

  const handleCreateOrUpdateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatNameAr.trim()) {
      alert('يرجى إدخال اسم القسم بالعربية');
      return;
    }

    const enName = newCatNameEn.trim() || translateOffline(newCatNameAr.trim(), 'en');
    const idName = newCatNameId.trim() || translateOffline(newCatNameAr.trim(), 'id');

    if (editingCategory) {
      onEditCategory({
        id: editingCategory.id,
        name: {
          ar: newCatNameAr.trim(),
          en: enName,
          id: idName,
        },
        icon: newCatIcon || 'fa-folder-open',
      });
      setEditingCategory(null);
    } else {
      const generatedId = newCatId.trim() || newCatNameAr.trim();
      onAddCategory({
        id: generatedId,
        name: {
          ar: newCatNameAr.trim(),
          en: enName,
          id: idName,
        },
        icon: newCatIcon || 'fa-folder-open',
      });
    }

    setNewCatId('');
    setNewCatNameAr('');
    setNewCatNameEn('');
    setNewCatNameId('');
    setNewCatIcon('fa-book');
  };

  const startEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setNewCatId(cat.id);
    setNewCatNameAr(cat.name.ar);
    setNewCatNameEn(cat.name.en);
    setNewCatNameId(cat.name.id);
    setNewCatIcon(cat.icon);
  };

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminName.trim()) {
      alert('يرجى إدخال اسم المدير');
      return;
    }
    if (!newAdminEmail.trim() || !newAdminEmail.includes('@')) {
      alert('يرجى إدخال بريد إلكتروني صالح للمدير');
      return;
    }
    if (!newAdminCode.trim()) {
      alert('يرجى إدخال رمز الدخول الخاص بالمدير');
      return;
    }
    onAddAdminAccount({
      name: newAdminName.trim(),
      email: newAdminEmail.trim().toLowerCase(),
      code: newAdminCode.trim(),
      addedAt: new Date().toLocaleDateString('ar-SA'),
    });
    setNewAdminName('');
    setNewAdminEmail('');
    setNewAdminCode('');
  };

  const handleSavePrimaryName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrimaryNameInput.trim()) {
      alert('يرجى إدخال اسم صحيح للمدير');
      return;
    }
    onChangePrimaryName(newPrimaryNameInput.trim());
    alert(`تم تحديث اسم المدير الرئيسي إلى: ${newPrimaryNameInput.trim()}`);
  };

  const handleSavePrimaryAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrimaryInput.trim() || !newPrimaryInput.includes('@')) {
      alert('يرجى إدخال بريد إلكتروني صالح للمدير الرئيسي');
      return;
    }
    onChangePrimaryAdmin(newPrimaryInput.trim().toLowerCase());
    alert(`تم تحديث البريد الإلكتروني للمدير الرئيسي إلى: ${newPrimaryInput.trim().toLowerCase()}`);
  };

  const handleSavePrimaryCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrimaryCodeInput.trim()) {
      alert('يرجى إدخال رمز دخول صحيح');
      return;
    }
    onChangePrimaryCode(newPrimaryCodeInput.trim());
    alert(`تم تحديث رمز الدخول بنجاح! الرمز الجديد هو: ${newPrimaryCodeInput.trim()}`);
  };

  const handleOpenAnswerInquiry = (inquiry: TrackingItem) => {
    setSelectedInquiry(inquiry);
    setInquiryAnswerText(inquiry.answer || '');
    setInquiryStatusStep(inquiry.statusStep);
    setInquiryStatusText(inquiry.statusText);
  };

  const handleSaveInquiryAnswer = () => {
    if (!selectedInquiry) return;
    const finalStatusText =
      inquiryStatusText.trim() ||
      (inquiryStatusStep === 3
        ? 'تمت الإجابة واعتماد الفتوى من لجنة الإفتاء'
        : inquiryStatusStep === 2
        ? 'قيد الدراسة والعرض على لجنة الفتوى'
        : 'تم استلام السؤال وجاري فرزه');
    const finalAnswer = inquiryAnswerText.trim() || null;

    const updated: TrackingItem = {
      ...selectedInquiry,
      statusStep: inquiryStatusStep,
      statusText: finalStatusText,
      answer: finalAnswer,
      en: {
        title: translateOffline(selectedInquiry.title, 'en'),
        date: translateOffline(selectedInquiry.date, 'en'),
        statusText: translateOffline(finalStatusText, 'en'),
        answer: finalAnswer ? translateOffline(finalAnswer, 'en') : null,
      },
      idLang: {
        title: translateOffline(selectedInquiry.title, 'id'),
        date: translateOffline(selectedInquiry.date, 'id'),
        statusText: translateOffline(finalStatusText, 'id'),
        answer: finalAnswer ? translateOffline(finalAnswer, 'id') : null,
      },
    };
    onUpdateInquiry(updated);
    setSelectedInquiry(null);
  };

  const filteredFatwas = fatwas.filter((f) => {
    const q = adminFatwaSearch.toLowerCase();
    return (
      f.id.toString().includes(q) ||
      f.category.toLowerCase().includes(q) ||
      f.ar.title.toLowerCase().includes(q) ||
      (f.ar.questioner && f.ar.questioner.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-modal-backdrop">
      <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[94vh] flex flex-col shadow-2xl border-2 border-gold-500 overflow-hidden my-auto text-gray-800 animate-modal-card">
        
        {/* Top Header */}
        <div className="islamic-pattern p-4 sm:p-6 text-white flex flex-wrap justify-between items-center gap-3 border-b-2 border-gold-500 shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border-2 border-gold-400 flex items-center justify-center text-gold-400 text-2xl shadow-inner">
              <i className="fa-solid fa-sliders"></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold font-serif text-white">
                  لوحة التحكم وإدارة الموقع الشاملة
                </h2>
                <span className="bg-gold-500 text-emerald-950 text-xs font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                  إشراف عام
                </span>
              </div>
              <p className="text-xs text-gray-200 mt-0.5">
                المدير الحالي المسجل: <span className="font-mono text-gold-400 font-bold">{currentAdminEmail}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onLogout}
              className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              title="تسجيل الخروج من لوحة التحكم"
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              <span className="hidden sm:inline">خروج</span>
            </button>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
              title="إغلاق لوحة التحكم"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-gray-100 border-b border-gray-200 px-3 sm:px-6 flex overflow-x-auto gap-1 text-xs sm:text-sm font-bold shrink-0 scrollbar-thin">
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3.5 px-3.5 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-emerald-850 text-emerald-850 bg-white font-bold shadow-xs'
                : 'border-transparent text-gray-600 hover:text-emerald-850 hover:bg-white/50'
            }`}
          >
            <i className="fa-solid fa-palette text-gold-500"></i>
            <span>المظهر والعناوين والألوان</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`py-3.5 px-3.5 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'categories'
                ? 'border-emerald-850 text-emerald-850 bg-white font-bold shadow-xs'
                : 'border-transparent text-gray-600 hover:text-emerald-850 hover:bg-white/50'
            }`}
          >
            <i className="fa-solid fa-folder-tree text-gold-500"></i>
            <span>الأقسام الفقهية ({categories.length - 1})</span>
          </button>

          <button
            onClick={() => setActiveTab('fatwas')}
            className={`py-3.5 px-3.5 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'fatwas'
                ? 'border-emerald-850 text-emerald-850 bg-white font-bold shadow-xs'
                : 'border-transparent text-gray-600 hover:text-emerald-850 hover:bg-white/50'
            }`}
          >
            <i className="fa-solid fa-scale-balanced text-gold-500"></i>
            <span>إدارة الفتاوى ({fatwas.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('research')}
            className={`py-3.5 px-3.5 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'research'
                ? 'border-emerald-850 text-emerald-850 bg-white font-bold shadow-xs'
                : 'border-transparent text-gray-600 hover:text-emerald-850 hover:bg-white/50'
            }`}
          >
            <i className="fa-solid fa-book-bookmark text-gold-500"></i>
            <span>البحوث والدراسات ({researches.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('istiftaa')}
            className={`py-3.5 px-3.5 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'istiftaa'
                ? 'border-emerald-850 text-emerald-850 bg-white font-bold shadow-xs'
                : 'border-transparent text-gray-600 hover:text-emerald-850 hover:bg-white/50'
            }`}
          >
            <i className="fa-brands fa-whatsapp text-green-600"></i>
            <span>الاستفتاء والواتساب والإيميل ({trackingInquiries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('admins')}
            className={`py-3.5 px-3.5 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'admins'
                ? 'border-emerald-850 text-emerald-850 bg-white font-bold shadow-xs'
                : 'border-transparent text-gray-600 hover:text-emerald-850 hover:bg-white/50'
            }`}
          >
            <i className="fa-solid fa-users-gear text-gold-500"></i>
            <span>المدراء والصلاحيات</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`py-3.5 px-3.5 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'backup'
                ? 'border-emerald-850 text-emerald-850 bg-white font-bold shadow-xs'
                : 'border-transparent text-gray-600 hover:text-emerald-850 hover:bg-white/50'
            }`}
          >
            <i className="fa-solid fa-database text-gold-500"></i>
            <span>النسخ والاستعادة</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-7 space-y-6">
          
          {saveSuccessMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-500 rounded-xl text-emerald-900 text-sm font-bold flex items-center gap-2">
              <i className="fa-solid fa-circle-check text-emerald-700"></i>
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          {/* ================= TAB 1: SITE SETTINGS & IDENTITY ================= */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-6">
              
              {/* Identity & Branding */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                <h3 className="font-bold text-base text-emerald-900 flex items-center gap-2">
                  <i className="fa-solid fa-heading text-gold-500"></i>
                  <span>العناوين وشعار الموقع</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">اسم الموقع الرئيسي (Brand Title)</label>
                    <input
                      type="text"
                      value={localSettings.brandTitle}
                      onChange={(e) => setLocalSettings({ ...localSettings, brandTitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-300 focus:bg-white focus:ring-2 focus:ring-emerald-700 text-sm font-bold text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">العنوان الفرعي (Brand Subtitle)</label>
                    <input
                      type="text"
                      value={localSettings.brandSubtitle}
                      onChange={(e) => setLocalSettings({ ...localSettings, brandSubtitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-300 focus:bg-white focus:ring-2 focus:ring-emerald-700 text-sm text-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">شريط الإعلان العلوي (Top Bar)</label>
                    <input
                      type="text"
                      value={localSettings.topBarTitle}
                      onChange={(e) => setLocalSettings({ ...localSettings, topBarTitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-300 focus:bg-white focus:ring-2 focus:ring-emerald-700 text-sm text-gray-800"
                    />
                  </div>

                </div>

                {/* Logo & Icon Management Section */}
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <i className="fa-solid fa-image text-gold-500"></i>
                      <span>شعار الموقع الرسمي (رفع صورة أو اختيار أيقونة)</span>
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Option 1: Upload Logo File */}
                    <div className="p-4 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 space-y-3 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-800">
                          1. رفع صورة الشعار من جهازك:
                        </span>
                        {localSettings.logoImage ? (
                          <span className="text-[10px] bg-emerald-100 text-emerald-850 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                            الشعار المرفوع مفعّل
                          </span>
                        ) : (
                          <span className="text-[10px] bg-gray-200 text-gray-700 font-medium px-2 py-0.5 rounded-full">
                            لم يتم رفع صورة
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          type="file"
                          id="logo-upload-input"
                          accept="image/png, image/jpeg, image/svg+xml, image/webp"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                        <label
                          htmlFor="logo-upload-input"
                          className="cursor-pointer px-4 py-2.5 bg-emerald-850 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition shadow flex items-center gap-2 border border-gold-500/40"
                        >
                          <i className="fa-solid fa-cloud-arrow-up text-gold-400"></i>
                          <span>رفع صورة الشعار</span>
                        </label>

                        {localSettings.logoImage && (
                          <button
                            type="button"
                            onClick={handleRemoveUploadedLogo}
                            className="px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-xs font-bold transition border border-red-200"
                          >
                            <i className="fa-solid fa-trash ml-1"></i> إزالة الشعار
                          </button>
                        )}
                      </div>

                      {/* Preview Box */}
                      <div className="flex items-center gap-3 pt-1">
                        <span className="text-xs text-gray-500">المعاينة:</span>
                        {localSettings.logoWithoutBox ? (
                          <div className="h-14 min-w-14 max-w-36 px-2 rounded-2xl bg-gray-200/60 border border-dashed border-gray-300 flex items-center justify-center">
                            {localSettings.logoImage ? (
                              <img
                                src={localSettings.logoImage}
                                alt="Logo Preview"
                                className="h-12 w-auto max-w-full object-contain"
                              />
                            ) : (
                              <i className={`fa-solid ${localSettings.logoIcon || 'fa-mosque'} text-emerald-850 text-2xl`}></i>
                            )}
                          </div>
                        ) : (
                          <div className="w-14 h-14 rounded-2xl islamic-pattern border-2 border-gold-500 flex items-center justify-center p-1.5 shadow overflow-hidden">
                            {localSettings.logoImage ? (
                              <img
                                src={localSettings.logoImage}
                                alt="Logo Preview"
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <i className={`fa-solid ${localSettings.logoIcon || 'fa-mosque'} text-gold-400 text-2xl`}></i>
                            )}
                          </div>
                        )}
                        <div className="text-xs">
                          <span className="text-gray-800 font-medium block">
                            {localSettings.logoImage ? 'صورة الشعار المرفوعة' : 'الأيقونة الإسلامية الافتراضية'}
                          </span>
                          <span className="text-[11px] text-emerald-850 font-bold block">
                            {localSettings.logoWithoutBox ? '← بدون مربع (الشعار فقط)' : '← داخل مربع زخرفي'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Option 2: Choose FontAwesome Icon */}
                    <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-3 shadow-xs">
                      <span className="text-xs font-bold text-gray-800 block">
                        2. أو اختر أيقونة الشعار (إذا لم ترفع صورة):
                      </span>
                      <div className="flex gap-2">
                        <select
                          value={localSettings.logoIcon}
                          onChange={(e) => setLocalSettings({ ...localSettings, logoIcon: e.target.value })}
                          className="flex-1 px-3 py-2.5 rounded-xl bg-white border border-gray-300 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                        >
                          <option value="fa-mosque">مسجد (fa-mosque)</option>
                          <option value="fa-scale-balanced">ميزان العدل والشرع (fa-scale-balanced)</option>
                          <option value="fa-book-quran">مصحف شريف (fa-book-quran)</option>
                          <option value="fa-kaaba">الكعبة المشرفة (fa-kaaba)</option>
                          <option value="fa-star-and-crescent">هلال ونجمة (fa-star-and-crescent)</option>
                          <option value="fa-feather-pointed">ريشة فتوى وتأليف (fa-feather-pointed)</option>
                          <option value="fa-landmark">صرح علمي / رباط (fa-landmark)</option>
                        </select>
                        <div className="w-11 h-11 rounded-xl bg-emerald-850 text-gold-400 flex items-center justify-center text-xl shrink-0 border border-gold-500/40">
                          <i className={`fa-solid ${localSettings.logoIcon}`}></i>
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-500 leading-relaxed">
                        تُستخدم هذه الأيقونة في الهيدر والفوتر إذا لم تقم برفع صورة مخصصة للشعار.
                      </p>
                    </div>

                    {/* Option 3: Logo Display Mode (Without Box vs Boxed) */}
                    <div className="md:col-span-2 p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-3 shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="text-xs font-bold text-gray-800 block">
                            3. شكل ومظهر إطار الشعار في الموقع:
                          </span>
                          <p className="text-[11px] text-gray-500 mt-0.5">
                            يمكنك إظهار الشعار بدون مربع أو خلفية ليتكيف حجمه بسلاسة مع المساحة في الهيدر والفوتر.
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input
                            type="checkbox"
                            checked={localSettings.logoWithoutBox || false}
                            onChange={(e) => setLocalSettings({ ...localSettings, logoWithoutBox: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-850"></div>
                          <span className="me-3 text-xs font-bold text-gray-800">
                            {localSettings.logoWithoutBox ? 'إظهار الشعار بدون مربع' : 'داخل مربع زخرفي'}
                          </span>
                        </label>
                      </div>

                      {/* Visual selector buttons */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <button
                          type="button"
                          onClick={() => setLocalSettings({ ...localSettings, logoWithoutBox: false })}
                          className={`p-3 rounded-xl border text-right transition flex items-center gap-3 ${
                            !localSettings.logoWithoutBox
                              ? 'border-emerald-700 bg-emerald-50/70 text-emerald-950 font-bold ring-2 ring-emerald-700/20'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <div className="w-11 h-11 rounded-xl islamic-pattern border border-gold-500 flex items-center justify-center shrink-0 shadow-xs">
                            {localSettings.logoImage ? (
                              <img src={localSettings.logoImage} alt="logo" className="w-full h-full object-contain p-1 rounded-lg" />
                            ) : (
                              <i className={`fa-solid ${localSettings.logoIcon || 'fa-mosque'} text-gold-400 text-sm`}></i>
                            )}
                          </div>
                          <div>
                            <span className="text-xs block font-bold">داخل مربع زخرفي (افتراضي)</span>
                            <span className="text-[10px] text-gray-500 block">إطار مربع بزخرفة إسلامية وتحديد ذهبي</span>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setLocalSettings({ ...localSettings, logoWithoutBox: true })}
                          className={`p-3 rounded-xl border text-right transition flex items-center gap-3 ${
                            localSettings.logoWithoutBox
                              ? 'border-emerald-700 bg-emerald-50/70 text-emerald-950 font-bold ring-2 ring-emerald-700/20'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <div className="w-11 h-11 rounded-xl bg-gray-200/70 border border-dashed border-gray-300 flex items-center justify-center shrink-0">
                            {localSettings.logoImage ? (
                              <img src={localSettings.logoImage} alt="logo" className="h-9 w-auto max-w-full object-contain" />
                            ) : (
                              <i className={`fa-solid ${localSettings.logoIcon || 'fa-mosque'} text-emerald-850 text-xl`}></i>
                            )}
                          </div>
                          <div>
                            <span className="text-xs block font-bold">بدون مربع (الشعار فقط)</span>
                            <span className="text-[10px] text-gray-500 block">يظهر الشعار بحجم متكيف وطبيعي بدون أي إطار</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Colors Customization */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                <h3 className="font-bold text-base text-emerald-900 flex items-center gap-2">
                  <i className="fa-solid fa-paintbrush text-gold-500"></i>
                  <span>تخصيص ألوان الموقع والهوية البصرية</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">اللون الأساسي الإسلامي (Primary Color)</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={localSettings.primaryColor}
                        onChange={(e) => setLocalSettings({ ...localSettings, primaryColor: e.target.value })}
                        className="w-14 h-12 rounded-xl cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={localSettings.primaryColor}
                        onChange={(e) => setLocalSettings({ ...localSettings, primaryColor: e.target.value })}
                        className="w-32 px-3 py-2 rounded-xl bg-gray-50 border border-gray-300 font-mono text-sm text-gray-800"
                      />
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => setLocalSettings({ ...localSettings, primaryColor: '#0B4619' })}
                          className="w-7 h-7 rounded-lg bg-[#0B4619] border border-gray-300"
                          title="أخضر حضرمي افتراضي"
                        />
                        <button
                          type="button"
                          onClick={() => setLocalSettings({ ...localSettings, primaryColor: '#064e3b' })}
                          className="w-7 h-7 rounded-lg bg-[#064e3b] border border-gray-300"
                          title="زمردي داكن"
                        />
                        <button
                          type="button"
                          onClick={() => setLocalSettings({ ...localSettings, primaryColor: '#1e3a8a' })}
                          className="w-7 h-7 rounded-lg bg-[#1e3a8a] border border-gray-300"
                          title="أزرق ملكي"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">اللون الذهبي الثانوي (Gold Accent Color)</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={localSettings.goldColor}
                        onChange={(e) => setLocalSettings({ ...localSettings, goldColor: e.target.value })}
                        className="w-14 h-12 rounded-xl cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={localSettings.goldColor}
                        onChange={(e) => setLocalSettings({ ...localSettings, goldColor: e.target.value })}
                        className="w-32 px-3 py-2 rounded-xl bg-gray-50 border border-gray-300 font-mono text-sm text-gray-800"
                      />
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => setLocalSettings({ ...localSettings, goldColor: '#D4AF37' })}
                          className="w-7 h-7 rounded-lg bg-[#D4AF37] border border-gray-300"
                          title="ذهبي إسلامي"
                        />
                        <button
                          type="button"
                          onClick={() => setLocalSettings({ ...localSettings, goldColor: '#E5C158' })}
                          className="w-7 h-7 rounded-lg bg-[#E5C158] border border-gray-300"
                          title="ذهبي فاتح"
                        />
                        <button
                          type="button"
                          onClick={() => setLocalSettings({ ...localSettings, goldColor: '#b45309' })}
                          className="w-7 h-7 rounded-lg bg-[#b45309] border border-gray-300"
                          title="عسلي"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hero Section Texts */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                <h3 className="font-bold text-base text-emerald-900 flex items-center gap-2">
                  <i className="fa-solid fa-bullhorn text-gold-500"></i>
                  <span>نصوص الواجهة الرئيسية (Hero Section)</span>
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">الآية القرآنية العلوية</label>
                    <input
                      type="text"
                      value={localSettings.heroAyah}
                      onChange={(e) => setLocalSettings({ ...localSettings, heroAyah: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-300 focus:bg-white focus:ring-2 focus:ring-emerald-700 text-sm font-serif text-emerald-900 font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">العنوان الرئيسي في الواجهة</label>
                      <input
                        type="text"
                        value={localSettings.heroMainTitle}
                        onChange={(e) => setLocalSettings({ ...localSettings, heroMainTitle: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-300 focus:bg-white focus:ring-2 focus:ring-emerald-700 text-sm font-bold text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">العنوان الفرعي في الواجهة</label>
                      <input
                        type="text"
                        value={localSettings.heroSubTitle}
                        onChange={(e) => setLocalSettings({ ...localSettings, heroSubTitle: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-300 focus:bg-white focus:ring-2 focus:ring-emerald-700 text-sm font-bold text-gray-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">الوصف التعريفي للواجهة</label>
                    <textarea
                      rows={3}
                      value={localSettings.heroDesc}
                      onChange={(e) => setLocalSettings({ ...localSettings, heroDesc: e.target.value })}
                      className="w-full p-3 rounded-xl bg-gray-50 border border-gray-300 focus:bg-white focus:ring-2 focus:ring-emerald-700 text-sm leading-relaxed text-gray-800"
                    />
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                <h3 className="font-bold text-base text-emerald-900 flex items-center gap-2">
                  <i className="fa-solid fa-chart-simple text-gold-500"></i>
                  <span>أرقام وإحصائيات الموقع</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <label className="block text-[11px] font-bold text-gray-500 mb-1">الرقم 1</label>
                    <input
                      type="text"
                      value={localSettings.stat1Val}
                      onChange={(e) => setLocalSettings({ ...localSettings, stat1Val: e.target.value })}
                      className="w-full px-2 py-1.5 rounded-lg border border-gray-300 font-bold text-sm mb-1 bg-white text-emerald-850"
                    />
                    <input
                      type="text"
                      value={localSettings.stat1Label}
                      onChange={(e) => setLocalSettings({ ...localSettings, stat1Label: e.target.value })}
                      className="w-full px-2 py-1.5 rounded-lg border border-gray-300 text-xs bg-white text-gray-700"
                    />
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <label className="block text-[11px] font-bold text-gray-500 mb-1">الرقم 2</label>
                    <input
                      type="text"
                      value={localSettings.stat2Val}
                      onChange={(e) => setLocalSettings({ ...localSettings, stat2Val: e.target.value })}
                      className="w-full px-2 py-1.5 rounded-lg border border-gray-300 font-bold text-sm mb-1 bg-white text-emerald-850"
                    />
                    <input
                      type="text"
                      value={localSettings.stat2Label}
                      onChange={(e) => setLocalSettings({ ...localSettings, stat2Label: e.target.value })}
                      className="w-full px-2 py-1.5 rounded-lg border border-gray-300 text-xs bg-white text-gray-700"
                    />
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <label className="block text-[11px] font-bold text-gray-500 mb-1">الرقم 3</label>
                    <input
                      type="text"
                      value={localSettings.stat3Val}
                      onChange={(e) => setLocalSettings({ ...localSettings, stat3Val: e.target.value })}
                      className="w-full px-2 py-1.5 rounded-lg border border-gray-300 font-bold text-sm mb-1 bg-white text-emerald-850"
                    />
                    <input
                      type="text"
                      value={localSettings.stat3Label}
                      onChange={(e) => setLocalSettings({ ...localSettings, stat3Label: e.target.value })}
                      className="w-full px-2 py-1.5 rounded-lg border border-gray-300 text-xs bg-white text-gray-700"
                    />
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <label className="block text-[11px] font-bold text-gray-500 mb-1">الرقم 4</label>
                    <input
                      type="text"
                      value={localSettings.stat4Val}
                      onChange={(e) => setLocalSettings({ ...localSettings, stat4Val: e.target.value })}
                      className="w-full px-2 py-1.5 rounded-lg border border-gray-300 font-bold text-sm mb-1 bg-white text-gold-600"
                    />
                    <input
                      type="text"
                      value={localSettings.stat4Label}
                      onChange={(e) => setLocalSettings({ ...localSettings, stat4Label: e.target.value })}
                      className="w-full px-2 py-1.5 rounded-lg border border-gray-300 text-xs bg-white text-gray-700"
                    />
                  </div>
                </div>
              </div>

              {/* About and Timings */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                <h3 className="font-bold text-base text-emerald-900 flex items-center gap-2">
                  <i className="fa-solid fa-circle-info text-gold-500"></i>
                  <span>معلومات الدائرة والمواعيد والموقع</span>
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">عنوان قسم عن الدائرة</label>
                    <input
                      type="text"
                      value={localSettings.aboutTitle}
                      onChange={(e) => setLocalSettings({ ...localSettings, aboutTitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-300 focus:bg-white focus:ring-2 focus:ring-emerald-700 text-sm font-bold text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">نص النبذة التعريفية</label>
                    <textarea
                      rows={3}
                      value={localSettings.aboutDesc}
                      onChange={(e) => setLocalSettings({ ...localSettings, aboutDesc: e.target.value })}
                      className="w-full p-3 rounded-xl bg-gray-50 border border-gray-300 focus:bg-white focus:ring-2 focus:ring-emerald-700 text-sm leading-relaxed text-gray-800"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">عنوان المربع 1 (المنهج العلمي)</label>
                      <input
                        type="text"
                        value={localSettings.aboutBox1Title}
                        onChange={(e) => setLocalSettings({ ...localSettings, aboutBox1Title: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white text-xs font-bold text-gray-800 mb-2"
                      />
                      <textarea
                        rows={3}
                        value={localSettings.aboutBox1Desc}
                        onChange={(e) => setLocalSettings({ ...localSettings, aboutBox1Desc: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white text-xs text-gray-700"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">عنوان المربع 2 (آلية عمل اللجنة)</label>
                      <input
                        type="text"
                        value={localSettings.aboutBox2Title}
                        onChange={(e) => setLocalSettings({ ...localSettings, aboutBox2Title: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white text-xs font-bold text-gray-800 mb-2"
                      />
                      <textarea
                        rows={3}
                        value={localSettings.aboutBox2Desc}
                        onChange={(e) => setLocalSettings({ ...localSettings, aboutBox2Desc: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white text-xs text-gray-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">العنوان الجغرافي والمقر</label>
                    <input
                      type="text"
                      value={localSettings.aboutLocation}
                      onChange={(e) => setLocalSettings({ ...localSettings, aboutLocation: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-300 focus:bg-white focus:ring-2 focus:ring-emerald-700 text-sm text-gray-800"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-8 py-3 bg-emerald-850 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-lg transition flex items-center gap-2 border border-gold-500/40 text-sm"
                >
                  <i className="fa-solid fa-check text-gold-400"></i>
                  <span>حفظ جميع إعدادات المظهر والهوية</span>
                </button>
              </div>
            </form>
          )}

          {/* ================= TAB 2: CATEGORIES MANAGEMENT ================= */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              
              {/* Form to Add / Edit Category */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                <h3 className="font-bold text-base text-emerald-950 flex items-center gap-2 font-serif">
                  <i className="fa-solid fa-folder-plus text-gold-500"></i>
                  <span>{editingCategory ? `تعديل قسم: ${editingCategory.name.ar}` : 'إضافة قسم فقهي جديد'}</span>
                </h3>

                <form onSubmit={handleCreateOrUpdateCategory} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">اسم القسم بالعربية <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        placeholder="مثال: فقه الأيمان والنذور"
                        value={newCatNameAr}
                        onChange={(e) => setNewCatNameAr(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 focus:bg-white border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none text-sm text-gray-800 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">اسم القسم بالإنجليزية (English)</label>
                      <input
                        type="text"
                        placeholder="e.g. Oaths & Vows"
                        value={newCatNameEn}
                        onChange={(e) => setNewCatNameEn(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 focus:bg-white border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none text-sm text-gray-800 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">اسم القسم بالإندونيسية (Indonesia)</label>
                      <input
                        type="text"
                        placeholder="e.g. Sumpah & Nazar"
                        value={newCatNameId}
                        onChange={(e) => setNewCatNameId(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 focus:bg-white border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none text-sm text-gray-800 transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">رمز الأيقونة (FontAwesome Icon Class)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="fa-book"
                          value={newCatIcon}
                          onChange={(e) => setNewCatIcon(e.target.value)}
                          className="flex-1 px-3.5 py-2 rounded-xl bg-gray-50 focus:bg-white border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none text-sm font-mono text-gray-800 transition"
                        />
                        <div className="w-10 h-10 rounded-xl bg-emerald-850 text-gold-400 flex items-center justify-center text-lg shrink-0 shadow-xs">
                          <i className={`fa-solid ${newCatIcon}`}></i>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-end gap-2">
                      <button
                        type="submit"
                        className="flex-1 py-2.5 px-4 bg-emerald-850 hover:bg-emerald-900 text-white font-bold rounded-xl text-sm transition shadow-md border border-gold-500/40"
                      >
                        {editingCategory ? 'تحديث القسم' : 'إضافة القسم الآن'}
                      </button>
                      {editingCategory && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCategory(null);
                            setNewCatNameAr('');
                            setNewCatNameEn('');
                            setNewCatNameId('');
                          }}
                          className="py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition border border-gray-200"
                        >
                          إلغاء
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </div>

              {/* Existing Categories List */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-gray-800 font-serif">
                  قائمة الأقسام الفقهية الحالية في الموقع:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {categories.map((cat) => {
                    const count = cat.id === 'الكل'
                      ? fatwas.length
                      : fatwas.filter((f) => f.category === cat.id).length;
                    return (
                      <div
                        key={cat.id}
                        className="p-3.5 rounded-2xl bg-white border border-gray-200 shadow-xs hover:border-emerald-750 transition flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 truncate">
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-850 flex items-center justify-center text-base shrink-0 border border-emerald-100">
                            <i className={`fa-solid ${cat.icon}`}></i>
                          </div>
                          <div className="truncate">
                            <h5 className="font-bold text-sm truncate text-gray-900">{cat.name.ar}</h5>
                            <span className="text-xs text-gray-500">{count} فتوى</span>
                          </div>
                        </div>

                        {cat.id !== 'الكل' && (
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => startEditCategory(cat)}
                              className="p-2 text-emerald-850 hover:bg-emerald-50 rounded-lg text-xs transition"
                              title="تعديل"
                            >
                              <i className="fa-solid fa-pen"></i>
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`هل أنت متأكد من حذف قسم "${cat.name.ar}"؟`)) {
                                  onDeleteCategory(cat.id);
                                }
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg text-xs transition"
                              title="حذف"
                            >
                              <i className="fa-solid fa-trash-can"></i>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* ================= TAB 3: FATWAS MANAGEMENT ================= */}
          {activeTab === 'fatwas' && (
            <div className="space-y-4">
              
              {/* Header Bar with Search & Add button */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
                <div className="relative w-full sm:w-80">
                  <i className="fa-solid fa-search absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                  <input
                    type="text"
                    placeholder="بحث في الفتاوى برقمها، عنوانها، أو السائل..."
                    value={adminFatwaSearch}
                    onChange={(e) => setAdminFatwaSearch(e.target.value)}
                    className="w-full pr-9 pl-3 py-2.5 rounded-xl bg-gray-50 focus:bg-white border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none text-xs sm:text-sm text-gray-800 transition"
                  />
                </div>

                <button
                  onClick={onOpenAddFatwa}
                  className="w-full sm:w-auto px-6 py-2.5 bg-emerald-850 hover:bg-emerald-900 text-white font-bold rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2 border border-gold-500/40"
                >
                  <i className="fa-solid fa-plus text-gold-400"></i>
                  <span>إضافة فتوى جديدة</span>
                </button>
              </div>

              {/* Fatwas Table / Cards */}
              <div className="space-y-3">
                {filteredFatwas.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 bg-white rounded-2xl border border-gray-200">
                    لا توجد فتاوى مطابقة للبحث
                  </div>
                ) : (
                  filteredFatwas.map((f) => (
                    <div
                      key={f.id}
                      className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-3 hover:border-emerald-750 hover:shadow-md transition"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-lg bg-emerald-850 text-gold-400">
                            #{typeof f.id === 'object' ? ((f.id as any)?.id || 1042) : f.id}
                          </span>
                          <span className="text-xs bg-gray-100 px-2.5 py-0.5 rounded-full text-gray-700 border border-gray-200">
                            {f.category}
                          </span>
                          <span className="text-xs text-gray-400 font-mono">
                            <i className="fa-regular fa-clock mx-1"></i>
                            {f.ar.date}
                          </span>
                        </div>
                        <h4 className="font-bold text-base text-gray-900 font-serif">
                          {f.ar.title}
                        </h4>
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {f.ar.question}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                        <button
                          onClick={() => onOpenEditFatwa(f)}
                          className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-850 text-xs font-bold transition flex items-center gap-1.5 border border-emerald-200"
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                          <span>تعديل</span>
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`هل أنت متأكد من حذف الفتوى رقم #${f.id} نهائياً؟`)) {
                              onDeleteFatwa(f.id);
                            }
                          }}
                          className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition flex items-center gap-1.5 border border-red-200"
                        >
                          <i className="fa-solid fa-trash-can"></i>
                          <span>حذف</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

          {/* ================= TAB 4: RESEARCH MANAGEMENT ================= */}
          {activeTab === 'research' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
                <div>
                  <h4 className="font-bold text-sm text-gray-900 font-serif">البحوث والدراسات العلمية المنشورة</h4>
                  <p className="text-xs text-gray-500">يمكنك تعديل أي بحث حالي، حذفه، أو نشر بحث ودراسة جديدة</p>
                </div>
                <button
                  onClick={onOpenAddResearch}
                  className="px-5 py-2.5 bg-emerald-850 hover:bg-emerald-900 text-white font-bold rounded-xl text-sm transition flex items-center gap-2 border border-gold-500/40 shadow-md"
                >
                  <i className="fa-solid fa-plus text-gold-400"></i>
                  <span>إضافة بحث جديد</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {researches.map((r) => (
                  <div
                    key={r.id}
                    className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs hover:border-emerald-750 hover:shadow-md transition space-y-3"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-850 border border-emerald-200 font-bold">
                        {r.ar.badge}
                      </span>
                      <span className="text-xs text-gray-400 font-mono">{r.ar.pages}</span>
                    </div>
                    <h4 className="font-bold text-base font-serif text-gray-900 line-clamp-2">
                      {r.ar.title}
                    </h4>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {r.ar.desc}
                    </p>
                    <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                      <span className="text-xs text-gray-500">{r.ar.author}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onOpenEditResearch(r)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-850 text-xs font-bold transition border border-emerald-200"
                        >
                          تعديل
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`هل أنت متأكد من حذف البحث "${r.ar.title}"؟`)) {
                              onDeleteResearch(r.id);
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition border border-red-200"
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 5: ISTIFTAA, WHATSAPP & EMAIL SETTINGS ================= */}
          {activeTab === 'istiftaa' && (
            <div className="space-y-6">
              
              {/* Dispatch Configuration */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-850 border border-emerald-100 flex items-center justify-center text-xl">
                    <i className="fa-brands fa-whatsapp text-emerald-850"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-gray-900 font-serif">
                      إعدادات إرسال الاستفتاءات (رقم الواتساب والبريد الإلكتروني)
                    </h3>
                    <p className="text-xs text-gray-500">
                      تحديد الرقم والبريد الإلكتروني الذي يستقبل تفاصيل وأسئلة المستفتين مباشرة فور إرسالها من الموقع
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      رقم الواتساب المخصص لاستقبال الاستفتاءات (مع مفتاح الدولة)
                    </label>
                    <div className="relative">
                      <i className="fa-brands fa-whatsapp absolute right-3.5 top-1/2 -translate-y-1/2 text-green-600 text-lg"></i>
                      <input
                        type="text"
                        dir="ltr"
                        placeholder="مثال: 967770000000"
                        value={localSettings.whatsappNumber}
                        onChange={(e) => setLocalSettings({ ...localSettings, whatsappNumber: e.target.value })}
                        className="w-full pr-10 pl-4 py-3 rounded-xl bg-gray-50 focus:bg-white border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none text-sm font-mono font-bold text-gray-800 transition"
                      />
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">
                      اكتب الرقم الدولي بدون علامة (+) أو أصفار إضافية (مثلاً لليمن: 967770000000 أو للسعودية: 966500000000).
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      البريد الإلكتروني المخصص لاستقبال الاستفتاءات
                    </label>
                    <div className="relative">
                      <i className="fa-regular fa-envelope absolute right-3.5 top-1/2 -translate-y-1/2 text-blue-500"></i>
                      <input
                        type="email"
                        dir="ltr"
                        placeholder="fatwa@almustafa-shihr.org"
                        value={localSettings.istiftaaEmail}
                        onChange={(e) => setLocalSettings({ ...localSettings, istiftaaEmail: e.target.value })}
                        className="w-full pr-10 pl-4 py-3 rounded-xl bg-gray-50 focus:bg-white border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none text-sm font-mono font-bold text-gray-800 transition"
                      />
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">
                      البريد الذي ستُوجّه إليه الاستفتاءات عبر تطبيق البريد مباشرة.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateSettings(localSettings);
                      setSaveSuccessMsg('تم حفظ رقم الواتساب والبريد الإلكتروني بنجاح!');
                      setTimeout(() => setSaveSuccessMsg(''), 3000);
                    }}
                    className="px-6 py-2.5 bg-emerald-850 hover:bg-emerald-900 text-white font-bold rounded-xl text-sm transition shadow-md flex items-center gap-2 border border-gold-500/40"
                  >
                    <i className="fa-solid fa-floppy-disk text-gold-400"></i>
                    <span>حفظ أرقام وبيانات الاستقبال</span>
                  </button>
                </div>
              </div>

              {/* Inquiries Received & Answering System */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 font-serif">
                      الاستفتاءات الواردة من الموقع والرد عليها ({trackingInquiries.length})
                    </h4>
                    <p className="text-xs text-gray-500">
                      يمكنك هنا متابعة أي استفتاء أرسله زائر، وتحديث حالته وإضافة الجواب المعتمد ليظهر له في كود المتابعة
                    </p>
                  </div>
                </div>

                {trackingInquiries.length === 0 ? (
                  <div className="p-8 text-center bg-white rounded-2xl border border-gray-200 text-gray-500">
                    لا توجد استفتاءات مرسلة حتى الآن
                  </div>
                ) : (
                  <div className="space-y-3">
                    {trackingInquiries.map((inq) => (
                      <div
                        key={inq.code}
                        className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-3 hover:border-emerald-750 transition"
                      >
                        <div className="flex flex-wrap justify-between items-center gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-850 text-gold-400">
                              {inq.code}
                            </span>
                            <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full border border-gray-200 font-medium">
                              {inq.category}
                            </span>
                            <span className="text-xs text-gray-400">
                              {inq.date}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                                inq.statusStep === 3
                                  ? 'bg-green-100 text-green-800 border border-green-200'
                                  : inq.statusStep === 2
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : 'bg-blue-100 text-blue-800 border border-blue-200'
                              }`}
                            >
                              {inq.statusStep === 3 ? 'تمت الإجابة' : inq.statusStep === 2 ? 'قيد الدراسة' : 'جديد'}
                            </span>

                            <button
                              onClick={() => handleOpenAnswerInquiry(inq)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-850 hover:bg-emerald-900 text-white text-xs font-bold transition flex items-center gap-1.5 shadow"
                            >
                              <i className="fa-solid fa-comment-dots text-gold-400"></i>
                              <span>تحرير الإجابة / الحالة</span>
                            </button>

                            <button
                              onClick={() => {
                                if (window.confirm(`حذف الاستفتاء ${inq.code}؟`)) {
                                  onDeleteInquiry(inq.code);
                                }
                              }}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg text-xs transition"
                              title="حذف"
                            >
                              <i className="fa-solid fa-trash-can"></i>
                            </button>
                          </div>
                        </div>

                        <div>
                          <h5 className="font-bold text-sm text-gray-900 font-serif">{inq.title}</h5>
                          {inq.details && (
                            <p className="text-xs text-gray-600 mt-1 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-200">
                              {inq.details}
                            </p>
                          )}
                        </div>

                        {inq.answer && (
                          <div className="p-3 bg-emerald-50 rounded-xl border-s-4 border-emerald-850 text-xs border border-emerald-100">
                            <strong className="text-emerald-950 block mb-1 font-bold">الجواب المعتمد الصادر:</strong>
                            <p className="font-serif text-sm text-gray-800">{inq.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal to edit inquiry answer */}
              {selectedInquiry && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 border-2 border-gold-500 shadow-2xl text-gray-800">
                    <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                      <h4 className="font-bold text-base font-serif text-emerald-950">
                        الرد على الاستفتاء ({selectedInquiry.code})
                      </h4>
                      <button onClick={() => setSelectedInquiry(null)} className="text-gray-400 hover:text-gray-600">
                        <i className="fa-solid fa-xmark text-lg"></i>
                      </button>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-gray-500">عنوان السؤال:</span>
                      <p className="font-bold text-sm text-gray-900">{selectedInquiry.title}</p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">مرحلة حالة السؤال</label>
                      <select
                        value={inquiryStatusStep}
                        onChange={(e) => setInquiryStatusStep(Number(e.target.value) as 1 | 2 | 3)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white text-sm font-bold text-gray-800"
                      >
                        <option value={1}>1. تم استلام السؤال وجاري الفرز</option>
                        <option value={2}>2. قيد الدراسة والعرض على لجنة الفتوى</option>
                        <option value={3}>3. تمت الإجابة واعتماد الفتوى</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">وصف الحالة المختصر للمستفتي</label>
                      <input
                        type="text"
                        value={inquiryStatusText}
                        onChange={(e) => setInquiryStatusText(e.target.value)}
                        placeholder="تمت الإجابة واعتماد الفتوى..."
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white text-xs text-gray-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        نص الجواب والفتوى الصادرة (يظهر للمستفتي عند الاستعلام برقم المتابعة)
                      </label>
                      <textarea
                        rows={6}
                        value={inquiryAnswerText}
                        onChange={(e) => setInquiryAnswerText(e.target.value)}
                        placeholder="الحمد لله والصلاة والسلام على رسول الله... الجواب هو..."
                        className="w-full p-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white font-serif text-sm leading-relaxed text-gray-800"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setSelectedInquiry(null)}
                        className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold border border-gray-200"
                      >
                        إلغاء
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveInquiryAnswer}
                        className="px-6 py-2 rounded-xl bg-emerald-850 hover:bg-emerald-900 text-white text-xs font-bold shadow"
                      >
                        حفظ الفتوى وتحديث الحالة
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ================= TAB 6: ADMINS & SECURITY ================= */}
          {activeTab === 'admins' && (
            <div className="space-y-6">
              
              {/* Primary Admin Settings (Name, Email & PIN Code) */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gold-500/20 text-gold-600 flex items-center justify-center text-lg border border-gold-400/40">
                    <i className="fa-solid fa-crown"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-gray-900 font-serif">
                      بيانات المدير الرئيسي ({primaryAdminName})
                    </h3>
                    <p className="text-xs text-gray-500">
                      يمكنك تغيير اسم المدير، البريد الإلكتروني، ورمز الدخول الخاص به في أي وقت
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Change Name */}
                  <form onSubmit={handleSavePrimaryName} className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
                    <label className="block text-xs font-bold text-gray-700">
                      <i className="fa-solid fa-user ml-1 text-emerald-850"></i> اسم المدير الرئيسي
                    </label>
                    <input
                      type="text"
                      required
                      value={newPrimaryNameInput}
                      onChange={(e) => setNewPrimaryNameInput(e.target.value)}
                      placeholder="حمزة عمر"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none text-sm font-bold text-gray-900"
                    />
                    <button
                      type="submit"
                      className="w-full py-2 bg-emerald-850 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs transition shadow border border-gold-500/40"
                    >
                      تحديث اسم المدير
                    </button>
                  </form>

                  {/* Change Email */}
                  <form onSubmit={handleSavePrimaryAdmin} className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
                    <label className="block text-xs font-bold text-gray-700">
                      <i className="fa-solid fa-envelope ml-1 text-emerald-850"></i> البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      dir="ltr"
                      required
                      value={newPrimaryInput}
                      onChange={(e) => setNewPrimaryInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none font-mono text-sm font-bold text-gray-900"
                    />
                    <button
                      type="submit"
                      className="w-full py-2 bg-emerald-850 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs transition shadow border border-gold-500/40"
                    >
                      تحديث البريد
                    </button>
                  </form>

                  {/* Change Code / PIN */}
                  <form onSubmit={handleSavePrimaryCode} className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="block text-xs font-bold text-gray-700">
                        <i className="fa-solid fa-key ml-1 text-gold-500"></i> رمز الدخول (PIN)
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowPrimaryCode(!showPrimaryCode)}
                        className="text-xs text-gray-500 hover:text-emerald-700 font-medium"
                      >
                        {showPrimaryCode ? 'إخفاء' : 'إظهار الرمز'}
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPrimaryCode ? 'text' : 'password'}
                        dir="ltr"
                        required
                        value={newPrimaryCodeInput}
                        onChange={(e) => setNewPrimaryCodeInput(e.target.value)}
                        placeholder="3823721122"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none font-mono text-sm font-bold text-gray-900"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 bg-gold-600 hover:bg-gold-700 text-emerald-950 font-bold rounded-xl text-xs transition shadow"
                    >
                      تحديث رمز الدخول
                    </button>
                  </form>
                </div>
              </div>

              {/* Add Unlimited Admins */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-850 border border-emerald-100 flex items-center justify-center text-lg">
                    <i className="fa-solid fa-user-plus text-emerald-850"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-gray-900 font-serif">
                      إضافة مدراء ومسؤولين آخرين (غير محدود)
                    </h3>
                    <p className="text-xs text-gray-500">
                      يطلب إدخال الاسم، البريد الإلكتروني، ورمز الدخول الخاص بكل مدير جديد
                    </p>
                  </div>
                </div>

                <form onSubmit={handleAddAdmin} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      اسم المدير الكامل:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: الشيخ أحمد محمود"
                      value={newAdminName}
                      onChange={(e) => setNewAdminName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none text-xs text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      البريد الإلكتروني:
                    </label>
                    <input
                      type="email"
                      dir="ltr"
                      required
                      placeholder="admin@example.com"
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none font-mono text-xs text-gray-900"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-bold text-gray-700">
                        رمز الدخول (PIN):
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowNewAdminCode(!showNewAdminCode)}
                        className="text-[11px] text-gray-500 hover:text-emerald-700"
                      >
                        {showNewAdminCode ? 'إخفاء' : 'إظهار'}
                      </button>
                    </div>
                    <input
                      type={showNewAdminCode ? 'text' : 'password'}
                      dir="ltr"
                      required
                      placeholder="أدخل رمز الدخول"
                      value={newAdminCode}
                      onChange={(e) => setNewAdminCode(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none font-mono text-xs text-gray-900"
                    />
                  </div>

                  <div className="md:col-span-3 pt-2">
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-emerald-850 hover:bg-emerald-900 text-white font-bold rounded-xl text-sm transition shadow-md border border-gold-500/40 flex items-center justify-center gap-2"
                    >
                      <i className="fa-solid fa-user-plus text-gold-400"></i>
                      إضافة المدير الجديد وحفظ البيانات
                    </button>
                  </div>
                </form>

                {/* List of current authorized admins */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-gray-700 font-serif">
                    المدراء المصرح لهم حالياً:
                  </h4>
                  <div className="space-y-2">
                    {/* Primary */}
                    <div className="p-3.5 rounded-xl bg-white border-2 border-gold-500 flex flex-col sm:flex-row justify-between sm:items-center gap-2 shadow-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gold-500/20 text-gold-600 flex items-center justify-center text-sm border border-gold-400/40">
                          <i className="fa-solid fa-crown"></i>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-gray-900 font-serif">المدير العام: {primaryAdminName}</span>
                            <span className="text-[10px] bg-gold-500 text-emerald-950 font-bold px-2 py-0.5 rounded-full">
                              المدير الرئيسي
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5 font-mono">
                            <span>{primaryAdminEmail}</span>
                            <span>•</span>
                            <span>الرمز: {primaryAdminCode}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Admins */}
                    {adminAccounts.length === 0 ? (
                      <div className="p-4 rounded-xl bg-white border border-dashed border-gray-300 text-center text-xs text-gray-500">
                        لا يوجد مدراء إضافيون مضافون حالياً. يمكنك إضافة أي عدد تريده من النموذج أعلاه.
                      </div>
                    ) : (
                      adminAccounts.map((admin) => (
                        <div
                          key={admin.email}
                          className="p-3.5 rounded-xl bg-white border border-gray-200 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-2 hover:border-emerald-750 transition"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-850 flex items-center justify-center text-sm border border-emerald-100">
                              <i className="fa-solid fa-user-shield"></i>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-gray-900 font-serif">{admin.name}</span>
                                <span className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-medium border border-gray-200">
                                  مدير معتمد
                                </span>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5 font-mono">
                                <span>{admin.email}</span>
                                <span>•</span>
                                <span>الرمز: {admin.code}</span>
                                {admin.addedAt && (
                                  <>
                                    <span>•</span>
                                    <span className="font-sans text-[11px]">{admin.addedAt}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`هل أنت متأكد من إزالة صلاحيات المدير: ${admin.name} (${admin.email})؟`)) {
                                onRemoveAdminAccount(admin.email);
                              }
                            }}
                            className="self-end sm:self-center px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 text-xs rounded-lg transition font-bold border border-red-200"
                          >
                            <i className="fa-solid fa-trash ml-1"></i> إزالة الصلاحية
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ================= TAB 7: BACKUP & DATA RESTORE ================= */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                <h3 className="font-bold text-base text-gray-900 flex items-center gap-2 font-serif">
                  <i className="fa-solid fa-cloud-arrow-down text-emerald-850"></i>
                  <span>تصدير واستيراد بيانات الموقع بالكامل</span>
                </h3>
                <p className="text-xs text-gray-500">
                  يمكنك حفظ نسخة احتياطية من كل الفتاوى، البحوث، الأقسام الفقهية، والإعدادات، واستعادتها في أي وقت.
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <button
                    onClick={onExportData}
                    className="px-6 py-3 bg-emerald-850 hover:bg-emerald-900 text-white font-bold rounded-xl text-sm transition shadow-md flex items-center gap-2 border border-gold-500/40"
                  >
                    <i className="fa-solid fa-download text-gold-400"></i>
                    <span>تصدير نسخة احتياطية (JSON)</span>
                  </button>

                  <label className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-sm transition shadow-md flex items-center gap-2 cursor-pointer">
                    <i className="fa-solid fa-upload"></i>
                    <span>استيراد واستعادة نسخة احتياطية</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={onImportData}
                      className="hidden"
                    />
                  </label>

                  <button
                    onClick={onResetDefaults}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition shadow-md flex items-center gap-2"
                  >
                    <i className="fa-solid fa-rotate-left"></i>
                    <span>إعادة ضبط المصنع (البيانات الافتراضية)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
