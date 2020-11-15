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

export interface RepairTask {
  name: "repair";
  say: string;
  targetId: Id<AnyStructure>;
}

export type Task = HarvestTask | TransferTask | UpgradeControllerTask | BuildTask | RepairTask;

export const getTask = (creep: Creep): Task | null => {
  // If no cargo, go harvest
  const harvestTarget = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
  if (creep.store.getUsedCapacity() === 0 && harvestTarget) {
    return { name: "harvest", say: "Harvesting", targetId: harvestTarget.id };
  }

  // Generate potential tasks
  const potentialTasks: Task[] = [];
  const transferTarget = randomElement(
    creep.room.find(FIND_STRUCTURES, {
      filter: structure =>
        (structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN) &&
        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    })
  ) as StructureExtension | StructureSpawn;
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
  const wallTarget = creep.room
    .find(FIND_STRUCTURES, {
      filter: structure =>
        (structure.structureType === STRUCTURE_WALL || structure.structureType === STRUCTURE_RAMPART) &&
        structure.hits < structure.hitsMax &&
        structure.hits < 1_000_000
    })
    .sort((a, b) => a.hits - b.hits)[0];
  if (wallTarget) {
    potentialTasks.push({ name: "repair", say: "Repair", targetId: wallTarget.id });
  }

  // Return random task
  const task = randomElement(potentialTasks);
  if (task === null) return null;
  creep.say(task.say);
  return task;
};
