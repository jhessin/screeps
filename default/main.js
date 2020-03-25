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

const DEFAULT_ROLE = roleWallRepairer;

// Structure roles
const roleTower = require('./role.tower');

// Constants
const c = require('./constants');

// setup some minimum numbers for different roles
const MIN_HARVESTERS = 1;
const MIN_UPGRADERS = 4;
const MIN_BUILDERS = 1;
const MIN_REPAIRERS = 1;
const MIN_WALL_REPAIRERS = 5;

// The main entry point for the program
module.exports.loop = function () {
  console.log('----------------------');
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
  let buckets = _.filter(Game.creeps, crp => crp.name.startsWith('BB'));
  let numberOfBuckets = buckets.length;

  console.log(`${numberOfHarvesters} Harvesters: ${harvesters}`);
  console.log(`${numberOfUpgraders} Upgraders: ${upgraders}`);
  console.log(`${numberOfBuilders} Builders: ${builders}`);
  console.log(`${numberOfRepairers} Repairers: ${repairers}`);
  console.log(`${numberOfWallRepairers} Wall Repairers: ${wallRepairers}`);
  console.log(`${numberOfBuckets} Bucket Brigade: ${buckets}`);

  // Loop through each spawn and spawn if necessary.
  for (let spawnName in Game.spawns) {
    let spawn = Game.spawns[spawnName];
    let energy = spawn.room.energyCapacityAvailable;
    let name;
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
      name = spawn.spawnCustom(energy, c.HARVESTER);

      if (name === ERR_NOT_ENOUGH_ENERGY && numberOfHarvesters === 0) {
        name = spawn.spawnCustom(spawn.room.energyAvailable, c.HARVESTER);
      }
    } else if (numberOfUpgraders < MIN_UPGRADERS) {
      name = spawn.spawnCustom(energy, c.UPGRADER);
    } else if (numberOfRepairers < MIN_REPAIRERS) {
      name = spawn.spawnCustom(energy, c.REPAIRER);
    } else if (numberOfBuilders < MIN_BUILDERS) {
      name = spawn.spawnCustom(energy, c.BUILDER);
    } else if (numberOfWallRepairers < MIN_WALL_REPAIRERS) {
      name = spawn.spawnCustom(energy, c.WALL_REPAIRER);
    }
    else {
      name = spawn.spawnCustom(energy, c.UPGRADER);
    }

    // print name to console if spawning was a success
    // name > 0 would not work since string > 0 returns false
    if (typeof name === 'string') {
      let creep = Game.creeps[name];
      console.log('Spawned new ' + creep.memory.role + ' creep: ' + name);
    }
  }
};
