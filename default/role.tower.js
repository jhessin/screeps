module.exports = {
  run: function(tower) {
    let target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    var structure = tower.pos.findClosestByPath(FIND_STRUCTURES, {
      // the second argument for findClosestByPath is an object which takes
      // a property called filter which can be a function
      // we use the arrow operator to define it
      filter: s => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL
    });

    if (target) {
      tower.attack(target);
    } else if (structure) {
      tower.repair(structure);
    }
  }
};
