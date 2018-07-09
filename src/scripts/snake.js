const DIRECTION = {
  UP: 'up',
  RIGHT: 'right',
  DOWN: 'down',
  LEFT: 'left',
};

// eslint-disable-next-line no-unused-vars
class SnakeGame {
  constructor(options = {}) {
    if (options.container && typeof options.container !== 'object') {
      throw new Error('Missing game container');
    }

    const defaulOptions = {
      canvas: document.querySelector('#bwSnake'),
      width: 400,
      height: 400,
      box: 20,
      speed: 100,
      color: {
        bg: '#000',
        snake: '#fff',
        snakeHead: 'silver',
        infoBg: '#fff',
        infoText: 'red',
        scoreText: '#000',
        pointBox: 'red',
      },
      font: {
        info: '15px Oswald',
        score: '30px Oswald',
        restart: '15px Oswald',
      },
      text: {
        gameOver: 'GAMEOVER',
        winner: 'MAXPOINTS!',
        restart: 'RESTART',
      },
    };

    this.options = Object.assign({}, defaulOptions, options);
    this.init(); // initialize game
  }

  init() {
    this.resetVars();
    this.attachEvents();
    this.start();
  }

  resetVars() {
    this.score = 0;
    this.scoreLimit = (this.options.width * this.options.height) / this.options.box;
    this.snake = [
      { x: 8 * this.options.box, y: 8 * this.options.box },
      { x: 8 * this.options.box, y: 7 * this.options.box },
      { x: 8 * this.options.box, y: 6 * this.options.box },
    ];
    this.pointBox = { x: null, y: null };
    this.ctx = null; // 2d canvas
    this.game = null; // game loop
    this.direction = DIRECTION.DOWN; // movement direction
    this.restartVisible = false;
    this.directionLock = false;
  }

  attachEvents() {
    // Attach snake steering
    document.addEventListener('keydown', this.control.bind(this));

    // Click events
    document.addEventListener('click', this.clickHandler.bind(this));
  }

  start() {
    this.resetVars();
    this.game = setInterval(this.draw.bind(this), this.options.speed);
  }

  control({ keyCode }) {
    const {
      direction,
      directionLock,
    } = this;

    if (directionLock) return;

    if (keyCode === 37 && direction !== DIRECTION.RIGHT) { // left
      this.direction = DIRECTION.LEFT;
    } else if (keyCode === 39 && direction !== DIRECTION.LEFT) { // right
      this.direction = DIRECTION.RIGHT;
    } else if (keyCode === 38 && direction !== DIRECTION.DOWN) { // up
      this.direction = DIRECTION.UP;
    } else if (keyCode === 40 && direction !== DIRECTION.UP) { // down
      this.direction = DIRECTION.DOWN;
    }

    this.directionLock = true;
  }

  clickHandler(e) {
    const pos = {
      x: e.offsetX,
      y: e.offsetY,
    };

    // restart
    if (
      this.restartVisible
      && (pos.x > 175 && pos.x < 225) && (pos.y > 220 && pos.y < 235)
    ) {
      this.score = 0;
      this.start();
    }
  }

  draw() {
    // prevent changing direction multiple times in one cycle
    this.directionLock = false;

    this.drawLevel();
    this.drawSnake();
    this.drawPointBox();
    this.collision();
  }

  drawLevel() {
    const {
      width,
      height,
      color: {
        bg,
      },
    } = this.options;

    // Sets game dimensions
    this.options.canvas.setAttribute('width', width);
    this.options.canvas.setAttribute('height', height);

    // Sets game background color
    this.ctx = this.options.canvas.getContext('2d');
    this.ctx.fillStyle = bg;
    this.ctx.fillRect(0, 0, width, height);
  }

  drawSnake() {
    const {
      box,
      color: {
        snake,
        snakeHead,
      },
    } = this.options;

    // change snake position
    this.move();

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < this.snake.length; i++) {
      this.ctx.fillStyle = i === 0 ? snake : snakeHead;
      this.ctx.fillRect(this.snake[i].x, this.snake[i].y, box, box);
    }
  }

  drawPointBox(generate = false) {
    const {
      width,
      height,
      box,
      color: {
        pointBox,
      },
    } = this.options;

    let x;
    let y;

    if (generate) {
      x = Math.floor(Math.random() * width / box) * box;
      y = Math.floor(Math.random() * height / box) * box;
    } else {
      x = (this.pointBox.x === 0 || this.pointBox.x)
        ? this.pointBox.x : Math.floor(Math.random() * width / box) * box;

      y = (this.pointBox.y === 0 || this.pointBox.y)
        ? this.pointBox.y : Math.floor(Math.random() * height / box) * box;
    }

    // Check if collides with snake then generate new
    this.snake.forEach((snake) => {
      if (snake.x === x && snake.y === y) {
        this.drawPointBox(true);
      }
      return false;
    });

    this.pointBox = { x, y };
    this.ctx.fillStyle = pointBox;
    this.ctx.fillRect(x, y, box, box);
  }

  drawInfo() {
    const {
      color: {
        infoBg,
        infoText,
        scoreText,
      },
      font,
      text: {
        gameOver,
        winner,
        restart,
      },
    } = this.options;

    this.ctx.fillStyle = infoBg;
    this.ctx.fillRect(100, 150, 200, 100);
    this.ctx.font = font.info;
    this.ctx.fillStyle = infoText;
    this.ctx.textAlign = 'center';

    // Sets the appropriate message
    const message = this.score !== this.scoreLimit ? gameOver : winner;
    this.ctx.fillText(message, 200, 175);

    // score info
    this.ctx.font = font.score;
    this.ctx.fillStyle = scoreText;
    this.ctx.fillText(this.score, 200, 210);

    // restart
    this.ctx.font = font.restart;
    this.ctx.fillText(restart, 200, 235);
    this.restartVisible = true;
  }

  collision() {
    const {
      snake,
      options: {
        width,
        height,
        box,
      },
    } = this;

    // If collided with self
    const selfCollide = snake.find(({ x, y }, i) => (
      i !== 0 && x === snake[0].x && y === snake[0].y
    ));

    // If reached "wall"
    if (
      snake[0].x > width - box
      || snake[0].x < 0
      || snake[0].y > height - box
      || snake[0].y < 0
      || selfCollide
    ) {
      // stop game
      this.stop();
    }
  }

  move() {
    const {
      direction,
      options: {
        box,
      },
      pointBox,
    } = this;

    const oldX = this.snake[0].x;
    const oldY = this.snake[0].y;

    let newX = oldX;
    let newY = oldY;

    switch (direction) {
      case DIRECTION.LEFT:
        newX = oldX - box;
        break;
      case DIRECTION.RIGHT:
        newX = oldX + box;
        break;
      case DIRECTION.UP:
        newY = oldY - box;
        break;
      case DIRECTION.DOWN:
        newY = oldY + box;
        break;
      default:
    }

    this.snake.unshift({
      x: newX,
      y: newY,
    });

    // When snake not eats
    if (newX === pointBox.x && newY === pointBox.y) {
      this.drawPointBox(true); // generate new pointbox
      this.score = this.score + 1; // add point
    } else {
      this.snake.pop();
    }
  }

  stop() {
    clearInterval(this.game);
    this.drawInfo();
  }
}
