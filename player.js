//player object
//params     y the location to start the player at, y = 0 is top of screen
function Player(positionVec, directionVec, mass, radius) {
  this.startPos = positionVec;
  this.lastLaunchDir = directionVec;
  this.position = positionVec;
  this.direction = directionVec;
  this.mass = mass;
  this.radius = radius;
  this.crashed = false;
  this.distTraveled = 0;
  this.maxDistTraveled = 0;
  this.bestLaunch = new Vector(0, 0);
  this.arrivedAtGoal = false;
  this.levelScore = 0;
  this.totalScore = 0;
  this.numBonuses = 0;
  this.throwStartEnergy = 0;
  this.speed = 0;
  this.turn = -2;
  this.fade = 2;
  this.energy = 0;
  this.attempts = 0;

  this.draw = function () {
    drawCircle(this.position.x, this.position.y, this.radius, redFill);

    if (!flying && !this.crashed) {
      drawArrow(
        this.position.x,
        this.position.y,
        this.position.x + this.direction.x,
        this.position.y + this.direction.y,
        orangeFill
      );
    }
  };

  this.updatePosition = function (fakeFlying) {
    this.position = this.position.add(this.direction.scale(0.05));
    if (flying || fakeFlying) {
      this.distTraveled += this.direction.dist(new Vector(0, 0));
      this.energy -= 10;
      if (this.maxDistTraveled <= this.distTraveled) {
        this.maxDistTraveled = this.distTraveled;
        this.bestLaunch = new Vector(
          this.lastLaunchDir.x,
          this.lastLaunchDir.y
        );
      }
    }
  };

  this.leanFn = function (center, current) {
    return 20 - Math.abs(current - center);
  };

  this.applyDiscPhysics = function (drift) {
    let percentDone = (1 - this.energy / this.throwStartEnergy) * 100;
    this.position = this.position.add(
      new Vector(-this.turn * (this.leanFn(50, percentDone) / 12), 0)
    );
    this.position = this.position.add(
      new Vector((this.fade * -(10 + this.leanFn(100, percentDone))) / 40, 0)
    );

    if (drift) {
      this.position = this.position.add(drift);
    }
  };

  this.applyGravity = function (planet) {
    var dist = this.position.dist(planet.position);
    var gravity = grav_const * ((planet.mass * this.mass) / Math.pow(dist, 2));
    this.direction = this.direction.add(
      planet.position.vecTo(this.position).scale(gravity)
    );
  };
}
