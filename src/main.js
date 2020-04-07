// The main entry point for the program
export function loop() {
  // console.log(`Current game tick: ${Game.time}`);
  console.log('=================================');
  console.log(`cpu.limit: ${Game.cpu.limit}`);
  console.log(`cpu.tickLimit: ${Game.cpu.tickLimit}`);
  console.log(`cpu.limit: ${Game.cpu.limit}`);
  if (Game.time % 500 === 0) {
    cleanupMemory();
  }
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
