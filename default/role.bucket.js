const c = require('constants');

module.exports = {
  // a function to run the logic for this role
  run: function(creep) {
    let name = creep.name;

    // if creep is bringing energy to the spawn or an extension but has no energy left
    if (creep.memory.working == true && creep.carry.energy == 0) {
      // switch state
      creep.memory.working = false;
    }
    // if creep is harvesting energy but is full
    else if (
      creep.memory.working == false &&
      creep.carry.energy == creep.carryCapacity
    ) {
      // switch state
      creep.memory.working = true;
    }

    // if creep is supposed to transfer energy to the spawn or an extension
    if (creep.memory.working == true && name == `BB${c.TOTAL_BUCKETS}`) {
      // find closest spawn or extension which is not full
      var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        // the second argument for findClosestByPath is an object which takes
        // a property called filter which can be a function
        // we use the arrow operator to define it
        filter: s => s.energyCapacity > 0 && s.energy < s.energyCapacity
      });

      // if we found one
      if (structure != undefined) {
        // try to transfer energy, if it is not in range
        if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          // move towards it
          creep.moveTo(structure);
        }
      }
    } else if (creep.memory.working) {
      for (var i = 1; i < c.TOTAL_BUCKETS; i++) {
        if (name === `BB${i}`) {
          let target = Game.creeps[`BB${i + 1}`];
          if (
            target &&
            creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE
          ) {
            creep.moveTo(target);
          } else if (!target) {
            target = Game.flags[`BB${i + 1}`];
            creep.moveTo(target);
          }
        }
      }
    }
    // if creep is supposed to harvest energy from source
    else {
      if (name === 'BB1') {
        let source = Game.flags.BB1.findClosestByPath(FIND_SOURCES);
        if (creep.harvest(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(source);
        }
      } else
        for (var i = 2; i <= c.TOTAL_BUCKETS; i++) {
          if (name === `BB${i}`) {
            let target = Game.creeps[`BB${i - 1}`];
            if (target) {
              creep.moveTo(target);
            } else {
              creep.moveTo(Game.flags[`BB${i - 1}`]);
            }
          }
        }
    }
  },
  harvest: function(creep) {
    // find closest source
    let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    let tombstone = creep.pos.findClosestByPath(FIND_TOMBSTONES, {
      filter: t => t.store.getUsedCapacity(RESOURCE_ENERGY) > 0
    });
    let ruin = creep.pos.findClosestByPath(FIND_RUINS, {
      filter: r => r.store.getUsedCapacity(RESOURCE_ENERGY) > 0
    });
    let dropped = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);

    // let closest = creep.pos.findClosestByPath([source, tombstone, dropped]);
    let options = [];
    if (source) {
      options.push(source);
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
    if (closest == dropped && creep.pickup(dropped) == ERR_NOT_IN_RANGE) {
      creep.moveTo(dropped);
    } else if (
      (closest == tombstone || closest == ruin) &&
      creep.withdraw(closest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE
    ) {
      creep.moveTo(closest);
    } else if (closest == source && creep.harvest(source) == ERR_NOT_IN_RANGE) {
      // move towards the source
      creep.moveTo(source);
    }
  }
};
