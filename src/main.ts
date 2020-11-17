import { ErrorMapper } from "utils/ErrorMapper";
import { getTask } from "utils/getTask";
import { run as runWorker } from "roles/worker";

const recipes: { [key: string]: BodyPartConstant[] } = {
  worker: [WORK, CARRY, MOVE]
};

const getRecipe = (role: string, level: number) =>
  _.flatten(recipes[role].map(r => Array<BodyPartConstant>(level).fill(r)));

const spawnIfNeeded = (role: string, count: number) => {
  const creeps = _.filter(Game.creeps, creep => creep.memory.role === role);
  if (creeps.length < count) {
    const newName = `${role}${Game.time}`;
    const recipe = [5, 4, 3, 2, 1]
      .map(level => getRecipe(role, level))
      .find(r => Game.spawns.Spawn1.spawnCreep(r, newName, { memory: { role, task: null } }) === OK);
    if (recipe) {
      console.log(`Spawning new ${role}: ${newName} of length ${recipe.length}`);
    }
  }
};

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  // Automatically delete memory of missing creeps
  Object.keys(Memory.creeps || []).forEach(name => {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  });

  spawnIfNeeded("worker", 10);

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
      case "worker": {
        if (!runWorker(creep)) {
          creep.memory.task = getTask(creep);
        }
        break;
      }
    }
  });
});
