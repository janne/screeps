import { getBuildTarget, getRepairTarget, getTransferTarget, hasMoreEnergy } from "utils/getTask";

export const run = (creep: Creep): boolean => {
  if (!creep.memory.task) return false;
  switch (creep.memory.task.name) {
    case "harvest": {
      const target = Game.getObjectById(creep.memory.task.targetId);
      if (!target) return false;
      if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
        if (creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } }) === ERR_NO_PATH) {
          creep.memory.task.attempts -= 1;
          return creep.memory.task.attempts > 0;
        }
      }
      if (creep.store.getFreeCapacity() === 0 || target.energy === 0) {
        const controller = creep.room.controller;
        if (!controller) return false;
        creep.memory.task = { name: "move", say: "Away!", targetId: controller.id, attempts: 5 };
        creep.say(creep.memory.task.say);
      }
      return true;
    }
    case "transfer": {
      const target = Game.getObjectById(creep.memory.task.targetId);
      if (!target) return false;
      if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
      }
      if (target.store.getFreeCapacity(RESOURCE_ENERGY) === 0 && hasMoreEnergy(creep)) {
        const newTarget = getTransferTarget(creep);
        if (newTarget) {
          creep.memory.task.targetId = newTarget.id;
          return true;
        }
      }
      return target.store.getFreeCapacity(RESOURCE_ENERGY) > 0 && hasMoreEnergy(creep);
    }
    case "upgradeController": {
      const target = Game.getObjectById(creep.memory.task.targetId);
      if (!target) return false;
      if (creep.upgradeController(target) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
      }
      return hasMoreEnergy(creep);
    }
    case "build": {
      const target = Game.getObjectById(creep.memory.task.targetId);
      if (!target) return false;
      if (creep.build(target) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
      }
      if (hasMoreEnergy(creep) && target.progress === target.progressTotal) {
        const newTarget = getBuildTarget(creep);
        if (newTarget) {
          creep.memory.task.targetId = newTarget.id;
          return true;
        }
      }
      return hasMoreEnergy(creep) && target.progress < target.progressTotal;
    }
    case "repair": {
      const target = Game.getObjectById(creep.memory.task.targetId);
      if (!target) return false;
      if (creep.repair(target) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
      }
      if (hasMoreEnergy(creep) && target.hits === target.hitsMax) {
        const newTarget = getRepairTarget(creep);
        if (newTarget) {
          creep.memory.task.targetId = newTarget.id;
          return true;
        }
      }
      return hasMoreEnergy(creep) && target.hits < target.hitsMax;
    }
    case "move": {
      const target = Game.getObjectById(creep.memory.task.targetId);
      if (!target) return false;
      creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
      creep.memory.task.attempts -= 1;
      return creep.memory.task.attempts >= 0;
    }
  }
};
