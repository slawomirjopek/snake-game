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
      snakeWidth: 20,
      snakeHeight: 20,
      bgColor: '#000',
    };

    this.options = Object.assign({}, defaulOptions, options);

    this.snake = [];
    this.ctx = null;

    this.init();
  }

  init() {
    this.createLevel();
    this.createSnake();
  }

  createLevel() {
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

  createSnake() {
    //
  }
}
