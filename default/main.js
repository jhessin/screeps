// import modules
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
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
    var minimumNumberOfHarvesters = 10;
    var minimumNumberOfUpgraders = 1;
    var minimumNumberOfBuilders = 1;
    var minimumNumberOfRepairers = 2;

    // count the number of creeps alive for each role
    // _.sum will count the number of properties in Game.creeps filtered by the
    //  arrow function, which checks for the creep being a harvester
    var numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == c.HARVESTER);
    var numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role == c.UPGRADER);
    var numberOfBuilders = _.sum(Game.creeps, (c) => c.memory.role == c.BUILDER);
    var numberOfRepairers = _.sum(Game.creeps, (c) => c.memory.role == c.REPAIRER);

    var name;
    for (let name in Game.spawns) {
        let spawn = Game.spawns[name];

        // if not enough harvesters
        if (numberOfHarvesters < minimumNumberOfHarvesters) {
            // try to spawn one
            name = roleHarvester.build(spawn);
        }
        // if not enough upgraders
        else if (numberOfUpgraders < minimumNumberOfUpgraders) {
            // try to spawn one
            name = roleUpgrader.build(spawn);
        }
        // if not enough repairers
        else if (numberOfRepairers < minimumNumberOfRepairers) {
            // try to spawn one
            name = roleRepairer.build(spawn);
        }
        // if not enough builders
        else if (numberOfBuilders < minimumNumberOfBuilders) {
            // try to spawn one
            name = roleBuilder.build(spawn);
        } else {
            // else try to spawn a builder
            name = roleRepairer.build(spawn);
        }

        // print name to console if spawning was a success
        // name > 0 would not work since string > 0 returns false
        if (!(name < 0)) {
            console.log("Spawned new " + creep.memory.role + " creep: " + name);
        }
    }
};