module.exports.run = function (creep) {
  const spawner = Game.spawns['Spawn1'];

  if (creep.store.getFreeCapacity() > 0) {
    const sources = creep.room.find(FIND_SOURCES);
    if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
      creep.moveTo(sources[0]);
    }
  }
  else {
    if (creep.transfer(spawner, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE ) {
      creep.moveTo(spawner);
    }
  }
};
