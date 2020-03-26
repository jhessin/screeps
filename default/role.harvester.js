// const c = require('./constants');

module.exports = {
  // a function to run the logic for this role
  run: function (creep) {
    // if creep is bringing energy to the spawn or an extension but has no energy left
    if (creep.memory.working && creep.carry.energy === 0) {
      // switch state
      creep.memory.working = false;
    }
    // if creep is harvesting energy but is full
    else if (
      !creep.memory.working
      &&
      creep.carry.energy === creep.carryCapacity
    ) {
      // switch state
      creep.memory.working = true;
    }

    // if creep is supposed to transfer energy to the spawn or an extension
    if (creep.memory.working) {
      // creep.say('delivering');
      // find closest spawn or extension which is not full
      // console.log('delivering');
      let structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        // the second argument for findClosestByPath is an object which takes
        // a property called filter which can be a function
        // we use the arrow operator to define it
        filter: s => s.energy < s.energyCapacity
      });
      // console.log(`found structure: ${structure}`);

      // if we found one
      if (structure) {
        // try to transfer energy, if it is not in range
        if (creep.transfer(structure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          // move towards it
          // console.log('Moving toward structure');
          creep.moveTo(structure);
        }
      }
    }
    // if creep is supposed to harvest energy from source
    else {
      this.harvest(creep);
    }
  },
  harvest: function (creep) {
    // find closest source
    // creep.say('harvesting');
    let structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
      filter: s => s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0
    });
    let tombstone = creep.pos.findClosestByPath(FIND_TOMBSTONES, {
      filter: t => t.store.getUsedCapacity(RESOURCE_ENERGY) > 0
    });
    let ruin = creep.pos.findClosestByPath(FIND_RUINS, {
      filter: r => r.store.getUsedCapacity(RESOURCE_ENERGY) > 0
    });
    let dropped = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);

    // let closest = creep.pos.findClosestByPath([source, tombstone, dropped]);
    let options = [];
    if (structure) {
      options.push(structure);
    }
    if (tombstone) {
      options.push(tombstone);
    }
    if (dropped) {
      options.push(dropped);
    }
    if (ruin) {
      options.push(ruin);
    }

    let closest = creep.pos.findClosestByPath(options);

    // try to harvest energy, if the source is not in range
    if (closest === dropped && creep.pickup(dropped) === ERR_NOT_IN_RANGE) {
      creep.moveTo(dropped);
    } else if (
      (closest === tombstone || closest === ruin || closest === structure) &&
      creep.withdraw(closest, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE
    ) {
      creep.moveTo(closest);
    }
  },
};
