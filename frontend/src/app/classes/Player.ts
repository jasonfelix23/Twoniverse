import { Direction, PlayerImages, Hitbox } from "../types/types";

export class Player {
  x: number;
  y: number;
  width: number;
  height: number;
  images: PlayerImages;
  hitbox: Hitbox;
  framewidth: number;
  currentFrame: number;
  elapsedFrames: number;
  currentDirection: Direction;
  isMoving: boolean;

  constructor(x: number, y: number, images: PlayerImages) {
    this.x = x;
    this.y = y;
    this.framewidth = 32;
    this.width = 64;
    this.height = 60;
    this.images = images;
    this.hitbox = {
      width: this.width * 0.25,
      height: this.height * 0.25,
    };
    this.currentFrame = 0;
    this.elapsedFrames = 0;
    this.currentDirection = "down";
    this.isMoving = false;
  }

  move(dx: number, dy: number) {
    this.x += dx;
    this.y += dy;
    this.isMoving = dx !== 0 || dy !== 0;

    if (dx > 0) this.currentDirection = "right";
    else if (dx < 0) this.currentDirection = "left";
    else if (dy > 0) this.currentDirection = "down";
    else if (dy < 0) this.currentDirection = "up";

    if (this.isMoving) {
      this.elapsedFrames++;
      if (this.elapsedFrames >= 10) {
        this.elapsedFrames = 0;
        this.currentFrame = (this.currentFrame + 1) % 3;
      }
    } else {
      this.currentFrame = 0;
      this.elapsedFrames = 0;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const currentImage = this.images[this.currentDirection];

    ctx.drawImage(
      currentImage,
      this.currentFrame * this.framewidth,
      0,
      this.framewidth,
      currentImage.height,
      this.x,
      this.y,
      this.width,
      this.height
    );

    ctx.save();
    ctx.font = "14px Arial";
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.textAlign = "center";

    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 1;

    const nameY = this.y - 5;
    ctx.fillText("Jason", this.x + this.width / 2, nameY);
    ctx.restore();

    // Debug hitbox
    ctx.strokeStyle = "yellow";
    ctx.strokeRect(
      this.x + (this.width - this.hitbox.width) / 2,
      this.y + (this.height - this.hitbox.height) / 2,
      this.hitbox.width,
      this.hitbox.height
    );
  }

  getHitbox() {
    return {
      left: this.x + (this.width - this.hitbox.width) / 2,
      right: this.x + (this.width + this.hitbox.width) / 2,
      top: this.y + (this.height - this.hitbox.height) / 2,
      bottom: this.y + (this.height + this.hitbox.height) / 2,
    };
  }

  updateDimensions(scale: number) {
    this.width = 64 * scale;
    this.height = 60 * scale;
    this.hitbox = {
      width: this.width * 0.25,
      height: this.height * 0.25,
    };
  }
}
