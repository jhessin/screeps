const roleHarvester = require('role.harvester');

module.exports.loop = function () {
  for(let name in Game.creeps){
    const creep = Game.creeps[name];
    roleHarvester.run(creep);
  }
};
