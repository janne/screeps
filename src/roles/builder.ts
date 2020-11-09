import { harvest } from "utils/harvest";
import { setWorkMode } from "utils/setWorkMode";

export const builder = (creep: Creep): void => {
  setWorkMode(creep, "🚧 building");
  if (creep.memory.working) {
    const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
    if (targets.length > 0 && creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
      creep.moveTo(targets[0], { visualizePathStyle: { stroke: "#ffffff" } });
    }
  } else {
    harvest(creep);
  }
};
