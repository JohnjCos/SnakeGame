import Constants from "../Constants";

type HeadArgs = {
  position: number[];
  size: number;
  updateFrequency: number;
  nextMove: number;
  xspeed: number;
  yspeed: number;
  renderer: React.JSX.Element;
};

type FoodArgs = {
  position: number[];
  size: number;
  renderer: React.JSX.Element;
};

type TailArgs = {
  size: number;
  elements: [number, number][];
  renderer: React.JSX.Element;
};

type EntitiesDef = {
  head: HeadArgs;
  food: FoodArgs;
  tail: TailArgs;
};

const randomPositions = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const DEFAULT_SNAKESPEED = 0.1;
let snakeSpeed = DEFAULT_SNAKESPEED;

function resetGame() {
  snakeSpeed = DEFAULT_SNAKESPEED;
}

function handleEvents({
  entities: { head },
  events,
}: {
  events: string[];
  entities: EntitiesDef;
}) {
  if (events.length) {
    events.forEach((event: string) => {
      switch (event) {
        case "move-up":
          if (head.yspeed === snakeSpeed) return;
          head.yspeed = -snakeSpeed;
          head.xspeed = 0;
          return;
        case "move-right":
          if (head.xspeed === -snakeSpeed) return;
          head.xspeed = snakeSpeed;
          head.yspeed = 0;
          return;
        case "move-down":
          if (head.yspeed === -snakeSpeed) return;
          head.yspeed = snakeSpeed;
          head.xspeed = 0;
          return;
        case "move-left":
          if (head.xspeed === snakeSpeed) return;
          head.xspeed = -snakeSpeed;
          head.yspeed = 0;
          return;
      }
    });
  }
}

function isOutOfBounds(head: HeadArgs) {
  return (
    head.position[0] + head.xspeed < 0 ||
    head.position[0] + head.xspeed >= Constants.GRID_SIZE ||
    head.position[1] + head.yspeed < 0 ||
    head.position[1] + head.yspeed >= Constants.GRID_SIZE
  );
}

function hasSnakeEaten(head: HeadArgs, food: FoodArgs) {
  return (
    head.position[0] <= food.position[0] &&
    head.position[1] <= food.position[1] &&
    head.position[0] >= food.position[0] - 1 &&
    head.position[1] >= food.position[1] - 1
  );
}

function updateTailWithHead(head: HeadArgs, tail: TailArgs) {
  tail.elements = [[head.position[0], head.position[1]], ...tail.elements];
}

function changeSnakePosition({ head, tail }: EntitiesDef) {
  updateTailWithHead(head, tail);
  tail.elements.pop();

  head.position[0] = Math.round((head.position[0] + head.xspeed) * 10) / 10;
  head.position[1] = Math.round((head.position[1] + head.yspeed) * 10) / 10;
}

function snakeCollisionCheck(
  { head, tail }: EntitiesDef,
  dispatch: (type: string) => void
) {
  tail.elements.forEach((el: number[]) => {
    if (head.position[0] === el[0] && head.position[1] === el[1]) {
      resetGame();
      dispatch("game-over");
    }
  });
}

function snakeFoodCollisionCheck(entities: EntitiesDef) {
  const { head, tail, food } = entities;
  if (hasSnakeEaten(head, food)) {
    updateTailWithHead(head, tail);
    snakeSpeed = snakeSpeed + DEFAULT_SNAKESPEED;
    food.position = [
      randomPositions(0, Constants.GRID_SIZE - 1),
      randomPositions(0, Constants.GRID_SIZE - 1),
    ];
  }
}

function updateSnake(entities: EntitiesDef, dispatch: (type: string) => void) {
  const { head } = entities;

  head.nextMove -= 1;
  if (head.nextMove === 0) {
    head.nextMove = head.updateFrequency;

    if (isOutOfBounds(head)) {
      resetGame();
      dispatch("game-over");
    } else {
      changeSnakePosition(entities);

      snakeCollisionCheck(entities, dispatch);

      snakeFoodCollisionCheck(entities);
    }
  }
}

export default function GameLoop(
  entities: EntitiesDef,
  { events, dispatch }: any
) {
  const head = entities.head;
  const food = entities.food;
  const tail = entities.tail;

  handleEvents({ entities, events });
  updateSnake(entities, dispatch);
  return entities;
}
