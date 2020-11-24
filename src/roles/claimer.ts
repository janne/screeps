const getNearestController = (creep: Creep) => {
  const controllers = creep.room.find(FIND_STRUCTURES, {
    filter: structure => structure.structureType === STRUCTURE_CONTROLLER
  });
  if (controllers.length === 0) return null;
  return controllers[0] as StructureController;
};

export const run = (creep: Creep) => {
  const nearestController = getNearestController(creep);
  if (!nearestController || nearestController.owner?.username === creep.owner.username) {
    const exits = creep.room.find(FIND_EXIT_LEFT);
    if (exits.length === 0) return;
    creep.moveTo(exits[0].x, exits[0].y);
  } else if (creep.claimController(nearestController) === ERR_NOT_IN_RANGE) {
    creep.moveTo(nearestController);
  }
};
