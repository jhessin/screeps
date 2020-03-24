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
module.exports = function() {
  StructureSpawn.prototype.createCreep =
		function(energy, role) {
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
		      if (!Game.creeps[`BB${i}`]) {
		        this.spawnCreep(body, `BB${i}`, { working: false });
		      }
		    }
		  } else {
		    return this.spawnCreep(body, null, { role, working: false });
		  }
		};
};