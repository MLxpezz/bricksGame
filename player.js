class Player {
  direction = null;
  velocity = 5;
  width = 70;
  height = 15;
  color = "#db2ef2";

  constructor(ctx) {
    this.ctx = ctx;
    this.positionX = 365;
    this.positionY = 700;
    this.moveDirection = 0;
  }

  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.positionX, this.positionY, this.width, this.height);
    this.playerMovement();
  }

  playerMovement() {
    if (this.direction === "right") {
      this.positionX += this.velocity;
    } else if (this.direction === "left") {
      this.positionX -= this.velocity;
    } else {
      this.positionX += 0;
    }
  }

  setDirection(direction) {
    this.direction = direction;
  }
}
