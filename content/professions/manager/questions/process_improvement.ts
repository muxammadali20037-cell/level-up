import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** manager.process_improvement.NN — target levels 3, 5, 6, 8. */
export const questions: QuestionInput[] = [
  {
    key: "manager.process_improvement.01",
    skill: "process_improvement",
    specializations: [],
    type: "knowledge",
    targetLevel: 3,
    scoringRule: "single_best",
    discrimination: 1.3,
    prompt: {
      uz: "Jarayondagi «tor joy» nima?",
      ru: "Что такое «узкое место» в процессе?",
      en: "What is a bottleneck in a process?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Yoʻriqnomasi eng uzun boʻlgan bosqich",
          ru: "Этап с самой длинной инструкцией",
          en: "The step with the longest written instructions",
        },
        score: 0,
      },
      {
        key: "b",
        label: {
          uz: "Quvvati eng past boʻlib, butun jarayon natijasini cheklaydigan bosqich",
          ru: "Этап с наименьшей пропускной способностью, ограничивающий результат всего процесса",
          en: "The step with the lowest capacity, which limits the output of the whole process",
        },
        score: 1,
      },
      {
        key: "c",
        label: {
          uz: "Eng qimmatga tushadigan bosqich",
          ru: "Самый дорогой этап",
          en: "The most expensive step",
        },
        score: 0,
      },
      {
        key: "d",
        label: {
          uz: "Eng koʻp xodim band boʻlgan bosqich",
          ru: "Этап, на котором занято больше всего людей",
          en: "The step that employs the most people",
        },
        score: 0,
      },
    ],
    explanation: {
      uz: "Tor joy — butun jarayon tezligini belgilaydigan eng sekin bosqich. Uni yaxshilamasdan boshqa bosqichlarni tezlashtirish umumiy natijani oshirmaydi.",
      ru: "Узкое место — самый медленный этап, который задаёт скорость всего процесса. Без его улучшения ускорение других этапов не повышает общий результат.",
      en: "A bottleneck is the slowest step, which sets the pace of the whole process. Speeding up other steps without fixing it does not raise overall output.",
    },
  },
  {
    key: "manager.process_improvement.02",
    skill: "process_improvement",
    specializations: [],
    type: "scenario",
    targetLevel: 5,
    scoringRule: "partial_credit",
    scenario: {
      uz: "Buyurtmalarni rasmiylashtirish juda sekin. Xodimlar «doim shunday boʻlgan» deyishadi.",
      ru: "Заказы оформляются очень медленно. Сотрудники говорят: «Так было всегда».",
      en: "Order processing is very slow. Staff say it has always been like this.",
    },
    prompt: {
      uz: "Eng toʻgʻri birinchi qadam qaysi?",
      ru: "Какой первый шаг лучший?",
      en: "What is the best first step?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Darhol yangi dasturiy taʼminot sotib olish",
          ru: "Сразу купить новое программное обеспечение",
          en: "Buy new software straight away",
        },
        score: 0,
      },
      {
        key: "b",
        label: {
          uz: "Har bir bosqich uchun qatʼiyroq muddatlar belgilash",
          ru: "Установить более жёсткие сроки на каждый этап",
          en: "Set stricter deadlines for every step",
        },
        score: 0,
      },
      {
        key: "c",
        label: {
          uz: "Jamoa yigʻilishida yaxshilash gʻoyalarini soʻrash",
          ru: "Собрать идеи по улучшению на совещании команды",
          en: "Collect improvement ideas in a team meeting",
        },
        score: 0.5,
      },
      {
        key: "d",
        label: {
          uz: "Ishni bajaruvchilar bilan joriy jarayonni chizib, vaqt qayerda yoʻqolishini oʻlchash",
          ru: "Вместе с исполнителями описать текущий процесс и измерить, где теряется время",
          en: "Map the current process with the people who do it and measure where time is lost",
        },
        score: 1,
      },
    ],
    explanation: {
      uz: "Yaxshilash joriy holatni koʻrish va oʻlchashdan boshlanadi, aks holda yechim notoʻgʻri muammoga qaratiladi. Gʻoyalar yigʻish foydali, ammo maʼlumotsiz ular taxminlarga tayanadi.",
      ru: "Улучшение начинается с того, чтобы увидеть и измерить текущее состояние, иначе решение бьёт не в ту проблему. Сбор идей полезен, но без данных он опирается на догадки.",
      en: "Improvement starts by seeing and measuring the current state; otherwise you solve the wrong problem. Collecting ideas helps, but without data it rests on guesses.",
    },
  },
  {
    key: "manager.process_improvement.03",
    skill: "process_improvement",
    specializations: [],
    type: "judgment",
    targetLevel: 6,
    scoringRule: "partial_credit",
    scenario: {
      uz: "Siz jarayonni yaxshiladingiz va natija oshdi. Ikki oydan keyin xodimlar asta-sekin eski usulga qaytdi.",
      ru: "Вы улучшили процесс, и результат вырос. Через два месяца сотрудники постепенно вернулись к старому способу.",
      en: "You improved a process and results went up. Two months later, people have slowly drifted back to the old way.",
    },
    prompt: {
      uz: "Buni qanday tuzatish eng toʻgʻri?",
      ru: "Как лучше всего это исправить?",
      en: "What is the best way to fix this?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Umumiy chatda hammaga yangi usulni yana eslatish",
          ru: "Ещё раз напомнить всем о новом способе в общем чате",
          en: "Remind everyone about the new way in the team chat",
        },
        score: 0.5,
      },
      {
        key: "b",
        label: {
          uz: "Eski usulga qaytganlarni jarimaga tortish",
          ru: "Штрафовать тех, кто вернулся к старому способу",
          en: "Penalize the people who went back to the old way",
        },
        score: 0,
      },
      {
        key: "c",
        label: {
          uz: "Yangi standartni sodda hujjatlashtirib, masʼul tayinlash, kundalik koʻrsatkichlarga kiritish va eski yoʻlni yopish",
          ru: "Просто описать новый стандарт, назначить владельца, встроить его в регулярные метрики и закрыть старый путь",
          en: "Document the new standard simply, give it an owner, build it into routine metrics and close the old path",
        },
        score: 1,
      },
      {
        key: "d",
        label: {
          uz: "Yaxshilashni boshidan qaytadan oʻtkazish",
          ru: "Провести улучшение заново с нуля",
          en: "Run the whole improvement again from scratch",
        },
        score: 0,
      },
    ],
    explanation: {
      uz: "Yaxshilanish standart, egasi va muntazam nazoratga aylanmasa, jarayon eski holatiga qaytadi. Eslatma qisqa muddat yordam beradi, ammo tizimni oʻzgartirmaydi.",
      ru: "Без стандарта, владельца и регулярного контроля процесс возвращается к старому. Напоминание помогает ненадолго, но систему не меняет.",
      en: "Without a standard, an owner and routine measurement, a process slides back. A reminder helps briefly but does not change the system.",
    },
  },
  {
    key: "manager.process_improvement.04",
    skill: "process_improvement",
    specializations: [],
    type: "scenario",
    targetLevel: 8,
    scoringRule: "partial_credit",
    discrimination: 1.3,
    scenario: {
      uz: "Ombor jamoasi qadoqlashni 30% ga tezlashtirdi, ammo kuniga joʻnatilayotgan buyurtmalar soni oʻzgarmadi.",
      ru: "Команда склада ускорила упаковку на 30%, но число отправляемых в день заказов не изменилось.",
      en: "The warehouse team made packing 30% faster, but the number of orders shipped per day did not change.",
    },
    prompt: {
      uz: "Buning eng ehtimolli sababi nima?",
      ru: "Какое объяснение наиболее вероятно?",
      en: "What is the most likely explanation?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Qadoqlash tor joy emas edi: oqim boshqa bosqichda, masalan, kuryerga topshirishda cheklanmoqda",
          ru: "Упаковка не была узким местом: поток ограничен на другом этапе, например при передаче курьеру",
          en: "Packing was not the constraint: flow is limited elsewhere, e.g. at courier handover",
        },
        score: 1,
      },
      {
        key: "b",
        label: {
          uz: "Xodimlar boʻshagan vaqtda sustroq ishlay boshladi",
          ru: "Сотрудники стали работать медленнее в освободившееся время",
          en: "Staff started slacking off in the time they freed up",
        },
        score: 0,
      },
      {
        key: "c",
        label: {
          uz: "Yaxshilanish natija berishi uchun koʻproq vaqt kerak",
          ru: "Улучшению нужно больше времени, чтобы дать результат",
          en: "The improvement simply needs more time to show results",
        },
        score: 0,
      },
      {
        key: "d",
        label: {
          uz: "Koʻrsatkich notoʻgʻri oʻlchanmoqda, uni tekshirish kerak",
          ru: "Показатель измеряется неправильно, его нужно проверить",
          en: "The metric is being measured wrong and needs checking",
        },
        score: 0.5,
      },
    ],
    explanation: {
      uz: "Tor joy boʻlmagan bosqichni tezlashtirish faqat oraliq zaxirani oshiradi, umumiy oqimni emas. Oʻlchovni tekshirish oqilona, lekin bunday holatda asosiy sabab odatda cheklov boshqa joyda ekanligidir.",
      ru: "Ускорение этапа, который не является узким местом, лишь увеличивает промежуточный запас, но не поток. Проверить измерение разумно, но обычно причина в том, что ограничение находится в другом месте.",
      en: "Speeding up a non-bottleneck step only grows work-in-progress, not throughput. Checking the metric is reasonable, but the usual cause is that the constraint lies elsewhere.",
    },
  },
];
