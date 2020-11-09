import { harvest } from "utils/harvest";
import { setWorkMode } from "utils/setWorkMode";
import { transfer } from "utils/transfer";

export const run = (creep: Creep): void => {
  setWorkMode(creep, "Building");
  switch (creep.memory.workMode) {
    case "harvesting":
      return harvest(creep);
    case "transferring":
      return transfer(creep);
    case "working": {
      const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      if (targets.length > 0 && creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0], { visualizePathStyle: { stroke: "#ffffff" } });
      }
    }
  }
};
