//player object
//params     y the location to start the player at, y = 0 is top of screen
function Player(positionVec, directionVec, mass, radius)
{	
	this.startPos = positionVec;
	this.lastLaunchDir = directionVec;
	this.position = positionVec;
	this.direction = directionVec;
	this.mass = mass;
	this.radius = radius;
	this.crashed = false;
	this.distTraveled = 0;
	this.maxDistTraveled = 0;
	this.bestLaunch = new Vector(0,0);
	this.arrivedAtGoal = false;
	this.levelScore = 0;
	this.totalScore = 0;
	
	this.draw = function()
	{
		drawCircle(this.position.x, this.position.y, this.radius, redFill);
		
		if(!flying && !this.crashed)
		{			
			drawArrow(this.position.x, this.position.y, this.position.x + this.direction.x, this.position.y + this.direction.y, orangeFill);
		}
	};
	
	this.updatePosition = function()
	{
		this.position = this.position.add(this.direction.scale(.1));
		if(flying)
		{
			this.distTraveled += this.direction.dist(new Vector(0,0));
			if(this.maxDistTraveled <= this.distTraveled)
			{
				this.maxDistTraveled = this.distTraveled;
				this.bestLaunch = new Vector(this.lastLaunchDir.x, this.lastLaunchDir.y);
			}
		}
			
	};
	
	this.applyGravity = function(planet)
	{
		var dist = this.position.dist(planet.position);		
		var gravity = grav_const*((planet.mass * this.mass)/Math.pow(dist,2));
		this.direction = this.direction.add(planet.position.vecTo(this.position).scale(gravity));
	}
}