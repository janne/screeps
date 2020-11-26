import { ErrorMapper } from "utils/ErrorMapper";
import { getTask } from "utils/getTask";
import { run as runClaimer } from "roles/claimer";
import { run as runWorker } from "roles/worker";

const recipes: { [key: string]: BodyPartConstant[] } = {
  worker: [WORK, CARRY, MOVE],
  claimer: [CLAIM, MOVE]
};

const getRecipe = (role: string, level: number) =>
  _.flatten(recipes[role].map(r => Array<BodyPartConstant>(level).fill(r)));

const spawnIfNeeded = (spawn: StructureSpawn, role: string, count: number) => {
  if (!spawn) return;
  const creeps = spawn.room.find(FIND_MY_CREEPS).filter(creep => creep.memory.role === role);
  if (creeps.length < count) {
    const newName = `${role}${Game.time}`;
    const extCount = spawn.room.find(FIND_STRUCTURES, {
      filter: structure => structure.structureType === STRUCTURE_EXTENSION
    }).length;
    const level = role === "worker" ? Math.floor((300 + extCount * 50) / 200) : 1;
    const recipe = getRecipe(role, level);
    if (spawn.spawnCreep(recipe, newName, { memory: { role, task: null } }) === OK) {
      console.log(`Spawning new ${role}: ${newName} of length ${recipe.length}`);
    }
  }
};

function defendRoom(room: Room) {
  const hostiles = room.find(FIND_HOSTILE_CREEPS);
  if (hostiles.length > 0) {
    const username = hostiles[0].owner.username;
    Game.notify(`User ${username} spotted in room ${room.name}`);
    const towers = room.find<StructureTower>(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
    towers.forEach(tower => tower.attack(hostiles[0]));
  }
}

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  // Automatically delete memory of missing creeps
  Object.keys(Memory.creeps || []).forEach(name => {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  });

  Object.values(Game.rooms).forEach(defendRoom);

  if (Object.keys(Game.rooms).length < 2) {
    spawnIfNeeded(Game.spawns.Spawn1, "claimer", 1);
  }
  spawnIfNeeded(Game.spawns.Spawn1, "worker", 5);
  spawnIfNeeded(Game.spawns.Spawn2, "worker", 10);

  Object.values(Game.creeps).forEach(creep => {
    switch (creep.memory.role) {
      case "worker": {
        if (!runWorker(creep)) {
          creep.memory.task = getTask(creep);
        }
        break;
      }
      case "claimer": {
        runClaimer(creep);
      }
    }
  });
});
