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
      speed: 500,
      bgColor: '#000',
      snakeColor: '#fff',
    };

    this.options = Object.assign({}, defaulOptions, options);

    this.snake = [{ x: 8 * this.options.box, y: 8 * this.options.box }];
    this.ctx = null; // 2d canvas
    this.game = null; // game loop
    this.direction = DIRECTION.DOWN; // movement direction

    this.init();
  }

  init() {
    // Attach snake steering
    document.addEventListener('keydown', this.control.bind(this));

    this.drawLevel();
    this.game = setInterval(this.drawSnake.bind(this), this.options.speed);
  }

  control({ keyCode }) {
    const { direction } = this;

    if (keyCode === 37 && direction !== DIRECTION.RIGHT) { // left
      this.direction = DIRECTION.LEFT;
    } else if (keyCode === 39 && direction !== DIRECTION.LEFT) { // right
      this.direction = DIRECTION.RIGHT;
    } else if (keyCode === 38 && direction !== DIRECTION.DOWN) { // up
      this.direction = DIRECTION.UP;
    } else if (keyCode === 40 && direction !== DIRECTION.UP) { // down
      this.direction = DIRECTION.DOWN;
    }
  }

  drawLevel() {
    const {
      width,
      height,
    } = this.options;

    // Sets game dimensions
    this.options.canvas.setAttribute('width', width);
    this.options.canvas.setAttribute('height', height);

    // Sets game background color
    this.ctx = this.options.canvas.getContext('2d');
    this.ctx.fillStyle = this.options.bgColor;
    this.ctx.fillRect(0, 0, width, height);
  }

  drawSnake() {
    const {
      box,
      snakeColor,
    } = this.options;

    // Drawing snake
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < this.snake.length; i++) {
      this.ctx.fillStyle = snakeColor;
      this.ctx.fillRect(this.snake[i].x, this.snake[i].y, box, box);
    }
  }
}
