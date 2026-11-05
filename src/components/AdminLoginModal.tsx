import React, { useState } from 'react';
import { AdminAccount } from '../types';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (email: string) => void;
  primaryAdminName: string;
  primaryAdminEmail: string;
  primaryAdminCode: string;
  adminAccounts: AdminAccount[];
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  primaryAdminName,
  primaryAdminEmail,
  primaryAdminCode,
  adminAccounts,
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanCode = codeInput.trim();

    if (!cleanEmail) {
      setErrorMsg('يرجى إدخال البريد الإلكتروني للمدير.');
      return;
    }

    if (!cleanCode) {
      setErrorMsg('يرجى إدخال رمز الدخول الخاص بالمدير.');
      return;
    }

    // 1. Check Primary Admin
    if (cleanEmail === primaryAdminEmail.toLowerCase()) {
      if (cleanCode === primaryAdminCode) {
        onLoginSuccess(primaryAdminEmail);
        setErrorMsg('');
        setCodeInput('');
        onClose();
        return;
      } else {
        setErrorMsg('رمز الدخول غير صحيح للمدير الرئيسي. يرجى التحقق من الرمز.');
        return;
      }
    }

    // 2. Check Additional Admins
    const foundAdmin = adminAccounts.find(
      (a) => a.email.toLowerCase() === cleanEmail
    );

    if (foundAdmin) {
      if (foundAdmin.code === cleanCode) {
        onLoginSuccess(foundAdmin.email);
        setErrorMsg('');
        setCodeInput('');
        onClose();
        return;
      } else {
        setErrorMsg(`رمز الدخول غير صحيح للمدير (${foundAdmin.name}).`);
        return;
      }
    }

    // 3. Not found
    setErrorMsg(`عذراً، هذا البريد (${cleanEmail}) ليس مسجلاً كمدير مصرح له بالموقع.`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-modal-backdrop">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border-2 border-gold-500 overflow-hidden animate-modal-card">
        
        {/* Header */}
        <div className="islamic-pattern p-6 text-white text-center border-b-2 border-gold-500 relative shadow-xs">
          <button 
            type="button"
            onClick={onClose} 
            className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
          <div className="w-16 h-16 rounded-2xl bg-white/10 border-2 border-gold-400 mx-auto flex items-center justify-center text-gold-400 text-2xl mb-3 shadow-inner">
            <i className="fa-solid fa-user-shield"></i>
          </div>
          <h3 className="text-xl font-bold font-serif text-white">دخول إدارة الموقع</h3>
          <p className="text-xs text-gray-200 mt-1">
            أدخل البريد الإلكتروني للمدير ورمز الدخول لفتح لوحة التحكم والإشراف
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 bg-white text-gray-800">
          
          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-300 rounded-xl text-red-700 text-xs flex items-start gap-2">
              <i className="fa-solid fa-circle-exclamation mt-0.5 text-base shrink-0"></i>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                البريد الإلكتروني للمدير <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <i className="fa-regular fa-envelope absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="email"
                  dir="ltr"
                  required
                  placeholder="example@gmail.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm font-mono text-gray-800"
                />
              </div>
            </div>

            {/* PIN Code / Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-gray-700">
                  رمز الدخول (PIN Code) <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowCode(!showCode)}
                  className="text-xs text-emerald-700 hover:underline flex items-center gap-1"
                >
                  <i className={`fa-solid ${showCode ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  <span>{showCode ? 'إخفاء الرمز' : 'إظهار الرمز'}</span>
                </button>
              </div>
              <div className="relative">
                <i className="fa-solid fa-key absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type={showCode ? 'text' : 'password'}
                  dir="ltr"
                  required
                  placeholder="أدخل رمز الدخول..."
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm font-mono tracking-wider font-bold text-gray-800"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-850 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 border border-gold-500/40"
            >
              <i className="fa-solid fa-unlock-keyhole text-gold-400"></i>
              <span>تسجيل الدخول والتحكم</span>
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};
