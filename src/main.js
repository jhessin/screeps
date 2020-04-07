// import modules
import protoCreep from './prototype.creep';
protoCreep();
import protoSpawn from './prototype.spawn';
protoSpawn();

const DEBUGGING = false;

// Creep roles
import roleBucket from './role.bucket';
import roleHarvester from './role.harvester';
import roleUpgrader from './role.upgrader';
import roleBuilder from './role.builder';
import roleRepairer from './role.repairer';
import roleWallRepairer from './role.wallRepairer';
import roleMiner from './role.miner';

// Structure roles
import roleTower from './role.tower';

// Constants
import c from './constants';

// setup some minimum numbers for different roles
const MIN_HARVESTERS = 2;
const MIN_UPGRADERS = 1;
const MIN_BUILDERS = 1;
const MIN_REPAIRERS = 2;
const MIN_WALL_REPAIRERS = 1;

// Set the default role for extras
const DEFAULT_ROLE_NAME = c.REPAIRER;
const DEFAULT_ROLE = roleRepairer;

// The main entry point for the program
export function loop() {
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

  // Loop through each spawn and spawn if necessary.
  for (let spawnName in Game.spawns) {
    let spawn = Game.spawns[spawnName];
    let energy = spawn.room.energyCapacityAvailable;
    // Loop through all the creeps and assign roles
    let creepsInRoom = spawn.room.find(FIND_MY_CREEPS);
    for (let creep of creepsInRoom) {
      // can't do anything with a spawning creep.
      if (creep.spawning) continue;

      // if creep is harvester, call harvester script
      if (creep.memory.role === c.MINER) {
        roleMiner.run(creep);
      } else if (creep.memory.role === c.HARVESTER) {
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
    let harvesters = _.filter(
      Game.creeps,
      crp => crp.memory.role === c.HARVESTER,
    );
    let numHarvesters = harvesters.length;
    let upgraders = _.filter(
      Game.creeps,
      crp => crp.memory.role === c.UPGRADER,
    );
    let numUpgraders = upgraders.length;
    let builders = _.filter(Game.creeps, crp => crp.memory.role === c.BUILDER);
    let numBuilders = builders.length;
    let repairers = _.filter(
      Game.creeps,
      crp => crp.memory.role === c.REPAIRER,
    );
    let numRepairers = repairers.length;
    let wallRepairers = _.filter(
      Game.creeps,
      crp => crp.memory.role === c.WALL_REPAIRER,
    );
    let numWallRepairers = wallRepairers.length;
    let miners = _.filter(creepsInRoom, crp => crp.memory.role === c.MINER);
    let numMiners = miners.length;
    // let buckets = _.filter(Game.creeps, crp => crp.name.startsWith('BB'));
    // let numberOfBuckets = buckets.length;

    let result;
    // STRUCTURE ROLES
    let towers = spawn.room.find(FIND_STRUCTURES, {
      filter: {
        structureType: STRUCTURE_TOWER,
      },
    });

    for (let tower of towers) {
      roleTower.run(tower);
    }

    // Spawn all of our creeps

    // Spawn miners if possible
    if (spawn.room.canMine()) {
      let sources = spawn.room.find(FIND_SOURCES);
      for (let source of sources) {
        if (
          _.some(
            creepsInRoom,
            crp =>
              crp.memory.role === c.MINER && crp.memory.sourceId === source.id,
          )
        ) {
          continue;
        }
        let containers = source.pos.findInRange(FIND_STRUCTURES, 1, {
          filter: s => s.structureType === STRUCTURE_CONTAINER,
        });
        if (containers.length > 0) {
          result = spawn.spawnMiner(source, containers[0]);
          break;
        }
      }
    }
    // Harvesters
    if (!result) {
      if (numHarvesters < MIN_HARVESTERS) {
        result = spawn.spawnCustom(energy, c.HARVESTER);

        if (result === ERR_NOT_ENOUGH_ENERGY && numHarvesters === 0) {
          result = spawn.spawnCustom(spawn.room.energyAvailable, c.HARVESTER);
        }
      } else if (numUpgraders < MIN_UPGRADERS) {
        result = spawn.spawnCustom(energy, c.UPGRADER);
      } else if (numRepairers < MIN_REPAIRERS) {
        result = spawn.spawnCustom(energy, c.REPAIRER);
      } else if (numBuilders < MIN_BUILDERS) {
        result = spawn.spawnCustom(energy, c.BUILDER);
      } else if (numWallRepairers < MIN_WALL_REPAIRERS) {
        result = spawn.spawnCustom(energy, c.WALL_REPAIRER);
      } else {
        result = spawn.spawnCustom(energy, DEFAULT_ROLE_NAME);
      }
    }

    // print name to console if spawning was a success
    // name > 0 would not work since string > 0 returns false
    if (result === OK || DEBUGGING) {
      console.log('----------------------');
      console.log(`${numMiners} Miners: ${miners}`);
      console.log(
        `${numHarvesters} of ${MIN_HARVESTERS} Harvesters: ${harvesters}`,
      );
      console.log(
        `${numUpgraders} of ${MIN_UPGRADERS} Upgraders: ${upgraders}`,
      );
      console.log(
        `${numRepairers} of ${MIN_REPAIRERS} Repairers: ${repairers}`,
      );
      console.log(`${numBuilders} of ${MIN_BUILDERS} Builders: ${builders}`);
      console.log(
        `${numWallRepairers} of ${MIN_WALL_REPAIRERS} Wall Repairers: ${wallRepairers}`,
      );
    }
  }
}
