import { Task } from "utils/getTask";

declare global {
  export type Role = "worker" | "claimer";

  export interface CreepMemory {
    role: Role;
    task: Task | null;
  }

  export interface Memory {
    uuid: number;
    log: any;
  }
}
