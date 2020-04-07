export default {
  // a function to run the logic for this role
  run: function(creep) {
    let source = Game.getObjectById(creep.memory.sourceId);
    if (creep.memory.containerId) {
      creep.memory.containerId = source.pos.findInRange(FIND_STRUCTURES, 1, {
        filter: s => s.structureType === STRUCTURE_CONTAINER,
      })[0].id;
    }
    let container = Game.getObjectById(creep.memory.containerId);

    if (creep.pos.isEqualTo(container.pos)) {
      creep.harvest(source);
    } else {
      creep.moveTo(container);
    }
  },
};
