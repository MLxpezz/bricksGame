class Game {
  canvasWidth = 800;
  canvasHeight = 800;
  play = false;
  ballPosX = 350;
  ballPosY = 550;
  ballDirX = 2;
  ballDirY = 5;
  ballColor = "white";
  arrBlocks = [];

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

    requestAnimationFrame(this.init);
  }

  logic() {
    this.playerDirection();
    this.drawBall();
    this.drawBlocks();
    this.blockCollision();

    if(this.player.positionX + 70 >= this.canvasWidth) {
      this.player.positionX = this.canvasWidth - 70;
    } else if(this.player.positionX <= 0) {
      this.player.positionX = 0;
    }
  }

  playerDirection() {
    document.addEventListener("keypress", (e) => {
      this.play = true;
      if (e.key === "d") {
        this.player.setDirection("right");
      } else if (e.key === "a") {
        this.player.setDirection("left");
      }
    });
  }

  drawBall() {
    this.ctx.fillStyle = "white";
    this.ctx.beginPath();
    this.ctx.arc(this.ballPosX, this.ballPosY, 10, 0, 2 * Math.PI, false);
    this.ctx.fill();
    this.ballColission();
  }

  ballColission() {
    if (this.play) {
      // Actualiza la posición de la pelota según las velocidades
      this.ballPosX += this.ballDirX;
      this.ballPosY -= this.ballDirY;
  
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
      }
    }
  }

  drawBlocks() {
    this.ctx.fillStyle = "white";

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
    this.arrBlocks.push(new Array(8));
    this.arrBlocks.push(new Array(8));
    this.arrBlocks.push(new Array(8));

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
          }
        }
      }
    }
  }
}

new Game();
