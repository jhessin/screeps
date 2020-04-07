// @flow
/// These are the names of our creeps - they should never be used up.
const names = [
  'Jim',
  'Crystal',
  'Nathan',
  'Samuel',
  'Anna',
  'Tom',
  'Diane',
  'Pat',
  'Gary',
  'Tina',
  'David',
  'Andy',
  'Joey',
  'Chris',
  'Sarah',
  'Spurf',
  'Elizabeth',
  'Melchizedek',
  'Sassel',
  'Grillbrick',
];

// The superclass of all roles
// Holds the data and the standard functionality shared amongst creeps.
export class Role {
  /**
   *
   * @param {string} name
   * @param {[BodyPartConstant]} body
   * @param {Creep} creep
   * @param {Memory} memory
   */
  constructor({ name, body = [WORK, CARRY, MOVE], creep, memory }) {
    /** @type {string} */
    this.name = name;
    /** @type {[BodyPartConstant]} */
    this.body = body;
    /** @type {Creep} */
    this.creep = creep;
    /** @type {Room} */
    this.room = creep.room;
    /** @type {Memory} */
    this.memory = memory;
    this.memory.role = name;
    this.memory.working = false;
  }

  /**
   * @returns {[Creep]}
   */
  creepsWith() {
    return _.filter(Game.creeps, c => c.memory.role === this.name);
  }

  run() {
    console.log(`Running ${this.name} creep: ${this.creep.name}`);
  }

  /** @param {Resource} target */
  pickup_or_move(target) {
    let code;
    if (typeof target === Resource) {
      code = this.creep.pickup(target);
    } else if (typeof target === Source) {
      code = this.creep.harvest(target);
    } else {
      code = this.creep.withdraw(target, RESOURCE_ENERGY);
    }

    if (code === ERR_NOT_IN_RANGE) {
      this.creep.moveTo(target);
    } else if (code !== OK) {
      console.error(`couldn't pickup resource ${target}: ${code}`);
    }
  }

  harvest() {
    // This harvests from any available energy - source if nothing is found
    // first we search for dropped energy
    let targets = [];
    let dropped = this.creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);

    if (dropped) {
      targets.push(dropped);
    }

    let tombstone = this.creep.pos.findClosestByPath(FIND_TOMBSTONES, {
      filter: t => t.store[RESOURCE_ENERGY] > 0,
    });

    if (tombstone) {
      targets.push(tombstone);
    }

    let ruin = this.creep.pos.findClosestByPath(FIND_RUINS, {
      filter: r => r.store[RESOURCE_ENERGY] > 0,
    });

    if (ruin) {
      targets.push(ruin);
    }

    let target = this.creep.pos.findClosestByPath(targets);

    if (target) {
      this.pickup_or_move(target);
    } else {
      target = this.creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
      this.pickup_or_move(target);
    }
  }

  /**
   *
   * @param {StructureSpawn} spawn
   */
  spawn(spawn) {
    spawn.spawnCreep(this.body, this.getRandomName(), {
      memory: this.memory,
    });
  }

  getRandomName() {
    for (let name of names) {
      if (Game.creeps[name]) {
        continue;
      } else {
        return name;
      }
    }
  }
}
