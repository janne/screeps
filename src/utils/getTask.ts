import { randomElement } from "./randomElement";

interface BaseTask {
  say: string;
}

export interface HarvestTask extends BaseTask {
  name: "harvest";
  attempts: number;
  targetId: Id<Source>;
}

export interface TransferTask extends BaseTask {
  name: "transfer";
  targetId: Id<StructureExtension | StructureSpawn>;
}

export interface UpgradeControllerTask extends BaseTask {
  name: "upgradeController";
  targetId: Id<StructureController>;
}

export interface BuildTask extends BaseTask {
  name: "build";
  targetId: Id<ConstructionSite>;
}

export interface RepairTask extends BaseTask {
  name: "repair";
  targetId: Id<AnyStructure>;
}

export interface MoveTask extends BaseTask {
  name: "move";
  targetId: Id<AnyStructure>;
  attempts: number;
}

export type Task = HarvestTask | TransferTask | UpgradeControllerTask | BuildTask | RepairTask | MoveTask;

export const getTransferTarget = (creep: Creep) =>
  randomElement(
    creep.room.find<StructureExtension | StructureSpawn>(FIND_STRUCTURES, {
      filter: structure =>
        (structure.structureType === STRUCTURE_EXTENSION ||
          structure.structureType === STRUCTURE_SPAWN ||
          structure.structureType === STRUCTURE_TOWER) &&
        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    })
  );

export const getRepairTarget = (creep: Creep) =>
  creep.room
    .find(FIND_STRUCTURES, {
      filter: structure =>
        (structure.structureType === STRUCTURE_WALL ||
          structure.structureType === STRUCTURE_ROAD ||
          structure.structureType === STRUCTURE_RAMPART) &&
        structure.hits < structure.hitsMax &&
        structure.hits < 10_000_000
    })
    .sort((a, b) => a.hits - b.hits)[0];

export const getBuildTarget = (creep: Creep) => {
  const sites = creep.room.find(FIND_CONSTRUCTION_SITES);
  const extension = sites.find(site => site.structureType === STRUCTURE_EXTENSION);
  if (extension) return extension;
  return sites.sort((a, b) => b.progress - a.progress)[0];
};

export const hasMoreEnergy = (creep: Creep) => creep.store.getUsedCapacity() > 0;

const checkRoom = (room: Room): UpgradeControllerTask | null => {
  if (!room.controller || room.find(FIND_MY_CREEPS).length > 0) return null;
  return { name: "upgradeController", say: "Upgrading", targetId: room.controller.id };
};

export const getTask = (creep: Creep): Task | null => {
  // If no cargo, go harvest
  const harvestTarget = randomElement(creep.room.find(FIND_SOURCES_ACTIVE));
  if (creep.store.getUsedCapacity() === 0 && harvestTarget) {
    return { name: "harvest", say: "Harvesting", targetId: harvestTarget.id, attempts: 5 };
  }

  // Generate potential tasks
  const potentialTasks: Task[] = [];
  const transferTarget = getTransferTarget(creep);
  if (transferTarget) {
    potentialTasks.push({ name: "transfer", say: "Transfering", targetId: transferTarget.id });
  }
  const creeps = creep.room.find(FIND_MY_CREEPS);
  if (creeps.length > 3) {
    // Check if any emergency task
    const emergencyTask = checkRoom(Game.rooms.W42N36);
    if (emergencyTask) return emergencyTask;

    if (creep.room.controller) {
      potentialTasks.push({ name: "upgradeController", say: "Upgrading", targetId: creep.room.controller.id });
    }
    const buildTarget = getBuildTarget(creep);
    if (buildTarget) {
      potentialTasks.push({ name: "build", say: "Building", targetId: buildTarget.id });
    }
    const repairTarget = getRepairTarget(creep);
    if (repairTarget) {
      potentialTasks.push({ name: "repair", say: "Repair", targetId: repairTarget.id });
    }
  }

  if (potentialTasks.length === 0) {
    const buildTarget = getBuildTarget(creep);
    if (buildTarget) {
      return { name: "build", say: "Building", targetId: buildTarget.id };
    }
  }

  // Return random task
  const task = randomElement(potentialTasks);
  if (task === null) return null;
  creep.say(task.say);
  return task;
};
