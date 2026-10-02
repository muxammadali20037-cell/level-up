import type { z } from "zod";
import type { contextQuestionSchema } from "../../schema";

type ContextQuestionInput = z.input<typeof contextQuestionSchema>;

/**
 * One profession-specific quick-context question (3 global + 1 = 4 pre-test questions). The doc (§7) defines no
 * sales-specific context question; this one maps the selling channel to a suggested specialization. Boosts affect
 * routing only (doc P1).
 */
export const contextQuestions: ContextQuestionInput[] = [
  {
    key: "sales_channel",
    prompt: {
      uz: "Asosan qayerda yoki qanday sotasiz?",
      ru: "Где или как вы в основном продаёте?",
      en: "Where or how do you mostly sell?",
    },
    options: [
      {
        key: "store",
        label: { uz: "Doʻkon yoki savdo zalida", ru: "В магазине или торговом зале", en: "In a store or showroom" },
        suggestsSpecialization: "retail",
      },
      {
        key: "companies",
        label: { uz: "Kompaniyalarga (B2B)", ru: "Компаниям (B2B)", en: "To companies (B2B)" },
        suggestsSpecialization: "b2b",
      },
      {
        key: "phone",
        label: { uz: "Telefon orqali", ru: "По телефону", en: "Over the phone" },
        suggestsSpecialization: "telephone_sales",
      },
      {
        key: "field",
        label: { uz: "Mijozlarga borib", ru: "С выездом к клиентам", en: "Visiting clients on site" },
        suggestsSpecialization: "field_sales",
      },
      {
        key: "lead_team",
        label: { uz: "Savdo jamoasini boshqaraman", ru: "Руковожу командой продаж", en: "I lead a sales team" },
        suggestsSpecialization: "sales_manager",
        skillBoosts: { team_coaching: 2, pipeline_crm: 1.3 },
      },
      {
        key: "not_yet",
        label: { uz: "Hali sotmayman", ru: "Пока не продаю", en: "Not selling yet" },
      },
    ],
  },
];
