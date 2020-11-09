import { findTargets } from "./findTargets";

export const setWorkMode = (creep: Creep, task = "working"): void => {
  if (creep.memory.workMode !== "harvesting" && creep.store[RESOURCE_ENERGY] === 0) {
    creep.memory.workMode = "harvesting";
    creep.say("Harvesting");
  } else if (
    creep.memory.workMode !== "transferring" &&
    findTargets(creep).length > 0 &&
    creep.store.getFreeCapacity() === 0
  ) {
    creep.memory.workMode = "transferring";
    creep.say("Transferring");
  } else if (creep.memory.workMode !== "working" && creep.store.getFreeCapacity() === 0) {
    creep.memory.workMode = "working";
    creep.say(task);
  }
};
