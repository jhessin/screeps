// import modules
require('./prototype.creep')();
require('./prototype.spawn')();

// Creep roles
const roleBucket = require('./role.bucket');
const roleHarvester = require('./role.harvester');
const roleUpgrader = require('./role.upgrader');
const roleBuilder = require('./role.builder');
const roleRepairer = require('./role.repairer');
const roleWallRepairer = require('./role.wallRepairer');

// Structure roles
const roleTower = require('./role.tower');

// Constants
const c = require('./constants');

// setup some minimum numbers for different roles
const MIN_HARVESTERS = 1;
const MIN_UPGRADERS = 1;
const MIN_BUILDERS = 1;
const MIN_REPAIRERS = 1;
const MIN_WALL_REPAIRERS = 1;

// The main entry point for the program
module.exports.loop = function() {
  console.log('----------------------');
  // check for memory entries of died creeps by iterating over Memory.creeps
  for (let name in Memory.creeps) {
    // and checking if the creep is still alive
    if (!Game.creeps[name]) {
      // if not, delete the memory entry
      delete Memory.creeps[name];
    }
  }

  // Loop through all the creeps and assign roles
  for (let name in Game.creeps) {
    // get the creep object
    let creep = Game.creeps[name];

    // if creep is harvester, call harvester script
    if (creep.memory.role === c.HARVESTER) {
      roleHarvester.run(creep);
    }
    // if creep is upgrader, call upgrader script
    else if (creep.memory.role === c.UPGRADER) {
      roleUpgrader.run(creep);
    }
    // if creep is builder, call builder script
    else if (creep.memory.role === c.BUILDER) {
      roleBuilder.run(creep);
    } else if (creep.memory.role === c.REPAIRER) {
      roleRepairer.run(creep);
    } else if (creep.memory.role === c.WALL_REPAIRER) {
      roleWallRepairer.run(creep);
    } else if (creep.name.startsWith('BB')) {
      roleBucket.run(creep);
    } else {
      // default to repair just in case
      creep.memory.role = c.REPAIRER;
      roleRepairer.run(creep);
    }
  }

  // count the number of creeps alive for each role
  // _.sum will count the number of properties in Game.creeps filtered by the
  //  arrow function, which checks for the creep being a harvester
  let numberOfHarvesters = _.sum(
    Game.creeps,
    crp => crp.memory.role === c.HARVESTER? 1 : 0
  );
  let numberOfUpgraders = _.sum(
    Game.creeps,
    crp => crp.memory.role === c.UPGRADER? 1 : 0
  );
  let numberOfBuilders = _.sum(
    Game.creeps,
    crp => crp.memory.role === c.BUILDER? 1 : 0
  );
  let numberOfRepairers = _.sum(
    Game.creeps,
    crp => crp.memory.role === c.REPAIRER? 1 : 0
  );
  let numberOfWallRepairers = _.sum(
    Game.creeps,
    crp => crp.memory.role === c.WALL_REPAIRER? 1 : 0
  );
  let numberOfBuckets = _.sum(Game.creeps, crp => crp.name.startsWith('BB')? 1 : 0);

  console.log(`Harvesters: ${numberOfHarvesters}`);
  console.log(`Upgraders: ${numberOfUpgraders}`);
  console.log(`Builders: ${numberOfBuilders}`);
  console.log(`Repairers: ${numberOfRepairers}`);
  console.log(`Wall Repairers: ${numberOfWallRepairers}`);
  console.log(`Bucket Brigade: ${numberOfBuckets}`);

  // Loop through each spawn and spawn if necessary.
  for (let name in Game.spawns) {
    let spawn = Game.spawns[name];
    let energy = spawn.room.energyCapacityAvailable;

    // STRUCTURE ROLES
    let towers = spawn.room.find(FIND_STRUCTURES, {
      filter: {
        structureType: STRUCTURE_TOWER
      }
    });

    for (let tower of towers) {
      roleTower.run(tower);
    }

    // if not enough harvesters
    if (numberOfHarvesters < MIN_HARVESTERS) {
      // try to spawn one
      // name = roleHarvester.build(spawn);
      name = spawn.createCreep(energy, c.HARVESTER);

      if (name === ERR_NOT_ENOUGH_ENERGY && numberOfHarvesters === 0) {
        name = spawn.createCreep(spawn.room.energyAvailable, c.HARVESTER);
      }
    }
    // if not enough upgraders
    else if (numberOfUpgraders < MIN_UPGRADERS) {
      // try to spawn one
      name = spawn.createCreep(energy, c.UPGRADER);
    }
    // if not enough repairers
    else if (numberOfRepairers < MIN_REPAIRERS) {
      // try to spawn one
      name = spawn.createCreep(energy, c.REPAIRER);
    }
    // if not enough builders
    else if (numberOfBuilders < MIN_BUILDERS) {
      // try to spawn one
      name = spawn.createCreep(energy, c.BUILDER);
    } else if (numberOfWallRepairers < MIN_WALL_REPAIRERS) {
      name = spawn.createCreep(energy, c.WALL_REPAIRER);
    } else if (numberOfBuckets < c.NUM_BUCKETS) {
      name = spawn.createCreep(energy, c.BUCKETIER);
    } else {
      // DEFAULT to Upgraders
      name = spawn.createCreep(energy, c.UPGRADER);
    }

    // print name to console if spawning was a success
    // name > 0 would not work since string > 0 returns false
    if (name && !(name < 0)) {
      let creep = Game.creeps[name];
      console.log('Spawned new ' + creep.memory.role + ' creep: ' + name);
    }
  }
};
