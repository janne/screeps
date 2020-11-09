import { harvest } from "utils/harvest";
import { setWorkMode } from "utils/setWorkMode";

export const run = (creep: Creep): void => {
  setWorkMode(creep, "⚡ upgrading");
  if (creep.memory.working) {
    if (creep.room.controller && creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
      creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: "#ffffff" } });
    }
  } else {
    harvest(creep);
  }
};
