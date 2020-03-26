// import modules
require('./prototype.creep')();
require('./prototype.spawn')();

const DEBUGGING = false;

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
const MIN_HARVESTERS = 4;
const MIN_UPGRADERS = 1;
const MIN_BUILDERS = 1;
const MIN_REPAIRERS = 2;
const MIN_WALL_REPAIRERS = 0;

// Set the default role for extras
const DEFAULT_ROLE = roleRepairer;

// The main entry point for the program
module.exports.loop = function () {
  // check for memory entries of died creeps by iterating over Memory.creeps
  for (let name in Memory.creeps) {
    // and checking if the creep is still alive
    if (!Game.creeps[name]) {
      // if not, delete the memory entry
      delete Memory.creeps[name];
    }
  }

  // run bucket creeps
  roleBucket.front();
  roleBucket.back();
  roleBucket.middle();

  // Loop through all the creeps and assign roles
  for (let name in Game.creeps) {
    // get the creep object
    let creep = Game.creeps[name];

    // can't do anything with a spawning creep.
    if (creep.spawning) continue;

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
    } else {
      DEFAULT_ROLE.run(creep);
    }
  }

  // count the number of creeps alive for each role
  // _.sum will count the number of properties in Game.creeps filtered by the
  //  arrow function, which checks for the creep being a harvester
  let harvesters = _.filter(Game.creeps, crp => crp.memory.role === c.HARVESTER);
  let numberOfHarvesters = harvesters.length;
  let upgraders = _.filter(
    Game.creeps,
    crp => crp.memory.role === c.UPGRADER
  );
  let numberOfUpgraders = upgraders.length;
  let builders = _.filter(
    Game.creeps,
    crp => crp.memory.role === c.BUILDER
  );
  let numberOfBuilders = builders.length;
  let repairers = _.filter(
    Game.creeps,
    crp => crp.memory.role === c.REPAIRER
  );
  let numberOfRepairers = repairers.length;
  let wallRepairers = _.filter(
    Game.creeps,
    crp => crp.memory.role === c.WALL_REPAIRER
  );
  let numberOfWallRepairers = wallRepairers.length;
  // let buckets = _.filter(Game.creeps, crp => crp.name.startsWith('BB'));
  // let numberOfBuckets = buckets.length;

  // Loop through each spawn and spawn if necessary.
  for (let spawnName in Game.spawns) {
    let spawn = Game.spawns[spawnName];
    let energy = spawn.room.energyCapacityAvailable;
    let result;
    // STRUCTURE ROLES
    let towers = spawn.room.find(FIND_STRUCTURES, {
      filter: {
        structureType: STRUCTURE_TOWER
      }
    });

    for (let tower of towers) {
      roleTower.run(tower);
    }

    // Spawn all of our creeps
    // Harvesters
    if (numberOfHarvesters < MIN_HARVESTERS) {
      result = spawn.spawnCustom(energy, c.HARVESTER);

      if (result === ERR_NOT_ENOUGH_ENERGY && numberOfHarvesters === 0) {
        result = spawn.spawnCustom(spawn.room.energyAvailable, c.HARVESTER);
      }
    } else if (numberOfUpgraders < MIN_UPGRADERS) {
      result = spawn.spawnCustom(energy, c.UPGRADER);
    } else if (numberOfRepairers < MIN_REPAIRERS) {
      result = spawn.spawnCustom(energy, c.REPAIRER);
    } else if (numberOfBuilders < MIN_BUILDERS) {
      result = spawn.spawnCustom(energy, c.BUILDER);
    } else if (numberOfWallRepairers < MIN_WALL_REPAIRERS) {
      result = spawn.spawnCustom(energy, c.WALL_REPAIRER);
    } else {
      result = spawn.spawnCustom(energy, c.UPGRADER);
    }

    // print name to console if spawning was a success
    // name > 0 would not work since string > 0 returns false
    if (result === OK || DEBUGGING) {
      console.log('----------------------');
      console.log(`${numberOfHarvesters} of ${MIN_HARVESTERS} Harvesters: ${harvesters}`);
      console.log(`${numberOfUpgraders} of ${MIN_UPGRADERS} Upgraders: ${upgraders}`);
      console.log(`${numberOfRepairers} of ${MIN_REPAIRERS} Repairers: ${repairers}`);
      console.log(`${numberOfBuilders} of ${MIN_BUILDERS} Builders: ${builders}`);
      console.log(`${numberOfWallRepairers} of ${MIN_WALL_REPAIRERS} Wall Repairers: ${wallRepairers}`);
    }
  }
};
