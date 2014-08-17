function Canvas() {
  this.canvas = document.getElementById("canvas");
  this.context = canvas.getContext("2d");
  this.colors = ["#C03", "yellow", "green", "orange", "brown",
      "Magenta","DeepSkyBlue"];

  this.cursorShow = false;
  this.cursor = null;
}

Canvas.prototype.drawGrid = function(color, stepx, stepy) {
  var ctx = this.context;

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

Canvas.prototype.drawDisk = function(tower) {
  var self = this;

  var m, n, o = 300;
  var ctx = this.context;
  ctx.save();
  tower.disks.forEach(function(disk) {
    m = tower.position - 10 * disk.value;
    n = tower.position + 10 * disk.value;
    ctx.strokeStyle = self.colors[disk.color];
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(m, o);
    ctx.lineTo(n, o);
    ctx.closePath();
    ctx.stroke();
    o = o - 15;
  });

  if (this.cursorShow && this.cursor == tower) {
    ctx.beginPath();
    ctx.strokeStyle = 'grey';
    ctx.lineWidth = 6;
    ctx.moveTo(tower.position-5, o);
    ctx.lineTo(tower.position+5, o);
    ctx.closePath();
    ctx.stroke();
  }
  ctx.restore();
}


function EventHandler() {
  this.events = {};

  this.listen();
}

EventHandler.prototype.on = function(event, callback) {
  //if (!this.events[event]) this.events[event] = [];
  //this.events[event].push(callback);
  this.events[event] = callback;
}

EventHandler.prototype.emit = function(event) {
  var callback = this.events[event];
  if (callback) callback();
}

EventHandler.prototype.listen = function() {
  var self = this;

  document.addEventListener("keydown", function (event) {
    event.preventDefault();
    switch (event.keyCode) {
      case 37:
      case 65:
        self.emit('left');
        break;
      case 38:
      case 87:
        self.emit('up');
        break;
      case 39:
      case 68:
        self.emit('right');
        break;
      case 40:
      case 83:
        self.emit('down');
        break;
    }
  });
}

function Game(startDisk) {
  this.startDisk = startDisk;
  this.towers = [];
  this.solves = [];
  
  this.canvas = new Canvas();
  this.eventHandler = new EventHandler();

  this.eventHandler.on('left', this.moveLeft.bind(this));
  this.eventHandler.on('right', this.moveRight.bind(this));
  this.eventHandler.on('up', this.cursorUp.bind(this));
  this.eventHandler.on('down', this.cursorDown.bind(this));

  this.init();
  

  this.start();
}

Game.prototype.init = function() {
  var towerA = new Tower(100, this.startDisk, true);
  var towerB = new Tower(300);
  var towerC = new Tower(500);
  towerA.left  = towerC;
  towerA.right = towerB;
  towerB.left  = towerA;
  towerB.right = towerC;
  towerC.left  = towerB;
  towerC.right = towerA;
  this.towers  = [towerA, towerB, towerC];
  this.canvas.cursor = this.towers[0];
  this.draw();
};

Game.prototype.start = function() {
  var self = this;
  //this.solveShow();
};

Game.prototype.succuss = function() {
  if (this.towers[2].disks.length == this.startDisk) {
    alert('You won!');
  }
}

Game.prototype.moveLeft = function() {
  var self = this;

  for (var i = self.towers.length-1; i >= 0; i--) {
    if (self.towers[i].checked == true) {
      checkedTower = self.towers[i];
      var disk = checkedTower.disks[checkedTower.disks.length-1]
      if (!disk) return;
      var leftDisks = checkedTower.left.disks;
      if (leftDisks.length !== 0) {
        if (leftDisks[leftDisks.length-1].value < disk.value){
          return;
        }
      }
      disk = checkedTower.disks.pop();
      checkedTower.left.disks.push(disk);
      checkedTower.checked = false;
      checkedTower.left.checked = true;
      this.canvas.cursor = self.towers[i];
      
      break;
    }
  }
  if (this.canvas.cursor) this.canvas.cursor = this.canvas.cursor.left;
  this.draw();
}
Game.prototype.moveRight = function() {
  var self = this;

  for (var i = self.towers.length-1; i >= 0; i--) {
    if (self.towers[i].checked == true) {
      checkedTower = self.towers[i];
      var disk = checkedTower.disks[checkedTower.disks.length-1]
      if (!disk) return;
      var rightDisks = checkedTower.right.disks;
      if (rightDisks.length !== 0) {
        if (rightDisks[rightDisks.length-1].value < disk.value){
          return;
        }
      }
      disk = checkedTower.disks.pop();
      checkedTower.right.disks.push(disk);
      checkedTower.checked = false;
      checkedTower.right.checked = true;
      this.canvas.cursor = self.towers[i];
      break;
    }
  }
  if (this.canvas.cursor) this.canvas.cursor = this.canvas.cursor.right;
  this.draw();
}
Game.prototype.cursorUp = function() {
  var self = this;

  self.towers.forEach(function(tower) {
    tower.checked = false;
  });
  this.canvas.cursorShow = true;
  this.draw();
}
Game.prototype.cursorDown = function() {
  var self = this;

  if (this.canvas.cursor) this.canvas.cursor.checked = true;
  this.canvas.cursorShow = false;
  this.draw();
}


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
};

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
  var self = this;

  this.canvas.drawGrid("lightgrey", 20, 20);
  this.towers.forEach(function(tower) {
    self.canvas.drawDisk(tower);
  });
  this.succuss();
};


function Disk(value, color) {
  this.value = value;
  this.color = color;
}


function Tower(position, diskNumber, checked) {
  this.position = position;
  this.diskNumber = diskNumber;
  this.checked = checked;

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


new Game(4);