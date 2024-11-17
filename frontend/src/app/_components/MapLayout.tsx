"use client";
import { useRef, useEffect, useState } from "react";
import mapLayout from "./../../../public/32_24_with_zoom.png";

import redPlayerDown from "../../../public/Red/neo_red_down.png";
import redPlayerUp from "../../../public/Red/neo_red_up.png";
import redPlayerLeft from "../../../public/Red/neo_red_left.png";
import redPlayerRight from "../../../public/Red/neo_red_right.png";

import bluePlayerDown from "../../../public/Blue/neo_blue_down.png";
import bluePlayerUp from "../../../public/Blue/neo_blue_up.png";
import bluePlayerLeft from "../../../public/Blue/neo_blue_left.png";
import bluePlayerRight from "../../../public/Blue/neo_blue_right.png";

import yellowPlayerDown from "../../../public/Yellow/neo_yellow_down.png";
import yellowPlayerUp from "../../../public/Yellow/neo_yellow_up.png";
import yellowPlayerLeft from "../../../public/Yellow/neo_yellow_left.png";
import yellowPlayerRight from "../../../public/Yellow/neo_yellow_right.png";

import { Player } from "../classes/Player";
import { Boundary } from "../classes/Boundary";
import { collisions } from "../utils/Collisions";
import { PlayerImages } from "../types/types";

const MapLayout: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [mainPlayer, setMainPlayer] = useState<Player | null>(null);
  const [otherplayers, setOtherplayers] = useState<Player[]>([]);
  const [boundaries, setBoundaries] = useState<Boundary[]>([]);
  const [tileSize, setTileSize] = useState(16);
  const [isInitialized, setIsInitialized] = useState(false);

  const MOVEMENT_SPEED = 1;
  const MAP_WIDTH = 32;
  const MAP_HEIGHT = 24;
  const ASPECT_RATIO = MAP_WIDTH / MAP_HEIGHT;

  const pressedKeys = useRef<Set<string>>(new Set());
  const lastKeyPressed = useRef<string | null>(null);
  const animationFrameId = useRef<number>();
  const mainPlayerImagesRef = useRef<PlayerImages>({
    down: null,
    up: null,
    left: null,
    right: null,
  });

  const yellowPlayerImagesRef = useRef<PlayerImages>({
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

  const draw = () => {
    if (!ctxRef.current || !canvasRef.current) return;

    ctxRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    drawImage();
    // drawCollisionTiles();

    otherplayers.forEach((p) => {
      p.draw(ctxRef.current!, false);
    });

    if (mainPlayer) {
      mainPlayer.draw(ctxRef.current!, true);
    }
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
      if (mainPlayer) {
        mainPlayer.updateDimensions(scaleFactor);
      }
      otherplayers.forEach((player) => {
        player.updateDimensions(scaleFactor);
      });
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
    if (lastKeyPressed.current && mainPlayer) {
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

      const tempPlayer = new Player(
        mainPlayer.id,
        mainPlayer.x + dx,
        mainPlayer.y + dy,
        mainPlayer.images,
        mainPlayer.name
      );

      if (!checkCollision(tempPlayer)) {
        setMainPlayer((prevPlayer) => {
          if (prevPlayer) {
            prevPlayer.move(dx, dy);
            // Here you would emit the player's new state via websocket
            return prevPlayer;
          }
          return null;
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
      mainPlayerImagesRef.current.down = new Image();
      mainPlayerImagesRef.current.up = new Image();
      mainPlayerImagesRef.current.left = new Image();
      mainPlayerImagesRef.current.right = new Image();

      mainPlayerImagesRef.current.down.src = bluePlayerDown.src;
      mainPlayerImagesRef.current.up.src = bluePlayerUp.src;
      mainPlayerImagesRef.current.left.src = bluePlayerLeft.src;
      mainPlayerImagesRef.current.right.src = bluePlayerRight.src;

      yellowPlayerImagesRef.current.down = new Image();
      yellowPlayerImagesRef.current.up = new Image();
      yellowPlayerImagesRef.current.left = new Image();
      yellowPlayerImagesRef.current.right = new Image();

      yellowPlayerImagesRef.current.down.src = yellowPlayerDown.src;
      yellowPlayerImagesRef.current.up.src = yellowPlayerUp.src;
      yellowPlayerImagesRef.current.left.src = yellowPlayerLeft.src;
      yellowPlayerImagesRef.current.right.src = yellowPlayerRight.src;

      Promise.all([
        // Main player image loading promises
        new Promise<void>((resolve) => {
          imageRef.current!.onload = () => resolve();
        }),
        new Promise<void>((resolve) => {
          mainPlayerImagesRef.current.down!.onload = () => resolve();
        }),
        new Promise<void>((resolve) => {
          mainPlayerImagesRef.current.up!.onload = () => resolve();
        }),
        new Promise<void>((resolve) => {
          mainPlayerImagesRef.current.left!.onload = () => resolve();
        }),
        new Promise<void>((resolve) => {
          mainPlayerImagesRef.current.right!.onload = () => resolve();
        }),
        // Yellow player image loading promises
        new Promise<void>((resolve) => {
          yellowPlayerImagesRef.current.down!.onload = () => resolve();
        }),
        new Promise<void>((resolve) => {
          yellowPlayerImagesRef.current.up!.onload = () => resolve();
        }),
        new Promise<void>((resolve) => {
          yellowPlayerImagesRef.current.left!.onload = () => resolve();
        }),
        new Promise<void>((resolve) => {
          yellowPlayerImagesRef.current.right!.onload = () => resolve();
        }),
      ]).then(() => {
        const initialX = canvasRef.current!.width / 2;
        const initialY = canvasRef.current!.height / 2;

        // Create main player
        const mainPlayer = new Player(
          "main-player",
          initialX,
          initialY,
          mainPlayerImagesRef.current as Required<PlayerImages>,
          "You"
        );

        // Create player2 player
        const player2Player = new Player(
          "player2",
          initialX - 50,
          initialY - 50,
          yellowPlayerImagesRef.current as Required<PlayerImages>,
          "player2"
        );

        setMainPlayer(mainPlayer);
        setOtherplayers([player2Player]);
        setIsInitialized(true);
        draw();
      });
    }
  }, []);

  useEffect(() => {
    if (isInitialized && mainPlayer) {
      animationFrameId.current = requestAnimationFrame(updateMovement);

      return () => {
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
        }
      };
    }
  }, [isInitialized, mainPlayer, otherplayers]);

  return <canvas ref={canvasRef} className="flex-1"></canvas>;
};

export default MapLayout;
