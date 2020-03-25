// prototype.spawn.js
const c = require('./constants');

const NAMES = [
  'Jim',
  'Nathan',
  'Samuel',
  'Anna',
  'Crystal',
  'David',
  'Andy',
  'Joey',
  'Tom',
  'Diane',
  'Tina',
  'Gertrude',
  'Bertha',
  'George',
  'Clyde',
  'John',
  'Matthew',
  'Mark',
  'Luke',
  'Bethany',
  'Deborah',
  'Debbie',
  'Ezra',
  'Nehemiah',
  'Simian',
];
module.exports = function () {
  StructureSpawn.prototype.spawnCustom =
    function (energy, role) {
      let i;
      let numberOfParts = Math.floor(energy / 200);
      let body = [];

      for (i = 0; i < numberOfParts; i++) {
        body.push(WORK);
      }
      for (i = 0; i < numberOfParts; i++) {
        body.push(CARRY);
      }
      for (i = 0; i < numberOfParts; i++) {
        body.push(MOVE);
      }

      if (role === c.BUCKETIER) {
        for (i = 1; i < c.NUM_BUCKETS; i++) {
          let r = this.spawnCreep(body, `BB${i}`, {working: false});
          if (r === ERR_NAME_EXISTS) continue;
          return r;
        }
      } else {
        for (let name of NAMES) {
          if (!Game.creeps[name]) {
            return this.spawnCreep(body, name, {
              memory: {
                working: false,
                role
              }
            });
          }
        }
        return this.spawnCreep(body, Game.time, {
          memory: {
            working: false,
            role
          }
        });
      }
    };
};