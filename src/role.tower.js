export default {
  run: function(tower) {
    let target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    let damagedCreep = tower.pos.findClosestByPath(FIND_MY_CREEPS, {
      // the second argument for findClosestByPath is an object which takes
      // a property called filter which can be a function
      // we use the arrow operator to define it
      filter: s => s.hits < s.hitsMax,
    });

    if (target) {
      tower.attack(target);
    } else if (damagedCreep) {
      tower.heal(damagedCreep);
    }
  },
};
