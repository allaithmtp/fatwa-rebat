import React, { useState, useEffect } from 'react';
import {
  Fatwa,
  Category,
  ResearchStudy,
  TrackingItem,
  SiteSettings,
  Language,
  AdminAccount,
} from './types';
import {
  initialCategories,
  initialFatwas,
  initialResearch,
  initialTrackingItems,
  defaultSiteSettings,
  uiTranslations,
} from './data/initialData';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminPanel } from './components/AdminPanel';
import { AddEditFatwaModal } from './components/AddEditFatwaModal';
import { AddEditResearchModal } from './components/AddEditResearchModal';

function getFatwaContent(fatwa: Fatwa, lang: Language) {
  if (lang === 'en' && fatwa.en) return fatwa.en;
  if (lang === 'id' && fatwa.idLang) return fatwa.idLang;
  return fatwa.ar;
}

function getResearchContent(res: ResearchStudy, lang: Language) {
  if (lang === 'en' && res.en) return res.en;
  if (lang === 'id' && res.idLang) return res.idLang;
  return res.ar;
}

export default function App() {
  // 1. Language State (persisted)
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    return (localStorage.getItem('ribat_language') as Language) || 'ar';
  });

  // 2. Settings State (persisted)
  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('ribat_site_settings');
    return saved ? JSON.parse(saved) : defaultSiteSettings;
  });

  // 3. Categories State (persisted)
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('ribat_categories');
    return saved ? JSON.parse(saved) : initialCategories;
  });

  // 4. Fatwas State (persisted)
  const [fatwas, setFatwas] = useState<Fatwa[]>(() => {
    const saved = localStorage.getItem('ribat_fatwas');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((f: any, idx: number) => ({
            ...f,
            id: typeof f.id === 'number' ? f.id : (typeof f.id === 'object' && f.id ? (Number(f.id.id || f.id.value) || 1040 + idx) : (Number(f.id) || 1040 + idx))
          }));
        }
      } catch (e) {
        return initialFatwas;
      }
    }
    return initialFatwas;
  });

  // 5. Research Studies State (persisted)
  const [researches, setResearches] = useState<ResearchStudy[]>(() => {
    const saved = localStorage.getItem('ribat_research');
    return saved ? JSON.parse(saved) : initialResearch;
  });

  // 6. Tracking Inquiries State (persisted)
  const [trackingInquiries, setTrackingInquiries] = useState<TrackingItem[]>(() => {
    const saved = localStorage.getItem('ribat_tracking_inquiries');
    return saved ? JSON.parse(saved) : initialTrackingItems;
  });

  // 7. Bookmarks State (persisted)
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>(() => {
    const saved = localStorage.getItem('ribat_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  // 8. Admin Security & Authentication State (persisted)
  const [primaryAdminName, setPrimaryAdminName] = useState<string>(() => {
    return localStorage.getItem('ribat_primary_admin_name') || 'حمزة عمر';
  });

  const [primaryAdminEmail, setPrimaryAdminEmail] = useState<string>(() => {
    return localStorage.getItem('ribat_primary_admin') || 'allaithmtp@gmail.com';
  });

  const [primaryAdminCode, setPrimaryAdminCode] = useState<string>(() => {
    return localStorage.getItem('ribat_primary_admin_code') || '3823721122';
  });

  const [adminAccounts, setAdminAccounts] = useState<AdminAccount[]>(() => {
    const saved = localStorage.getItem('ribat_admin_accounts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [currentAdminEmail, setCurrentAdminEmail] = useState<string | null>(() => {
    return localStorage.getItem('ribat_current_logged_admin') || null;
  });

  // UI States
  const [currentCategory, setCurrentCategory] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'number'>('newest');
  const [fontSizeStep, setFontSizeStep] = useState<number>(0);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('ribat_theme') === 'dark';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastVisible, setToastVisible] = useState<boolean>(false);

  // Modals
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState<boolean>(false);
  const [isAddEditFatwaOpen, setIsAddEditFatwaOpen] = useState<boolean>(false);
  const [fatwaToEdit, setFatwaToEdit] = useState<Fatwa | null>(null);
  const [isAddEditResearchOpen, setIsAddEditResearchOpen] = useState<boolean>(false);
  const [researchToEdit, setResearchToEdit] = useState<ResearchStudy | null>(null);
  const [isChoiceModalOpen, setIsChoiceModalOpen] = useState<boolean>(false);
  const [isBookmarksModalOpen, setIsBookmarksModalOpen] = useState<boolean>(false);
  const [selectedResearchForModal, setSelectedResearchForModal] = useState<ResearchStudy | null>(null);

  // Ask Fatwa Form State
  const [qName, setQName] = useState('');
  const [qCategory, setQCategory] = useState('المعاملات المالية والتجارة');
  const [qContact, setQContact] = useState('');
  const [qPriority, setQPriority] = useState('عادي');
  const [qTitle, setQTitle] = useState('');
  const [qDetails, setQDetails] = useState('');
  const [qPrivate, setQPrivate] = useState(false);
  const [lastSubmittedCode, setLastSubmittedCode] = useState<string | null>(null);
  const [formSubmittedSuccess, setFormSubmittedSuccess] = useState<boolean>(false);

  // Tracking Search Input
  const [trackInputCode, setTrackInputCode] = useState<string>('');
  const [trackedItemResult, setTrackedItemResult] = useState<TrackingItem | null | 'NOT_FOUND'>(null);

  // ----------------------------------------------------
  // Sync Styles & HTML attributes
  // ----------------------------------------------------
  useEffect(() => {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('ribat_language', currentLang);
  }, [currentLang]);

  // Site is permanently set to clean light theme
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark');
    localStorage.setItem('ribat_theme', 'light');
  }, []);

  useEffect(() => {
    if (settings.primaryColor) {
      document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
    }
    if (settings.goldColor) {
      document.documentElement.style.setProperty('--gold-color', settings.goldColor);
    }
  }, [settings.primaryColor, settings.goldColor]);

  // Persist State to LocalStorage
  useEffect(() => {
    localStorage.setItem('ribat_site_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('ribat_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('ribat_fatwas', JSON.stringify(fatwas));
  }, [fatwas]);

  useEffect(() => {
    localStorage.setItem('ribat_research', JSON.stringify(researches));
  }, [researches]);

  useEffect(() => {
    localStorage.setItem('ribat_tracking_inquiries', JSON.stringify(trackingInquiries));
  }, [trackingInquiries]);

  useEffect(() => {
    localStorage.setItem('ribat_bookmarks', JSON.stringify(bookmarkedIds));
  }, [bookmarkedIds]);

  useEffect(() => {
    localStorage.setItem('ribat_primary_admin_name', primaryAdminName);
  }, [primaryAdminName]);

  useEffect(() => {
    localStorage.setItem('ribat_primary_admin', primaryAdminEmail);
  }, [primaryAdminEmail]);

  useEffect(() => {
    localStorage.setItem('ribat_primary_admin_code', primaryAdminCode);
  }, [primaryAdminCode]);

  useEffect(() => {
    localStorage.setItem('ribat_admin_accounts', JSON.stringify(adminAccounts));
  }, [adminAccounts]);

  useEffect(() => {
    if (currentAdminEmail) {
      localStorage.setItem('ribat_current_logged_admin', currentAdminEmail);
    } else {
      localStorage.removeItem('ribat_current_logged_admin');
    }
  }, [currentAdminEmail]);

  // ----------------------------------------------------
  // Helpers
  // ----------------------------------------------------
  const t = uiTranslations[currentLang] || uiTranslations.ar;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3200);
  };

  const toggleLanguage = (lang: Language) => {
    setCurrentLang(lang);
    showToast(uiTranslations[lang]?.langChangedMsg || 'Language changed');
  };

  const handleAdjustFontSize = (delta: number) => {
    const newStep = Math.max(-1, Math.min(3, fontSizeStep + delta));
    setFontSizeStep(newStep);
    const baseRem = 1.2 + newStep * 0.15;
    const lineRem = 2.1 + newStep * 0.25;
    document.documentElement.style.setProperty('--fatwa-font-size', `${baseRem}rem`);
    document.documentElement.style.setProperty('--fatwa-line-height', `${lineRem}rem`);
    showToast(delta > 0 ? 'تم تكبير خط قراءة الفتاوى' : 'تم تصغير خط قراءة الفتاوى');
  };

  const toggleBookmark = (id: number) => {
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter((item) => item !== id));
      showToast('تمت إزالة الفتوى من المفضلة');
    } else {
      setBookmarkedIds([...bookmarkedIds, id]);
      showToast('تم حفظ الفتوى في المفضلة بنجاح');
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast(label);
    } else {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      showToast(label);
    }
  };

  const printFatwa = (fatwa: Fatwa) => {
    const loc = getFatwaContent(fatwa, currentLang);
    const printArea = document.getElementById('print-area');
    if (printArea) {
      printArea.innerHTML = `
        <div style="font-family: Tajawal, serif; padding: 20px; line-height: 1.8; direction: ${t.dir}; text-align: ${t.dir === 'rtl' ? 'right' : 'left'}">
          <div style="text-align: center; border-bottom: 2px solid #D4AF37; padding-bottom: 15px; margin-bottom: 20px;">
            <h2 style="color: #0B4619; margin: 0 0 5px 0;">${settings.brandTitle}</h2>
            <h4 style="color: #666; margin: 0;">${settings.brandSubtitle}</h4>
            <p style="font-size: 12px; color: #888; margin-top: 5px;">فتوى رقم #${fatwa.id} - ${fatwa.category}</p>
          </div>
          <h3 style="color: #0B4619;">${loc.title}</h3>
          <p><strong>تاريخ الصدور:</strong> ${loc.date || ''}</p>
          <p><strong>المستفتي:</strong> ${loc.questioner || ''}</p>
          <hr style="border: 0; border-top: 1px dashed #ccc; margin: 15px 0;" />
          <h4 style="color: #0B4619;">نص السؤال:</h4>
          <p style="background: #f9f9f9; padding: 12px; border-radius: 8px;">${loc.question || ''}</p>
          <h4 style="color: #0B4619;">الجواب الصادر عن الدائرة:</h4>
          <div style="font-family: Amiri, serif; font-size: 16px; white-space: pre-line;">${loc.answer || ''}</div>
          ${
            loc.references && loc.references.length > 0
              ? `
            <h4 style="color: #0B4619; margin-top: 20px;">المراجع المعتمدة:</h4>
            <ul>${loc.references.map((r: string) => `<li>${r}</li>`).join('')}</ul>
          `
              : ''
          }
          <div style="margin-top: 30px; text-align: center; font-size: 11px; color: #777; border-top: 1px solid #eee; padding-top: 10px;">
            ${settings.footerCopyright}
          </div>
        </div>
      `;
      window.print();
    }
  };

  const shareFatwaOnWhatsapp = (fatwa: Fatwa) => {
    const loc = getFatwaContent(fatwa, currentLang);
    const text = `*${loc.title}* (فتوى رقم #${fatwa.id})\n` +
      `قسم: ${fatwa.category}\n\n` +
      `*السؤال:* ${loc.question}\n\n` +
      `*الجواب:* ${loc.answer}\n\n` +
      `صادر عن: دائرة الفتاوى والبحوث - رباط المصطفى بالشحر للدراسات الإسلامية`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // ----------------------------------------------------
  // Electronic Istiftaa Submission with WhatsApp & Email Dispatch
  // ----------------------------------------------------
  const handleAskFatwaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qTitle.trim() || !qDetails.trim()) {
      alert('يرجى كتابة عنوان السؤال ونص الاستفتاء');
      return;
    }

    const randomNum = Math.floor(200 + Math.random() * 799);
    const trackingCode = `RM-${randomNum}`;
    const nameToUse = qName.trim() || 'مستفتي';

    const newInquiry: TrackingItem = {
      code: trackingCode,
      category: qCategory,
      name: nameToUse,
      contact: qContact.trim(),
      priority: qPriority,
      title: qTitle.trim(),
      details: qDetails.trim(),
      date: currentLang === 'ar' ? 'الآن (اليوم)' : currentLang === 'en' ? 'Today' : 'Hari ini',
      statusStep: 1,
      statusText:
        currentLang === 'ar'
          ? 'تم استلام السؤال وجاري فرزه لعرضه على لجنة الإفتاء برباط المصطفى'
          : currentLang === 'en'
          ? 'Question received and being reviewed by the Fatwa Committee'
          : 'Pertanyaan telah diterima dan sedang diproses oleh Komisi Fatwa',
      answer: null,
    };

    setTrackingInquiries([newInquiry, ...trackingInquiries]);
    setLastSubmittedCode(trackingCode);
    setFormSubmittedSuccess(true);

    // Prepare message for WhatsApp & Email
    const formattedMsg =
      `*استفتاء شرعي جديد - ${settings.brandTitle}*\n` +
      `*رباط المصطفى بالشحر للدراسات الإسلامية*\n` +
      `--------------------------------\n` +
      `📌 *رقم المتابعة:* ${trackingCode}\n` +
      `👤 *اسم المستفتي:* ${nameToUse}\n` +
      `📂 *الباب الفقهي:* ${qCategory}\n` +
      `⚡ *درجة الأهمية:* ${qPriority}\n` +
      `📞 *بيانات التواصل:* ${qContact.trim() || 'غير محدد'}\n` +
      `🔒 *الخصوصية:* ${qPrivate ? 'سؤال خاص (عدم نشر الاسم)' : 'عام'}\n\n` +
      `📝 *عنوان السؤال:* ${qTitle.trim()}\n\n` +
      `❓ *نص الاستفتاء بالتفصيل:*\n${qDetails.trim()}`;

    // Auto-dispatch / link to WhatsApp if configured
    const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');
    if (cleanPhone) {
      const waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(formattedMsg)}`;
      window.open(waUrl, '_blank');
    }

    showToast(`تم استلام السؤال بنجاح ورقم متابعتك: ${trackingCode}`);
  };

  const handleManualSendViaWhatsapp = () => {
    if (!lastSubmittedCode) return;
    const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const inq = trackingInquiries.find((i) => i.code === lastSubmittedCode);
    if (!inq) return;

    const formattedMsg =
      `*استفتاء شرعي جديد - ${settings.brandTitle}*\n` +
      `--------------------------------\n` +
      `📌 *رقم المتابعة:* ${inq.code}\n` +
      `👤 *المستفتي:* ${inq.name || 'مستفتي'}\n` +
      `📂 *الباب الفقهي:* ${inq.category}\n` +
      `⚡ *الأهمية:* ${inq.priority || 'عادي'}\n` +
      `📞 *التواصل:* ${inq.contact || 'غير محدد'}\n\n` +
      `📝 *العنوان:* ${inq.title}\n\n` +
      `❓ *نص السؤال:*\n${inq.details || ''}`;

    const waUrl = cleanPhone
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(formattedMsg)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(formattedMsg)}`;
    window.open(waUrl, '_blank');
  };

  const handleManualSendViaEmail = () => {
    if (!lastSubmittedCode) return;
    const inq = trackingInquiries.find((i) => i.code === lastSubmittedCode);
    if (!inq) return;

    const subject = `استفتاء شرعي جديد (${inq.code}): ${inq.title}`;
    const body =
      `استفتاء شرعي عبر موقع دائرة الفتاوى والبحوث - رباط المصطفى بالشحر\n\n` +
      `رقم المتابعة: ${inq.code}\n` +
      `المستفتي: ${inq.name}\n` +
      `الباب الفقهي: ${inq.category}\n` +
      `الأهمية: ${inq.priority}\n` +
      `التواصل: ${inq.contact}\n\n` +
      `عنوان السؤال: ${inq.title}\n\n` +
      `نص السؤال بالتفصيل:\n${inq.details}\n`;

    const mailtoUrl = `mailto:${settings.istiftaaEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');
  };

  const handleResetAskForm = () => {
    setQName('');
    setQContact('');
    setQTitle('');
    setQDetails('');
    setQPrivate(false);
    setFormSubmittedSuccess(false);
  };

  // ----------------------------------------------------
  // Tracking Search
  // ----------------------------------------------------
  const handleCheckTracking = (codeToCheck?: string) => {
    const code = (codeToCheck || trackInputCode).trim().toUpperCase();
    if (!code) {
      showToast(t.trackInputPlaceholder);
      return;
    }
    const found = trackingInquiries.find((item) => item.code.toUpperCase() === code);
    if (found) {
      setTrackedItemResult(found);
    } else {
      setTrackedItemResult('NOT_FOUND');
    }
  };

  // ----------------------------------------------------
  // Filtering & Sorting Fatwas
  // ----------------------------------------------------
  const filteredFatwas = fatwas.filter((fatwa) => {
    const loc = getFatwaContent(fatwa, currentLang);
    const matchesCategory = currentCategory === 'الكل' || fatwa.category === currentCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      fatwa.id.toString().includes(q) ||
      loc.title.toLowerCase().includes(q) ||
      (loc.question && loc.question.toLowerCase().includes(q)) ||
      (loc.answer && loc.answer.toLowerCase().includes(q)) ||
      fatwa.category.toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  const sortedFatwas = [...filteredFatwas].sort((a, b) => {
    if (sortBy === 'popular') return (b.views || 0) - (a.views || 0);
    if (sortBy === 'number') return b.id - a.id;
    return b.id - a.id; // newest by ID
  });

  // Current hijri date string
  const currentHijriDate = () => {
    try {
      const now = new Date();
      const localeMap: Record<string, string> = {
        ar: 'ar-SA-u-ca-islamic',
        en: 'en-US-u-ca-islamic',
        id: 'id-ID-u-ca-islamic',
      };
      return new Intl.DateTimeFormat(localeMap[currentLang] || 'ar-SA-u-ca-islamic', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(now);
    } catch {
      return settings.brandSubtitle;
    }
  };

  // Check if admin is currently authenticated
  const isAdminLoggedIn = Boolean(currentAdminEmail);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans islamic-pattern-light">
      
      {/* ================= ADMIN TOP NOTIFICATION BAR (WHEN LOGGED IN) ================= */}
      {isAdminLoggedIn && (
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-850 to-emerald-950 text-white text-xs py-2 px-3 sm:px-6 border-b-2 border-gold-500 shadow-md flex flex-wrap justify-between items-center gap-2 no-print z-50">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></span>
            <span className="font-bold text-gold-400">وضع الإشراف والتحكم الكامل مفعّل:</span>
            <span className="font-bold text-white bg-emerald-950 px-2.5 py-0.5 rounded-md border border-emerald-700/60 flex items-center gap-1.5">
              <i className="fa-solid fa-user-shield text-gold-400 text-xs"></i>
              <span>المدير: {currentAdminEmail === primaryAdminEmail ? primaryAdminName : (adminAccounts.find((a) => a.email === currentAdminEmail)?.name || currentAdminEmail)}</span>
            </span>
            <span className="font-mono text-xs text-gray-300">({currentAdminEmail})</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAdminPanelOpen(true)}
              className="bg-gold-500 hover:bg-gold-400 text-emerald-950 font-bold px-3 py-1 rounded-lg text-xs flex items-center gap-1.5 transition shadow"
            >
              <i className="fa-solid fa-sliders"></i>
              <span>فتح لوحة التحكم والإدارة</span>
            </button>

            <button
              onClick={() => setIsChoiceModalOpen(true)}
              className="bg-emerald-750 hover:bg-emerald-700 text-white font-bold px-3 py-1 rounded-lg text-xs flex items-center gap-1.5 transition border border-emerald-600"
            >
              <i className="fa-solid fa-plus text-gold-400"></i>
              <span>إضافة فتوى أو بحث</span>
            </button>

            <button
              onClick={() => {
                setCurrentAdminEmail(null);
                showToast('تم تسجيل الخروج من لوحة الإدارة');
              }}
              className="bg-red-800/80 hover:bg-red-700 text-white px-2.5 py-1 rounded-lg text-xs transition"
              title="خروج"
            >
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
            </button>
          </div>
        </div>
      )}

      {/* ================= TOP INFO BAR ================= */}
      <div className="bg-emerald-950 text-gray-200 text-xs sm:text-sm py-2 px-2 sm:px-4 border-b border-emerald-800/60 no-print">
        <div className="w-full max-w-[1600px] mx-auto px-1 sm:px-4 lg:px-8 flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-4 space-x-reverse">
            <span className="flex items-center gap-1.5 text-gold-400 font-medium">
              <i className="fa-solid fa-mosque"></i>
              <span>{settings.topBarTitle}</span>
            </span>
            <span className="hidden md:inline text-gray-500">|</span>
            <span className="hidden md:inline text-gray-300 font-serif">
              {currentHijriDate()}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Desktop Language Switcher */}
            <div className="hidden lg:flex items-center bg-emerald-900/80 rounded-lg px-2.5 py-0.5 border border-emerald-700/50 gap-1.5">
              <i className="fa-solid fa-globe text-gold-400 text-xs"></i>
              <select
                value={currentLang}
                onChange={(e) => toggleLanguage(e.target.value as Language)}
                className="bg-transparent text-gray-200 text-xs font-bold focus:outline-none cursor-pointer py-0.5"
                aria-label="Language selector"
              >
                <option value="ar" className="bg-emerald-950 text-white">العربية</option>
                <option value="en" className="bg-emerald-950 text-white">English</option>
                <option value="id" className="bg-emerald-950 text-white">Indonesia</option>
              </select>
            </div>

            {/* Font Size Adjusters */}
            <div className="flex items-center bg-emerald-900/80 rounded-lg px-2 py-0.5 border border-emerald-700/50" title="حجم خط الفتاوى">
              <button
                onClick={() => handleAdjustFontSize(1)}
                className="px-1.5 hover:text-gold-400 text-gray-200 transition font-bold"
                aria-label="تكبير الخط"
              >
                A+
              </button>
              <span className="text-gray-500 mx-1">|</span>
              <button
                onClick={() => handleAdjustFontSize(-1)}
                className="px-1.5 hover:text-gold-400 text-gray-200 transition text-xs font-bold"
                aria-label="تصغير الخط"
              >
                A-
              </button>
            </div>

            {/* Saved Bookmarks */}
            <button
              onClick={() => setIsBookmarksModalOpen(true)}
              className="flex items-center gap-1.5 bg-emerald-900/80 hover:bg-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-700/50 text-white transition"
            >
              <i className="fa-solid fa-bookmark text-gold-400"></i>
              <span>{t.savedBtn}</span>
              <span className="bg-gold-500 text-emerald-950 text-xs font-bold px-1.5 rounded-full">
                {bookmarkedIds.length}
              </span>
            </button>

            {/* Mobile Language Switcher */}
            <div className="flex lg:hidden items-center bg-emerald-900/80 rounded-lg px-2 py-1 border border-emerald-700/50 gap-1">
              <i className="fa-solid fa-globe text-gold-400 text-xs"></i>
              <select
                value={currentLang}
                onChange={(e) => toggleLanguage(e.target.value as Language)}
                className="bg-transparent text-gray-200 text-xs font-bold focus:outline-none cursor-pointer"
                aria-label="Mobile Language selector"
              >
                <option value="ar" className="bg-emerald-950 text-white">العربية</option>
                <option value="en" className="bg-emerald-950 text-white">English</option>
                <option value="id" className="bg-emerald-950 text-white">Indonesia</option>
              </select>
            </div>


            {/* Admin Login / Panel Button */}
            {!isAdminLoggedIn ? (
              <button
                onClick={() => setIsAdminLoginOpen(true)}
                className="flex items-center gap-1 bg-gold-500 hover:bg-gold-400 text-emerald-950 px-2.5 py-1 rounded-lg text-xs font-bold transition shadow-xs"
              >
                <i className="fa-solid fa-user-lock"></i>
                <span className="hidden sm:inline">{t.adminLoginBtn}</span>
              </button>
            ) : (
              <button
                onClick={() => setIsAdminPanelOpen(true)}
                className="flex items-center gap-1 bg-gold-500 hover:bg-gold-400 text-emerald-950 px-2.5 py-1 rounded-lg text-xs font-bold transition shadow-xs"
              >
                <i className="fa-solid fa-sliders"></i>
                <span className="hidden sm:inline">لوحة التحكم</span>
              </button>
            )}

          </div>
        </div>
      </div>

      {/* ================= MAIN HEADER & NAVIGATION ================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-md border-b border-gray-200 no-print">
        <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 gap-2">
            
            {/* Branding Logo */}
            <a href="#" className="flex items-center gap-2.5 sm:gap-3.5 group min-w-0">
              <div className="w-10 h-10 sm:w-14 sm:h-14 shrink-0 rounded-2xl islamic-pattern flex items-center justify-center shadow-lg border-2 border-gold-500/70 group-hover:scale-105 transition-transform overflow-hidden">
                {settings.logoImage ? (
                  <img
                    src={settings.logoImage}
                    alt={settings.brandTitle}
                    className="w-full h-full object-contain p-1 rounded-xl"
                  />
                ) : (
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gold-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L9.5 6.5C7 9 6 11.5 6 14H18C18 11.5 17 9 14.5 6.5L12 2ZM4 16V20H20V16H4ZM2 22H22V24H2V22Z"/>
                  </svg>
                )}
              </div>
              <div className="truncate">
                <h1 className="text-base sm:text-2xl font-extrabold text-emerald-850 font-serif tracking-wide truncate">
                  {settings.brandTitle}
                </h1>
                <p className="text-[10px] sm:text-sm text-gray-600 font-medium truncate">
                  {settings.brandSubtitle}
                </p>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 font-medium text-sm xl:text-base">
              <a href="#hero" className="px-3 py-2 rounded-lg text-emerald-850 font-bold bg-emerald-50">
                {t.navHome}
              </a>
              <a href="#fatwas-section" className="px-3 py-2 rounded-lg text-gray-700 hover:text-emerald-850 hover:bg-gray-100 transition">
                {t.navBrowse}
              </a>
              <a href="#categories-section" className="px-3 py-2 rounded-lg text-gray-700 hover:text-emerald-850 hover:bg-gray-100 transition">
                {t.navCategories}
              </a>
              <a href="#ask-section" className="px-3 py-2 rounded-lg text-gray-700 hover:text-emerald-850 hover:bg-gray-100 transition">
                {t.navAsk}
              </a>
              <a href="#track-section" className="px-3 py-2 rounded-lg text-gray-700 hover:text-emerald-850 hover:bg-gray-100 transition">
                {t.navTrack}
              </a>
              <a href="#research-section" className="px-3 py-2 rounded-lg text-gray-700 hover:text-emerald-850 hover:bg-gray-100 transition">
                {t.navResearch}
              </a>
              <a href="#about-section" className="px-3 py-2 rounded-lg text-gray-700 hover:text-emerald-850 hover:bg-gray-100 transition">
                {t.navAbout}
              </a>
            </nav>

            {/* Prominent Action Button & Mobile Menu Trigger */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              
              {/* If Admin logged in: Prominent Add Fatwa/Research button */}
              {isAdminLoggedIn && (
                <button
                  onClick={() => setIsChoiceModalOpen(true)}
                  className="inline-flex bg-gold-500 hover:bg-gold-400 text-emerald-950 px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm shadow-md transition items-center gap-1.5"
                >
                  <i className="fa-solid fa-plus text-xs"></i>
                  <span>إضافة فتوى أو بحث</span>
                </button>
              )}

              <a
                href="#ask-section"
                className="hidden md:inline-flex bg-emerald-850 hover:bg-emerald-900 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg border border-gold-500/40 items-center gap-2 whitespace-nowrap transition transform active:scale-95"
              >
                <i className="fa-solid fa-pen-nib text-gold-400 text-sm"></i>
                <span>{t.headerAskBtn || 'ضع سؤالك هنا'}</span>
              </a>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100 focus:outline-none"
                aria-label="القائمة"
              >
                <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-lg sm:text-xl`}></i>
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 px-4 pt-3 pb-5 space-y-2 shadow-xl">
            <a
              href="#hero"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-850 font-bold"
            >
              {t.navHome}
            </a>
            <a
              href="#fatwas-section"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100"
            >
              {t.navBrowseMobile}
            </a>
            <a
              href="#categories-section"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100"
            >
              {t.navCategories}
            </a>
            <a
              href="#ask-section"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100 font-bold text-emerald-800"
            >
              {t.navAskMobile}
            </a>
            <a
              href="#track-section"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100"
            >
              {t.navTrackMobile}
            </a>
            <a
              href="#research-section"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100"
            >
              {t.navResearchMobile}
            </a>
            <a
              href="#about-section"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100"
            >
              {t.navAboutMobile}
            </a>
            {isAdminLoggedIn ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsAdminPanelOpen(true);
                }}
                className="w-full text-start px-4 py-2.5 rounded-xl bg-gold-500 text-emerald-950 font-bold shadow-xs"
              >
                <i className="fa-solid fa-sliders mx-1"></i>
                لوحة تحكم الموقع
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsAdminLoginOpen(true);
                }}
                className="w-full text-start px-4 py-2.5 rounded-xl bg-gray-100 text-gray-800 font-bold"
              >
                <i className="fa-solid fa-user-shield mx-1"></i>
                تسجيل دخول الإدارة
              </button>
            )}
          </div>
        )}
      </header>

      {/* ================= HERO SECTION ================= */}
      <section id="hero" className="islamic-pattern text-white relative overflow-hidden py-12 sm:py-16 lg:py-20 border-b-4 border-gold-500 no-print">
        {/* Decorative Glowing Orbs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gold-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Right Column: Welcome & Live Search */}
            <div className="lg:col-span-7 text-center lg:text-start space-y-6">
              <div className="inline-flex items-center gap-2 bg-emerald-950/70 border border-gold-500/40 px-4 py-1.5 rounded-full text-gold-400 text-sm font-serif shadow-xs">
                <i className="fa-solid fa-star-and-crescent text-xs text-gold-400"></i>
                <span>{settings.heroAyah}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif leading-tight text-white">
                <span>{settings.heroMainTitle}</span>
                <span className="block text-gold-400 text-2xl sm:text-3xl mt-3 font-normal font-serif">
                  {settings.heroSubTitle}
                </span>
              </h2>

              <p className="text-gray-200 text-base sm:text-lg max-w-4xl mx-auto lg:mx-0 leading-relaxed font-light">
                {settings.heroDesc}
              </p>

              {/* Mobile Only: Ask Button */}
              <div className="md:hidden flex justify-center gap-2">
                <a
                  href="#ask-section"
                  className="inline-flex bg-white hover:bg-gray-50 text-emerald-850 px-5 py-2.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg border border-emerald-300 items-center justify-center gap-2 whitespace-nowrap transition transform active:scale-95"
                >
                  <i className="fa-solid fa-pen-nib text-emerald-850 text-sm"></i>
                  <span>{t.headerAskBtn || 'ضع سؤالك هنا'}</span>
                </a>
                {isAdminLoggedIn && (
                  <button
                    onClick={() => setIsChoiceModalOpen(true)}
                    className="inline-flex bg-gold-500 text-emerald-950 px-4 py-2.5 rounded-xl font-bold text-sm shadow-md"
                  >
                    + فتوى/بحث
                  </button>
                )}
              </div>

              {/* Instant Search Box */}
              <div className="bg-white p-2 rounded-2xl shadow-2xl max-w-4xl mx-auto lg:mx-0 border-2 border-gold-500/50">
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <div className="relative w-full flex-1">
                    <i className="fa-solid fa-magnifying-glass absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t.heroSearchPlaceholder}
                      className="w-full pr-12 pl-4 py-3.5 rounded-xl bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm sm:text-base font-normal"
                    />
                  </div>
                  <a
                    href="#fatwas-section"
                    className="w-full sm:w-auto bg-emerald-850 hover:bg-emerald-900 text-white font-bold px-7 py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-md"
                  >
                    <span>{t.searchBtn}</span>
                    <i className="fa-solid fa-arrow-left text-xs text-gold-400"></i>
                  </a>
                </div>
              </div>

              {/* Quick Popular Searches */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs sm:text-sm text-gray-300">
                <span className="text-gold-400 font-medium flex items-center">
                  <i className="fa-solid fa-fire-flame-curved mx-1 text-gold-400"></i>
                  <span>{t.popularSearches}</span>
                </span>
                <button
                  onClick={() => setSearchQuery('زكاة')}
                  className="bg-emerald-950/60 hover:bg-emerald-800 px-3 py-1 rounded-full border border-emerald-700 transition"
                >
                  {t.tagZakat}
                </button>
                <button
                  onClick={() => setSearchQuery('طلاق')}
                  className="bg-emerald-950/60 hover:bg-emerald-800 px-3 py-1 rounded-full border border-emerald-700 transition"
                >
                  {t.tagDivorce}
                </button>
                <button
                  onClick={() => setSearchQuery('تجارة')}
                  className="bg-emerald-950/60 hover:bg-emerald-800 px-3 py-1 rounded-full border border-emerald-700 transition"
                >
                  {t.tagEcommerce}
                </button>
                <button
                  onClick={() => setSearchQuery('جمع')}
                  className="bg-emerald-950/60 hover:bg-emerald-800 px-3 py-1 rounded-full border border-emerald-700 transition"
                >
                  {t.tagPrayer}
                </button>
              </div>

            </div>

            {/* Left Column: Call-to-action card */}
            <div className="lg:col-span-5">
              <div className="bg-white text-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl border-t-4 border-gold-500 relative">
                <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-850 flex items-center justify-center text-xl shadow-inner shrink-0">
                      <i className="fa-solid fa-comments"></i>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg sm:text-xl text-emerald-950 font-serif">
                        {t.ctaCardTitle}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {t.ctaCardSub}
                      </p>
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0">
                    <span className="w-2 h-2 rounded-full bg-green-600 animate-ping"></span>
                    <span>{t.ctaOnline}</span>
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                    <ul className="text-xs sm:text-sm space-y-2 text-gray-600">
                      <li className="flex items-center gap-2">
                        <i className="fa-solid fa-circle-check text-emerald-700"></i>
                        <span>{t.ctaPoint1}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <i className="fa-solid fa-circle-check text-emerald-700"></i>
                        <span>{t.ctaPoint2}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <i className="fa-solid fa-circle-check text-emerald-700"></i>
                        <span>{t.ctaPoint3}</span>
                      </li>
                    </ul>
                  </div>

                  <a
                    href="#ask-section"
                    className="w-full py-4 px-6 bg-emerald-850 hover:bg-emerald-900 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-3 text-base sm:text-lg border border-gold-500/40"
                  >
                    <i className="fa-solid fa-paper-plane text-gold-400"></i>
                    <span>{t.ctaSubmitBtn}</span>
                  </a>

                  {/* Quick Track Mini Bar */}
                  <div className="pt-3 border-t border-gray-200">
                    <label className="block text-xs font-bold text-gray-500 mb-2">
                      {t.ctaTrackLabel}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder={t.ctaTrackPlaceholder}
                        onChange={(e) => setTrackInputCode(e.target.value)}
                        value={trackInputCode}
                        className="flex-1 px-3.5 py-2 rounded-xl bg-gray-100 text-sm border border-gray-300 focus:outline-none focus:border-emerald-700 text-gray-800"
                      />
                      <a
                        href="#track-section"
                        onClick={() => handleCheckTracking()}
                        className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-xl text-sm font-bold transition flex items-center justify-center"
                      >
                        {t.ctaTrackBtn}
                      </a>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= STATISTICS BAR ================= */}
      <section className="py-6 bg-white shadow-sm border-b border-gray-200 no-print">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-x divide-x-reverse divide-gray-200">
            <div className="p-2">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-850 font-serif">
                {settings.stat1Val}
              </div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1">
                {settings.stat1Label}
              </div>
            </div>
            <div className="p-2">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-850 font-serif">
                {categories.length - 1}
              </div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1">
                {settings.stat2Label}
              </div>
            </div>
            <div className="p-2">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-850 font-serif">
                {settings.stat3Val}
              </div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1">
                {settings.stat3Label}
              </div>
            </div>
            <div className="p-2">
              <div className="text-2xl sm:text-3xl font-extrabold text-gold-600 font-serif">
                {settings.stat4Val}
              </div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1">
                {settings.stat4Label}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CATEGORIES SECTION (الأقسام الفقهية) ================= */}
      <section id="categories-section" className="py-12 w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 no-print">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <span className="text-emerald-850 font-bold text-sm tracking-wider uppercase bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
            {t.catBadge}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-3 font-serif">
            {t.catTitle}
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mt-2">
            {t.catSubtitle}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.map((cat) => {
            const count = cat.id === 'الكل'
              ? fatwas.length
              : fatwas.filter((f) => f.category === cat.id).length;
            const isActive = currentCategory === cat.id;
            const activeClasses = isActive
              ? 'bg-emerald-850 text-white border-gold-500 shadow-md ring-2 ring-gold-500/30 scale-[1.02]'
              : 'bg-white hover:bg-emerald-50/50 text-gray-700 border-gray-200 shadow-sm';

            return (
              <button
                key={cat.id}
                onClick={() => setCurrentCategory(cat.id)}
                className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col items-center text-center justify-center gap-2 group ${activeClasses}`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                    isActive
                      ? 'bg-white/15 text-gold-400'
                      : 'bg-emerald-50 text-emerald-850 group-hover:scale-110 transition-transform'
                  }`}
                >
                  <i className={`fa-solid ${cat.icon}`}></i>
                </div>
                <span className="font-bold text-xs sm:text-sm line-clamp-1">
                  {cat.name[currentLang] || cat.name.ar}
                </span>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-gold-500 text-emerald-950 font-bold'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {count} {t.fatwaUnit}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ================= MAIN FATWAS DISPLAY SECTION ================= */}
      <section id="fatwas-section" className="py-6 pb-16 w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 no-print">
        
        {/* Filter & Sort Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-10 h-10 rounded-xl bg-emerald-850 text-gold-400 flex items-center justify-center shrink-0">
              <i className="fa-solid fa-scale-balanced"></i>
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">
                {currentCategory === 'الكل'
                  ? t.allPublishedFatwas
                  : `${t.categoryPrefix}${
                      categories.find((c) => c.id === currentCategory)?.name[currentLang] || currentCategory
                    }`}
              </h3>
              <p className="text-xs text-gray-500">
                {t.totalResultsPrefix} {sortedFatwas.length} {t.fatwaUnit}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full md:w-auto">
            {/* Local Search Input */}
            <div className="relative flex-1 sm:w-64">
              <i className="fa-solid fa-search absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.filterSearchPlaceholder}
                className="w-full pr-9 pl-3 py-2 bg-gray-100 rounded-xl text-sm border border-gray-200 focus:outline-none focus:border-emerald-700 text-gray-800"
              />
            </div>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'popular' | 'number')}
              className="bg-gray-100 text-gray-700 text-sm rounded-xl px-3.5 py-2 border border-gray-200 focus:outline-none focus:border-emerald-700"
            >
              <option value="newest">{t.sortNewest}</option>
              <option value="popular">{t.sortPopular}</option>
              <option value="number">{t.sortNumber}</option>
            </select>

            {/* Quick Add Button if Admin */}
            {isAdminLoggedIn && (
              <button
                onClick={() => {
                  setFatwaToEdit(null);
                  setIsAddEditFatwaOpen(true);
                }}
                className="bg-emerald-850 hover:bg-emerald-900 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow"
              >
                <i className="fa-solid fa-plus text-gold-400"></i>
                <span className="hidden sm:inline">فتوى جديدة</span>
              </button>
            )}
          </div>
        </div>

        {/* Fatwas Cards List */}
        {sortedFatwas.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-850 flex items-center justify-center text-2xl mx-auto">
              <i className="fa-solid fa-magnifying-glass"></i>
            </div>
            <h4 className="font-bold text-xl text-gray-800 font-serif">
              {t.noResultsTitle}
            </h4>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              {t.noResultsDesc}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setCurrentCategory('الكل');
              }}
              className="px-6 py-2.5 bg-emerald-850 text-white rounded-xl text-sm font-bold shadow hover:bg-emerald-900 transition"
            >
              {t.showAllFatwasBtn}
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {sortedFatwas.map((fatwa, index) => {
              const loc = getFatwaContent(fatwa, currentLang);
              const isSaved = bookmarkedIds.includes(fatwa.id);
              const safeId = typeof fatwa.id === 'number'
                ? fatwa.id
                : typeof fatwa.id === 'string' && !isNaN(Number(fatwa.id))
                ? Number(fatwa.id)
                : typeof fatwa.id === 'object' && fatwa.id !== null
                ? Number((fatwa.id as any).id || (fatwa.id as any).value || 1042 + index)
                : 1042 + index;

              return (
                <article
                  key={safeId}
                  id={`fatwa-card-${safeId}`}
                  className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-shadow border border-gray-200 overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="bg-gray-100 px-5 sm:px-8 py-3.5 border-b border-gray-200 flex flex-wrap justify-between items-center gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-emerald-850 text-gold-400 text-xs font-bold px-3 py-1 rounded-lg font-mono">
                        {t.fatwaNumPrefix || 'فتوى رقم #'}{safeId}
                      </span>
                      <span className="bg-white text-emerald-850 text-xs font-bold px-3 py-1 rounded-lg border border-gray-200">
                        <i className="fa-solid fa-tag mx-1 text-gold-500"></i>
                        {fatwa.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>
                        <i className="fa-regular fa-calendar mx-1"></i>
                        {loc.date || fatwa.ar.date}
                      </span>
                      <span>
                        <i className="fa-regular fa-eye mx-1"></i>
                        {fatwa.views} {t.viewsUnit}
                      </span>

                      {/* Admin Quick Action Buttons */}
                      {isAdminLoggedIn && (
                        <div className="flex items-center gap-1.5 ms-2 border-s border-gray-300 ps-2">
                          <button
                            onClick={() => {
                              setFatwaToEdit(fatwa);
                              setIsAddEditFatwaOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-850 hover:bg-emerald-100 text-xs font-bold"
                            title="تعديل الفتوى"
                          >
                            <i className="fa-solid fa-pen"></i>
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`هل أنت متأكد من حذف الفتوى #${safeId}؟`)) {
                                setFatwas(fatwas.filter((f) => f.id !== fatwa.id));
                                showToast(`تم حذف الفتوى #${safeId}`);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold"
                            title="حذف الفتوى"
                          >
                            <i className="fa-solid fa-trash-can"></i>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 sm:p-8 space-y-6">
                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 font-serif leading-snug">
                      {loc.title}
                    </h3>

                    {/* Questioner box */}
                    <div className="bg-gray-50 rounded-2xl p-5 border-s-4 border-emerald-850 relative">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <span className="inline-flex items-center gap-1.5 text-sm font-extrabold text-emerald-850">
                          <i className="fa-solid fa-circle-question"></i>
                          <span>{t.questionLabel}</span>
                        </span>
                        <span className="text-xs text-gray-500">
                          {t.questionerPrefix}{loc.questioner || fatwa.ar.questioner}
                        </span>
                      </div>
                      <p className="text-gray-700 font-serif fatwa-content-text leading-relaxed">
                        {loc.question || fatwa.ar.question}
                      </p>
                    </div>

                    {/* Answer section */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-2 text-emerald-850 font-extrabold text-base border-b border-gray-100 pb-2">
                        <i className="fa-solid fa-feather-pointed text-gold-500"></i>
                        <span>{t.answerLabel}</span>
                      </div>

                      <div className="text-gray-800 font-serif fatwa-content-text leading-loose text-justify px-1 whitespace-pre-line">
                        {loc.answer || fatwa.ar.answer}
                      </div>
                    </div>

                    {/* References */}
                    {loc.references && loc.references.length > 0 && (
                      <div className="bg-emerald-50/60 rounded-2xl p-4 sm:p-5 border border-emerald-200/80 space-y-2">
                        <div className="flex items-center justify-between font-bold text-sm text-emerald-950">
                          <span className="flex items-center gap-2">
                            <i className="fa-solid fa-book-open-reader text-emerald-800"></i>
                            <span>{t.referencesLabel} ({loc.references.length})</span>
                          </span>
                        </div>
                        <ul className="mt-3 pt-3 border-t border-emerald-200/60 space-y-1.5 text-xs sm:text-sm text-gray-700 list-disc list-inside">
                          {loc.references.map((ref: string, idx: number) => (
                            <li key={idx} className="leading-relaxed">{ref}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Card Footer Actions */}
                  <div className="bg-gray-50 px-5 sm:px-8 py-3.5 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs text-gray-500 flex items-center gap-1.5">
                      <i className="fa-solid fa-stamp text-emerald-800"></i>
                      <span>{t.issuedByFooter}</span>
                    </span>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Copy */}
                      <button
                        onClick={() => copyToClipboard(`${loc.title}\n\n${loc.answer}`, 'تم نسخ الفتوى إلى الحافظة')}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-gray-700 border border-gray-200 text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <i className="fa-regular fa-copy text-emerald-700"></i>
                        <span>{t.copyBtn}</span>
                      </button>

                      {/* WhatsApp Share */}
                      <button
                        onClick={() => shareFatwaOnWhatsapp(fatwa)}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-green-50 text-gray-700 border border-gray-200 text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <i className="fa-brands fa-whatsapp text-green-600 text-sm"></i>
                        <span>{t.whatsappBtn}</span>
                      </button>

                      {/* Print */}
                      <button
                        onClick={() => printFatwa(fatwa)}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-gray-700 border border-gray-200 text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <i className="fa-solid fa-print text-gray-600"></i>
                        <span>{t.printBtn}</span>
                      </button>

                      {/* Bookmark Save */}
                      <button
                        onClick={() => toggleBookmark(fatwa.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                          isSaved
                            ? 'bg-gold-500 text-emerald-950 border-gold-500'
                            : 'bg-white hover:bg-emerald-50 text-gray-700 border border-gray-200'
                        }`}
                      >
                        <i className={`fa-${isSaved ? 'solid' : 'regular'} fa-bookmark ${isSaved ? 'text-emerald-950' : 'text-gold-600'}`}></i>
                        <span>{isSaved ? t.savedStateBtn : t.saveBtn}</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* ================= ELECTRONIC ISTIFTAA SECTION ================= */}
      <section id="ask-section" className="py-16 bg-gray-100 border-y border-gray-200 no-print">
        <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-14">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
            
            {/* Header Banner */}
            <div className="islamic-pattern p-6 sm:p-10 text-white border-b-4 border-gold-500">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="inline-block bg-gold-500 text-emerald-950 font-bold text-xs px-3 py-1 rounded-full mb-2">
                    {t.askBadge}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold font-serif">{t.askTitle}</h2>
                  <p className="text-gray-200 text-sm sm:text-base mt-1">
                    {t.askDesc}
                  </p>
                </div>
                <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-gold-400/40 items-center justify-center text-3xl text-gold-400 shrink-0">
                  <i className="fa-solid fa-file-signature"></i>
                </div>
              </div>
            </div>

            {/* Form & Success State */}
            {formSubmittedSuccess ? (
              <div className="p-8 sm:p-12 text-center space-y-6">
                <div className="w-16 h-16 bg-emerald-850 text-gold-400 rounded-full flex items-center justify-center text-2xl mx-auto shadow-lg">
                  <i className="fa-solid fa-check"></i>
                </div>
                <h3 className="text-2xl font-bold text-emerald-950 font-serif">
                  {t.successTitle}
                </h3>
                <p className="text-sm text-gray-600 max-w-lg mx-auto">
                  {t.successDesc}
                </p>

                {/* Tracking Code Box */}
                <div className="inline-flex items-center gap-3 bg-gray-50 px-6 py-3 rounded-2xl border-2 border-dashed border-emerald-700 shadow-sm">
                  <span className="text-xs text-gray-500">{t.trackingCodeLabel}</span>
                  <strong className="text-2xl font-mono text-emerald-850 tracking-wider">
                    {lastSubmittedCode}
                  </strong>
                  <button
                    type="button"
                    onClick={() => lastSubmittedCode && copyToClipboard(lastSubmittedCode, 'تم نسخ رقم المتابعة')}
                    className="text-gray-500 hover:text-emerald-700 p-1"
                    title="نسخ الرقم"
                  >
                    <i className="fa-regular fa-copy"></i>
                  </button>
                </div>

                {/* Instant Send to WhatsApp & Email Buttons */}
                <div className="p-5 bg-emerald-50/70 rounded-2xl border border-emerald-200 max-w-xl mx-auto space-y-3">
                  <p className="text-xs font-bold text-emerald-900">
                    يمكنك إرسال تفاصيل سؤالك مباشرة الآن إلى واتساب أو إيميل دائرة الفتاوى:
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleManualSendViaWhatsapp}
                      className="px-5 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm shadow transition flex items-center justify-center gap-2"
                    >
                      <i className="fa-brands fa-whatsapp text-lg"></i>
                      <span>{t.sendViaWhatsappBtn}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleManualSendViaEmail}
                      className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow transition flex items-center justify-center gap-2"
                    >
                      <i className="fa-regular fa-envelope text-lg"></i>
                      <span>{t.sendViaEmailBtn}</span>
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap justify-center gap-3">
                  <a
                    href="#track-section"
                    onClick={() => {
                      if (lastSubmittedCode) {
                        setTrackInputCode(lastSubmittedCode);
                        handleCheckTracking(lastSubmittedCode);
                      }
                    }}
                    className="bg-emerald-850 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-900 transition"
                  >
                    {t.viewStatusNowBtn}
                  </a>
                  <button
                    type="button"
                    onClick={handleResetAskForm}
                    className="bg-gray-200 text-gray-800 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-300 transition"
                  >
                    {t.askAnotherBtn}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAskFatwaSubmit} className="p-6 sm:p-10 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      <span>{t.formNameLabel}</span>{' '}
                      <span className="text-xs font-normal text-gray-500">{t.formNameHint}</span>
                    </label>
                    <div className="relative">
                      <i className="fa-regular fa-user absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"></i>
                      <input
                        type="text"
                        value={qName}
                        onChange={(e) => setQName(e.target.value)}
                        placeholder={t.formNamePlaceholder}
                        className="w-full pr-10 pl-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white text-sm text-gray-800"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      <span>{t.formCatLabel}</span> <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <i className="fa-solid fa-folder-open absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"></i>
                      <select
                        value={qCategory}
                        onChange={(e) => setQCategory(e.target.value)}
                        required
                        className="w-full pr-10 pl-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white text-sm text-gray-800"
                      >
                        {categories.filter((c) => c.id !== 'الكل').map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name[currentLang] || cat.name.ar}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Contact */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      <span>{t.formContactLabel}</span>{' '}
                      <span className="text-xs font-normal text-gray-500">{t.formContactHint}</span>
                    </label>
                    <div className="relative">
                      <i className="fa-brands fa-whatsapp absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-600 text-lg"></i>
                      <input
                        type="text"
                        value={qContact}
                        onChange={(e) => setQContact(e.target.value)}
                        placeholder={t.formContactPlaceholder}
                        className="w-full pr-10 pl-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white text-sm text-gray-800"
                      />
                    </div>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      {t.formPriorityLabel}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition ${
                        qPriority === 'عادي'
                          ? 'border-emerald-700 bg-emerald-50 font-bold text-emerald-900'
                          : 'border-gray-300 bg-gray-50 text-gray-700'
                      }`}>
                        <input
                          type="radio"
                          name="q-priority"
                          value="عادي"
                          checked={qPriority === 'عادي'}
                          onChange={() => setQPriority('عادي')}
                          className="accent-emerald-850"
                        />
                        <span className="text-sm">{t.formPriorityNormal}</span>
                      </label>
                      <label className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition ${
                        qPriority === 'مستعجل'
                          ? 'border-amber-600 bg-amber-50 font-bold text-amber-800'
                          : 'border-gray-300 bg-gray-50 text-gray-700'
                      }`}>
                        <input
                          type="radio"
                          name="q-priority"
                          value="مستعجل"
                          checked={qPriority === 'مستعجل'}
                          onChange={() => setQPriority('مستعجل')}
                          className="accent-amber-600"
                        />
                        <span className="text-sm">{t.formPriorityUrgent}</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <span>{t.formTitleLabel}</span> <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={qTitle}
                    onChange={(e) => setQTitle(e.target.value)}
                    placeholder={t.formTitlePlaceholder}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white text-sm text-gray-800"
                  />
                </div>

                {/* Details */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <span>{t.formDetailsLabel}</span> <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={qDetails}
                    onChange={(e) => setQDetails(e.target.value)}
                    placeholder={t.formDetailsPlaceholder}
                    className="w-full p-4 rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white text-sm leading-relaxed text-gray-800"
                  />
                  <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                    <i className="fa-solid fa-circle-info text-emerald-700"></i>
                    <span>{t.formDetailsNote}</span>
                  </p>
                </div>

                {/* Privacy & Submit */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-gray-200">
                  <label className="flex items-center gap-2.5 text-sm text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={qPrivate}
                      onChange={(e) => setQPrivate(e.target.checked)}
                      className="w-4 h-4 rounded accent-emerald-850"
                    />
                    <span>{t.formPrivacyCheck}</span>
                  </label>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-4 bg-emerald-850 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-3 border border-gold-500/40"
                  >
                    <i className="fa-solid fa-paper-plane text-gold-400"></i>
                    <span>{t.formSubmitBtn}</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      </section>

      {/* ================= TRACK QUESTION SECTION ================= */}
      <section id="track-section" className="py-14 w-full max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-14 no-print">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-gray-200">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-850 flex items-center justify-center text-xl mx-auto mb-3 border border-emerald-200">
              <i className="fa-solid fa-magnifying-glass-chart"></i>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-gray-900">
              {t.trackTitle}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {t.trackSubtitle}
            </p>
          </div>

          {/* Search Bar for Tracking */}
          <div className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3 mb-4">
            <input
              type="text"
              value={trackInputCode}
              onChange={(e) => setTrackInputCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCheckTracking()}
              placeholder={t.trackInputPlaceholder}
              className="flex-1 px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-center sm:text-start font-mono text-base font-bold text-gray-800"
            />
            <button
              onClick={() => handleCheckTracking()}
              className="bg-emerald-850 hover:bg-emerald-900 text-white font-bold px-8 py-3.5 rounded-xl transition shadow-md flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-radar text-gold-400"></i>
              <span>{t.trackCheckBtn}</span>
            </button>
          </div>

          {/* Demo Codes Hint */}
          <div className="text-center text-xs text-gray-500 mb-6">
            <span>{t.trackDemoHint}</span>
            <button
              onClick={() => {
                setTrackInputCode('RM-105');
                handleCheckTracking('RM-105');
              }}
              className="underline hover:text-emerald-700 mx-1 font-mono font-bold"
            >
              RM-105 ({t.trackStep2})
            </button>
            <span> | </span>
            <button
              onClick={() => {
                setTrackInputCode('RM-108');
                handleCheckTracking('RM-108');
              }}
              className="underline hover:text-emerald-700 mx-1 font-mono font-bold"
            >
              RM-108 ({t.trackStep3})
            </button>
          </div>

          {/* Tracking Result Display */}
          {trackedItemResult === 'NOT_FOUND' && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="bg-red-50 border border-red-300 rounded-2xl p-5 text-center space-y-2">
                <i className="fa-solid fa-circle-exclamation text-red-600 text-2xl"></i>
                <h4 className="font-bold text-red-900">
                  {t.trackNotFoundTitle} ({trackInputCode})
                </h4>
                <p className="text-xs text-gray-600">
                  {t.trackNotFoundDesc}
                </p>
              </div>
            </div>
          )}

          {trackedItemResult && trackedItemResult !== 'NOT_FOUND' && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 space-y-6">
                <div className="flex flex-wrap justify-between items-center gap-2 border-b border-gray-200 pb-4">
                  <div>
                    <span className="text-xs font-mono bg-emerald-850 text-gold-400 px-2.5 py-1 rounded-lg font-bold">
                      {trackedItemResult.code}
                    </span>
                    <h4 className="font-bold text-lg text-gray-900 mt-2 font-serif">
                      {trackedItemResult.title}
                    </h4>
                  </div>
                  <div className="text-end text-xs text-gray-500">
                    <div>{trackedItemResult.category}</div>
                    <div className="mt-1">{trackedItemResult.date}</div>
                  </div>
                </div>

                {/* Progress Steps */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div
                    className={`p-3 rounded-xl border ${
                      trackedItemResult.statusStep >= 1
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-bold'
                        : 'bg-gray-100 opacity-50'
                    }`}
                  >
                    <i className="fa-solid fa-check-circle text-lg mb-1"></i>
                    <div className="text-xs">{t.trackStep1}</div>
                  </div>

                  <div
                    className={`p-3 rounded-xl border ${
                      trackedItemResult.statusStep >= 2
                        ? 'bg-amber-50 border-amber-500 text-amber-900 font-bold'
                        : 'bg-gray-100 opacity-50'
                    }`}
                  >
                    <i className="fa-solid fa-magnifying-glass text-lg mb-1"></i>
                    <div className="text-xs">{t.trackStep2}</div>
                  </div>

                  <div
                    className={`p-3 rounded-xl border ${
                      trackedItemResult.statusStep >= 3
                        ? 'bg-green-100 border-green-600 text-green-900 font-bold'
                        : 'bg-gray-100 opacity-50'
                    }`}
                  >
                    <i className="fa-solid fa-stamp text-lg mb-1"></i>
                    <div className="text-xs">{t.trackStep3}</div>
                  </div>
                </div>

                {/* Current Status Box */}
                <div className="text-sm bg-white p-4 rounded-xl border border-gray-200">
                  <span className="font-bold text-emerald-850">
                    {t.trackCurrentStatus}
                  </span>
                  <span>{trackedItemResult.statusText}</span>
                </div>

                {/* Issued Answer if exists */}
                {trackedItemResult.answer && (
                  <div className="bg-emerald-50/70 p-5 rounded-2xl border-s-4 border-emerald-800 space-y-2">
                    <div className="font-bold text-emerald-900 text-sm">
                      {t.trackIssuedAnswer}
                    </div>
                    <p className="font-serif text-base leading-relaxed text-gray-800">
                      {trackedItemResult.answer}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick List of submitted tracking inquiries */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="font-bold text-sm text-gray-700 mb-3 flex items-center gap-2">
              <i className="fa-solid fa-clock-rotate-left text-emerald-700"></i>
              <span>{t.trackBrowserHistory}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {trackingInquiries.map((q) => (
                <div
                  key={q.code}
                  onClick={() => {
                    setTrackInputCode(q.code);
                    handleCheckTracking(q.code);
                  }}
                  className="p-3.5 rounded-xl bg-gray-50 hover:bg-emerald-50 border border-gray-200 cursor-pointer transition flex justify-between items-center"
                >
                  <div className="truncate pe-2">
                    <span className="text-xs font-mono font-bold text-emerald-850">
                      {q.code}
                    </span>
                    <p className="text-xs font-bold text-gray-800 truncate mt-0.5">
                      {q.title}
                    </p>
                  </div>
                  <span className={`text-[11px] px-2.5 py-1 rounded-full shrink-0 font-bold ${
                    q.statusStep === 3
                      ? 'bg-green-100 text-green-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {q.statusStep === 3 ? 'تمت الإجابة' : t.trackUnderReviewBadge}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ================= RESEARCH & STUDIES SECTION ================= */}
      <section id="research-section" className="py-14 bg-gray-100 border-t border-gray-200 no-print">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
            <div>
              <span className="text-emerald-850 font-bold text-xs tracking-wider uppercase bg-emerald-100 px-3 py-1 rounded-full">
                {t.resBadge}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2 font-serif">
                {t.resTitle}
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                {t.resSubtitle}
              </p>
            </div>

            {isAdminLoggedIn && (
              <button
                onClick={() => {
                  setResearchToEdit(null);
                  setIsAddEditResearchOpen(true);
                }}
                className="bg-emerald-850 hover:bg-emerald-900 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow flex items-center gap-2 border border-gold-500/40"
              >
                <i className="fa-solid fa-plus text-gold-400"></i>
                <span>إضافة بحث جديد</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {researches.map((res) => {
              const rLoc = getResearchContent(res, currentLang);
              return (
                <div
                  key={res.id}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 flex flex-col justify-between hover:shadow-md transition space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-emerald-850 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        {rLoc.badge || res.ar.badge}
                      </span>
                      <span className="text-gray-500 font-mono">
                        <i className="fa-regular fa-file-pdf mx-1"></i>
                        {rLoc.pages || res.ar.pages}
                      </span>
                    </div>

                    <h3 className="font-bold text-lg font-serif text-gray-900 line-clamp-2">
                      {rLoc.title || res.ar.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-3">
                      {rLoc.desc || res.ar.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {rLoc.author || res.ar.author}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {isAdminLoggedIn && (
                        <>
                          <button
                            onClick={() => {
                              setResearchToEdit(res);
                              setIsAddEditResearchOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-850 hover:bg-emerald-100 text-xs font-bold"
                            title="تعديل البحث"
                          >
                            <i className="fa-solid fa-pen"></i>
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`هل أنت متأكد من حذف هذا البحث؟`)) {
                                setResearches(researches.filter((item) => item.id !== res.id));
                                showToast('تم حذف البحث');
                              }
                            }}
                            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold"
                            title="حذف البحث"
                          >
                            <i className="fa-solid fa-trash-can"></i>
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => setSelectedResearchForModal(res)}
                        className="text-xs font-bold text-emerald-850 hover:underline flex items-center gap-1"
                      >
                        <span>{t.readSummaryBtn}</span>
                        <i className="fa-solid fa-arrow-left text-[10px]"></i>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ================= ABOUT SECTION ================= */}
      <section id="about-section" className="py-14 w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 no-print">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-md border border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <span className="text-emerald-850 font-bold text-xs px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                {t.aboutBadge}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-gray-900">
                {settings.aboutTitle}
              </h2>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                {settings.aboutDesc}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                  <h4 className="font-bold text-emerald-850 mb-1 flex items-center gap-2">
                    <i className="fa-solid fa-book-quran"></i>
                    <span>{settings.aboutBox1Title}</span>
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {settings.aboutBox1Desc}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                  <h4 className="font-bold text-emerald-850 mb-1 flex items-center gap-2">
                    <i className="fa-solid fa-users-gear"></i>
                    <span>{settings.aboutBox2Title}</span>
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {settings.aboutBox2Desc}
                  </p>
                </div>
              </div>
            </div>

            {/* Timings & Direct Contact Card */}
            <div className="lg:col-span-5 islamic-pattern text-white rounded-2xl p-6 sm:p-8 border-2 border-gold-500/70 shadow-lg space-y-5">
              <h3 className="text-xl font-bold font-serif text-white flex items-center gap-2">
                <i className="fa-regular fa-clock text-gold-400"></i>
                <span>{settings.aboutHoursTitle}</span>
              </h3>
              <ul className="space-y-3 text-sm text-gray-200">
                <li className="flex justify-between pb-2 border-b border-emerald-800">
                  <span>{settings.aboutHours1Label}</span>
                  <span className="font-bold text-gold-400">{settings.aboutHours1Val}</span>
                </li>
                <li className="flex justify-between pb-2 border-b border-emerald-800">
                  <span>{settings.aboutHours2Label}</span>
                  <span className="font-bold">{settings.aboutHours2Val}</span>
                </li>
                <li className="flex justify-between pb-2 border-b border-emerald-800">
                  <span>{settings.aboutHours3Label}</span>
                  <span className="font-bold">{settings.aboutHours3Val}</span>
                </li>
              </ul>
              <div className="pt-2 space-y-2 text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-location-dot text-gold-400 w-4"></i>
                  <span>{settings.aboutLocation}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="islamic-pattern text-gray-300 pt-12 pb-8 border-t-4 border-gold-500 no-print">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-emerald-800">
            
            {/* Col 1: Brand */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-950 border border-gold-500 flex items-center justify-center text-gold-400 overflow-hidden p-1 shadow-sm">
                  {settings.logoImage ? (
                    <img
                      src={settings.logoImage}
                      alt={settings.brandTitle}
                      className="w-full h-full object-contain rounded-lg"
                    />
                  ) : (
                    <i className={`fa-solid ${settings.logoIcon || 'fa-mosque'} text-lg`}></i>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-serif">{settings.brandTitle}</h3>
                  <p className="text-xs text-gold-400 font-semibold">{settings.brandSubtitle}</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-md">
                {settings.footerDesc}
              </p>
            </div>

            {/* Col 2: Quick Links */}
            <div className="md:col-span-4 space-y-2">
              <h4 className="text-white font-bold text-sm mb-3 text-gold-400 font-serif">
                {t.footerQuickLinks}
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                <a href="#fatwas-section" className="hover:text-gold-400 transition">{t.navBrowse}</a>
                <a href="#ask-section" className="hover:text-gold-400 transition">{t.navAsk}</a>
                <a href="#track-section" className="hover:text-gold-400 transition">{t.navTrack}</a>
                <a href="#categories-section" className="hover:text-gold-400 transition">{t.navCategories}</a>
                <a href="#research-section" className="hover:text-gold-400 transition">{t.navResearch}</a>
                <a href="#about-section" className="hover:text-gold-400 transition">{t.navAbout}</a>
              </div>
            </div>

            {/* Col 3: Direct Contact */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-white font-bold text-sm mb-2 text-gold-400 font-serif">
                {settings.footerContactTitle}
              </h4>
              <p className="text-xs text-gray-300">
                {settings.footerContactDesc}
              </p>
              <div className="pt-1 flex flex-col gap-2">
                <a
                  href="#ask-section"
                  className="inline-flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-400 text-emerald-950 font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-xs"
                >
                  <i className="fa-solid fa-pen-to-square"></i>
                  <span>{t.footerAskBtn}</span>
                </a>

                {/* Admin Quick Entry from Footer */}
                <button
                  onClick={() => (isAdminLoggedIn ? setIsAdminPanelOpen(true) : setIsAdminLoginOpen(true))}
                  className="text-xs text-gray-400 hover:text-gold-400 flex items-center gap-1 transition"
                >
                  <i className="fa-solid fa-lock text-[10px]"></i>
                  <span>{isAdminLoggedIn ? 'لوحة تحكم الموقع' : 'بوابة تسجيل دخول الإدارة'}</span>
                </button>
              </div>
            </div>

          </div>

          <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-400">
            <p>{settings.footerCopyright}</p>
            <p className="font-mono">
              Developed by <span className="text-gold-400 font-semibold">Al-Laith M.T.P</span>
            </p>
          </div>
        </div>
      </footer>

      {/* ================= BOOKMARKS MODAL ================= */}
      {isBookmarksModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 no-print">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden">
            <div className="p-5 islamic-pattern text-white flex justify-between items-center border-b-2 border-gold-500">
              <div className="flex items-center gap-2.5">
                <i className="fa-solid fa-bookmark text-gold-400 text-lg"></i>
                <h3 className="font-bold text-lg font-serif">{t.bookmarksModalTitle}</h3>
              </div>
              <button
                onClick={() => setIsBookmarksModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {bookmarkedIds.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {t.noBookmarksText}
                </div>
              ) : (
                fatwas
                  .filter((f) => bookmarkedIds.includes(f.id))
                  .map((bFatwa) => {
                    const bLoc = getFatwaContent(bFatwa, currentLang);
                    return (
                      <div
                        key={bFatwa.id}
                        className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex justify-between items-center gap-3"
                      >
                        <div className="truncate">
                          <span className="font-mono text-xs font-bold text-emerald-850">
                            #{bFatwa.id}
                          </span>
                          <h4 className="font-bold text-sm text-gray-900 truncate">
                            {bLoc.title}
                          </h4>
                          <span className="text-xs text-gray-500">{bFatwa.category}</span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <a
                            href={`#fatwa-card-${bFatwa.id}`}
                            onClick={() => setIsBookmarksModalOpen(false)}
                            className="px-3 py-1.5 bg-emerald-850 text-white rounded-xl text-xs font-bold"
                          >
                            {t.viewBtn}
                          </a>
                          <button
                            onClick={() => toggleBookmark(bFatwa.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg text-xs"
                            title="إزالة"
                          >
                            <i className="fa-solid fa-trash-can"></i>
                          </button>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= RESEARCH SUMMARY MODAL ================= */}
      {selectedResearchForModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 no-print">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden">
            <div className="p-5 islamic-pattern text-white flex justify-between items-center border-b-2 border-gold-500">
              <h3 className="font-bold text-lg font-serif">
                {getResearchContent(selectedResearchForModal, currentLang).title}
              </h3>
              <button
                onClick={() => setSelectedResearchForModal(null)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 text-sm sm:text-base leading-relaxed">
              <div className="flex flex-wrap gap-3 text-xs text-gray-500 pb-3 border-b border-gray-200">
                <span>
                  <i className="fa-solid fa-user-pen mx-1 text-emerald-700"></i>
                  {getResearchContent(selectedResearchForModal, currentLang).author}
                </span>
                <span>
                  <i className="fa-regular fa-file-pdf mx-1 text-emerald-700"></i>
                  {getResearchContent(selectedResearchForModal, currentLang).pages}
                </span>
              </div>
              <div className="font-serif text-lg leading-relaxed text-gray-800 whitespace-pre-line">
                {getResearchContent(selectedResearchForModal, currentLang).summary}
              </div>
              <div className="pt-4 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setSelectedResearchForModal(null)}
                  className="px-5 py-2 bg-emerald-850 text-white rounded-xl text-sm font-bold"
                >
                  {t.closeBtn}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= PROMINENT CHOICE MODAL (ADD FATWA OR RESEARCH) ================= */}
      {isChoiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 border-2 border-gold-500 shadow-2xl">
            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
              <h3 className="font-bold text-lg font-serif text-gray-900">ماذا تود أن تضيف الآن؟</h3>
              <button onClick={() => setIsChoiceModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => {
                  setIsChoiceModalOpen(false);
                  setFatwaToEdit(null);
                  setIsAddEditFatwaOpen(true);
                }}
                className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-700 text-emerald-950 flex items-center gap-3 hover:bg-emerald-100 transition text-start"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-850 text-gold-400 flex items-center justify-center text-xl shrink-0">
                  <i className="fa-solid fa-scale-balanced"></i>
                </div>
                <div>
                  <h4 className="font-bold text-base">إضافة فتوى شرعية جديدة</h4>
                  <p className="text-xs text-gray-600">
                    إدخال السؤال، الجواب المحرر، المراجع المعتمدة، والقسم
                  </p>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsChoiceModalOpen(false);
                  setResearchToEdit(null);
                  setIsAddEditResearchOpen(true);
                }}
                className="p-4 rounded-2xl bg-amber-50 border-2 border-gold-500 text-gray-900 flex items-center gap-3 hover:bg-amber-100 transition text-start"
              >
                <div className="w-12 h-12 rounded-xl bg-gold-500 text-emerald-950 flex items-center justify-center text-xl shrink-0">
                  <i className="fa-solid fa-book-bookmark"></i>
                </div>
                <div>
                  <h4 className="font-bold text-base">إضافة بحث علمي / دراسة فقهية</h4>
                  <p className="text-xs text-gray-600">
                    نشر ملخص بحث، إصداره، عدد الصفحات، واللجنة المعدة
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADMIN LOGIN ================= */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        primaryAdminName={primaryAdminName}
        primaryAdminEmail={primaryAdminEmail}
        primaryAdminCode={primaryAdminCode}
        adminAccounts={adminAccounts}
        onLoginSuccess={(email) => {
          setCurrentAdminEmail(email);
          setIsAdminPanelOpen(true);
          showToast(`مرحباً بك يا مدير الموقع (${email})`);
        }}
      />

      {/* ================= MODAL: ADMIN CONTROL CENTER ================= */}
      <AdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        currentAdminEmail={currentAdminEmail || primaryAdminEmail}
        primaryAdminName={primaryAdminName}
        primaryAdminEmail={primaryAdminEmail}
        primaryAdminCode={primaryAdminCode}
        onChangePrimaryName={(newName) => {
          setPrimaryAdminName(newName);
          showToast(`تم تغيير اسم المدير إلى: ${newName}`);
        }}
        onChangePrimaryAdmin={(newPrimary) => {
          setPrimaryAdminEmail(newPrimary);
          if (currentAdminEmail === primaryAdminEmail) {
            setCurrentAdminEmail(newPrimary);
          }
          showToast(`تم تغيير البريد الإلكتروني للمدير إلى: ${newPrimary}`);
        }}
        onChangePrimaryCode={(newCode) => {
          setPrimaryAdminCode(newCode);
          showToast(`تم تحديث رمز دخول المدير بنجاح`);
        }}
        adminAccounts={adminAccounts}
        onAddAdminAccount={(account) => {
          if (!adminAccounts.some((a) => a.email.toLowerCase() === account.email.toLowerCase())) {
            setAdminAccounts([...adminAccounts, account]);
            showToast(`تمت إضافة المدير: ${account.name}`);
          } else {
            alert('هذا البريد الإلكتروني مسجل بالفعل كمدير مصرح له');
          }
        }}
        onRemoveAdminAccount={(emailToRemove) => {
          setAdminAccounts(adminAccounts.filter((a) => a.email !== emailToRemove));
          showToast(`تمت إزالة المدير: ${emailToRemove}`);
        }}
        settings={settings}
        onUpdateSettings={(newSettings) => {
          setSettings(newSettings);
          showToast('تم حفظ وتحديث إعدادات الموقع');
        }}
        categories={categories}
        onAddCategory={(newCat) => {
          setCategories([...categories, newCat]);
          showToast(`تمت إضافة القسم: ${newCat.name.ar}`);
        }}
        onEditCategory={(updatedCat) => {
          setCategories(categories.map((c) => (c.id === updatedCat.id ? updatedCat : c)));
          showToast(`تم تحديث قسم: ${updatedCat.name.ar}`);
        }}
        onDeleteCategory={(catId) => {
          setCategories(categories.filter((c) => c.id !== catId));
          showToast('تم حذف القسم');
        }}
        fatwas={fatwas}
        onOpenAddFatwa={() => {
          setFatwaToEdit(null);
          setIsAddEditFatwaOpen(true);
        }}
        onOpenEditFatwa={(fatwa) => {
          setFatwaToEdit(fatwa);
          setIsAddEditFatwaOpen(true);
        }}
        onDeleteFatwa={(id) => {
          setFatwas(fatwas.filter((f) => f.id !== id));
          showToast(`تم حذف الفتوى #${id}`);
        }}
        researches={researches}
        onOpenAddResearch={() => {
          setResearchToEdit(null);
          setIsAddEditResearchOpen(true);
        }}
        onOpenEditResearch={(res) => {
          setResearchToEdit(res);
          setIsAddEditResearchOpen(true);
        }}
        onDeleteResearch={(resId) => {
          setResearches(researches.filter((r) => r.id !== resId));
          showToast('تم حذف البحث');
        }}
        trackingInquiries={trackingInquiries}
        onUpdateInquiry={(updated) => {
          setTrackingInquiries(trackingInquiries.map((inq) => (inq.code === updated.code ? updated : inq)));
          showToast(`تم تحديث حالة الاستفتاء #${updated.code}`);
        }}
        onDeleteInquiry={(code) => {
          setTrackingInquiries(trackingInquiries.filter((inq) => inq.code !== code));
          showToast(`تم حذف الاستفتاء #${code}`);
        }}
        onLogout={() => {
          setCurrentAdminEmail(null);
          setIsAdminPanelOpen(false);
          showToast('تم تسجيل الخروج');
        }}
        onExportData={() => {
          const exportObj = {
            settings,
            categories,
            fatwas,
            researches,
            trackingInquiries,
            primaryAdminName,
            primaryAdminEmail,
            primaryAdminCode,
            adminAccounts,
          };
          const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `fatwa_portal_backup_${new Date().toISOString().slice(0, 10)}.json`;
          a.click();
          URL.revokeObjectURL(url);
          showToast('تم تصدير النسخة الاحتياطية بنجاح');
        }}
        onImportData={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (evt) => {
            try {
              const data = JSON.parse(evt.target?.result as string);
              if (data.settings) setSettings(data.settings);
              if (data.categories) setCategories(data.categories);
              if (data.fatwas) setFatwas(data.fatwas);
              if (data.researches) setResearches(data.researches);
              if (data.trackingInquiries) setTrackingInquiries(data.trackingInquiries);
              if (data.primaryAdminName) setPrimaryAdminName(data.primaryAdminName);
              if (data.primaryAdminEmail) setPrimaryAdminEmail(data.primaryAdminEmail);
              if (data.primaryAdminCode) setPrimaryAdminCode(data.primaryAdminCode);
              if (data.adminAccounts) setAdminAccounts(data.adminAccounts);
              showToast('تمت استعادة البيانات بنجاح!');
            } catch {
              alert('الملف غير صالح أو تالف.');
            }
          };
          reader.readAsText(file);
        }}
        onResetDefaults={() => {
          if (window.confirm('هل أنت متأكد من رغبتك في إعادة ضبط الموقع إلى البيانات الافتراضية الأصلية بالكامل؟')) {
            setSettings(defaultSiteSettings);
            setCategories(initialCategories);
            setFatwas(initialFatwas);
            setResearches(initialResearch);
            setTrackingInquiries(initialTrackingItems);
            setPrimaryAdminName('حمزة عمر');
            setPrimaryAdminEmail('allaithmtp@gmail.com');
            setPrimaryAdminCode('3823721122');
            setAdminAccounts([]);
            showToast('تمت إعادة ضبط البيانات إلى الوضع الافتراضي');
          }
        }}
      />

      {/* ================= MODAL: ADD / EDIT FATWA ================= */}
      <AddEditFatwaModal
        isOpen={isAddEditFatwaOpen}
        onClose={() => setIsAddEditFatwaOpen(false)}
        fatwaToEdit={fatwaToEdit}
        categories={categories}
        existingFatwaIds={fatwas.map((f) => f.id)}
        onSave={(newOrUpdatedFatwa) => {
          if (fatwaToEdit) {
            setFatwas(fatwas.map((f) => (f.id === fatwaToEdit.id ? newOrUpdatedFatwa : f)));
            showToast(`تم تعديل الفتوى #${newOrUpdatedFatwa.id} بنجاح`);
          } else {
            setFatwas([newOrUpdatedFatwa, ...fatwas]);
            showToast(`تمت إضافة الفتوى #${newOrUpdatedFatwa.id} بنجاح`);
          }
        }}
      />

      {/* ================= MODAL: ADD / EDIT RESEARCH ================= */}
      <AddEditResearchModal
        isOpen={isAddEditResearchOpen}
        onClose={() => setIsAddEditResearchOpen(false)}
        researchToEdit={researchToEdit}
        onSave={(newOrUpdatedResearch) => {
          if (researchToEdit) {
            setResearches(researches.map((r) => (r.id === researchToEdit.id ? newOrUpdatedResearch : r)));
            showToast('تم تعديل البحث العلمي بنجاح');
          } else {
            setResearches([newOrUpdatedResearch, ...researches]);
            showToast('تم نشر البحث العلمي الجديد بنجاح');
          }
        }}
      />

      {/* Dedicated Print Container */}
      <div id="print-area" className="hidden"></div>

      {/* Toast Notification */}
      <div
        id="toast-notification"
        className={`fixed bottom-5 left-5 z-50 transform transition-all duration-300 pointer-events-none no-print ${
          toastVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}
      >
        <div className="bg-emerald-950 text-white px-5 py-3 rounded-2xl shadow-2xl border border-gold-500 flex items-center gap-3 text-sm">
          <i className="fa-solid fa-circle-check text-gold-400 text-lg"></i>
          <span>{toastMessage}</span>
        </div>
      </div>

    </div>
  );
}
