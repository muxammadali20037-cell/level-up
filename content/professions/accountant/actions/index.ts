import type { z } from "zod";
import type { actionSchema } from "../../../schema";
import { actions as accountingPrinciples } from "./accounting_principles";
import { actions as doubleEntryBookkeeping } from "./double_entry_bookkeeping";
import { actions as primaryDocuments } from "./primary_documents";
import { actions as taxation } from "./taxation";
import { actions as payroll } from "./payroll";
import { actions as financialStatements } from "./financial_statements";
import { actions as managementAccounting } from "./management_accounting";
import { actions as accountingSoftware } from "./accounting_software";
import { actions as accuracyControls } from "./accuracy_controls";
import { actions as professionalEthics } from "./professional_ethics";

export type ActionInput = z.input<typeof actionSchema>;

export const actions: ActionInput[] = [
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
