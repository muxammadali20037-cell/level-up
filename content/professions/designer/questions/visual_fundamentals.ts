import type { QuestionInput } from "./_types";

/** designer.visual_fundamentals — keys "designer.visual_fundamentals.NN" (gate skill K1). */
export const questions: QuestionInput[] = [
  {
    key: "designer.visual_fundamentals.01",
    skill: "visual_fundamentals",
    specializations: [],
    type: "knowledge",
    targetLevel: 2,
    scoringRule: "single_best",
    prompt: {
      uz: "Maketdagi vizual ierarxiyaning asosiy vazifasi nima?",
      ru: "Какова главная задача визуальной иерархии в макете?",
      en: "What is the main job of visual hierarchy in a layout?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Dizaynni zamonaviy va trenddagidek koʻrsatish",
          ru: "Сделать дизайн современным и трендовым",
          en: "Making the design look modern and on-trend",
        },
        score: 0,
      },
      {
        key: "b",
        label: {
          uz: "Tomoshabinga avval nimaga, keyin nimaga qarashni koʻrsatish",
          ru: "Показать зрителю, на что смотреть первым, вторым и третьим",
          en: "Showing the viewer what to look at first, second and third",
        },
        score: 1,
      },
      {
        key: "c",
        label: {
          uz: "Barcha elementlarni bir xil oʻlchamda qilib, raqobatni yoʻqotish",
          ru: "Сделать все элементы одного размера, чтобы они не спорили",
          en: "Keeping all elements the same size so nothing competes",
        },
        score: 0,
      },
      {
        key: "d",
        label: {
          uz: "Brend ranglarini har bir elementda ishlatish",
          ru: "Использовать фирменные цвета в каждом элементе",
          en: "Using brand colours on every element",
        },
        score: 0,
      },
    ],
    explanation: {
      uz: "Ierarxiya oʻlcham, qalinlik, rang va joylashuv orqali maʼlumotni muhimlik tartibida oʻqitadi. Usiz koʻz qayerdan boshlashni bilmaydi.",
      ru: "Иерархия через размер, насыщенность, цвет и положение ведёт взгляд по порядку важности. Без неё глазу не за что зацепиться.",
      en: "Hierarchy uses size, weight, colour and position to lead the eye in order of importance. Without it the viewer has no entry point.",
    },
  },
  {
    key: "designer.visual_fundamentals.02",
    skill: "visual_fundamentals",
    specializations: [],
    type: "judgment",
    targetLevel: 3,
    scoringRule: "single_best",
    scenario: {
      uz: "Konsert afishasida guruh nomi, sana, joy va chipta narxi bir xil oʻlcham va qalinlikda yozilgan. Mijoz: «Uzoqdan oʻqib boʻlmayapti».",
      ru: "На афише концерта название группы, дата, площадка и цена билета набраны одним размером и начертанием. Заказчик: «Издалека ничего не читается».",
      en: "A concert poster sets the band name, date, venue and ticket price in the same size and weight. The client says: «It can't be read from a distance».",
    },
    prompt: {
      uz: "Birinchi navbatda nimani tuzatish eng toʻgʻri?",
      ru: "Что лучше всего исправить в первую очередь?",
      en: "What is the best first fix?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Eʼtiborni tortish uchun fonga yorqin surat qoʻyish",
          ru: "Поставить на фон яркое фото, чтобы привлечь внимание",
          en: "Add a bright background photo to grab attention",
        },
        score: 0,
      },
      {
        key: "b",
        label: {
          uz: "Kayfiyatga mos dekorativ shriftga almashtirish",
          ru: "Заменить шрифт на декоративный под настроение",
          en: "Switch to a decorative font that fits the mood",
        },
        score: 0,
      },
      {
        key: "c",
        label: {
          uz: "Guruh nomi va sanani oʻlcham va qalinlik bilan ajratib, qolganini ikkinchi darajaga tushirish",
          ru: "Выделить название и дату размером и насыщенностью, остальное сделать второстепенным",
          en: "Make the band name and date dominant by size and weight, and the rest secondary",
        },
        score: 1,
      },
      {
        key: "d",
        label: {
          uz: "Har bir maʼlumot atrofiga ramka chizish",
          ru: "Обвести каждый блок информации рамкой",
          en: "Put a frame around each piece of information",
        },
        score: 0,
      },
    ],
    explanation: {
      uz: "Muammo ierarxiya yoʻqligida: hamma narsa bir xil «baland» gapiradi. Avval asosiy maʼlumotni ajratish kerak, bezaklar buni hal qilmaydi.",
      ru: "Проблема в отсутствии иерархии: всё «говорит» одинаково громко. Сначала нужно выделить главное — декор этого не решит.",
      en: "The problem is missing hierarchy: everything speaks at the same volume. Separating the key information comes first; decoration won't fix it.",
    },
  },
  {
    key: "designer.visual_fundamentals.03",
    skill: "visual_fundamentals",
    specializations: [],
    type: "scenario",
    targetLevel: 5,
    scoringRule: "partial_credit",
    scenario: {
      uz: "Chegirma banneri uchun toʻq sariq urgʻu rangini tanladingiz va uni sarlavha, ikonkalar, ramka hamda «Sotib olish» tugmasida ishlatdingiz. Mijoz: «Tugma koʻzga tashlanmayapti».",
      ru: "Для баннера распродажи вы выбрали оранжевый акцент и использовали его в заголовке, иконках, рамке и кнопке «Купить». Заказчик: «Кнопку не видно».",
      en: "For a sale banner you chose an orange accent and used it on the headline, icons, frame and the «Buy» button. The client says: «The button doesn't stand out».",
    },
    prompt: {
      uz: "Tugmani ajratib koʻrsatishning eng yaxshi usuli qaysi?",
      ru: "Как лучше всего выделить кнопку?",
      en: "What is the best way to make the button stand out?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Toʻq sariqni faqat tugmaga qoldirib, boshqa elementlarni sokinroq qilish",
          ru: "Оставить оранжевый только кнопке, а остальные элементы сделать спокойнее",
          en: "Keep the orange for the button only and calm down the other elements",
        },
        score: 1,
      },
      {
        key: "b",
        label: {
          uz: "Tugmani kattalashtirib, unga soya qoʻshish",
          ru: "Увеличить кнопку и добавить ей тень",
          en: "Make the button bigger and add a drop shadow",
        },
        score: 0,
      },
      {
        key: "c",
        label: {
          uz: "Tugma rangini boshqa yorqin rangga, masalan yashilga almashtirish",
          ru: "Перекрасить кнопку в другой яркий цвет, например зелёный",
          en: "Change the button to another bright colour, such as green",
        },
        score: 0.5,
      },
      {
        key: "d",
        label: {
          uz: "Tugmaga qaratilgan katta strelka qoʻshish",
          ru: "Добавить большую стрелку, указывающую на кнопку",
          en: "Add a large arrow pointing at the button",
        },
        score: 0,
      },
    ],
    explanation: {
      uz: "Urgʻu rangi hamma joyda boʻlsa, u urgʻu boʻlmay qoladi. Rangni bitta harakatga ajratish kontrastni tiklaydi; yangi rang qoʻshish ishlaydi, lekin palitrani chalkashtiradi.",
      ru: "Акцент, который везде, перестаёт быть акцентом. Закрепив цвет за одним действием, вы возвращаете контраст; новый цвет тоже сработает, но засорит палитру.",
      en: "An accent used everywhere stops being an accent. Reserving it for one action restores contrast; a new colour also works but clutters the palette.",
    },
  },
  {
    key: "designer.visual_fundamentals.04",
    skill: "visual_fundamentals",
    specializations: [],
    type: "judgment",
    targetLevel: 7,
    discrimination: 0.7,
    scoringRule: "partial_credit",
    scenario: {
      uz: "Siz katta surat chapda, matn bloki oʻngda joylashgan assimetrik buklet muqovasini taklif qildingiz. Mijoz: «Nimadir notekis, hammasini oʻrtaga qoʻying».",
      ru: "Вы предложили асимметричную обложку буклета: крупное фото слева, текстовый блок справа. Заказчик: «Что-то не так, поставьте всё по центру».",
      en: "You proposed an asymmetric brochure cover: a large photo on the left and a text block on the right. The client says: «Something feels off, centre everything».",
    },
    prompt: {
      uz: "Eng professional javob qaysi?",
      ru: "Какой ответ самый профессиональный?",
      en: "What is the most professional response?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Kelishmovchilik boʻlmasligi uchun hammasini aytilganidek oʻrtaga qoʻyish",
          ru: "Сделать всё по центру, как просят, чтобы избежать спора",
          en: "Centre everything as asked to avoid friction",
        },
        score: 0.5,
      },
      {
        key: "b",
        label: {
          uz: "Assimetriya hozir moda ekanini tushuntirib, oʻz variantingizni qoldirish",
          ru: "Объяснить, что асимметрия сейчас в моде, и оставить свой вариант",
          en: "Explain that asymmetry is on-trend and keep your version",
        },
        score: 0,
      },
      {
        key: "c",
        label: {
          uz: "Boʻsh tomonni toʻldirish uchun qoʻshimcha elementlar qoʻyish",
          ru: "Добавить элементы, чтобы заполнить пустую сторону",
          en: "Add more elements to fill the empty side",
        },
        score: 0,
      },
      {
        key: "d",
        label: {
          uz: "Vizual ogʻirlikni (oʻlcham, rang, zichlik) muvozanatlab, markazlashgan variant bilan yonma-yon koʻrsatish",
          ru: "Уравновесить визуальный вес (размер, цвет, плотность) и показать рядом с центрированным вариантом",
          en: "Rebalance visual weight (size, colour, density) and show it next to a centred version",
        },
        score: 1,
      },
    ],
    explanation: {
      uz: "«Notekis» degan his koʻpincha vizual ogʻirlik muvozanati buzilganidan kelib chiqadi. Sababni tuzatib, ikki variantni solishtirish mijozga asosli tanlov beradi.",
      ru: "Ощущение «что-то не так» обычно идёт от нарушенного баланса визуального веса. Исправив причину и показав два варианта, вы даёте заказчику осознанный выбор.",
      en: "A feeling that «something is off» usually comes from unbalanced visual weight. Fixing the cause and comparing both options gives the client an informed choice.",
    },
  },
  {
    key: "designer.visual_fundamentals.05",
    skill: "visual_fundamentals",
    specializations: [],
    type: "decision",
    targetLevel: 8,
    scoringRule: "partial_credit",
    scenario: {
      uz: "Kichik dizayner sahifa maketini olib keldi. Har bir element alohida yaxshi, lekin umumiy koʻrinish «shovqinli»: 6 xil oʻlcham, 4 ta rang va bir nechta qalin sarlavha bir-biri bilan bahslashmoqda.",
      ru: "Младший дизайнер принёс макет страницы. Каждый элемент по отдельности хорош, но в целом «шумно»: 6 размеров, 4 цвета и несколько жирных заголовков спорят друг с другом.",
      en: "A junior designer brings a page layout. Each element is fine on its own, but the whole feels noisy: 6 sizes, 4 colours and several bold headings compete with each other.",
    },
    prompt: {
      uz: "Unga qanday asosiy yoʻnalish berasiz?",
      ru: "Какое главное направление вы ему дадите?",
      en: "What main direction do you give them?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Kontentni qisqartirib, elementlar sonini kamaytirish",
          ru: "Сократить контент и уменьшить число элементов",
          en: "Cut content and reduce the number of elements",
        },
        score: 0.5,
      },
      {
        key: "b",
        label: {
          uz: "Bitta asosiy fokus nuqtasini tanlab, kontrastni bir necha aniq pogʻonaga keltirish",
          ru: "Выбрать одну главную точку фокуса и свести контраст к нескольким чётким ступеням",
          en: "Pick one dominant focal point and limit contrast to a few deliberate steps",
        },
        score: 1,
      },
      {
        key: "c",
        label: {
          uz: "Barcha elementlar orasidagi boʻshliqni bir tekis oshirish",
          ru: "Равномерно увеличить отступы между всеми элементами",
          en: "Increase the spacing between all elements evenly",
        },
        score: 0,
      },
      {
        key: "d",
        label: {
          uz: "Sokinroq koʻrinishi uchun butun maketni monoxrom qilish",
          ru: "Сделать весь макет монохромным, чтобы он стал спокойнее",
          en: "Make the whole layout monochrome so it feels calmer",
        },
        score: 0,
      },
    ],
    explanation: {
      uz: "Shovqin elementlar soni emas, balki kontrast pogʻonalari tizimsizligidan kelib chiqadi. Bitta fokus va cheklangan pogʻonalar har qanday hajmdagi kontentga tartib beradi.",
      ru: "Шум возникает не из-за количества элементов, а из-за бессистемных ступеней контраста. Один фокус и ограниченная шкала упорядочат контент любого объёма.",
      en: "Noise comes less from element count than from unsystematic contrast steps. One focal point and a limited scale bring order to any amount of content.",
    },
  },
];
