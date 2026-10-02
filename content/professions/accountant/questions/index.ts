import type { z } from "zod";
import type { questionSchema } from "../../../schema";
import { questions as accountingPrinciples } from "./accounting_principles";
import { questions as doubleEntryBookkeeping } from "./double_entry_bookkeeping";
import { questions as primaryDocuments } from "./primary_documents";
import { questions as taxation } from "./taxation";
import { questions as payroll } from "./payroll";
import { questions as financialStatements } from "./financial_statements";
import { questions as managementAccounting } from "./management_accounting";
import { questions as accountingSoftware } from "./accounting_software";
import { questions as accuracyControls } from "./accuracy_controls";
import { questions as professionalEthics } from "./professional_ethics";

export type QuestionInput = z.input<typeof questionSchema>;

export const questions: QuestionInput[] = [
  ...accountingPrinciples,
  ...doubleEntryBookkeeping,
  ...primaryDocuments,
  ...taxation,
  ...payroll,
  ...financialStatements,
  ...managementAccounting,
  ...accountingSoftware,
  ...accuracyControls,
  ...professionalEthics,
];
