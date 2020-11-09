import { findTargets } from "./findTargets";

export const transfer = (creep: Creep): void => {
  const targets = findTargets(creep);
  if (targets.length > 0) {
    if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      creep.moveTo(targets[0], { visualizePathStyle: { stroke: "#ffffff" } });
    }
  }
};
