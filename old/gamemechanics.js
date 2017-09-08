function keypressed(e)
{
	if(e.keyCode == 32)
		reset();
	if(!flying && !player.crashed)
	{
		switch (e.keyCode)
		{
			case 37:
				player.direction.x -= 5;
				break;
			case 38:
				player.direction.y -= 5;
				break;
			case 39:
				player.direction.x += 5;
				break;
			case 40:
				player.direction.y += 5;
				break;
		}
	}
}

function getAppropriateFontSize(numChars, width)
{
	return (width/numChars)*2;
}

function reset()
{
	if(flying || player.crashed || outOfRange)
	{
		player.position = player.startPos;
		player.direction = player.lastLaunchDir;
		player.crashed = false;
		flying = false;
		outOfRange = false;
		player.distTraveled = 0;
		
		for(p in planets)
			planets[p].isVisible = true;
	}
}
function mouseDown(e) {

  if(message != undefined)
  {
    message = undefined;
  }
	if(player.arrivedAtGoal)
	{
		breadCrumbsCanvases = [];
		breadCrumbsImg = undefined;
		currBreadCrumbImg = undefined;
    currNumBreadCrumbsDrawn = 0
		if (window.location.host == "cwynn.com")
			saveScore();
		if(currentLevel == levels.length-1)
		{
			currentLevel = 0;
			loadLevel(0);
		}
		else
			loadLevel(++currentLevel);
	}
	else if(!flying && !player.crashed && !outOfRange)
	{
		var clickPoint = getCursorPosition(e);
		touchPt = new Vector(clickPoint[0], clickPoint[1]);
		dragging = true;
	}
}

function mouseMove(e) {
	var clickPoint = getCursorPosition(e);
	var clickpt = new Vector(clickPoint[0], clickPoint[1]);
	
	if(dragging)
		player.direction = clickpt.vecTo(touchPt);
    
  var len = Math.floor(player.direction.dist(new Vector(0,0)));
  var maxLenAllowed = 120;
  if(len > maxLenAllowed)
    player.direction = player.direction.scale(maxLenAllowed/len);
}

function mouseUp(e) {
	
	if(dragging)
	{
		flying = true;
		player.lastLaunchDir = player.direction;
		breadCrumbs = [];
		dragging = false;
		savedSinceLastStop = false;
	}
	else
		reset();
}

function getCursorPosition(e) {
	var x, y;
	if (e.pageX || e.pageY)
	{
	  x = e.pageX;
	  y = e.pageY;
	}
	else {
	  x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
	  y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
	
	x -= document.getElementById("theCanvas").offsetLeft;
	y -= document.getElementById("theCanvas").offsetTop;
	return [x,y];
}

function saveScore()
{
  if (window.XMLHttpRequest) // code for IE7+, Firefox, Chrome, Opera, Safari
  {
    xmlhttp=new XMLHttpRequest();
  }
  else // code for IE6, IE5
  {
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onreadystatechange=function()
  {
    if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
      var result = xmlhttp.responseText;
    }
  }
  xmlhttp.open("POST","savescore.php",true);
  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlhttp.send("level="+currentLevel+"&x="+player.lastLaunchDir.x+"&y="+player.lastLaunchDir.y+"&dist="+player.distTraveled+"&score="+player.levelScore);
}

function touchHandler(event)
{
    var touches = event.changedTouches,
        first = touches[0],
        type = "";
     
	switch(event.type)
    {
        case "touchstart": type = "mousedown"; break;
        case "touchmove":  type="mousemove"; break;        
        case "touchend":   type="mouseup"; break;
        default: return;
    }
	
    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, true, true, window, 1, 
                              first.screenX, first.screenY, 
                              first.clientX, first.clientY, false, 
                              false, false, false, 0/*left*/, null);

							  first.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
}	
	
function breadCrumbsColor(ndx)
{
	var red = parseInt(Math.sin(2.4*ndx + 0) * 127 + 128);
	var grn = parseInt(Math.sin(2.4*ndx + 2) * 127 + 128);
	var blu = parseInt(Math.sin(2.4*ndx + 4) * 127 + 128);
	var opa = 1;
	var col = "rgba("+red+","+grn+","+blu+","+opa+")";
	return col;
}

function byte2Hex(n)
{
	var nybHexString = "0123456789ABCDEF";
	return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
}
  
function didload()
{	
	document.documentElement.style.overflow = 'hidden';	 // firefox, chrome
	document.body.scroll = "no";
	width  = window.innerWidth;
	height = window.innerHeight;
	document.getElementById("canvas").innerHTML = '<canvas id="theCanvas" width="'+width+'" height="'+height+'" >You need to use Firefox, Google Chrome or IE 9 to Play"</canvas>';
	canvas = document.getElementById("theCanvas");
	context = canvas.getContext("2d");
	document.onkeydown = keypressed;
	canvas.addEventListener('mousedown', mouseDown, false);
	canvas.addEventListener('mousemove', mouseMove, false);
	canvas.addEventListener('mouseup',   mouseUp, false);
	
	document.addEventListener("touchstart", touchHandler, true);
  document.addEventListener("touchmove", touchHandler, true);
  document.addEventListener("touchend", touchHandler, true);
  document.addEventListener("touchcancel", touchHandler, true);
	
	loadLevel(currentLevel);
	updateGame();
}

//this is called for every frame to update the location of the objects in the game
function updateGame()
{
	var time = new Date().getTime();
  
  if(particles.length < numParticles)
  {
    var pDir = player.direction;
    if(flying)
      pDir = player.lastLaunchDir;
      particles.push({pos:player.startPos.add(new Vector(Math.random()-.5,Math.random()-.5).scale(0)),
                      dir:pDir.add(new Vector(Math.random()-.5, Math.random()-.5).scale(10)),
                      life:500});
  }
  
  for(var i=0; i<4; ++i)
  {
    for(part in particles)
    {
      for (p in planets)
      {
        var pa = particles[part];
        
        var dist = pa.pos.dist(planets[p].position);		
        var gravity = grav_const*((planets[p].mass * player.mass)/Math.pow(dist,2));
        pa.dir = pa.dir.add(planets[p].position.vecTo(pa.pos).scale(gravity));
        
      }
      pa.life--;
      if(pa.life <= 0)
        particles.splice(part, 1);
      pa.pos = pa.pos.add(pa.dir.scale(.05));
    }
  }
    
	if(flying)
	{
		for (p in planets)
			player.applyGravity(planets[p]);

		if(breadCrumbsNDX >= breadCrumbsMaxNDX && player.position.x > screenLeft && player.position.x < screenRight && player.position.y > screenTop && player.position.y < screenBottom)
		{
			breadCrumbs.push(player.position);
			breadCrumbsNDX = 0;
      currNumBreadCrumbsDrawn++;
		}
		breadCrumbsNDX++;
		player.updatePosition();
		
		for (p in planets)
		{
			if(planets[p].position.dist(player.position) <= player.radius + planets[p].radius)
			{
				if(planets[p].isBonus)
				{
					if(planets[p].isVisible)
					{
						player.levelScore += 500;
						planets[p].isVisible = false;
					}
				}
				else
				{
					player.crashed = true;
					flying = false;
					if(planets[p].isGoal)
					{
						player.levelScore += (player.distTraveled/(attempts+1));
						player.arrivedAtGoal = true;
					}
				}
			}
		}
		
		if(player.position.dist(new Vector(width/2, height/2)) > 2000)
		{
			flying = false;
			outOfRange = true;
		}
	}
	redraw();
	setTimeout( function(){	 updateGame(); }, 20-(new Date().getTime()-time));
};