/**
 * @extends {Role}
 */
export class Harvester extends Role {
  /**
   *
   * @param {Creep} creep - This is the creep that this class is controlling.
   */
  constructor(creep) {
    super({
      creep,
      name: 'harvester',
    });
  }

  run() {
    if (this.creep.spawning) {
      return;
    }

    if (
      this.creep.memory.working &&
      this.creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0
    ) {
      // out of energy
      this.creep.memory.working = false;
    } else if (
      !this.creep.memory.working &&
      this.creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0
    ) {
      // full go to work
      this.creep.memory.working = true;
    }

    if (this.creep.memory.working) {
      // working with energy
      let target = this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: s =>
          (s.structureType === STRUCTURE_EXTENSION ||
            s.structureType === STRUCTURE_SPAWN ||
            s.structureType === STRUCTURE_TOWER) &&
          s.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
      });

      let code = this.creep.transfer(target, RESOURCE_ENERGY);
      if (code === ERR_NOT_IN_RANGE) {
        this.creep.moveTo(target);
      } else if (code !== OK) {
        console.log(`Error transfering to target ${code}`);
      }
    } else {
      // gathering
      this.harvest();
    }
  }
}
