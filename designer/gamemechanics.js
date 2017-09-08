function keypressed(e)
{
	//alert(e.keyCode);
	if(e.keyCode == 32 && !flying)
	{
		mode = 1 - mode;
		objDragging = undefined;
		dragging = false;
		reset();
	}
	
	//c pressed
	if(e.keyCode == 67 && mode == edit)
	{
		breadCrumbsCanvases = [];
		breadCrumbsImg = undefined;
	}
	//d pressed
	if(e.keyCode == 68 && mode == edit)
	{
		if(objDragging)
			if(objDragging != player)
				if(objDragging.isGoal == false)
					for(p in planets)
						if(planets[p] == objDragging)
							planets.splice(p, 1);
	}
	
	//b pressed
	if(e.keyCode == 66 && mode == edit)
	{
		planets.push(new Planet(currMousePos, 10, 5, false, true));
	}
	
	//p pressed
	if(e.keyCode == 80 && mode == edit)
	{
		planets.push(new Planet(currMousePos, 900, 50, false, false));
	}
	
	if(objDragging)
		if(objDragging != player)
			if(objDragging.isBonus == false)
				switch (e.keyCode)
				{
					case 37:
						objDragging.mass = Math.max(5, objDragging.mass - 5);
						break;
					case 38:
						objDragging.radius += 5;
						break;
					case 39:
						objDragging.mass = Math.min(5000, objDragging.mass + 5);
						break;
					case 40:
						objDragging.radius = Math.max(5, objDragging.radius - 5);
						break;
				}
	
	setLevelDefinition();
}

function reset()
{
	if(flying || player.crashed)
	{
		player.arrivedAtGoal = false;
		player.position = player.startPos;
		player.direction = player.lastLaunchDir;
		player.crashed = false;
		if(flying) flying = !flying;
		breadCrumbsColorNDX++;
		player.distTraveled = 0;
		for(p in planets)
			planets[p].isVisible = true;
	}
}
function mouseDown(e) {

	var clickPoint = getCursorPosition(e);
	touchPt = new Vector(clickPoint[0], clickPoint[1]);
	
	if(mode == edit)
	{
		if(touchPt.dist(player.position) < player.radius)
		{
			objDragging = player;
			draggingOffset = player.position.vecTo(touchPt);
		}
		else
		{
			for(p in planets)
			{
				if(touchPt.dist(planets[p].position) < planets[p].radius)
				{
					objDragging = planets[p];
					draggingOffset = planets[p].position.vecTo(touchPt);
				}
			}
		
		}
		if(!objDragging)
			dragging = true;
	}
	else
	{	
		if(player.arrivedAtGoal)
		{
			reset();
		}
		else if(!flying && !player.crashed)
		{
			dragging = true;
		}
	}
}

function mouseMove(e) {
	var clickPoint = getCursorPosition(e);
	var clickpt = new Vector(clickPoint[0], clickPoint[1]);
	currMousePos = clickpt;
	
	if(objDragging)
	{
		objDragging.position = clickpt.add(draggingOffset);
		player.startPos = player.position;
		setLevelDefinition();
	}
	
	if(dragging)
	{
		player.direction = clickpt.vecTo(touchPt);
		player.lastLaunchDir = clickpt.vecTo(touchPt);
		setLevelDefinition();
	}
	
}

function mouseUp(e) {
	
	if(objDragging)
		objDragging = undefined;
	
	if(dragging)
	{
		if(mode == test)
		{
			flying = true;
			player.lastLaunchDir = player.direction;
			breadCrumbs[breadCrumbsColorNDX] = [];
			savedSinceLastStop = false;
		}
		dragging = false;
	}
	else
	{
		reset();
	}
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
	reallyLoad();
}
function reallyLoad()
{
	document.getElementById("canvas").innerHTML = '<canvas id="theCanvas" width="'+width+'" height="'+height+'" >You need to use Firefox, Google Chrome or IE 9 to Play"</canvas>';
	canvas = document.getElementById("theCanvas");
	context = canvas.getContext("2d");
	document.onkeydown = keypressed;
	canvas.addEventListener('mousedown', mouseDown, false);
	canvas.addEventListener('mousemove', mouseMove, false);
	canvas.addEventListener('mouseup',   mouseUp, false);
	
	player = new Player(new Vector(100,100), new Vector(30,45), 5, 20);
	planets.push(new Planet(new Vector(700,700), 5, 20, true, false));
	
	setLevelDefinition();
	updateGame();
}

function setLevelDefinition()
{
	openLevelCode(true);
}

function levelChanged(level)
{
	try {
		var level = eval(level);
	}
	catch (e)
	{
		if (e instanceof SyntaxError)
		{
			alert(e.message);
		}
		return;
	}
	
	planets = [];
	player = undefined;
	player = level[0];
	player.position = player.position.add(levelAdj.scale(-1));
	player.startPos = player.position;
	player.arrivedAtGoal = false;
	breadCrumbsNDX = 0;
	breadCrumbs = [];
	breadCrumbsColorNDX = 0;
	breadCrumbs[breadCrumbsColorNDX] = [];
	
	for(var i=1; i<level.length; ++i)
	{
		planets.push(level[i]);
		planets[planets.length-1].position = planets[planets.length-1].position.add(levelAdj.scale(-1));
	}
}

function openLevelCode(refresh)
{

	if(refresh)
	{
		if(loadLevelWindow)
		{
			if(!loadLevelWindow.closed)
			{
				loadLevelWindow.document.getElementById("leveldef").value = getLevelDefinition();
			}
		}
	}
	else
	{
		if(!loadLevelWindow || loadLevelWindow.closed)
		{
			loadLevelWindow=window.open('','','width=600,height=600,location=no');
			loadLevelWindow.document.write('<head><title>Load Level</title></head><textarea id="leveldef" onchange="levelChanged()" cols="70" rows="30">' + getLevelDefinition() + '</textarea><br>');
			loadLevelWindow.document.write('<center><button onClick="window.opener.levelChanged(document.getElementById(\'leveldef\').value);">Load Level</button></center>');
		}
		else
		{
			loadLevelWindow.document.getElementById("leveldef").value = getLevelDefinition();
			loadLevelWindow.focus();
		}
	}
}

function getLevelDefinition()
{
	var def = '[new Player(new Vector(' + player.startPos.add(levelAdj).value() + '), new Vector(' + player.lastLaunchDir.value() + '), ' + player.mass + ', ' + player.radius + '),';
	for(p in planets)
	{
		def += '\n new Planet(new Vector(' + planets[p].position.add(levelAdj).value() + '), ' + planets[p].mass + ', ' + planets[p].radius + ', ' + planets[p].isGoal + ', ' + planets[p].isBonus + ')';
		if(p < planets.length-1)
			def += ',';
	}
	def += '];';
	return def;
}

//this is called for every frame to update the location of the objects in the game
function updateGame()
{
	if(flying)
	{
		for (p in planets)
			player.applyGravity(planets[p]);

		if(breadCrumbsNDX >= breadCrumbsMaxNDX && player.position.x > screenLeft && player.position.x < screenRight && player.position.y > screenTop && player.position.y < screenBottom)
		{
			breadCrumbs.push(player.position);
			breadCrumbsNDX = 0;
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
						player.levelScore += (player.distTraveled/attempts);
						player.arrivedAtGoal = true;
					}
				}
			}
		}
	}
	var time = new Date().getTime();
	redraw();
	
	setTimeout( function(){	 updateGame(); }, 30-(new Date().getTime()-time));
};