"use client";
import { useRef, useEffect, useState } from "react";
import mapLayout from "./../../../public/32_24_with_zoom.png";
import redPlayerDown from "../../../public/neo_red_down.png";
import redPlayerUp from "../../../public/neo_red_up.png";
import redPlayerLeft from "../../../public/neo_red_left.png";
import redPlayerRight from "../../../public/neo_red_right.png";
import { collisions } from "../utils/Collisions";

class Player {
  x: number;
  y: number;
  width: number;
  height: number;
  images: {
    down: HTMLImageElement;
    up: HTMLImageElement;
    left: HTMLImageElement;
    right: HTMLImageElement;
  };
  hitbox: { width: number; height: number };
  framewidth: number;
  currentFrame: number;
  elapsedFrames: number;
  currentDirection: "down" | "up" | "left" | "right";
  isMoving: boolean;

  constructor(
    x: number,
    y: number,
    images: {
      down: HTMLImageElement;
      up: HTMLImageElement;
      left: HTMLImageElement;
      right: HTMLImageElement;
    }
  ) {
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

    // Update direction based on movement
    if (dx > 0) this.currentDirection = "right";
    else if (dx < 0) this.currentDirection = "left";
    else if (dy > 0) this.currentDirection = "down";
    else if (dy < 0) this.currentDirection = "up";

    // Update animation frames
    if (this.isMoving) {
      this.elapsedFrames++;
      if (this.elapsedFrames >= 10) {
        // Adjust this value to control animation speed
        this.elapsedFrames = 0;
        this.currentFrame = (this.currentFrame + 1) % 3;
      }
    } else {
      this.currentFrame = 0;
      this.elapsedFrames = 0;
    }
  }

  draw(ctx: CanvasRenderingContext2D, scale: number) {
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

    // Draw player name
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
}
class Boundary {
  position: { x: number; y: number };
  width: number;
  height: number;

  constructor(x: number, y: number, tileSize: number) {
    this.position = { x: x, y: y };
    this.width = tileSize;
    this.height = tileSize;
  }
}

const MapLayout: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [players, setPlayers] = useState<Player[]>([]); //checking
  const [boundaries, setBoundaries] = useState<Boundary[]>([]);
  const [tileSize, setTileSize] = useState(16);
  const [isInitialized, setIsInitialized] = useState(false);

  const zoomFactor = 2;
  const MOVEMENT_SPEED = 1;
  const MAP_WIDTH = 32;
  const MAP_HEIGHT = 24;
  const ASPECT_RATIO = MAP_WIDTH / MAP_HEIGHT;

  const pressedKeys = useRef<Set<string>>(new Set());
  const lastKeyPressed = useRef<string | null>(null);
  const animationFrameId = useRef<number>();
  const playerImagesRef = useRef<{
    down: HTMLImageElement | null;
    up: HTMLImageElement | null;
    left: HTMLImageElement | null;
    right: HTMLImageElement | null;
  }>({
    down: null,
    up: null,
    left: null,
    right: null,
  });

  const setCanvasDimensions = () => {
    if (canvasRef.current) {
      const windowWidth = window.innerWidth * 0.75;
      const windowHeight = window.innerHeight;

      let canvasWidth = windowWidth;
      let canvasHeight = windowWidth / ASPECT_RATIO;

      if (canvasHeight > windowHeight) {
        canvasHeight = windowHeight;
        canvasWidth = windowHeight * ASPECT_RATIO;
      }

      canvasRef.current.width = canvasWidth;
      canvasRef.current.height = canvasHeight;

      const scaledTileSize = canvasWidth / MAP_WIDTH;
      setTileSize(scaledTileSize);

      createBoundaries(scaledTileSize);
    }
  };

  const drawImage = () => {
    if (canvasRef.current && imageRef.current && ctxRef.current) {
      ctxRef.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      ctxRef.current.drawImage(
        imageRef.current,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    }
  };

  const drawPlayers = () => {
    if (ctxRef.current) {
      players.forEach((player) => {
        player.draw(ctxRef.current!, zoomFactor);
      });
    }
  };

  const draw = () => {
    if (!ctxRef.current || !canvasRef.current) return;

    ctxRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    drawImage();
    drawCollisionTiles();
    drawPlayers();
  };

  useEffect(() => {
    setCanvasDimensions();
    if (canvasRef.current) {
      ctxRef.current = canvasRef.current.getContext("2d");
    }

    const handleResize = () => {
      setCanvasDimensions();
      updatePlayerPositionAndSize();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  const updatePlayerPositionAndSize = () => {
    if (canvasRef.current) {
      const scaleFactor = canvasRef.current.width / (MAP_WIDTH * 8);
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) => {
          const newPlayer = new Player(player.x, player.y, player.images);
          newPlayer.width = 64 * scaleFactor;
          newPlayer.height = 60 * scaleFactor;
          newPlayer.hitbox = {
            width: newPlayer.width * 0.5,
            height: newPlayer.height * 0.5,
          };
          return newPlayer;
        })
      );
    }
  };

  const createBoundaries = (currentTileSize: number) => {
    const newBoundaries: Boundary[] = [];

    for (let i = 0; i < MAP_HEIGHT; i++) {
      for (let j = 0; j < MAP_WIDTH; j++) {
        if (collisions[i * MAP_WIDTH + j] === 137) {
          newBoundaries.push(
            new Boundary(
              j * currentTileSize,
              i * currentTileSize,
              currentTileSize
            )
          );
        }
      }
    }
    setBoundaries(newBoundaries);
  };

  const drawCollisionTiles = () => {
    if (ctxRef.current) {
      const ctx = ctxRef.current;
      ctx.fillStyle = "rgba(255, 0, 0, 0.3)";

      boundaries.forEach((boundary) => {
        ctx.fillRect(
          boundary.position.x,
          boundary.position.y,
          boundary.width,
          boundary.height
        );
      });
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key.startsWith("Arrow")) {
      event.preventDefault();
      pressedKeys.current.add(event.key);
      lastKeyPressed.current = event.key;
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key.startsWith("Arrow")) {
      pressedKeys.current.delete(event.key);

      if (event.key === lastKeyPressed.current) {
        const remaining = Array.from(pressedKeys.current);
        lastKeyPressed.current =
          remaining.length > 0 ? remaining[remaining.length - 1] : null;
      }
    }
  };

  const updateMovement = () => {
    if (lastKeyPressed.current && players.length > 0) {
      const currentPlayer = players[0];
      let dx = 0;
      let dy = 0;

      switch (lastKeyPressed.current) {
        case "ArrowUp":
          dy = -MOVEMENT_SPEED;
          break;
        case "ArrowDown":
          dy = MOVEMENT_SPEED;
          break;
        case "ArrowLeft":
          dx = -MOVEMENT_SPEED;
          break;
        case "ArrowRight":
          dx = MOVEMENT_SPEED;
          break;
      }

      const newX = currentPlayer.x + dx;
      const newY = currentPlayer.y + dy;

      // Create a temporary player object to check collision
      const tempPlayer = new Player(newX, newY, currentPlayer.images);
      tempPlayer.width = currentPlayer.width;
      tempPlayer.height = currentPlayer.height;
      tempPlayer.hitbox = currentPlayer.hitbox;

      if (!checkCollision(tempPlayer)) {
        setPlayers((prevPlayers) => {
          const updatedPlayers = [...prevPlayers];
          updatedPlayers[0].move(dx, dy);
          return updatedPlayers;
        });
      }
    }

    draw();
    animationFrameId.current = requestAnimationFrame(updateMovement);
  };

  const checkCollision = (player: Player): boolean => {
    const hitbox = player.getHitbox();
    const margin = 2;

    const playerLeft = hitbox.left + margin;
    const playerRight = hitbox.right - margin;
    const playerTop = hitbox.top + margin;
    const playerBottom = hitbox.bottom - margin;

    for (const boundary of boundaries) {
      const boundaryLeft = boundary.position.x;
      const boundaryRight = boundaryLeft + boundary.width;
      const boundaryTop = boundary.position.y;
      const boundaryBottom = boundaryTop + boundary.height;

      if (
        playerLeft < boundaryRight &&
        playerRight > boundaryLeft &&
        playerTop < boundaryBottom &&
        playerBottom > boundaryTop
      ) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    if (canvasRef.current) {
      imageRef.current = new Image();
      imageRef.current.src = mapLayout.src;

      // Load all player images
      playerImagesRef.current.down = new Image();
      playerImagesRef.current.up = new Image();
      playerImagesRef.current.left = new Image();
      playerImagesRef.current.right = new Image();

      playerImagesRef.current.down.src = redPlayerDown.src;
      playerImagesRef.current.up.src = redPlayerUp.src;
      playerImagesRef.current.left.src = redPlayerLeft.src;
      playerImagesRef.current.right.src = redPlayerRight.src;

      Promise.all([
        new Promise<void>((resolve) => {
          imageRef.current!.onload = () => resolve();
        }),
        new Promise<void>((resolve) => {
          playerImagesRef.current.down!.onload = () => resolve();
        }),
        new Promise<void>((resolve) => {
          playerImagesRef.current.up!.onload = () => resolve();
        }),
        new Promise<void>((resolve) => {
          playerImagesRef.current.left!.onload = () => resolve();
        }),
        new Promise<void>((resolve) => {
          playerImagesRef.current.right!.onload = () => resolve();
        }),
      ]).then(() => {
        const initialPlayerX = canvasRef.current!.width / 2;
        const initialPlayerY = canvasRef.current!.height / 2;
        const player = new Player(initialPlayerX, initialPlayerY, {
          down: playerImagesRef.current.down!,
          up: playerImagesRef.current.up!,
          left: playerImagesRef.current.left!,
          right: playerImagesRef.current.right!,
        });
        setPlayers([player]);
        setIsInitialized(true);
        draw();
      });
    }
  }, []);

  useEffect(() => {
    if (isInitialized && players.length > 0) {
      animationFrameId.current = requestAnimationFrame(updateMovement);

      return () => {
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
        }
      };
    }
  }, [isInitialized, players.length]);

  return <canvas ref={canvasRef} className="flex-1"></canvas>;
};

export default MapLayout;
