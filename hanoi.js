var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d");

var colors = ["#C03", "yellow", "grey", "green", "orange", "brown", "Magenta","DeepSkyBlue"];


function Game(startDisk) {
  this.startDisk = startDisk;
  this.towers = [];
  this.solves = [];

  this.init();
  this.start();
}

Game.prototype.init = function() {
  var towerA = new Tower(100, this.startDisk);
  var towerB = new Tower(300);
  var towerC = new Tower(500);
  this.towers = [towerA, towerB, towerC];
  this.draw();
};

Game.prototype.start = function() {
  this.solveShow();
};

Game.prototype.solveShow = function() {
  var self = this;

  var towers = this.towers;
  this.solve(this.startDisk, towers[0], towers[1], towers[2]);

  var solves = this.solves;
  var n = solves.length;
  function tryNext(i) {
    if (i >= n) return;
    setTimeout(function() {
      self.move(solves[i].from, solves[i].to);
      self.draw();
      tryNext(i+1);
    }, 600);
  }
  tryNext(0);
}

Game.prototype.solve = function(n, a, b, c) {
  if (n == 1) return this.solves.push({from: a, to: c});
  this.solve(n-1, a, c, b);
  this.solves.push({from: a, to: c});
  this.solve(n-1, b, a, c);
};

Game.prototype.move = function(from, to) {
  var disk = from.disks.pop();
  to.disks.push(disk);
};

Game.prototype.draw = function() {
  this.drawGrid(ctx, "lightgrey", 20, 20);
  this.towers.forEach(function(tower) {
    tower.drawDisk();
  });
};

Game.prototype.drawGrid = function(ctx, color, stepx, stepy) {
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


function Disk(value, color) {
  this.value = value;
  this.color = color;
}


function Tower(position, diskNumber) {
  this.position = position;
  this.diskNumber = diskNumber;
  this.disks = [];

  this.addDisks();
}

Tower.prototype.addDisks = function() {
  var i = this.diskNumber;
  if (i == undefined) return;
  while(i > 0) {
    var disk = new Disk(i, i-1);
    this.disks.push(disk);
    i--;
  }
};

Tower.prototype.drawDisk = function() {
  var self = this;

  var m, n, o = 300;
  ctx.save();
  this.disks.forEach(function(disk) {
    m = self.position - 10 * disk.value;
    n = self.position + 10 * disk.value;
    ctx.strokeStyle = colors[disk.color];
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(m, o);
    ctx.lineTo(n, o);
    ctx.closePath();
    ctx.stroke();
    o = o - 15;
  });
  ctx.restore();
}


new Game(4);