//Colors
var redFill = "rgba(255,0,0,1)"
var greenFill = "rgba(34,139,34,1)"
var orangeFill = "rgba(255,140,0,1)"
var blueFill = "rgba(0,0,255,1)"
var blackFill = "rgba(0,0,0,1)"
var whiteFill = "rgba(255,255,255,1)"
var lightblueFill = "rgba(100,100,255,1)"
var greyFill = "rgba(255,255,255,.5)"
var lightgreyFill = "rgba(200,200,200,1)"
var darkgreyFill = "rgba(169,169,169,1)"
var brownFill = "rgba(139,69,19,1)"
var purpleFill = "rgba(170,0,255,1)"

function getTextWidth(text, font)
{
	context.font = typeof font == 'undefined' ? 'italic bold 15px sans-serif' : font;
	var val = context.measureText(text);
	return val.width;
}

//draws text to screen, font is optional
function drawText(x, y, text, color, font)
{
	context.fillStyle = color;
	context.font = typeof font == 'undefined' ? 'italic bold 15px sans-serif' : font;
	context.textBaseline = 'bottom';
	context.fillText(text, x, y);
};
function strokeText(x, y, text, color, font)
{
	context.strokeStyle = color;
	context.font = typeof font == 'undefined' ? 'bold 15px sans-serif' : font;
	context.lineWidth = 9;
	context.textBaseline = 'bottom';

	context.fillStyle = whiteFill;
	context.lineWidth = 3;
	context.fillText(text, x, y);
	
	context.strokeText(text, x, y);
	
};

function saveToNewCanvas()
{
	var backCanvas = document.createElement('canvas');
	backCanvas.width = canvas.width;
	backCanvas.height = canvas.height;
	var backCtx = backCanvas.getContext('2d');
	
	
	backCtx.drawImage(canvas,0,0);
	
	return backCanvas;
}

function drawCanvasToCurrentCanvas(storedCanvas, alpha)
{
	var bkCanvas = storedCanvas;
	var bkContext = bkCanvas.getContext('2d');
	context.globalAlpha = alpha;	
	context.drawImage(bkCanvas,0,0);
}

function redraw()
{		
	canvas.width = canvas.width;
	
	//save the breadCrumbs to an Canvas
	if(!savedSinceLastStop && !flying)
	{      
    currBreadCrumbsImg = undefined;
		context.save();
		context.scale(scaleX, scaleY);
		context.translate(width/scaleX/2, height/scaleY/2);
	
		for (b in breadCrumbs)
		{
      drawRect(breadCrumbs[b].x, breadCrumbs[b].y, 2, 2, breadCrumbsColor(breadCrumbsColorNDX));
		}
		drawArrow(player.startPos.x, player.startPos.y, player.startPos.x + player.lastLaunchDir.x, player.startPos.y + player.lastLaunchDir.y, breadCrumbsColor(breadCrumbsColorNDX));
		
		breadCrumbs = [];
		
		breadCrumbsCanvases.push(saveToNewCanvas());
		breadCrumbsColorNDX++;
		savedSinceLastStop = true;
		context.restore();	
	}
	
	context.fillStyle = blackFill;
	context.fillRect(0,0,width,height);
	context.fill();
	
	if(breadCrumbsImg)
		context.drawImage(breadCrumbsImg,0,0);
	
	for (img in breadCrumbsCanvases)
	{
		if(img < breadCrumbsCanvases.length-4)
		{
			if(breadCrumbsCanvases[img])
			{		
				drawCanvasToCurrentCanvas(breadCrumbsCanvases[img], .35);
				
				breadCrumbsImg = new Image();
				breadCrumbsImg.src = canvas.toDataURL("image/png");
				breadCrumbsCanvases.splice(img,1);
			}
		}
		else
		{
			var alpha = 1-(breadCrumbsCanvases.length-(1+parseInt(img)))*.12;
			drawCanvasToCurrentCanvas(breadCrumbsCanvases[img], alpha);
		}
	}
  if(currBreadCrumbsImg)
		context.drawImage(currBreadCrumbsImg, 0, 0);
	
	context.globalAlpha = 1;	
    context.save();
	context.scale(scaleX, scaleY);
	context.translate(width/scaleX/2, height/scaleY/2);
		
	
  
  for (var b = Math.max(0,breadCrumbs.length-numBreadCrumbsDraw); b < breadCrumbs.length; ++b)
  {
    drawRect(breadCrumbs[b].x, breadCrumbs[b].y, 2, 2, breadCrumbsColor(breadCrumbsColorNDX));
    
    if(!savedSinceLastStop)
      drawArrow(player.startPos.x, player.startPos.y, player.startPos.x + player.lastLaunchDir.x, player.startPos.y + player.lastLaunchDir.y, breadCrumbsColor(breadCrumbsColorNDX));	
  }
  if(currNumBreadCrumbsDrawn >= numBreadCrumbsDraw)
  {
    currBreadCrumbsImg = new Image();
    currBreadCrumbsImg.src = canvas.toDataURL("image/png");
    currNumBreadCrumbsDrawn = 0;
  }
	for (p in planets)
		planets[p].draw();
	player.draw();
  
  for(p in particles)
  {
    drawRect(particles[p].pos.x, particles[p].pos.y, 4,4, redFill);
  }
	
	if(dragging || (!flying && !player.crashed))
	{
		var mousept = player.position.add(player.direction.scale(1.3));
		drawText(mousept.x -10, mousept.y + 10, Math.floor(player.direction.x) + "," + Math.floor(player.direction.y), whiteFill, 'italic bold 15px sans-serif');
	}
	
	if(player.position.x < screenLeft-player.radius && player.position.y > screenTop+player.radius && player.position.y < screenBottom-player.radius)
		drawArrow(screenLeft+20, player.position.y, screenLeft+2, player.position.y, whiteFill);
	if(player.position.x > screenRight-player.radius && player.position.y > screenTop+player.radius && player.position.y < screenBottom-player.radius)
		drawArrow(screenRight-20, player.position.y, screenRight-2, player.position.y, whiteFill);
	if(player.position.y < screenTop-player.radius && player.position.x > screenLeft+player.radius && player.position.x < screenRight-player.radius)
		drawArrow(player.position.x, screenTop+20, player.position.x, screenTop+2, whiteFill);
	if(player.position.y > screenBottom+player.radius && player.position.x > screenLeft+player.radius && player.position.x < screenRight-player.radius)
		drawArrow(player.position.x, screenBottom-20, player.position.x, screenBottom-2, whiteFill);
		
	if(player.position.x < screenLeft+player.radius && player.position.y < screenTop+player.radius)
	{		
		var arrowStart = new Vector(screenLeft+20, screenTop+20);
		var dist = player.position.dist(arrowStart);
		var scale = 20/dist;
		var vec = player.position.vecTo(arrowStart);
		var svec = vec.scale(scale);
		var pvec = svec.add(arrowStart);
		drawArrow(arrowStart.x,arrowStart.y,pvec.x, pvec.y, whiteFill);
	}
	if(player.position.x > screenRight-player.radius && player.position.y < screenTop+player.radius)
	{
		var arrowStart = new Vector(screenRight-20, screenTop+20);
		var dist = player.position.dist(arrowStart);
		var scale = 20/dist;
		var vec = player.position.vecTo(arrowStart);
		var svec = vec.scale(scale);
		var pvec = svec.add(arrowStart);
		drawArrow(arrowStart.x,arrowStart.y,pvec.x, pvec.y, whiteFill);
	}	
	if(player.position.x < screenLeft+player.radius && player.position.y > screenBottom-player.radius)
	{		
		var arrowStart = new Vector(screenLeft+20, screenBottom-20);
		var dist = player.position.dist(arrowStart);
		var scale = 20/dist;
		var vec = player.position.vecTo(arrowStart);
		var svec = vec.scale(scale);
		var pvec = svec.add(arrowStart);
		drawArrow(arrowStart.x,arrowStart.y,pvec.x, pvec.y, whiteFill);
	}
	if(player.position.x > screenRight-player.radius && player.position.y > screenBottom-player.radius)
	{
		var arrowStart = new Vector(screenRight-20, screenBottom-20);
		var dist = player.position.dist(arrowStart);
		var scale = 20/dist;
		var vec = player.position.vecTo(arrowStart);
		var svec = vec.scale(scale);
		var pvec = svec.add(arrowStart);
		drawArrow(arrowStart.x,arrowStart.y,pvec.x, pvec.y, whiteFill);
	}
  
	
	context.restore();
	
	
	
	var text = "Drag across the screen to set launch direction/speed. Release to launch";
	var fontSize = 25;//getAppropriateFontSize(text.length, width/2-10);
	var font = 'italic bold '+fontSize+'px sans-serif';
	var textWidth = getTextWidth(text, font);
	drawText(5, fontSize + 10, text, whiteFill, font);
	//drawText(5, 330, "Position : " + touchPt.x.toFixed(0) + "," + touchPt.y.toFixed(0), whiteFill, 'italic bold 15px sans-serif');
	//drawText(5, height-80, "dist: " + player.position.dist(new Vector(width/2, height/2)), whiteFill, 'italic bold 25px sans-serif');
	drawText(5, height-55, "Launch Attempts : " + breadCrumbsColorNDX, whiteFill, 'italic bold 25px sans-serif');
	drawText(5, height-30, "Last Launch Direction : " + player.lastLaunchDir.x.toFixed(0) + "," + player.lastLaunchDir.y.toFixed(0), whiteFill, 'italic bold 25px sans-serif');
	drawText(5, height-5, "Current Distance Traveled: " + player.distTraveled.toFixed(1), whiteFill, 'italic bold 25px sans-serif');
	
	//drawText(10, 575, "Best Distance : " + player.maxDistTraveled.toFixed(1), whiteFill, 'italic bold 15px sans-serif');
	//drawText(10, 590, "Best Direction : " + player.bestLaunch.x.toFixed(0) + "," + player.bestLaunch.y.toFixed(0), whiteFill, 'italic bold 15px sans-serif');
	
	if(outOfRange)
	{
		var text = "Out of Range. Click to Reset";
		centerText(text);
	}
	
	if(player.arrivedAtGoal)
	{
		if(currentLevel == levels.length-1)
		{
			message = "Nice Job, You won. Click to Start Over";
		}
		else
		{
			message = "Nice Job, You won. Click the screen to go to next level";
		}
			
	}
  
  if(message != undefined)
    drawMessage();
	
};

function drawMessage()
{
  roundRect(width/10, height/10, 8*width/10, 8*height/10, 25, lightblueFill);
  drawTextPos(message, 8*width/10, height/4);
}

function roundRect(x, y, width, height, radius, color)
{
	context.fillStyle = color;
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
  context.fill();      
}

function drawTextPos(text, textWidth, y)
{
	var fontSize = getAppropriateFontSize(text.length, textWidth);
	var font = 'italic bold '+fontSize+'px sans-serif';
	var textWidth = getTextWidth(text, font);
	var offSet = width/2 - textWidth/2;
	drawText(offSet, y, text, whiteFill, font);
}

function centerText(text)
{
  drawTextPos(text, width-10, height/2);
}

function drawArrow(fromx, fromy, tox, toy, fill){
    var headlen = 10;   // length of head in pixels
    var angle = Math.atan2(toy-fromy,tox-fromx);
	context.beginPath()
	context.lineWidth = 3;
	context.strokeStyle = fill;
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.lineTo(tox-headlen*Math.cos(angle-Math.PI/6),toy-headlen*Math.sin(angle-Math.PI/6));
    context.moveTo(tox, toy);
    context.lineTo(tox-headlen*Math.cos(angle+Math.PI/6),toy-headlen*Math.sin(angle+Math.PI/6));
	context.stroke();
}

//generic draw rectangle function
function drawRect(x1,y1,x2,y2,color)
{
	context.beginPath();
	context.fillStyle = color;
	context.fillRect(x1,y1,x2,y2);
	context.closePath();
	context.fill();
};

//only used for boss health outline
function drawBox(x1,y1,x2,y2,color)
{
	context.beginPath();
	context.fillStyle = color;
	context.strokeRect(x1,y1,x2,y2);
	context.closePath();
	context.fill();
};

//only used for drawing the weapon type
function drawCircle(x,y,radius,color)
{
	context.beginPath();
	context.fillStyle = color;
	context.arc(x, y, radius, 0, Math.PI*2,false);
	context.closePath();	
	context.fill();
};