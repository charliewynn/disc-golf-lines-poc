function loadLevel(lv) {
  planets = [];
  particles = [];
  player = undefined;
  player = levels[lv][0];
  player.arrivedAtGoal = false;
  breadCrumbsNDX = 0;
  breadCrumbs = [];
  breadCrumbsColorNDX = 0;
  breadCrumbs[breadCrumbsColorNDX] = [];

  minX = player.position.x - player.radius;
  minY = player.position.y - player.radius;
  maxX = player.position.x + player.radius;
  maxY = player.position.y + player.radius;
  for (var i = 1; i < levels[lv].length; ++i) {
    minX = Math.min(minX, levels[lv][i].position.x - levels[lv][i].radius);
    minY = Math.min(minY, levels[lv][i].position.y - levels[lv][i].radius);
    maxX = Math.max(maxX, levels[lv][i].position.x + levels[lv][i].radius);
    maxY = Math.max(maxY, levels[lv][i].position.y + levels[lv][i].radius);
    planets.push(levels[lv][i]);
  }

  //scaleX = width/(maxX-minX);//, height/(maxY-minY));
  //scaleY = height/(maxY-minY);//scaleX;//height/(maxY-minY+200);
  var offset = -200;
  scaleX =
    Math.min(width / (maxX - minX + offset), height / (maxY - minY + offset)) /
    2;
  scaleY = scaleX; //height/(maxY-minY+200);

  var numGravSpotsToDraw = 20;
  gravMapPts = [];
  for (var i = -numGravSpotsToDraw / 2; i <= numGravSpotsToDraw / 2; ++i)
    for (var j = -numGravSpotsToDraw / 2; j <= numGravSpotsToDraw / 2; ++j) {
      var longer = Math.max(width, height);
      var pos = new Vector(i, j).scale(longer / scaleX / numGravSpotsToDraw);

      var pt = { pos: pos, dir: new Vector(0, 0) };
      for (p in planets) {
        var planetPos = planets[p].position;
        var dist = pt.pos.dist(planetPos);
        dist = Math.max(planets[p].radius + 25, dist);
        var gravity =
          grav_const * ((planets[p].mass * player.mass) / Math.pow(dist, 2));
        pt.dir = pt.dir.add(planetPos.vecTo(pt.pos).scale(gravity * 10));
      }
      gravMapPts.push(pt);
    }

  screenLeft = -width / scaleX / 2;
  screenRight = width / scaleX - width / scaleX / 2;
  screenTop = -height / scaleY / 2;
  screenBottom = height / scaleY - height / scaleY / 2;
}

var levels = [];

//short hop with bonuses
levels[0] = [
  new Player(new Vector(0, 300), new Vector(78, 35), 5, 20),
  new Planet(new Vector(320, 200), 1, 1, false, false),
  new Planet(new Vector(100, -50), 1, 60, false, true),
  new Planet(new Vector(-100, -400), 1, 70, false, true),
  new Planet(new Vector(0, -600), 5, 25, true, false),
];

//once around a planet  67 -24
levels[1] = [
  new Player(new Vector(-39, -133), new Vector(27, -64), 5, 20),
  new Planet(new Vector(-136, -38), 5, 20, true, false),
  new Planet(new Vector(0, 0), 1015, 100, false, false),
  new Planet(new Vector(-135, 28), 10, 5, false, true),
  new Planet(new Vector(-115, 79), 10, 5, false, true),
  new Planet(new Vector(-72, 115), 10, 5, false, true),
  new Planet(new Vector(-16, 132), 10, 5, false, true),
  new Planet(new Vector(43, 127), 10, 5, false, true),
  new Planet(new Vector(93, 96), 10, 5, false, true),
  new Planet(new Vector(126, 49), 10, 5, false, true),
  new Planet(new Vector(134, -7), 10, 5, false, true),
  new Planet(new Vector(123, -62), 10, 5, false, true),
  new Planet(new Vector(89, -107), 10, 5, false, true),
  new Planet(new Vector(43, -134), 10, 5, false, true),
];

//S shape for bonuses
levels[2] = [
  new Player(new Vector(-267, -297), new Vector(-69, 91), 5, 20),
  new Planet(new Vector(-161, -176), 900, 125, false, false),
  new Planet(new Vector(157, 107), 900, 120, false, false),
  new Planet(new Vector(272, 237), 10, 15, true, false),
  new Planet(new Vector(-211, -373), 10, 5, false, true),
  new Planet(new Vector(-165, -379), 10, 5, false, true),
  new Planet(new Vector(-102, -353), 10, 5, false, true),
  new Planet(new Vector(-42, -282), 10, 5, false, true),
  new Planet(new Vector(-7, -173), 10, 5, false, true),
  new Planet(new Vector(0, -48), 10, 5, false, true),
  new Planet(new Vector(3, 82), 10, 5, false, true),
  new Planet(new Vector(34, 196), 10, 5, false, true),
  new Planet(new Vector(91, 275), 10, 5, false, true),
  new Planet(new Vector(157, 308), 10, 5, false, true),
  new Planet(new Vector(217, 302), 10, 5, false, true),
  new Planet(new Vector(250, 273), 10, 5, false, true),
  new Planet(new Vector(-245, -339), 10, 5, false, true),
];

//have to orbit to get all of the bonuses, close to large planet
levels[3] = [
  new Player(new Vector(300, 300), new Vector(-67, -6), 5, 20),
  new Planet(new Vector(0, 0), 900, 150, false, false),
  new Planet(new Vector(-300, -300), 5, 20, true, false),
  new Planet(new Vector(-186, -98), 10, 5, false, true),
  new Planet(new Vector(-13, -200), 10, 5, false, true),
  new Planet(new Vector(161, -122), 10, 5, false, true),
  new Planet(new Vector(177, 92), 10, 5, false, true),
  new Planet(new Vector(-177, 129), 10, 5, false, true),
  new Planet(new Vector(2, 202), 10, 5, false, true),
];

//tricky tri-orbit -50, -19 to win
levels[4] = [
  new Player(
    new Vector(-11.272623387318902, 131.65897976546717),
    new Vector(-50, -50),
    5,
    20
  ),
  new Planet(new Vector(51, 48), 5, 20, true, false),
  new Planet(new Vector(-13, -82), 2045, 25, false, false),
  new Planet(new Vector(-118, -154), 5, 40, false, false),
  new Planet(new Vector(96, -149), 5, 35, false, false),
  new Planet(new Vector(-5, 49), 5, 35, false, false),
  new Planet(new Vector(-55, 81), 10, 5, false, true),
  new Planet(new Vector(-74, 38), 10, 5, false, true),
  new Planet(new Vector(-87, -40), 10, 5, false, true),
  new Planet(new Vector(-32, -157), 10, 5, false, true),
  new Planet(new Vector(52, -212), 10, 5, false, true),
  new Planet(new Vector(120, -222), 10, 5, false, true),
  new Planet(new Vector(162, -206), 10, 5, false, true),
  new Planet(new Vector(179, -172), 10, 5, false, true),
  new Planet(new Vector(166, -126), 10, 5, false, true),
  new Planet(new Vector(119, -71), 10, 5, false, true),
  new Planet(new Vector(58, -41), 10, 5, false, true),
  new Planet(new Vector(-49, -24), 10, 5, false, true),
  new Planet(new Vector(-147, -71), 10, 5, false, true),
  new Planet(new Vector(-190, -128), 10, 5, false, true),
  new Planet(new Vector(-206, -181), 10, 5, false, true),
  new Planet(new Vector(-186, -213), 10, 5, false, true),
  new Planet(new Vector(-144, -225), 10, 5, false, true),
  new Planet(new Vector(-78, -213), 10, 5, false, true),
  new Planet(new Vector(4, -157), 10, 5, false, true),
  new Planet(new Vector(76, -44), 10, 5, false, true),
];
