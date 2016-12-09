/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var loop_1 = __webpack_require__(1);
	var startstate_1 = __webpack_require__(2);
	var gamestate_1 = __webpack_require__(13);
	var keys_1 = __webpack_require__(5);
	var state = 'start';
	var startState = new startstate_1.StartState();
	var gameState = new gamestate_1.GameState();
	var Asteroids = (function () {
	    function Asteroids() {
	    }
	    Asteroids.prototype.update = function (step) {
	        switch (state) {
	            case 'start':
	                startState.update(step);
	                if (keys_1.Key.isPressed(keys_1.Key.ONE)) {
	                    state = 'game';
	                }
	                else {
	                }
	                break;
	            case 'game':
	                gameState.update(step);
	                break;
	        }
	    };
	    Asteroids.prototype.render = function (step) {
	        switch (state) {
	            case 'start':
	                startState.render(step);
	                break;
	            case 'game':
	                gameState.render(step);
	                break;
	        }
	        keys_1.Key.update();
	    };
	    return Asteroids;
	}());
	exports.Asteroids = Asteroids;
	var game = new Asteroids();
	setTimeout(function () {
	    loop_1.loop(game);
	}, 1000);


/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	var timestamp = function () {
	    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
	};
	var now;
	var delta = 0;
	var last = timestamp();
	var step = 1 / 60;
	var init = function (state) {
	    var frame = function () {
	        now = timestamp();
	        delta = delta + Math.min(1, (now - last) / 1000);
	        while (delta > step) {
	            delta -= step;
	            state.update(step);
	        }
	        state.render(delta);
	        last = now;
	        requestAnimationFrame(frame);
	    };
	    frame();
	};
	exports.loop = function (state) {
	    init(state);
	};


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var screen_1 = __webpack_require__(3);
	var keys_1 = __webpack_require__(5);
	var highscores_1 = __webpack_require__(6);
	var rocks_1 = __webpack_require__(7);
	var alien_1 = __webpack_require__(11);
	var StartState = (function () {
	    function StartState() {
	        this.blink = 0;
	        this.showPushStart = true;
	        this.modeTimer = 0;
	        this.alienTimer = 0;
	        this.demo = false;
	        this.demoStarted = false;
	        this.alienBullets = [];
	        this.debug = false;
	        this.highscore = highscores_1.highscores.length ? highscores_1.highscores[0].score : 0;
	        var rock1 = new rocks_1.Rock(20, screen_1.default.height - 40, rocks_1.RockSize.Large);
	        rock1.vx = 2;
	        rock1.vy = -2;
	        var rock2 = new rocks_1.Rock(screen_1.default.width - 40, 40, rocks_1.RockSize.Large);
	        rock2.vx = -2;
	        rock2.vy = 1;
	        var rock3 = new rocks_1.Rock(screen_1.default.width - 80, screen_1.default.height - 80, rocks_1.RockSize.Large);
	        rock3.vx = 1;
	        rock3.vy = -1.5;
	        var rock4 = new rocks_1.Rock(screen_1.default.width - 80, screen_1.default.height - 120, rocks_1.RockSize.Large);
	        rock4.vx = -1;
	        rock4.vy = 1.5;
	        this.rocks = [rock1, rock2, rock3, rock4];
	    }
	    StartState.prototype.update = function (step) {
	        var _this = this;
	        if (keys_1.Key.isPressed(keys_1.Key.DEBUG)) {
	            this.debug = !this.debug;
	        }
	        this.modeTimer += step;
	        if (this.modeTimer >= 15) {
	            this.modeTimer = step;
	            this.demo = !this.demo;
	            if (this.demo && !this.demoStarted) {
	                this.demoStarted = true;
	            }
	        }
	        if (this.demoStarted && !this.alien) {
	            this.alienTimer += step;
	        }
	        if (this.alienTimer >= 7) {
	            this.alien = new alien_1.BigAlien(0, 0);
	            this.alien.onDone = function () {
	                _this.alien = null;
	                _this.alienBullets = [];
	            };
	            this.alien.onFire = function (bullet) {
	                bullet.on('expired', function () {
	                    _this.alienBullets = _this.alienBullets.filter(function (x) { return x !== bullet; });
	                });
	                _this.alienBullets.push(bullet);
	            };
	            this.alienTimer = 0;
	        }
	        this.blink += step;
	        if (this.blink >= .4) {
	            this.blink = 0;
	            this.showPushStart = !this.showPushStart;
	        }
	        this.updateDemo(step);
	    };
	    StartState.prototype.render = function (step) {
	        if (this.demo) {
	            this.renderDemo();
	        }
	        else {
	            this.renderStart();
	        }
	        if (this.debug) {
	            screen_1.default.draw.text2('debug mode', '12pt', function (width) {
	                return { x: screen_1.default.width - width - 10, y: screen_1.default.height - 40 };
	            });
	        }
	    };
	    StartState.prototype.renderStart = function () {
	        this.drawBackground();
	        this.drawPushStart();
	        this.drawHighScores();
	    };
	    StartState.prototype.updateDemo = function (step) {
	        this.rocks.forEach(function (rock) {
	            rock.update(step);
	        });
	        if (this.alien) {
	            this.alien.update(step);
	        }
	        this.alienBullets.forEach(function (bullet) {
	            bullet.update(step);
	        });
	    };
	    StartState.prototype.renderDemo = function () {
	        var _this = this;
	        this.drawBackground();
	        this.drawPushStart();
	        this.rocks.forEach(function (rock) {
	            rock.render();
	            if (_this.debug) {
	                screen_1.default.draw.bounds(rock);
	            }
	        });
	        if (this.alien) {
	            this.alien.render();
	            if (this.debug) {
	                screen_1.default.draw.bounds(this.alien);
	            }
	        }
	        this.alienBullets.forEach(function (bullet) {
	            bullet.render();
	        });
	    };
	    StartState.prototype.drawBackground = function () {
	        screen_1.default.draw.background();
	        screen_1.default.draw.scorePlayer1(0);
	        screen_1.default.draw.highscore(this.highscore);
	        screen_1.default.draw.copyright();
	    };
	    StartState.prototype.drawHighScores = function () {
	        var screenX = screen_1.default.width / 2;
	        screen_1.default.draw.text2('high scores', '30pt', function (width) {
	            return {
	                x: screenX - (width / 2),
	                y: 200
	            };
	        });
	        var _loop_1 = function (i) {
	            var y = 280 + (i * 40);
	            var text = this_1.pad(i + 1, ' ', 2) + "." + this_1.pad(highscores_1.highscores[i].score, ' ', 6) + " " + highscores_1.highscores[i].initials;
	            screen_1.default.draw.text2(text, '30pt', function (width) {
	                return {
	                    x: screenX - (width / 2),
	                    y: y
	                };
	            });
	        };
	        var this_1 = this;
	        for (var i = 0; i < highscores_1.highscores.length; i++) {
	            _loop_1(i);
	        }
	    };
	    StartState.prototype.drawPushStart = function () {
	        var screenX = screen_1.default.width / 2;
	        if (this.showPushStart) {
	            screen_1.default.draw.text2('push start', '30pt', function (width) {
	                return {
	                    x: screenX - (width / 2),
	                    y: 120
	                };
	            });
	        }
	    };
	    StartState.prototype.pad = function (text, char, count) {
	        text = text.toString();
	        while (text.length < count) {
	            text = char + text;
	        }
	        return text;
	    };
	    return StartState;
	}());
	exports.StartState = StartState;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var draw_1 = __webpack_require__(4);
	var Screen = (function () {
	    function Screen() {
	        var _this = this;
	        this.canvas = document.getElementById('canvas');
	        this.ctx = this.canvas.getContext('2d');
	        this.draw = new draw_1.Draw(this.ctx);
	        this.init();
	        window.addEventListener('resize', function () {
	            _this.init();
	        });
	    }
	    Screen.prototype.init = function () {
	        this.canvas.width = document.body.clientWidth;
	        this.canvas.height = document.body.clientHeight;
	        this.width = this.canvas.width;
	        this.height = this.canvas.height;
	    };
	    return Screen;
	}());
	exports.Screen = Screen;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = new Screen();


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var screen_1 = __webpack_require__(3);
	var VectorLine = 'rgba(255,255,255,.8)';
	var Draw = (function () {
	    function Draw(ctx) {
	        this.ctx = ctx;
	    }
	    Draw.prototype.line = function (p1, p2, color, width) {
	        if (color === void 0) { color = VectorLine; }
	        if (width === void 0) { width = 2; }
	        var ctx = this.ctx;
	        ctx.beginPath();
	        ctx.strokeStyle = color;
	        ctx.lineWidth = width;
	        ctx.moveTo(p1.x, p1.y);
	        ctx.lineTo(p2.x, p2.y);
	        ctx.stroke();
	        ctx.closePath();
	    };
	    Draw.prototype.shape = function (points, x, y, color) {
	        if (color === void 0) { color = VectorLine; }
	        var p1, p2;
	        for (var i = 0; i < points.length - 1; i++) {
	            p1 = { x: x + points[i].x, y: y + points[i].y };
	            p2 = { x: x + points[i + 1].x, y: y + points[i + 1].y };
	            this.line(p1, p2, color, 2);
	        }
	    };
	    Draw.prototype.rect = function (p1, p2, color) {
	        if (color === void 0) { color = VectorLine; }
	        var ctx = this.ctx;
	        ctx.beginPath();
	        ctx.fillStyle = color;
	        ctx.fillRect(p1.x, p1.y, p2.x, p2.y);
	        ctx.stroke();
	        ctx.closePath();
	    };
	    Draw.prototype.point = function (p, fillStyle) {
	        if (fillStyle === void 0) { fillStyle = VectorLine; }
	        this.rect(p, { x: 4, y: 4 }, fillStyle);
	    };
	    Draw.prototype.background = function () {
	        this.rect({ x: 0, y: 0 }, { x: screen_1.default.width, y: screen_1.default.height }, '#000000');
	    };
	    Draw.prototype.bounds = function (obj) {
	        var ctx = this.ctx;
	        var rect = obj.rect;
	        ctx.beginPath();
	        ctx.strokeStyle = VectorLine;
	        ctx.lineWidth = 1;
	        ctx.moveTo(obj.x + rect.x, obj.y + rect.y);
	        ctx.lineTo(obj.x + rect.x + rect.width, obj.y + rect.y);
	        ctx.lineTo(obj.x + rect.x + rect.width, obj.y + rect.y + rect.height);
	        ctx.lineTo(obj.x + rect.x, obj.y + rect.y + rect.height);
	        ctx.lineTo(obj.x + rect.x, obj.y + rect.y);
	        ctx.stroke();
	        ctx.closePath();
	    };
	    Draw.prototype.text = function (text, x, y, size) {
	        var ctx = this.ctx;
	        ctx.save();
	        ctx.font = size + " hyperspace";
	        ctx.textBaseline = 'middle';
	        ctx.lineWidth = 1;
	        ctx.strokeStyle = VectorLine;
	        ctx.strokeText(text, x, y);
	        ctx.restore();
	    };
	    Draw.prototype.text2 = function (text, size, cb) {
	        var ctx = this.ctx;
	        ctx.save();
	        ctx.font = size + " hyperspace";
	        ctx.textBaseline = 'middle';
	        ctx.lineWidth = 1;
	        ctx.strokeStyle = VectorLine;
	        var width = ctx.measureText(text).width;
	        var point = cb(width);
	        ctx.strokeText(text, point.x, point.y);
	        ctx.restore();
	    };
	    Draw.prototype.scorePlayer1 = function (score) {
	        var text = score.toString();
	        while (text.length < 2)
	            text = '0' + text;
	        this.text(text, 100, 20, '24pt');
	    };
	    Draw.prototype.highscore = function (score) {
	        var text = score.toString();
	        while (text.length < 2)
	            text = '0' + text;
	        this.text2(text, '12pt', function (width) {
	            return {
	                x: (screen_1.default.width / 2) - (width / 2),
	                y: 20
	            };
	        });
	    };
	    Draw.prototype.copyright = function () {
	        this.text2(String.fromCharCode(169) + ' 1979 Atari INC', '12pt', function (width) {
	            return {
	                x: (screen_1.default.width / 2) - (width / 2),
	                y: screen_1.default.height - 20
	            };
	        });
	    };
	    return Draw;
	}());
	exports.Draw = Draw;


/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	var _Key = (function () {
	    function _Key() {
	        var _this = this;
	        this.LEFT = 37;
	        this.UP = 38;
	        this.RIGHT = 39;
	        this.SHIFT = 16;
	        this.CTRL = 17;
	        this.ONE = 49;
	        this.DEBUG = 68;
	        this.keys = new Array(222);
	        this.prev = new Array(222);
	        for (var i = 0; i < 222; i++) {
	            this.keys[i] = this.prev[i] = false;
	        }
	        window.onkeydown = function (event) {
	            event.preventDefault();
	            _this.keys[event.keyCode] = true;
	        };
	        window.onkeyup = function (event) {
	            event.preventDefault();
	            _this.keys[event.keyCode] = false;
	        };
	    }
	    _Key.prototype.update = function () {
	        for (var i = 0; i < 222; i++) {
	            this.prev[i] = this.keys[i];
	        }
	    };
	    _Key.prototype.isPressed = function (key) {
	        return this.prev[key] === false && this.keys[key] === true;
	    };
	    _Key.prototype.wasPressed = function (key) {
	        return this.prev[key] && !this.keys[key];
	    };
	    _Key.prototype.isDown = function (key) {
	        return this.keys[key];
	    };
	    return _Key;
	}());
	exports._Key = _Key;
	exports.Key = new _Key();


/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	exports.highscores = [
	    { score: 20140, initials: 'J H' },
	    { score: 20050, initials: 'O A' },
	    { score: 19930, initials: 'N M' },
	    { score: 19870, initials: '  I' },
	    { score: 19840, initials: 'P L' },
	    { score: 19790, initials: 'A T' },
	    { score: 19700, initials: 'U O' },
	    { score: 19660, initials: 'L N' },
	    { score: 190, initials: 'GAM' },
	    { score: 70, initials: 'ES ' },
	];


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var object2d_1 = __webpack_require__(8);
	var util_1 = __webpack_require__(10);
	(function (RockSize) {
	    RockSize[RockSize["Small"] = 5] = "Small";
	    RockSize[RockSize["Medium"] = 10] = "Medium";
	    RockSize[RockSize["Large"] = 20] = "Large";
	})(exports.RockSize || (exports.RockSize = {}));
	var RockSize = exports.RockSize;
	var Rock = (function (_super) {
	    __extends(Rock, _super);
	    function Rock(x, y, size) {
	        if (size === void 0) { size = 1; }
	        var _this = _super.call(this, x, y, size) || this;
	        _this.rotTimer = 0;
	        _this.rock1 = [
	            [.5, -2],
	            [2, -1],
	            [2, -.7],
	            [1.2, 0],
	            [2, 1],
	            [1, 2],
	            [.5, 1.5],
	            [-1, 2],
	            [-2, .7],
	            [-2, -1],
	            [-.5, -1],
	            [-1, -2],
	            [.5, -2]
	        ];
	        _this.rock2 = [
	            [0, -1.5],
	            [1, -2],
	            [2, -1],
	            [1, -.5],
	            [2, .5],
	            [1, 2],
	            [-.5, 1.5],
	            [-1, 2],
	            [-2, 1],
	            [-1.5, 0],
	            [-2, -1],
	            [-1, -2],
	            [0, -1.5]
	        ];
	        _this.rock3 = [
	            [0, -1],
	            [1, -2],
	            [2, -1],
	            [1.5, 0],
	            [2, 1],
	            [1, 2],
	            [-1, 2],
	            [-2, 1],
	            [-2, -1],
	            [-1, -2],
	            [0, -1]
	        ];
	        _this.rocks = [_this.rock1, _this.rock2, _this.rock3];
	        var type = util_1.random(0, 2);
	        var def = _this.rocks[type];
	        _this.points = def.map(function (p) {
	            return {
	                x: p[0] * size,
	                y: p[1] * size
	            };
	        });
	        _this.rotate(util_1.random(1, 90));
	        _this.rot = util_1.random(1, 10) % 2 === 0 ? 1 : -1;
	        return _this;
	    }
	    Rock.prototype.update = function (step) {
	        this.rotTimer += 1;
	        this.move();
	        if (this.rotTimer === 5) {
	            this.rotate(this.rot);
	            this.rotTimer = 0;
	        }
	    };
	    Rock.prototype.render = function () {
	        this.draw();
	    };
	    return Rock;
	}(object2d_1.Object2D));
	exports.Rock = Rock;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var lut_1 = __webpack_require__(9);
	var screen_1 = __webpack_require__(3);
	var Object2D = (function () {
	    function Object2D(x, y) {
	        var args = [];
	        for (var _i = 2; _i < arguments.length; _i++) {
	            args[_i - 2] = arguments[_i];
	        }
	        this.color = 'rgba(255,255,255,.8)';
	        this.angle = 360;
	        this.vx = 0;
	        this.vy = 0;
	        this.handlers = {};
	        this.x = x;
	        this.y = y;
	    }
	    Object2D.prototype.rotate = function (angle) {
	        this.angle += angle;
	        if (this.angle < 1) {
	            this.angle += 360;
	        }
	        if (this.angle > 360) {
	            this.angle -= 360;
	        }
	        var c = lut_1.COS[angle];
	        var s = lut_1.SIN[angle];
	        this.points.forEach(function (p) {
	            var newX = (c * p.x) - (s * p.y);
	            var newY = (s * p.x) + (c * p.y);
	            p.x = newX;
	            p.y = newY;
	        });
	    };
	    Object2D.prototype.move = function () {
	        this.x += this.vx;
	        this.y += this.vy;
	        if (this.x > screen_1.default.width) {
	            this.x -= screen_1.default.width;
	        }
	        if (this.x < 0) {
	            this.x += screen_1.default.width;
	        }
	        if (this.y > screen_1.default.height) {
	            this.y -= screen_1.default.height;
	        }
	        if (this.y < 0) {
	            this.y += screen_1.default.height;
	        }
	    };
	    Object2D.prototype.scale = function (factor) {
	        this.points.forEach(function (point) {
	            point.x *= factor;
	            point.y *= factor;
	        });
	    };
	    Object2D.prototype.draw = function () {
	        screen_1.default.draw.shape(this.points, this.x, this.y, this.color);
	    };
	    Object.defineProperty(Object2D.prototype, "speed", {
	        get: function () {
	            return Math.sqrt(Math.pow(this.vx, 2) + Math.pow(this.vy, 2));
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Object2D.prototype, "rect", {
	        get: function () {
	            var xmin = 0;
	            var ymin = 0;
	            var xmax = 0;
	            var ymax = 0;
	            this.points.forEach(function (p) {
	                if (p.x < xmin)
	                    xmin = p.x;
	                if (p.x > xmax)
	                    xmax = p.x;
	                if (p.y < ymin)
	                    ymin = p.y;
	                if (p.y > ymax)
	                    ymax = p.y;
	            });
	            return {
	                x: xmin,
	                y: ymin,
	                width: xmax - xmin,
	                height: ymax - ymin
	            };
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object2D.prototype.on = function (event, handler) {
	        if (!this.handlers[event]) {
	            this.handlers[event] = [];
	        }
	        this.handlers[event].push(handler);
	    };
	    Object2D.prototype.off = function (event, handler) {
	        this.handlers[event] = this.handlers[event].filter(function (x) { return x !== handler; });
	    };
	    Object2D.prototype.trigger = function (event) {
	        var _this = this;
	        var args = [];
	        for (var _i = 1; _i < arguments.length; _i++) {
	            args[_i - 1] = arguments[_i];
	        }
	        var handlers = this.handlers[event] || [];
	        handlers.forEach(function (x) { return x.apply(void 0, [_this].concat(args)); });
	    };
	    Object2D.prototype.destroy = function () {
	        for (var event_1 in this.handlers) {
	            this.handlers[event_1] = null;
	        }
	        this.handlers = {};
	    };
	    return Object2D;
	}());
	exports.Object2D = Object2D;


/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";
	var RAD = {};
	exports.RAD = RAD;
	var COS = {};
	exports.COS = COS;
	var SIN = {};
	exports.SIN = SIN;
	var VECTOR = {};
	exports.VECTOR = VECTOR;
	var r = Math.PI / 180;
	var PI2 = 2 * Math.PI;
	for (var i = 1; i <= 360; i++) {
	    RAD[i] = i * r;
	    COS[i] = Math.cos(RAD[i]);
	    SIN[i] = Math.sin(RAD[i]);
	    RAD[-i] = -i * r;
	    COS[-i] = Math.cos(RAD[-i]);
	    SIN[-i] = Math.sin(RAD[-i]);
	    var t = PI2 * (i / 360);
	    VECTOR[i] = {
	        x: Math.sin(t),
	        y: -Math.cos(t)
	    };
	}


/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";
	function random(start, end) {
	    return Math.floor(Math.random() * end) + start;
	}
	exports.random = random;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var screen_1 = __webpack_require__(3);
	var object2d_1 = __webpack_require__(8);
	var bullet_1 = __webpack_require__(12);
	var util_1 = __webpack_require__(10);
	var MAX_BULLETS = 3;
	var BigAlien = (function (_super) {
	    __extends(BigAlien, _super);
	    function BigAlien(x, y) {
	        var _this = _super.call(this, x, y) || this;
	        _this.moveTimer = 0;
	        _this.bulletTimer = 1;
	        _this.bulletCount = 0;
	        _this.moveTime = 2;
	        _this.vy = 0;
	        _this.y = util_1.random(100, screen_1.default.height - 100);
	        if (_this.y % 2 === 0) {
	            _this.x = 40;
	            _this.vx = 3;
	        }
	        else {
	            _this.x = screen_1.default.width - 40;
	            _this.vx = -3;
	        }
	        _this.points = [
	            { x: .5, y: -2 },
	            { x: 1, y: -1 },
	            { x: 2.5, y: 0 },
	            { x: 1, y: 1 },
	            { x: -1, y: 1 },
	            { x: -2.5, y: 0 },
	            { x: -1, y: -1 },
	            { x: -.5, y: -2 },
	            { x: .5, y: -2 }
	        ];
	        _this.scale(7);
	        return _this;
	    }
	    BigAlien.prototype.update = function (step) {
	        this.move();
	        if (this.x >= screen_1.default.width || this.x <= 0) {
	            this.onDone();
	            return;
	        }
	        this.moveTimer += step;
	        if (this.moveTimer >= 1 && this.vy !== 0) {
	            this.vy = 0;
	            this.moveTimer = 0;
	        }
	        if (this.moveTimer >= this.moveTime) {
	            var move = util_1.random(1, 20) % 2 === 0;
	            if (move) {
	                this.vy = this.x % 2 === 0 ? this.vx : -this.vx;
	            }
	            this.moveTimer = 0;
	            this.moveTime++;
	        }
	        this.bulletTimer += step;
	        if (this.bulletTimer >= 1 && this.bulletCount <= MAX_BULLETS) {
	            var bullet = new bullet_1.Bullet(this.x, this.y, util_1.random(1, 360));
	            bullet.vx *= 10;
	            bullet.vy *= 10;
	            this.onFire(bullet);
	            this.bulletTimer = 0;
	        }
	    };
	    BigAlien.prototype.render = function () {
	        this.draw();
	    };
	    BigAlien.prototype.draw = function () {
	        _super.prototype.draw.call(this);
	        screen_1.default.draw.shape([this.points[1], this.points[6]], this.x, this.y);
	        screen_1.default.draw.shape([this.points[2], this.points[5]], this.x, this.y);
	    };
	    return BigAlien;
	}(object2d_1.Object2D));
	exports.BigAlien = BigAlien;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var screen_1 = __webpack_require__(3);
	var lut_1 = __webpack_require__(9);
	var object2d_1 = __webpack_require__(8);
	var Bullet = (function (_super) {
	    __extends(Bullet, _super);
	    function Bullet(x, y, angle) {
	        var _this = _super.call(this, x, y) || this;
	        _this.life = 1.25;
	        var v = lut_1.VECTOR[angle];
	        _this.vx = v.x;
	        _this.vy = v.y;
	        return _this;
	    }
	    Bullet.prototype.render = function () {
	        this.draw();
	    };
	    Bullet.prototype.update = function (step) {
	        this.move();
	        this.life -= step;
	        if (this.life <= 0) {
	            this.trigger('expired');
	            this.destroy();
	        }
	    };
	    Bullet.prototype.draw = function () {
	        screen_1.default.draw.point({ x: this.x, y: this.y });
	    };
	    return Bullet;
	}(object2d_1.Object2D));
	exports.Bullet = Bullet;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var ship_1 = __webpack_require__(14);
	var screen_1 = __webpack_require__(3);
	var highscores_1 = __webpack_require__(6);
	var GameState = (function () {
	    function GameState() {
	        var _this = this;
	        this.level = 1;
	        this.score = 0;
	        this.lives = 3;
	        this.shipBullets = [];
	        this.extraLives = [];
	        this.ship = new ship_1.Ship(screen_1.default.width / 2, screen_1.default.height / 2);
	        this.ship.on('fire', function (ship, bullet) {
	            bullet.on('expired', function () {
	                _this.shipBullets = _this.shipBullets.filter(function (x) { return x !== bullet; });
	            });
	            _this.shipBullets.push(bullet);
	        });
	        for (var i = 0; i < this.lives; i++) {
	            var life = new ship_1.Ship(80 + (i * 20), 55);
	            this.extraLives.push(life);
	        }
	        this.highscore = highscores_1.highscores.length ? highscores_1.highscores[0].score : 0;
	    }
	    GameState.prototype.update = function (step) {
	        this.ship.update(step);
	        for (var i = 0; i < this.shipBullets.length; i++) {
	            this.shipBullets[i].update(step);
	        }
	    };
	    GameState.prototype.render = function (delta) {
	        screen_1.default.draw.background();
	        screen_1.default.draw.copyright();
	        screen_1.default.draw.scorePlayer1(this.score);
	        screen_1.default.draw.highscore(this.highscore);
	        this.drawExtraLives();
	        this.ship.render();
	        for (var i = 0; i < this.shipBullets.length; i++) {
	            this.shipBullets[i].render();
	        }
	    };
	    GameState.prototype.drawExtraLives = function () {
	        var lives = Math.min(this.lives, 10);
	        for (var i = 0; i < lives; i++) {
	            var life = this.extraLives[i];
	            life.render(0);
	        }
	    };
	    return GameState;
	}());
	exports.GameState = GameState;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var keys_1 = __webpack_require__(5);
	var screen_1 = __webpack_require__(3);
	var object2d_1 = __webpack_require__(8);
	var bullet_1 = __webpack_require__(12);
	var lut_1 = __webpack_require__(9);
	var ACCELERATION = 0.2;
	var FRICTION = 0.007;
	var ROTATION = 5;
	var MAX_SPEED = 15;
	var MAX_BULLETS = 4;
	var Flame = (function (_super) {
	    __extends(Flame, _super);
	    function Flame(x, y) {
	        var _this = _super.call(this, x, y) || this;
	        _this.points = [
	            { x: 5, y: 8 },
	            { x: 0, y: 20 },
	            { x: -5, y: 8 },
	        ];
	        return _this;
	    }
	    Flame.prototype.update = function () {
	    };
	    Flame.prototype.render = function () {
	        this.draw();
	    };
	    return Flame;
	}(object2d_1.Object2D));
	var Ship = (function (_super) {
	    __extends(Ship, _super);
	    function Ship(x, y) {
	        var _this = _super.call(this, x, y) || this;
	        _this.moving = false;
	        _this.bulletCount = 0;
	        _this.angle = 360;
	        _this.flame = new Flame(x, y);
	        _this.points = [
	            { x: 0, y: -15 },
	            { x: 10, y: 10 },
	            { x: 5, y: 5 },
	            { x: -5, y: 5 },
	            { x: -10, y: 10 },
	            { x: 0, y: -15 }
	        ];
	        return _this;
	    }
	    Ship.prototype.render = function () {
	        screen_1.default.draw.shape(this.points, this.x, this.y, this.color);
	        if (this.moving && (Math.floor(Math.random() * 10) + 1) % 2 === 0) {
	            this.flame.draw();
	        }
	    };
	    Ship.prototype.update = function (step) {
	        this.move();
	        this.flame.move();
	        if (keys_1.Key.isDown(keys_1.Key.UP)) {
	            this.moving = true;
	            this.thrust();
	        }
	        else {
	            this.moving = false;
	        }
	        if (keys_1.Key.isDown(keys_1.Key.LEFT)) {
	            this.rotate(-ROTATION);
	            this.flame.rotate(-ROTATION);
	        }
	        if (keys_1.Key.isDown(keys_1.Key.RIGHT)) {
	            this.rotate(ROTATION);
	            this.flame.rotate(ROTATION);
	        }
	        if (keys_1.Key.isPressed(keys_1.Key.CTRL)) {
	            this.fire();
	        }
	        this.vx -= this.vx * FRICTION;
	        this.vy -= this.vy * FRICTION;
	        this.flame.vx = this.vx;
	        this.flame.vy = this.vy;
	    };
	    Ship.prototype.thrust = function () {
	        var v = lut_1.VECTOR[this.angle];
	        this.vx += v.x * ACCELERATION;
	        this.flame.vx = this.vx;
	        this.vy += v.y * ACCELERATION;
	        this.flame.vy = this.vy;
	    };
	    Ship.prototype.fire = function () {
	        var _this = this;
	        if (this.bulletCount < MAX_BULLETS) {
	            this.bulletCount++;
	            var bullet = new bullet_1.Bullet(this.x, this.y, this.angle);
	            bullet.on('expired', function () {
	                _this.bulletCount--;
	            });
	            bullet.x += bullet.vx * 20;
	            bullet.y += bullet.vy * 20;
	            var speed = 0;
	            var dot = (this.vx * bullet.vx) + (this.vy * bullet.vy);
	            if (dot > 0) {
	                speed = this.speed;
	            }
	            bullet.vx *= (10 + speed);
	            bullet.vy *= (10 + speed);
	            this.trigger('fire', bullet);
	        }
	    };
	    return Ship;
	}(object2d_1.Object2D));
	exports.Ship = Ship;


/***/ }
/******/ ]);