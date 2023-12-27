class Game {
  canvasWidth = 800;
  canvasHeight = 800;
  play = false;
  count = 0;
  ballPosX = 350;
  ballPosY = 550;
  ballDirX;
  ballDirY;
  ballColor = "#db2ef2";
  brickColor = "#db2ef2";
  textColor = "#db2ef2";
  arrBlocks = [new Array(8), new Array(8), new Array(8)];
  totalBricks;
  score = 0;
  direction = "";

  constructor() {
    this.canvas = document.querySelector("canvas");
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
    this.ctx = this.canvas.getContext("2d");
    this.player = new Player(this.ctx);
    this.fillArr();
    this.init = this.init.bind(this);
    this.init();
  }

  init() {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.player.draw();
    this.logic();

    document.addEventListener("keypress", (e) => {
      if (e.key === " " && this.count === 0) {
        this.resetGame();
      }
    });
    requestAnimationFrame(this.init);
  }

  logic() {
    this.playerDirection();
    this.playerColisionCanvas();
    this.drawBall();
    this.ballColission();
    this.ballMovement();
    this.drawBlocks();
    this.blockCollision();
    this.drawScore();
    this.winText();
    this.loseText();
  }

  playerDirection() {
    document.addEventListener("keypress", (e) => {
      if (e.key === "d" && this.play) {
        this.player.setDirection("right");
      } else if (e.key === "a" && this.play) {
        this.player.setDirection("left");
      }
    });
  }

  playerColisionCanvas() {
    if (this.player.positionX + 70 >= this.canvasWidth) {
      this.player.positionX = this.canvasWidth - 70;
    } else if (this.player.positionX <= 0) {
      this.player.positionX = 0;
    }
  }

  resetGame() {
    this.count = 1;
    this.play = true;
    this.totalBricks = 24;
    this.score = 0;
    this.player.positionX = 350;
    this.player.positionY = 700;
    this.ballPosX = 350;
    this.ballPosY = 550;
    this.ballDirX = -5;
    this.ballDirY = -7;
    this.fillArr();
    document.querySelector('.ps').style.display = 'none';
  }

  drawBall() {
    this.ctx.fillStyle = this.ballColor;
    this.ctx.beginPath();
    this.ctx.arc(this.ballPosX, this.ballPosY, 10, 0, 2 * Math.PI, false);
    this.ctx.fill();
  }

  ballMovement() {
    if (this.play) {
      this.ballPosX += this.ballDirX;
      this.ballPosY += this.ballDirY;
    }
  }

  drawScore() {
    this.ctx.fillStyle = this.textColor;
    this.ctx.font = "25px Sans serif";
    this.ctx.fillText(`Puntaje: ${this.score}`, 600, 750, 100);
  }

  ballColission() {
    if (this.play) {
      // Detecta la colisión entre la pelota y los extremos del mapa
      if (this.ballPosX + 10 >= this.canvasWidth || this.ballPosX < 0) {
        this.ballDirX = -this.ballDirX;
      }
      // Detecta la colisión de la pelota con el extremo superior del mapa y con el jugador
      else if (
        this.ballPosY <= 0 ||
        (this.ballPosY + 10 >= this.player.positionY &&
          this.ballPosY <= this.player.positionY + this.player.height &&
          this.ballPosX >= this.player.positionX &&
          this.ballPosX + 10 <= this.player.positionX + this.player.width)
      ) {
        this.ballDirY = -this.ballDirY;
      } else if (this.ballPosY + 10 >= this.canvasHeight) {
        this.play = false;
        this.count = 0;
        this.player.setDirection('');
      }
    }
  }

  drawBlocks() {
    this.ctx.fillStyle = this.brickColor;

    for (let i = 0; i < this.arrBlocks.length; i++) {
      for (let j = 0; j < this.arrBlocks[0].length; j++) {
        this.ctx.fillRect(
          this.arrBlocks[i][j].x,
          this.arrBlocks[i][j].y,
          60,
          20
        );
      }
    }
  }

  fillArr() {
    for (let i = 0; i < this.arrBlocks.length; i++) {
      for (let j = 0; j < this.arrBlocks[0].length; j++) {
        let blockObj;
        this.arrBlocks[i][j] = blockObj = { x: j * 80 + 80, y: i * 45 + 50 };
      }
    }
  }

  blockCollision() {
    for (let i = 0; i < this.arrBlocks.length; i++) {
      for (let j = 0; j < this.arrBlocks[0].length; j++) {
        // Verifica la colisión solo si el bloque no ha sido golpeado antes
        if (this.arrBlocks[i][j] !== 0) {
          // Calcula los bordes del bloque
          let blockLeft = this.arrBlocks[i][j].x;
          let blockRight = this.arrBlocks[i][j].x + 60;
          let blockTop = this.arrBlocks[i][j].y;
          let blockBottom = this.arrBlocks[i][j].y + 20;

          // detecta si la pelota colisiono con un bloque
          if (
            this.ballPosY + 10 >= blockTop &&
            this.ballPosY <= blockBottom &&
            this.ballPosX + 10 >= blockLeft &&
            this.ballPosX <= blockRight
          ) {
            this.arrBlocks[i][j] = 0;
            this.ballDirY = -this.ballDirY;
            this.score += 5;
            this.totalBricks--;
          }
        }
      }
    }
  }

  loseText() {
    if (!this.play && this.ballPosY + 10 >= this.canvasHeight) {
      this.ctx.fillStyle = this.textColor;
      this.ctx.font = "25px Sans serif";
      this.ctx.fillText(
        `Perdiste, tu puntaje fue de: ${this.score}`,
        250,
        350,
        300
      );
      this.ctx.fillText(
        `Reinicia el juego presionando la tecla espacio`,
        200,
        400,
        400
      );
    }
  }

  winText() {
    if (this.totalBricks === 0) {
      this.play = false;
      this.ballDirX = 0;
      this.ballDirY = 0;
      this.player.setDirection('');
      this.count = 0;
      this.ctx.fillStyle = this.textColor;
      this.ctx.font = "25px Sans serif";
      this.ctx.fillText(
        `Ganaste!, tu puntaje fue de: ${this.score}`,
        250,
        350,
        300
      );
      this.ctx.fillText(
        `Reinicia el juego presionando la tecla espacio`,
        200,
        400,
        400
      );
    }
  }
}

new Game();
