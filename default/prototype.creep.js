module.exports = function() {
  if (!Creep.prototype._moveTo) {
    Creep.prototype._moveTo = Creep.prototype.moveTo;

    Creep.prototype.moveTo = function(target) {
      this._moveTo(target, {
        visualizePathStyle: {
          stroke: '#ffffff',
          strokeWidth: 0.2,
          opacity: 0.3,
          lineStyle: 'dashed',
          fill: 'transparent'
        }
      });
    };
  }
};
