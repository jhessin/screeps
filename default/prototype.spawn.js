// prototype.spawn.js
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

			return this._createCreep(body, null, { role, working: false })
		}
};