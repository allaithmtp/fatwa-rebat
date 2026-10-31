export type Language = 'ar' | 'en' | 'id';

export interface LocalizedContent {
  title: string;
  date?: string;
  questioner?: string;
  question?: string;
  answer?: string;
  references?: string[];
  statusText?: string;
  badge?: string;
  desc?: string;
  author?: string;
  summary?: string;
  pages?: string;
}

export interface Fatwa {
  id: number;
  category: string;
  views: number;
  ar: {
    title: string;
    date: string;
    questioner: string;
    question: string;
    answer: string;
    references: string[];
  };
  en?: {
    title: string;
    date: string;
    questioner: string;
    question: string;
    answer: string;
    references: string[];
  };
  idLang?: {
    title: string;
    date: string;
    questioner: string;
    question: string;
    answer: string;
    references: string[];
  };
}

export interface Category {
  id: string;
  name: {
    ar: string;
    en: string;
    id: string;
  };
  icon: string;
}

export interface ResearchStudy {
  id: string;
  ar: {
    badge: string;
    pages: string;
    title: string;
    desc: string;
    author: string;
    summary: string;
  };
  en?: {
    badge: string;
    pages: string;
    title: string;
    desc: string;
    author: string;
    summary: string;
  };
  idLang?: {
    badge: string;
    pages: string;
    title: string;
    desc: string;
    author: string;
    summary: string;
  };
}

export interface TrackingItem {
  code: string;
  category: string;
  statusStep: 1 | 2 | 3; // 1: استلام, 2: قيد الدراسة, 3: تمت الإجابة
  name?: string;
  contact?: string;
  priority?: string;
  date: string;
  title: string;
  details?: string;
  statusText: string;
  answer?: string | null;
  en?: {
    title: string;
    date: string;
    statusText: string;
    answer: string | null;
  };
  idLang?: {
    title: string;
    date: string;
    statusText: string;
    answer: string | null;
  };
}

export interface SiteSettings {
  brandTitle: string;
  brandSubtitle: string;
  topBarTitle: string;
  heroAyah: string;
  heroMainTitle: string;
  heroSubTitle: string;
  heroDesc: string;
  stat1Val: string;
  stat1Label: string;
  stat2Val: string;
  stat2Label: string;
  stat3Val: string;
  stat3Label: string;
  stat4Val: string;
  stat4Label: string;
  whatsappNumber: string;
  istiftaaEmail: string;
  primaryColor: string;
  goldColor: string;
  logoIcon: string;
  logoImage?: string;
  aboutTitle: string;
  aboutDesc: string;
  aboutBox1Title: string;
  aboutBox1Desc: string;
  aboutBox2Title: string;
  aboutBox2Desc: string;
  aboutHoursTitle: string;
  aboutHours1Label: string;
  aboutHours1Val: string;
  aboutHours2Label: string;
  aboutHours2Val: string;
  aboutHours3Label: string;
  aboutHours3Val: string;
  aboutLocation: string;
  footerDesc: string;
  footerContactTitle: string;
  footerContactDesc: string;
  footerCopyright: string;
}

export interface AdminAccount {
  email: string;
  name: string;
  code: string;
  isPrimary?: boolean;
  addedAt?: string;
}
