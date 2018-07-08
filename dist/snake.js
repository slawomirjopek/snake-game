"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},_createClass=function(){function o(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(t,e,n){return e&&o(t.prototype,e),n&&o(t,n),t}}();function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var SnakeGame=function(){function n(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{};if(_classCallCheck(this,n),t.container&&"object"!==_typeof(t.container))throw new Error("Missing game container");var e={canvas:document.querySelector("#bwSnake"),width:400,height:400,bgColor:"#000"};this.options=Object.assign({},e,t),this.snake=[],this.ctx=null,this.init()}return _createClass(n,[{key:"init",value:function(){this.createLevel(),this.createSnake()}},{key:"createLevel",value:function(){var t=this.options,e=t.width,n=t.height;this.options.canvas.setAttribute("width",e),this.options.canvas.setAttribute("height",n),this.ctx=this.options.canvas.getContext("2d"),this.ctx.fillStyle=this.options.bgColor,this.ctx.fillRect(0,0,e,n)}},{key:"createSnake",value:function(){if(!this.snake.length)for(var t=5;0<t;t--)this.snake.push({x:20+t,y:20})}}]),n}();