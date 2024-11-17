import { Direction, PlayerImages, Hitbox, PlayerState } from "../types/types";

export class Player {
  id: string;
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
  name: string;
  inProximity: boolean;
  proximityRadius: number;

  constructor(
    id: string,
    x: number,
    y: number,
    images: PlayerImages,
    name: string,
    scale: number = 1
  ) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.framewidth = 32;
    this.width = 64 * scale;
    this.height = 60 * scale;
    this.images = images;
    this.hitbox = {
      width: this.width * 0.25,
      height: this.height * 0.25,
    };
    this.currentFrame = 0;
    this.elapsedFrames = 0;
    this.currentDirection = "down";
    this.isMoving = false;
    this.name = name;
    this.inProximity = false;
    this.proximityRadius = this.width * 2;
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

  draw(ctx: CanvasRenderingContext2D, isMainPlayer: boolean = false) {
    const currentImage = this.images[this.currentDirection];

    if (!currentImage) return;

    // Draw proximity circle for main player
    if (isMainPlayer && this.proximityRadius) {
      ctx.beginPath();
      ctx.arc(
        this.x + this.width / 2,
        this.y + this.height / 2,
        this.proximityRadius,
        0,
        Math.PI * 2
      );
      //   ctx.strokeStyle = "rgba(43, 222, 216, 0.1)";
      //   ctx.stroke();
      ctx.fillStyle = "rgba(43, 222, 216, 0.1)";
      ctx.fill();
    }

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

    //Draw player name with background
    const namePadding = 4;
    const nameMetrics = ctx.measureText(this.name);
    const nameWidth = nameMetrics.width + namePadding * 2;
    const nameHeight = 20;
    const nameX = this.x + this.width / 2 - nameWidth / 2;
    const nameY = this.y - 25;

    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(nameX, nameY, nameWidth, nameHeight);

    // Name text
    ctx.font = "14px Arial";
    ctx.fillStyle = this.inProximity
      ? "rgba(0, 255, 0, 0.8)"
      : "rgba(255, 255, 255, 0.8)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 1;

    ctx.fillText(this.name, this.x + this.width / 2, nameY + nameHeight / 2);
    ctx.restore();

    // Debug hitbox
    if (isMainPlayer) {
      ctx.strokeStyle = "yellow";
      ctx.strokeRect(
        this.x + (this.width - this.hitbox.width) / 2,
        this.y + (this.height - this.hitbox.height) / 2,
        this.hitbox.width,
        this.hitbox.height
      );
    }
  }

  checkProximity(otherPlayer: Player): boolean {
    const dx =
      this.x + this.width / 2 - (otherPlayer.x + otherPlayer.width / 2);
    const dy =
      this.y + this.height / 2 - (otherPlayer.y + otherPlayer.height / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= this.proximityRadius;
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

  getState(): PlayerState {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      direction: this.currentDirection,
      isMoving: this.isMoving,
      name: this.name,
      inProximity: this.inProximity,
    };
  }

  setState(state: Partial<PlayerState>) {
    if (state.x !== undefined) this.x = state.x;
    if (state.y !== undefined) this.y = state.y;
    if (state.direction !== undefined) this.currentDirection = state.direction;
    if (state.isMoving !== undefined) this.isMoving = state.isMoving;
    if (state.inProximity !== undefined) this.inProximity = state.inProximity;
  }
}
