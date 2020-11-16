export const run = (creep: Creep): boolean => {
  if (!creep.memory.task) return false;
  switch (creep.memory.task.name) {
    case "harvest": {
      const target = Game.getObjectById(creep.memory.task.targetId);
      if (!target) return false;
      if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
        if (creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } }) === ERR_NO_PATH) {
          creep.memory.task.attempts -= 1;
          if (creep.memory.task.attempts === 0) {
            return false;
          }
        }
      }
      if (creep.store.getFreeCapacity() === 0) {
        creep.memory.task = { name: "move", say: "Away!", targetId: Game.spawns.Spawn1.id, attempts: 3 };
      }
      return true;
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
    case "repair": {
      const target = Game.getObjectById(creep.memory.task.targetId);
      if (!target) return false;
      if (creep.repair(target) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
      }
      return creep.store.getUsedCapacity() > 0 && target.hits < target.hitsMax;
    }
    case "move": {
      const target = Game.getObjectById(creep.memory.task.targetId);
      if (!target) return false;
      creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
      creep.memory.task.attempts -= 1;
      return creep.memory.task.attempts > 0;
    }
  }
};
