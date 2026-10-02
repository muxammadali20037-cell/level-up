import type { z } from "zod";
import type { questionSchema } from "../../../schema";
import { questions as programmingFundamentals } from "./programming_fundamentals";
import { questions as dataStructuresAlgorithms } from "./data_structures_algorithms";
import { questions as versionControl } from "./version_control";
import { questions as sqlDatabases } from "./sql_databases";
import { questions as apiDesign } from "./api_design";
import { questions as testingQuality } from "./testing_quality";
import { questions as debugging } from "./debugging";
import { questions as systemDesign } from "./system_design";
import { questions as deploymentOps } from "./deployment_ops";
import { questions as securityBasics } from "./security_basics";
import { questions as collaboration } from "./collaboration";

type QuestionInput = z.input<typeof questionSchema>;

export const questions: QuestionInput[] = [
  ...programmingFundamentals,
  ...dataStructuresAlgorithms,
  ...versionControl,
  ...sqlDatabases,
  ...apiDesign,
  ...testingQuality,
  ...debugging,
  ...systemDesign,
  ...deploymentOps,
  ...securityBasics,
  ...collaboration,
];
