import { harvest } from "utils/harvest";
import { setWorkMode } from "utils/setWorkMode";
import { transfer } from "utils/transfer";

export const run = (creep: Creep): void => {
  setWorkMode(creep, "Upgrading");
  switch (creep.memory.workMode) {
    case "harvesting":
      return harvest(creep);
    case "transferring":
      return transfer(creep);
    case "working": {
      if (creep.room.controller && creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: "#ffffff" } });
      }
    }
  }
};
