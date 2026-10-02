import type { z } from "zod";
import type { edgeSchema, skillSchema, specializationSchema } from "../../schema";

type SkillInput = z.input<typeof skillSchema>;
type EdgeInput = z.input<typeof edgeSchema>;
type SpecializationInput = z.input<typeof specializationSchema>;

/** docs/architecture/05-profession-skill-model.md §5.2 — importances sum to exactly 1.00. Gate skills: finance, operations, sales. */
export const skills: SkillInput[] = [
  {
    slug: "sales",
    globalSkillKey: "sales",
    kind: "hard",
    importance: 0.13,
    name: { uz: "Savdo", ru: "Продажи", en: "Sales" },
    description: {
      uz: "Qiziqishni toʻlangan bitimga, bir martalik xaridorni esa doimiy mijozga aylantirish.",
      ru: "Превращать интерес в оплаченные сделки, а разовых покупателей — в постоянных клиентов.",
      en: "Turning interest into paid deals and repeat customers.",
    },
  },
  {
    slug: "marketing",
    globalSkillKey: "marketing",
    kind: "hard",
    importance: 0.1,
    name: { uz: "Marketing", ru: "Маркетинг", en: "Marketing" },
    description: {
      uz: "Toʻgʻri mijozlardan maqbul narxda, oldindan bashorat qilinadigan talab yaratish.",
      ru: "Создавать предсказуемый спрос среди нужных клиентов по приемлемой цене.",
      en: "Creating predictable demand from the right customers at an acceptable cost.",
    },
  },
  {
    slug: "operations",
    globalSkillKey: "operations",
    kind: "hard",
    importance: 0.13,
    name: { uz: "Operatsion jarayonlar", ru: "Операционные процессы", en: "Operations & processes" },
    description: {
      uz: "Ishni takrorlanuvchi qilish: standart qadamlar, cheklistlar, rollar va sifat nazorati.",
      ru: "Делать работу воспроизводимой: стандартные шаги, чек-листы, роли и контроль качества.",
      en: "Making delivery repeatable: standard steps, checklists, roles, quality control.",
    },
  },
  {
    slug: "finance",
    globalSkillKey: "finance_literacy",
    kind: "hard",
    importance: 0.13,
    name: { uz: "Moliyaviy boshqaruv", ru: "Управление финансами", en: "Financial management" },
    description: {
      uz: "Pul oqimi, foyda va zarar, biznes va shaxsiy pulni ajratish, zaxirani rejalashtirish.",
      ru: "Денежный поток, прибыли и убытки, разделение личных и бизнес-денег, планирование резервов.",
      en: "Cash flow, P&L, separating business and personal money, planning reserves.",
    },
  },
  {
    slug: "unit_economics",
    globalSkillKey: "unit_economics",
    kind: "hard",
    importance: 0.09,
    name: { uz: "Unit-iqtisodiyot", ru: "Юнит-экономика", en: "Unit economics" },
    description: {
      uz: "Har bir sotuv birligi boʻyicha marja, mijozni jalb qilish narxi va mijoz qiymatini bilish.",
      ru: "Знать маржу, стоимость привлечения клиента и его ценность на единицу продаж.",
      en: "Knowing margin, customer acquisition cost and lifetime value per unit sold.",
    },
  },
  {
    slug: "hiring_team",
    globalSkillKey: "hiring",
    kind: "soft",
    importance: 0.1,
    name: { uz: "Jamoa yigʻish", ru: "Найм и команда", en: "Hiring & team" },
    description: {
      uz: "Biznes tayanadigan odamlarni topish, ishga moslashtirish va ushlab qolish.",
      ru: "Нанимать, вводить в работу и удерживать людей, на которых держится бизнес.",
      en: "Hiring, onboarding and keeping the people the business depends on.",
    },
  },
  {
    slug: "leadership",
    globalSkillKey: "leadership",
    kind: "soft",
    importance: 0.08,
    name: { uz: "Yetakchilik", ru: "Лидерство", en: "Leadership" },
    description: {
      uz: "Yoʻnalish berish, vazifani topshirish va har bir qadamni nazorat qilmasdan natija talab qilish.",
      ru: "Задавать направление, делегировать и спрашивать за результат без микроменеджмента.",
      en: "Setting direction, delegating and holding people accountable without micromanaging.",
    },
  },
  {
    slug: "customer_product",
    globalSkillKey: "customer_focus",
    kind: "hard",
    importance: 0.09,
    name: { uz: "Mijoz va mahsulot", ru: "Клиент и продукт", en: "Customer & product" },
    description: {
      uz: "Kim va nima uchun sotib olishini tushunish hamda taklifni real ehtiyojga moslash.",
      ru: "Понимать, кто и почему покупает, и строить предложение вокруг реальных потребностей.",
      en: "Understanding who buys and why, and shaping the offer around real needs.",
    },
  },
  {
    slug: "strategy",
    globalSkillKey: "planning",
    kind: "meta",
    importance: 0.08,
    name: { uz: "Strategiya va ustuvorliklar", ru: "Стратегия и приоритеты", en: "Strategy & priorities" },
    description: {
      uz: "Qayerda raqobatlashishni va bu chorakda nimani qilmaslikni tanlash.",
      ru: "Выбирать, где конкурировать и чего не делать в этом квартале.",
      en: "Choosing where to compete and what not to do this quarter.",
    },
  },
  {
    slug: "decision_making",
    globalSkillKey: "decision_making",
    kind: "meta",
    importance: 0.07,
    name: { uz: "Noaniqlikda qaror qabul qilish", ru: "Решения в неопределённости", en: "Decisions under uncertainty" },
    description: {
      uz: "Toʻliq boʻlmagan maʼlumot bilan qaror qilish: kichik sinovlar, qaytariladigan qadamlar, aniq risk chegarasi.",
      ru: "Решать при неполных данных: малые тесты, обратимые ставки, явные лимиты риска.",
      en: "Deciding with incomplete data: small tests, reversible bets, explicit risk limits.",
    },
  },
];

/** §5.3 — 11 edges, strengths on the {0.3, 0.5, 0.7, 0.9} scale; rationales describe the work, never the person. */
export const edges: EdgeInput[] = [
  {
    from: "operations",
    to: "sales",
    relation: "limits",
    strength: 0.7,
    rationale: {
      uz: "Savdo talab yaratadi, lekin ichki jarayonlar takrorlanmaydi — shuning uchun oʻsish toʻxtaydi.",
      ru: "Продажи создают спрос, но внутренние процессы не воспроизводимы — поэтому рост упирается в потолок.",
      en: "Sales generate demand, but internal processes are not repeatable — so growth stalls.",
    },
  },
  {
    from: "operations",
    to: "marketing",
    relation: "limits",
    strength: 0.5,
    rationale: {
      uz: "Marketing mijoz olib keladi, lekin biznes ularning hammasiga bir xil sifatda xizmat qila olmaydi.",
      ru: "Маркетинг приводит клиентов, но бизнес не может обслужить их всех с одинаковым качеством.",
      en: "More leads arrive than the business can serve with consistent quality.",
    },
  },
  {
    from: "unit_economics",
    to: "marketing",
    relation: "limits",
    strength: 0.7,
    rationale: {
      uz: "Har bir mijozdan qancha foyda qolishi nomaʼlum boʻlsa, reklamani koʻpaytirish zararni ham koʻpaytirishi mumkin.",
      ru: "Если неизвестно, сколько прибыли приносит каждый клиент, рост рекламы может умножать убытки.",
      en: "Scaling acquisition without knowing per-customer margin can scale losses.",
    },
  },
  {
    from: "unit_economics",
    to: "sales",
    relation: "limits",
    strength: 0.5,
    rationale: {
      uz: "Sotuv hajmi oʻsyapti, lekin har bir sotuv foyda keltirayotgani aniq emas.",
      ru: "Объём продаж растёт, но неясно, приносит ли каждая сделка прибыль.",
      en: "Volume grows, but each sale may not be profitable.",
    },
  },
  {
    from: "finance",
    to: "unit_economics",
    relation: "prerequisite",
    strength: 0.7,
    rationale: {
      uz: "Marja va jalb qilish narxini hisoblash uchun avval toʻgʻri foyda va zarar hisoboti kerak.",
      ru: "Чтобы считать маржу и стоимость привлечения, сначала нужен корректный отчёт о прибылях и убытках.",
      en: "Margin and acquisition cost need a correct P&L first.",
    },
  },
  {
    from: "hiring_team",
    to: "operations",
    relation: "limits",
    strength: 0.5,
    rationale: {
      uz: "Jarayonlar qogʻozda bor, lekin ularni ishonchli bajaradigan odam yoʻq.",
      ru: "Процессы есть на бумаге, но нет надёжных людей, которые их выполняют.",
      en: "Processes exist on paper, but nobody reliable runs them.",
    },
  },
  {
    from: "leadership",
    to: "hiring_team",
    relation: "limits",
    strength: 0.5,
    rationale: {
      uz: "Aniq yoʻnalish va vakolat berilmasa, yaxshi xodimlar ham ketadi yoki kam natija beradi.",
      ru: "Без ясного направления и делегирования даже сильные сотрудники уходят или работают ниже своих возможностей.",
      en: "Good hires leave or underperform without direction and delegation.",
    },
  },
  {
    from: "customer_product",
    to: "marketing",
    relation: "prerequisite",
    strength: 0.5,
    rationale: {
      uz: "Marketing taklifni kuchaytiradi — avval u kim uchun ekanini bilish kerak.",
      ru: "Маркетинг усиливает предложение — сначала нужно понять, для кого оно.",
      en: "Marketing amplifies an offer; first know who it is for.",
    },
  },
  {
    from: "customer_product",
    to: "sales",
    relation: "enables",
    strength: 0.5,
    rationale: {
      uz: "Mijoz ehtiyojiga aniq mos taklif sotishni ancha osonlashtiradi.",
      ru: "Предложение, точно попадающее в потребность клиента, заметно упрощает продажи.",
      en: "A clear need-fit offer makes selling easier.",
    },
  },
  {
    from: "finance",
    to: "decision_making",
    relation: "enables",
    strength: 0.5,
    rationale: {
      uz: "Zaxira qancha ekanini bilsangiz, qaror qancha riskni koʻtara olishi aniq boʻladi.",
      ru: "Зная свои резервы, понятно, какой риск может выдержать решение.",
      en: "Knowing reserves defines how much risk a decision can take.",
    },
  },
  {
    from: "decision_making",
    to: "strategy",
    relation: "enables",
    strength: 0.3,
    rationale: {
      uz: "Strategiya — noaniqlik sharoitida qabul qilinadigan qarorlar zanjiri.",
      ru: "Стратегия — это цепочка решений в условиях неопределённости.",
      en: "Strategy is a chain of decisions under uncertainty.",
    },
  },
];

/** §5.1 — only non-default weights listed; gate skills (finance, operations, sales) stay ≥ 0.5 everywhere. */
export const specializations: SpecializationInput[] = [
  {
    slug: "beginner_founder",
    name: { uz: "Yangi tadbirkor", ru: "Начинающий предприниматель", en: "Beginner founder" },
    description: {
      uz: "Biznesni endi boshlayapsiz yoki birinchi mijozlarni topyapsiz.",
      ru: "Вы только запускаете бизнес или ищете первых клиентов.",
      en: "You are launching a business or finding your first customers.",
    },
    skillWeights: { sales: 1.3, customer_product: 1.3, strategy: 0.8, leadership: 0.7, hiring_team: 0.6 },
  },
  {
    slug: "small_business_owner",
    name: { uz: "Kichik biznes egasi", ru: "Владелец малого бизнеса", en: "Small business owner" },
    description: {
      uz: "Ishlab turgan kichik biznesingiz bor: doʻkon, xizmat, ishlab chiqarish yoki onlayn savdo.",
      ru: "У вас работающий малый бизнес: магазин, услуги, производство или онлайн-продажи.",
      en: "You run an established small business: a shop, a service, production or online sales.",
    },
    skillWeights: { operations: 1.2, finance: 1.2, sales: 1.1 },
  },
  {
    slug: "growth_founder",
    name: { uz: "Oʻsish bosqichidagi asoschi", ru: "Основатель растущего бизнеса", en: "Growth-stage founder" },
    description: {
      uz: "Biznes ishlayapti, endi uni tizimli va foydali tarzda kengaytirmoqchisiz.",
      ru: "Бизнес работает, и теперь вы хотите масштабировать его системно и прибыльно.",
      en: "The business works and you now want to scale it systematically and profitably.",
    },
    skillWeights: { unit_economics: 1.4, marketing: 1.3, hiring_team: 1.2 },
  },
  {
    slug: "multi_branch_owner",
    name: { uz: "Koʻp filialli biznes egasi", ru: "Владелец сети филиалов", en: "Multi-branch owner" },
    description: {
      uz: "Bir nechta filial yoki nuqtani boshqarasiz va ular bir xil standartda ishlashi kerak.",
      ru: "Вы управляете несколькими филиалами или точками, и они должны работать по единому стандарту.",
      en: "You run several branches or locations that must work to one standard.",
    },
    skillWeights: { operations: 1.5, hiring_team: 1.3, leadership: 1.2, finance: 1.1, customer_product: 0.8 },
  },
  {
    slug: "startup_founder",
    name: { uz: "Startap asoschisi", ru: "Основатель стартапа", en: "Startup founder" },
    description: {
      uz: "Yangi mahsulot yaratyapsiz va bozorga mosligini izlayapsiz.",
      ru: "Вы создаёте новый продукт и ищете его соответствие рынку.",
      en: "You are building a new product and searching for product–market fit.",
    },
    skillWeights: { customer_product: 1.5, unit_economics: 1.3, decision_making: 1.2, operations: 0.8 },
  },
  {
    slug: "company_ceo",
    name: { uz: "Kompaniya rahbari (CEO)", ru: "Генеральный директор", en: "Company CEO" },
    description: {
      uz: "Rahbarlar jamoasi orqali kompaniyani boshqarasiz va yoʻnalishni belgilaysiz.",
      ru: "Вы управляете компанией через команду руководителей и задаёте направление.",
      en: "You lead the company through a management team and set its direction.",
    },
    skillWeights: { strategy: 1.5, leadership: 1.4, hiring_team: 1.2, sales: 0.8, marketing: 0.8 },
  },
];
