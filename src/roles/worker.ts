export const run = (creep: Creep): boolean => {
  if (!creep.memory.task) return false;
  switch (creep.memory.task.name) {
    case "harvest": {
      const target = Game.getObjectById(creep.memory.task.targetId);
      if (!target) return false;
      if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
      }
      return creep.store.getFreeCapacity() > 0;
    }
    case "transfer": {
      const target = Game.getObjectById(creep.memory.task.targetId);
      if (!target) return false;
      if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
      }
      return target.store.getFreeCapacity(RESOURCE_ENERGY) > 0 && creep.store.getUsedCapacity() > 0;
    }
    case "upgradeController": {
      const target = Game.getObjectById(creep.memory.task.targetId);
      if (!target) return false;
      if (creep.upgradeController(target) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
      }
      return creep.store.getUsedCapacity() > 0;
    }
    case "build": {
      const target = Game.getObjectById(creep.memory.task.targetId);
      if (!target) return false;
      if (creep.build(target) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
      }
      return creep.store.getUsedCapacity() > 0 && target.progress < target.progressTotal;
    }
  }
};
