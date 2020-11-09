import { ErrorMapper } from "utils/ErrorMapper";
import { run as runBuilder } from "roles/builder";
import { run as runUpgrader } from "roles/upgrader";

const recipes: { [key: string]: BodyPartConstant[] } = {
  upgrader: [WORK, CARRY, MOVE],
  builder: [WORK, CARRY, MOVE]
};

const spawnIfNeeded = (role: string, count: number) => {
  const creeps = _.filter(Game.creeps, creep => creep.memory.role === role);
  if (creeps.length < count) {
    const newName = `${role}${Game.time}`;
    if (Game.spawns.Spawn1.spawnCreep(recipes[role], newName, { memory: { role, workMode: "harvesting" } }) === OK) {
      console.log(`Spawning new ${role}: ${newName}`);
    }
  }
};

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  // Automatically delete memory of missing creeps
  Object.keys(Memory.creeps).forEach(name => {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  });

  spawnIfNeeded("upgrader", 2);
  spawnIfNeeded("builder", 2);

  if (Game.spawns.Spawn1.spawning) {
    const spawningCreep = Game.creeps[Game.spawns.Spawn1.spawning.name];
    Game.spawns.Spawn1.room.visual.text(
      "🛠️" + spawningCreep.memory.role,
      Game.spawns.Spawn1.pos.x + 1,
      Game.spawns.Spawn1.pos.y,
      { align: "left", opacity: 0.8 }
    );
  }

  Object.values(Game.creeps).forEach(creep => {
    switch (creep.memory.role) {
      case "upgrader":
        return runUpgrader(creep);
      case "builder":
        return runBuilder(creep);
    }
  });
});
