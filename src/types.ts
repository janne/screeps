import { Task } from "utils/getTask";

declare global {
  export interface CreepMemory {
    role: string;
    task: Task | null;
    errNoPath?: number;
  }

  export interface Memory {
    uuid: number;
    log: any;
  }
}
