type WORK_MODE = "harvesting" | "transferring" | "working";

interface CreepMemory {
  role: string;
  workMode: WORK_MODE;
}

interface Memory {
  uuid: number;
  log: any;
}
