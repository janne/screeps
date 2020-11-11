import { findTransferTargets } from "./findTransferTargets";
import { randomElement } from "./randomElement";

export interface HarvestTask {
  name: "harvest";
  say: string;
  targetId: Id<Source>;
}

export interface TransferTask {
  name: "transfer";
  say: string;
  targetId: Id<StructureExtension | StructureSpawn>;
}

export interface UpgradeControllerTask {
  name: "upgradeController";
  say: string;
  targetId: Id<StructureController>;
}

export interface BuildTask {
  name: "build";
  say: string;
  targetId: Id<ConstructionSite>;
}

export type Task = HarvestTask | TransferTask | UpgradeControllerTask | BuildTask;

export const getTask = (creep: Creep): Task | null => {
  // If no cargo, go harvest
  const harvestTarget = creep.room.find(FIND_SOURCES)[0];
  if (creep.store.getUsedCapacity() === 0 && harvestTarget) {
    return { name: "harvest", say: "Harvesting", targetId: harvestTarget.id };
  }

  // Generate potential tasks
  const potentialTasks: Task[] = [];
  const transferTarget = randomElement(findTransferTargets(creep));
  if (transferTarget) {
    potentialTasks.push({ name: "transfer", say: "Transfering", targetId: transferTarget.id });
  }
  if (creep.room.controller) {
    potentialTasks.push({ name: "upgradeController", say: "Upgrading", targetId: creep.room.controller.id });
  }
  const constructionTarget = randomElement(creep.room.find(FIND_CONSTRUCTION_SITES));
  if (constructionTarget) {
    potentialTasks.push({ name: "build", say: "Building", targetId: constructionTarget.id });
  }

  // Return random task
  const task = randomElement(potentialTasks);
  if (task === null) return null;
  creep.say(task.say);
  return task;
};
