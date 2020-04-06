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
      this.default(creep);
    }
    // if creep is supposed to harvest energy from source
    else {
      roleHarvester.harvest(creep);
    }
  },
  repair: function(creep) {
    creep.say('repairing');
    // find closest structure with less than max hits
    // Exclude walls because they have way too many max hits and would keep
    // our repairers busy forever. We have to find a solution for that later.
    let structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      // the second argument for findClosestByPath is an object which takes
      // a property called filter which can be a function
      // we use the arrow operator to define it
      filter: s => s.hits < s.hitsMax && s.structureType !== STRUCTURE_WALL
    });

    // if we find one
    if (structure) {
      // try to repair it, if it is out of range
      if (creep.repair(structure) === ERR_NOT_IN_RANGE) {
        // move towards it
        creep.moveTo(structure);
      }
    }
    // if we can't fine one
    else {
      // look for construction sites
      roleBuilder.run(creep);
    }
  },
  default: function(creep) {
    // Find find the nearest damaged structure and construction site
    // noinspection JSIncompatibleTypesComparison
    // creep.say('repair/building');
    let structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: s => s.hits < s.hitsMax && s.structureType !== STRUCTURE_WALL
    });
    let constSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

    // Then find which of those is closest
    let opts = [];
    if (constSite) {
      opts.push(constSite);
    }
    if (structure) {
      opts.push(structure);
    }
    let closest = creep.pos.findClosestByPath(opts);

    // Now build or repair whichever is closest
    if (closest === constSite && creep.build(constSite) === ERR_NOT_IN_RANGE) {
      creep.moveTo(closest);
    } else if (
      closest === structure &&
      creep.repair(structure) === ERR_NOT_IN_RANGE
    ) {
      creep.moveTo(closest);
    } else {
      // look for construction sites
      roleBuilder.run(creep);
    }
  }
};
