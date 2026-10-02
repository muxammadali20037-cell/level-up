import type { z } from "zod";
import type { actionSchema } from "../../../schema";
import { actions as programmingFundamentals } from "./programming_fundamentals";
import { actions as dataStructuresAlgorithms } from "./data_structures_algorithms";
import { actions as versionControl } from "./version_control";
import { actions as sqlDatabases } from "./sql_databases";
import { actions as apiDesign } from "./api_design";
import { actions as testingQuality } from "./testing_quality";
import { actions as debugging } from "./debugging";
import { actions as systemDesign } from "./system_design";
import { actions as deploymentOps } from "./deployment_ops";
import { actions as securityBasics } from "./security_basics";
import { actions as collaboration } from "./collaboration";

type ActionInput = z.input<typeof actionSchema>;

export const actions: ActionInput[] = [
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
