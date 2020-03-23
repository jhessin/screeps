// prototype.spawn.js
const c = require('constants');

module.exports = function() {
	if (!StructureSpawn.prototype._createCreep) {
		StructureSpawn.prototype._createCreep = StructureSpawn.prototype.createCreep;
	}
	StructureSpawn.prototype.createCreep =
		function(energy, role) {
			let numberOfParts = Math.floor(energy / 200);
			let body = [];

			for (var i = 0; i < numberOfParts; i++) {
				body.push(WORK);
			}
			for (var i = 0; i < numberOfParts; i++) {
				body.push(CARRY);
			}
			for (var i = 0; i < numberOfParts; i++) {
				body.push(MOVE);
			}

			if (role == c.BUCKETIER) {
				for (i = 1; i < c.NUM_BUCKETS; i++) {
					if (!Game.creeps[`BB${i}`]) {
						this._createCreep(body, `BB${i}`, { working: false });
                    }
                }
			} else {
				return this._createCreep(body, null, { role, working: false });
            }
		}
};