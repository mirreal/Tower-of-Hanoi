var canvas = document.getElementById("canvas"),
	ctx = canvas.getContext("2d");


var towerA = [],
	towerB = [],
	towerC = [],
	colors = [];
	

colors = ["#C03", "yellow", "grey", "green", "orange", "brown", "Magenta","DeepSkyBlue"];
towerA = [{w:3,c:0}, {w:2,c:4}, {w:1,c:1}];


drawTower(towerA);



function drawTower(tower) {
	drawGrid(ctx, "lightgrey", 20, 20);
	drawLine();
	var m,
		n,
		o = 300;
	ctx.save();
	for (var i = 0; i < tower.length; i++) {
		m = 100 - 10 * tower[i].w;
		n = 100 + 10 * tower[i].w;
		ctx.strokeStyle = colors[tower[i].c];
		ctx.lineWidth = 10;
		ctx.beginPath();
		ctx.moveTo(m, o);
		ctx.lineTo(n, o);
		ctx.closePath();
		ctx.stroke();
		o = o - 15;
	}
	ctx.restore();
}

function drawLine() {
	var m = 100;
	ctx.save();
	ctx.strokeStyle = "rgba(0, 0, 0, 0.8)";
	ctx.lineWidth = 4;
	for (var i = 0; i < 3; i++) {
		ctx.beginPath();
		ctx.moveTo(m, 40);
		ctx.lineTo(m, 300);
		ctx.closePath();
		ctx.stroke();
		m = m + 160;
	}
	ctx.restore();
}

function drawGrid(ctx, color, stepx, stepy) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.save();
	ctx.strokeStyle = color;
	ctx.lineWidth = 0.5;

	for (var i = stepx + 0.5; i < ctx.canvas.width; i += stepx) {
		ctx.beginPath();
		ctx.moveTo(i, 0);
		ctx.lineTo(i, ctx.canvas.height);
		ctx.stroke();
		ctx.closePath();
	}
	
	for (var i = stepy + 0.5; i < ctx.canvas.height; i += stepy) {
		ctx.beginPath();
		ctx.moveTo(0, i);
		ctx.lineTo(ctx.canvas.width, i);
		ctx.stroke();
		ctx.closePath();
	}
	ctx.restore();
}