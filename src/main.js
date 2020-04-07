import { Harvester } from './roles';

const minHarvesters = 2;

// The main entry point for the program
export function loop() {
  // console.log(`Current game tick: ${Game.time}`);
  console.log('=================================');
  // Run memory cleanup semiregularly
  if (Game.time % 500 === 0) {
    cleanupMemory();
  }

  // enumerate the roles
  let harvester = new Harvester();

  /** @type {[Creep]} */
  let harvesters = harvester.creepWith();

  // Log your creeps
  console.log(
    `${harvesters.length} of ${minHarvesters} ${harvester.name}: ${harvesters}`,
  );

  // Run spawns
  for (let name in Game.spawns) {
    let spawn = Game.spawns[name];

    if (harvesters.length < minHarvesters) {
      harvesters.spawn(spawn);
    }
  }

  // Run creeps
  for (let name in Game.creeps) {
    let creep = Game.creeps[name];
    let harvester = new Harvester(creep);
    harvester.run();
  }

  console.log(`Done: CPU: ${Game.cpu.getUsed()}`);
}

function cleanupMemory() {
  // check for memory entries of died creeps by iterating over Memory.creeps
  console.log('Cleaning up dead creeps.');
  for (let name in Memory.creeps) {
    // and checking if the creep is still alive
    if (!Game.creeps[name]) {
      // if not, delete the memory entry
      delete Memory.creeps[name];
    }
  }
}
