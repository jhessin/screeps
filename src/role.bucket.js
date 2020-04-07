import c from './constants';
import roleHarvester from './role.harvester';

export default {
  setFlag: function(creep) {
    // if creep is working but has no energy left
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
  },
  // a function to run the logic for this role
  front: function() {
    for (let i = 1; i <= c.NUM_BUCKETS; i++) {
      let creep = Game.creeps[`BB${i}`];

      if (!creep) continue;

      this.frontIndex = i;
      this.setFlag(creep);

      if (creep.memory.working) {
        for (let i = 2; i <= c.NUM_BUCKETS; i++) {
          let target = Game.creeps[`BB${i}`];
          if (target) {
            if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
              creep.moveTo(target);
            }
            return true;
          }
        }
        roleHarvester.run(creep);
      } else {
        let target = Game.flags.BB1.pos.findClosestByRange(FIND_SOURCES);

        if (!target) {
          creep.moveTo(Game.flags.BB1);
          return false;
        }

        //gather energy
        if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
        }
      }
    }
  },
  middle: function() {
    // First get all the creeps that exist.
    let creeps = [];
    for (let i = this.frontIndex + 1; i < this.backIndex; i++) {
      let creep = Game.creeps[`BB${i}`];
      if (creep) creeps.push(creep);
    }
    // Now iterate through them.
    for (let i = 0; i < creeps.length; i++) {
      // Get the creep
      let creep = creeps[i];
      this.setFlag(creep);

      if (creep.memory.working) {
        // going from lower to higher

        let target;
        // if we are at the limit go to the back
        if (i === creeps.length - 1) {
          target = Game.creeps[`BB${this.backIndex}`];
        } else {
          target = creeps[i + 1];
        }

        if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
        }
      } else {
        // going from higher to lower

        let target;
        // if we are at the beginning go to frontCreep
        if (i === 0) {
          target = Game.creeps[`BB${this.frontIndex}`];
        } else {
          target = creeps[i - 1];
        }

        if (target.transfer(creep, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
        }
      }
    }
  },
  back: function() {
    for (let i = c.NUM_BUCKETS; i > this.frontIndex; i--) {
      let creep = Game.creeps[`BB${i}`];

      if (!creep) continue;
      this.backIndex = i;
      this.setFlag(creep);

      if (creep.memory.working) {
        roleHarvester.run(creep);
      } else {
        for (let j = i; j > 1; j--) {
          let target = Game.creeps[`BB${j}`];

          if (!target) continue;

          if (target.transfer(creep, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
            return true;
          }
        }
      }
    }
  },
};
