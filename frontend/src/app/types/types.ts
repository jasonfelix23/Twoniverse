export type Direction = "down" | "up" | "left" | "right";

export type PlayerImages = {
  down: HTMLImageElement | null;
  up: HTMLImageElement | null;
  left: HTMLImageElement | null;
  right: HTMLImageElement | null;
};

export type Hitbox = {
  width: number;
  height: number;
};

export type PlayerState = {
  id: string;
  x: number;
  y: number;
  direction: Direction;
  isMoving: boolean;
  name: string;
  inProximity: boolean;
};

export interface LoginResponse {
  token: string;
}
