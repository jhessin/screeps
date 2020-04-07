// The main entry point for the program
export function loop() {
  console.log(`Current game tick: ${Game.time}`);

  if (Game.time % 7 === 0) {
    cleanupMemory();
  }
}

function cleanupMemory() {
  // check for memory entries of died creeps by iterating over Memory.creeps
  for (let name in Memory.creeps) {
    // and checking if the creep is still alive
    if (!Game.creeps[name]) {
      // if not, delete the memory entry
      delete Memory.creeps[name];
    }
  }
}
