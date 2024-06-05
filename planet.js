function Planet(position, mass, radius, isGoal, isBonus) {
  this.position = position;
  this.mass = mass;
  this.radius = radius;
  this.isGoal = isGoal;
  this.isBonus = isBonus;
  this.isVisible = true;
}

Planet.prototype.draw = function () {
  var fill = this.isGoal ? greyFill : this.isBonus ? greenFill : blueFill;
  if (this.isVisible)
    drawCircle(this.position.x, this.position.y, this.radius, fill);
};
