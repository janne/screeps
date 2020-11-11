export const findTransferTargets = (creep: Creep): (StructureExtension | StructureSpawn)[] =>
  creep.room.find(FIND_STRUCTURES, {
    filter: structure =>
      (structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN) &&
      structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
  }) as (StructureExtension | StructureSpawn)[];
