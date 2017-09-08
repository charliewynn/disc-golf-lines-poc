function Message()
{	

  this.scoreCounter = 0;
  this.scoreStop = (player.distTraveled + (500 * player.numBonuses)) / player.attempts;
  
  this.height = 0;
  this.growthRate = 15;
  this.heightStop = (8/10)*height;
  
  this.updating = true;
  this.growing = true;
  this.countingScore = false;
  this.scoreCountRate = 11111.1;
  this.oldScoreCountRate = this.scoreCountRate;
	
  this.update = function()
  {
    if(this.growing)
      this.updateSize();
    if(this.countingScore)
      this.updateScore();
      
    if(!this.growing && !this.countingScore)
      this.updating = false;
  };
  
  this.updateScore = function()
  {
    if(!this.countingScore)
      return;
      
    this.scoreCounter+=this.scoreCountRate;
    if(this.scoreCounter + this.scoreCountRate > this.scoreStop && this.scoreCountRate > .1)
    {
      this.scoreCountRate = Math.floor(this.scoreCountRate/10) + .1; 
    }
    else if(this.scoreCounter >= this.scoreStop)
    {
      this.countingScore = false;
      this.scoreCounter = this.scoreStop;
      this.scoreCountRate = this.oldScoreCountRate;
    }
  };
  
  this.updateSize = function()
  {
    if(!this.growing)
      return;
    this.height += this.growthRate;
    if(this.height >= this.heightStop)
    {
      this.growing = false;
      this.countingScore = true;
    }
  };
  
	this.draw = function()
	{
    roundRect(width/10, height/10, 8*width/10, this.height*(8*height/10)/this.heightStop, 25, lightblueFill);
    
    if(this.height > 20)
      drawTextPos("Nice Job! You beat level " + (currentLevel + 1), 8*width/10, height/10 + 10);
      
    if(this.height > 70)
      drawTextPos("(" + player.distTraveled.toFixed(1) + " traveled + 500x " + player.numBonuses + " bonuses ) / " + player.attempts + " tries = " + this.scoreCounter.toFixed(1),
                  8*width/10, height/2);
	};

}