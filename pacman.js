var fieldSize = 16;
var candyScore = 10;
var candySize = 4;
var score = 0;
var scale = 16;
var gameSpeed = 150;
var numGhosts = 3;

var maps = [
  [
    "################",
    "# # # # # # #  #",
    "# # # # # # #  #",
    "# #   # # # #  #",
    "# # # # # # #  #",
    "#   #   #   #  #",
    "#   # # #   #  #",
    "# #       # #  #",
    "# # # # # # #  #",
    "# # # # #   #  #",
    "#     # #   #  #",
    "  # #   #####   ",
    "# #   # #      #",
    "# # #   # ## # #",
    "# # #   # #### #",
    "############## #"
  ],
  [
    "################",
    "#              #",
    "# ##########   #",
    "#       #      #",
    "#       #      #",
    "#       #      #",
    "#       ########",
    "#              #",
    "#         #    #",
    "#   ############",
    "#              #",
    "#     #        #",
    "#     #        #",
    "#    ###########",
    "#              #",
    "################"
  ]
];


var canvas = document.getElementById("screen");
var ctx = canvas.getContext("2d");


function MovingObject(game) {
  console.log("MovingObject", arguments);
  this.game = game;
  this.dir = [0, 0];
  //  this.reset();
}

MovingObject.prototype.reset = function() {
  this.x = 1;
  this.y = 1;
  this.dir = [0, 0];
  this.fillStyle = "yellow";
  this.strokeStyle = "blue";
};

MovingObject.prototype.draw = function() {
  ctx.beginPath();
  ctx.arc(this.x * scale + scale / 2, this.y * scale + scale / 2, scale / 2, 0, 2 * Math.PI);
  ctx.fillStyle = this.fillStyle;
  ctx.strokeStyle = this.strokeStyle;
  ctx.fill();
  ctx.stroke();
};


MovingObject.prototype.maybeMove = function(xd, yd) {
  var r = this.canMoveTo(this.x + xd, this.y + yd);
  if (r) {
    this.x = r[0];
    this.y = r[1];
    return true;
  }
  return false;
};

MovingObject.prototype.up = function() {
  this.dir = [0, -1];
};

MovingObject.prototype.down = function() {
  this.dir = [0, 1];
};

MovingObject.prototype.left = function() {
  this.dir = [-1, 0];
};

MovingObject.prototype.right = function() {
  this.dir = [1, 0];
};

MovingObject.prototype.canMoveTo = function(x, y) {
  if (x < 0) {
    x += fieldSize;
  }
  if (y < 0) {
    y += fieldSize;
  }
  if (x >= fieldSize) {
    x -= fieldSize;
  }
  if (y >= fieldSize) {
    y -= fieldSize;
  }
  if (this.game.field.at(x, y) !== '#') {
    return [x, y];
  }
  return false;
};



function PacMan(game) {
  MovingObject.call(this, game);
  this.fillStyle = "yellow";
  this.strokeStyle = "blue";
  this.reset();
}

PacMan.prototype = Object.create(MovingObject.prototype);
PacMan.constructor = PacMan;

// returns true if moved
PacMan.prototype.update = function() {
  return this.maybeMove(this.dir[0], this.dir[1]);
};


function Ghost(game) {
  MovingObject.call(this, game);

  this.fillStyle = "orange";
  this.strokeStyle = "white";

  this.reset();
}

Ghost.prototype = Object.create(MovingObject.prototype);
Ghost.constructor = Ghost;

Ghost.prototype.reset = function() {
  do {
    this.x = Math.floor(Math.random() * 15);
    this.y = Math.floor(Math.random() * 15);
  } while (this.game.field.at(this.x, this.y) === '#');
};

Ghost.prototype.update = function() {
  if ((this.dir[0] == 0 && this.dir[1] == 0) ||
    (Math.random() < 0.25) ||
    (!this.maybeMove(this.dir[0], this.dir[1]))) {
    switch (Math.floor(Math.random() * 4)) {
      case 0:
        this.dir = [-1, 0];
        break;
      case 1:
        this.dir = [1, 0];
        break;
      case 2:
        this.dir = [0, -1];
        break;
      case 3:
        this.dir = [0, 1];
        break;
    }
    return false;
  } else {
    return true;
  }
};



function Field(map) {
  this.map = map;
  this.reset();
}

Field.prototype.at = function(x, y) {
  return this._state[y][x];
};

Field.prototype.set = function(x, y, c) {
  this._state[y][x] = c;
};

Field.prototype.reset = function() {
  this.numCandy = 0;
  this._state = this.map.map(function(row) {
    return row.split('').map(function(x) {
      if (x !== '#') {
        this.numCandy++;
        return ".";
      } else {
        return "#";
      }
    }.bind(this));
  }.bind(this));
};


Field.prototype.draw = function() {
  ctx.beginPath();
  ctx.rect(0, 0, 255, 255);
  ctx.strokeStyle = "lightblue";
  ctx.fillStyle = "black";
  ctx.fill();

  for (var y = 0; y < fieldSize; y++) {
    for (var x = 0; x < fieldSize; x++) {
      if (this._state[y][x] == '#') {
        ctx.beginPath();
        ctx.rect(x * scale, y * scale, scale, scale);
        ctx.fillStyle = "green";
        ctx.fill();
        ctx.stroke();
      } else if (this._state[y][x] == '.') {
        ctx.beginPath();
        ctx.rect((x * scale) + (scale / 2) - (candySize / 2),
          (y * scale) + (scale / 2) - (candySize / 2),
          candySize,
          candySize);
        ctx.fillStyle = "yellow";
        ctx.fill();
        ctx.stroke();
      }
    }
  }
}

function Game(map) {
  this.score = 0;
  this.map = map;
}

Game.prototype.start = function() {
  this.field = new Field(this.map);
  this.pacman = new PacMan(this);
  
  this.ghosts = [];
  for(var i = 0; i < numGhosts; i++) {
  	this.ghosts.push(new Ghost(this));
  }
  this.timer = setInterval(function() {
    this.update();
    this.draw();
  }.bind(this), gameSpeed);
}

Game.prototype.update = function() {
  this.pacman.update();
  this.ghosts.forEach(function(ghost) {
    ghost.update();
  });
  var px = this.pacman.x,
    py = this.pacman.y;

  if (this.field.at(px, py) === '.') { // Candy!!
    this.score++;
    document.getElementById('score').innerText = this.score;
    this.field.set(px, py, ' ');
    this.field.numCandy--;
    console.log("left: ", this.field.numCandy);
    if (this.field.numCandy == 0) {
      alert("You win!");
      this.gameOver();
    }
  }
  this.ghosts.forEach(function(ghost) {
    if (px === ghost.x && py === ghost.y) {
      this.gameOver();
    }
  }.bind(this));
}

Game.prototype.gameOver = function() {
  clearInterval(this.timer);
  alert('Game Over!');
  this.score = 0;
  this.start();
}

Game.prototype.draw = function() {
  this.field.draw();
  this.pacman.draw();
  this.ghosts.forEach(function(ghost) {
    ghost.draw();
  });
}

var game = new Game(maps[1]);
game.start();

window.onkeydown = function(e) {
  var r = false;
  switch (e.key) {
    case "ArrowUp":
    case "w":
      r = game.pacman.up();
      break;
    case "ArrowDown":
    case "s":
      r = game.pacman.down();
      break;
    case "ArrowLeft":
    case "a":
      r = game.pacman.left();
      break;
    case "ArrowRight":
    case "d":
      r = game.pacman.right();
      break;
  }
};
