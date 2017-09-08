var canvas;
var context;
var width  = window.innerWidth;
var	height = window.innerHeight;

var grav_const = .1;
		
var player;

var playing = false;

var planets = [];
var currentLevel = 0;

var breadCrumbsNDX = 0;
var breadCrumbs = [];
var breadCrumbsColorNDX = 0;


var breadCrumbsCanvases = [];
var breadCrumbsImg = undefined;
var currBreadCrumbsImg = undefined;

var numBreadCrumbsDraw = 100;
var currNumBreadCrumbsDrawn = 0;

var savedSinceLastStop = true;

var breadCrumbsMaxNDX = 4;

var flying = false;
var attempts = 0;
var dragging = false;

var touchPt = new Vector(0,0);

var scaleX = 1;
var scaleY = 1;
var minX = 0;
var minY = 0;
var maxX = 0;
var maxY = 0;

var screenLeft = 0;
var screenRight = width;
var screenTop = 0;
var screenBottom = height;
var outOfRange = false;
var particles = [];
var numParticles = 500;

var message = undefined;