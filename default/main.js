// import modules
require('prototype.spawn')();

const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleRepairer = require('role.repairer');
const c = require('constants');

module.exports.loop = function() {
    // check for memory entries of died creeps by iterating over Memory.creeps
    for (let name in Memory.creeps) {
        // and checking if the creep is still alive
        if (!Game.creeps[name]) {
            // if not, delete the memory entry
            delete Memory.creeps[name];
        }
    }

    // for every creep name in Game.creeps
    for (let name in Game.creeps) {
        // get the creep object
        var creep = Game.creeps[name];

        // if creep is harvester, call harvester script
        if (creep.memory.role == c.HARVESTER) {
            roleHarvester.run(creep);
        }
        // if creep is upgrader, call upgrader script
        else if (creep.memory.role == c.UPGRADER) {
            roleUpgrader.run(creep);
        }
        // if creep is builder, call builder script
        else if (creep.memory.role == c.BUILDER) {
            roleBuilder.run(creep);
        } else if (creep.memory.role == c.REPAIRER) {
            roleRepairer.run(creep);
        } else {
            // default to repair
            roleRepairer.run(creep);
        }
    }

    // setup some minimum numbers for different roles
    var MIN_HARVESTERS = 10;
    var MIN_UPGRADERS = 1;
    var MIN_BUILDERS = 1;
    var MIN_REPAIRERS = 2;

    // count the number of creeps alive for each role
    // _.sum will count the number of properties in Game.creeps filtered by the
    //  arrow function, which checks for the creep being a harvester
    var numberOfHarvesters = _.sum(Game.creeps, (crp) => crp.memory.role == c.HARVESTER);
    var numberOfUpgraders = _.sum(Game.creeps, (crp) => crp.memory.role == c.UPGRADER);
    var numberOfBuilders = _.sum(Game.creeps, (crp) => crp.memory.role == c.BUILDER);
    var numberOfRepairers = _.sum(Game.creeps, (crp) => crp.memory.role == c.REPAIRER);

    console.log(`Harvesters: ${numberOfHarvesters}`);
    console.log(`Upgraders: ${numberOfUpgraders}`);
    console.log(`Builders: ${numberOfBuilders}`);
    console.log(`Repairers: ${numberOfRepairers}`);

    var name;
    for (let name in Game.spawns) {
        let spawn = Game.spawns[name];
        let energy = spawn.room.energyCapacityAvailable;

        // if not enough harvesters
        if (numberOfHarvesters < MIN_HARVESTERS) {
            // try to spawn one
            // name = roleHarvester.build(spawn);
            name = spawn.createCreep(energy, c.HARVESTER);
            
            if (name == ERR_NOT_ENOUGH_ENERGY && numberOfHarvesters == 0) {
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
        } else {
            // else try to spawn a builder
            name = spawn.createCreep(energy, c.REPAIRER);
        }

        // print name to console if spawning was a success
        // name > 0 would not work since string > 0 returns false
        if (name && !(name < 0)) {
            let creep = Game.creeps[name];
            console.log("Spawned new " + creep.memory.role + " creep: " + name);
        }
    }
};