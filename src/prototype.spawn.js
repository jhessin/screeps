// prototype.spawn.js
import c from './constants';

export const NAMES = [
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

export const DEFAULT_PARTS = [WORK, CARRY, MOVE];

export function getAvailableName() {
  for (let name of NAMES) {
    if (!Game.creeps[name]) {
      return name;
    }
  }
}

export default function() {
  const minerBody = [WORK, WORK, WORK, WORK, WORK, MOVE];
  let minerCost = _.sum(minerBody, p => BODYPART_COST[p]);

  Room.prototype.canMine = function() {
    return this.energyAvailable > minerCost;
  };
  StructureSpawn.prototype.spawnCustom = function(
    energy,
    role,
    partsToUse = DEFAULT_PARTS,
  ) {
    const costOfParts = _.sum(partsToUse, p => BODYPART_COST[p]);
    let i;
    let numberOfParts = Math.floor(energy / costOfParts);
    let body = [];

    for (let part of partsToUse) {
      for (i = 0; i < numberOfParts; i++) {
        body.push(part);
      }
    }
    let name = getAvailableName();

    return this.spawnCreep(body, name, {
      memory: {
        working: false,
        role,
      },
    });
  };

  StructureSpawn.prototype.spawnMiner = function(source, container) {
    let sourceId = source.id;
    let containerId = container.id;

    let creepName = getAvailableName();
    return this.spawnCreep(minerBody, creepName, {
      memory: {
        sourceId,
        containerId,
        role: c.MINER,
      },
    });
  };
}
