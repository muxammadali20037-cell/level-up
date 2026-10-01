import type { z } from "zod";
import type { categorySchema } from "../schema";

type Category = z.input<typeof categorySchema>;

/** MVP categories (one flagship profession each). Icons are lucide-react component names. */
export const CATEGORIES: readonly Category[] = [
  {
    slug: "business",
    name: { uz: "Tadbirkorlik", ru: "Предпринимательство", en: "Entrepreneurship" },
    description: {
      uz: "Biznesni boshlash, boshqarish va oʻstirish",
      ru: "Запуск, управление и рост бизнеса",
      en: "Starting, running and growing a business",
    },
    icon: "Briefcase",
    sortOrder: 1,
    isMvp: true,
  },
  {
    slug: "technology",
    name: { uz: "Dasturlash", ru: "Программирование", en: "Software development" },
    description: {
      uz: "Frontend, backend, mobile, AI, data, DevOps, xavfsizlik",
      ru: "Frontend, backend, mobile, AI, data, DevOps, безопасность",
      en: "Frontend, backend, mobile, AI, data, DevOps, security",
    },
    icon: "Code",
    sortOrder: 2,
    isMvp: true,
  },
  {
    slug: "sales",
    name: { uz: "Savdo", ru: "Продажи", en: "Sales" },
    description: {
      uz: "Chakana, B2B, telefon orqali savdo va savdo boshqaruvi",
      ru: "Розница, B2B, телефонные продажи и управление продажами",
      en: "Retail, B2B, phone sales and sales leadership",
    },
    icon: "Handshake",
    sortOrder: 3,
    isMvp: true,
  },
  {
    slug: "marketing",
    name: { uz: "Marketing va SMM", ru: "Маркетинг и SMM", en: "Marketing & SMM" },
    description: {
      uz: "SMM, performance, kontent, brend, SEO, strategiya",
      ru: "SMM, performance, контент, бренд, SEO, стратегия",
      en: "SMM, performance, content, brand, SEO, strategy",
    },
    icon: "Megaphone",
    sortOrder: 4,
    isMvp: true,
  },
  {
    slug: "management",
    name: { uz: "Boshqaruv", ru: "Управление", en: "Management" },
    description: {
      uz: "Jamoa, jarayonlar va natijalarni boshqarish",
      ru: "Управление командой, процессами и результатами",
      en: "Leading people, processes and results",
    },
    icon: "Users",
    sortOrder: 5,
    isMvp: true,
  },
  {
    slug: "finance",
    name: { uz: "Buxgalteriya", ru: "Бухгалтерия", en: "Accounting" },
    description: {
      uz: "Buxgalteriya hisobi, soliqlar va moliyaviy hisobot",
      ru: "Бухгалтерский учёт, налоги и финансовая отчётность",
      en: "Bookkeeping, taxes and financial reporting",
    },
    icon: "Calculator",
    sortOrder: 6,
    isMvp: true,
  },
  {
    slug: "design",
    name: { uz: "Dizayn", ru: "Дизайн", en: "Design" },
    description: {
      uz: "Grafik, UI/UX va brend dizayni",
      ru: "Графический, UI/UX и бренд-дизайн",
      en: "Graphic, UI/UX and brand design",
    },
    icon: "Palette",
    sortOrder: 7,
    isMvp: true,
  },
  {
    slug: "career",
    name: { uz: "Talaba va karyera", ru: "Студенты и карьера", en: "Students & career" },
    description: {
      uz: "Ishga tayyorlik: oʻqish, muloqot, ish izlash",
      ru: "Готовность к работе: учёба, коммуникация, поиск работы",
      en: "Career readiness: learning, communication, job search",
    },
    icon: "GraduationCap",
    sortOrder: 8,
    isMvp: true,
  },
  {
    slug: "education",
    name: { uz: "Taʼlim", ru: "Образование", en: "Teaching" },
    description: {
      uz: "Dars berish, metodika va oʻquvchi rivoji",
      ru: "Преподавание, методика и развитие учеников",
      en: "Teaching, methodology and student growth",
    },
    icon: "BookOpen",
    sortOrder: 9,
    isMvp: true,
  },
  {
    slug: "driving",
    name: { uz: "Avtomaktab", ru: "Автошкола", en: "Driving instruction" },
    description: {
      uz: "Haydashni oʻrgatish, xavfsizlik va metodika",
      ru: "Обучение вождению, безопасность и методика",
      en: "Teaching driving, safety and methodology",
    },
    icon: "Car",
    sortOrder: 10,
    isMvp: true,
  },
];
