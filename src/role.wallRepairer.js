const roleBuilder = require('./role.builder');
const roleHarvester = require('./role.harvester');
// const c = require('./constants');

module.exports = {
  // a function to run the logic for this role
  run: function(creep) {
    // if creep is trying to repair something but has no energy left
    if (creep.memory.working && creep.carry.energy === 0) {
      // switch state
      creep.memory.working = false;
    }
    // if creep is harvesting energy but is full
    else if (
      !creep.memory.working &&
      creep.carry.energy === creep.carryCapacity
    ) {
      // switch state
      creep.memory.working = true;
    }

    // if creep is supposed to repair something
    if (creep.memory.working) {
      this.walls(creep);
    }
    // if creep is supposed to harvest energy from source
    else {
      roleHarvester.harvest(creep);
    }
  },
  walls: function(creep) {
    // get walls that need repaired
    // creep.say('repairing walls');
    let walls = creep.room.find(FIND_STRUCTURES, {
      filter: s => s.structureType === STRUCTURE_WALL
    });

    let target;
    for (let pct = 0.0001; pct <= 1; pct += 0.0001) {
      target = creep.pos.findClosestByPath(walls, {
        filter: w => w.hits / w.hitsMax < pct
      });

      if (target) {
        break;
      }
    }

    if (target && creep.repair(target) === ERR_NOT_IN_RANGE) {
      creep.moveTo(target);
    } else if (!target) {
      roleBuilder.run(creep);
    }
  }
};
