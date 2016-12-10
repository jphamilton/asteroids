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
	var highscorestate_1 = __webpack_require__(2);
	var demostate_1 = __webpack_require__(6);
	var gamestate_1 = __webpack_require__(15);
	var keys_1 = __webpack_require__(7);
	var highScoreState = new highscorestate_1.HighScoreState();
	var demoState = new demostate_1.DemoState();
	var gameState = new gamestate_1.GameState();
	var Asteroids = (function () {
	    function Asteroids() {
	        this.state = 'start';
	        this.demoTimer = 0;
	        this.demoStarted = false;
	    }
	    Asteroids.prototype.update = function (step) {
	        if (this.state !== 'game') {
	            this.demoTimer += step;
	            if (this.demoTimer >= 15) {
	                this.demoTimer = 0;
	                this.state = this.state === 'demo' ? 'start' : 'demo';
	            }
	        }
	        switch (this.state) {
	            case 'start':
	                highScoreState.update(step);
	                if (this.demoStarted) {
	                    demoState.update(step);
	                }
	                if (keys_1.Key.isPressed(keys_1.Key.ONE)) {
	                    this.state = 'game';
	                }
	                break;
	            case 'demo':
	                this.demoStarted = true;
	                demoState.update(step);
	                break;
	            case 'game':
	                gameState.update(step);
	                break;
	        }
	    };
	    Asteroids.prototype.render = function (step) {
	        switch (this.state) {
	            case 'start':
	                highScoreState.render(step);
	                break;
	            case 'demo':
	                demoState.render(step);
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
	var highscores_1 = __webpack_require__(5);
	var HighScoreState = (function () {
	    function HighScoreState() {
	        this.blink = 0;
	        this.showPushStart = true;
	        this.highscore = highscores_1.highscores.length ? highscores_1.highscores[0].score : 0;
	    }
	    HighScoreState.prototype.update = function (step) {
	        this.blink += step;
	        if (this.blink >= .4) {
	            this.blink = 0;
	            this.showPushStart = !this.showPushStart;
	        }
	    };
	    HighScoreState.prototype.render = function (step) {
	        this.drawBackground();
	        this.drawPushStart();
	        this.drawHighScores();
	    };
	    HighScoreState.prototype.drawBackground = function () {
	        screen_1.default.draw.background();
	        screen_1.default.draw.scorePlayer1(0);
	        screen_1.default.draw.highscore(this.highscore);
	        screen_1.default.draw.copyright();
	    };
	    HighScoreState.prototype.drawHighScores = function () {
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
	    HighScoreState.prototype.drawPushStart = function () {
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
	    HighScoreState.prototype.pad = function (text, char, count) {
	        text = text.toString();
	        while (text.length < count) {
	            text = char + text;
	        }
	        return text;
	    };
	    return HighScoreState;
	}());
	exports.HighScoreState = HighScoreState;


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
	    Draw.prototype.bounds = function (rect, color) {
	        if (color === void 0) { color = VectorLine; }
	        var ctx = this.ctx;
	        ctx.save();
	        ctx.beginPath();
	        ctx.strokeStyle = color;
	        ctx.lineWidth = 3;
	        ctx.moveTo(rect.x, rect.y);
	        ctx.lineTo(rect.x + rect.width, rect.y);
	        ctx.lineTo(rect.x + rect.width, rect.y + rect.height);
	        ctx.lineTo(rect.x, rect.y + rect.height);
	        ctx.lineTo(rect.x, rect.y);
	        ctx.stroke();
	        ctx.closePath();
	        ctx.restore();
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
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var screen_1 = __webpack_require__(3);
	var keys_1 = __webpack_require__(7);
	var highscores_1 = __webpack_require__(5);
	var rocks_1 = __webpack_require__(8);
	var alien_1 = __webpack_require__(12);
	var quadtree_1 = __webpack_require__(14);
	var DemoState = (function () {
	    function DemoState() {
	        this.blink = 0;
	        this.showPushStart = true;
	        this.modeTimer = 0;
	        this.alienTimer = 0;
	        this.alienBullets = [];
	        this.debug = false;
	        this.bounds = [];
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
	    DemoState.prototype.update = function (step) {
	        var _this = this;
	        if (keys_1.Key.isPressed(keys_1.Key.DEBUG)) {
	            this.debug = !this.debug;
	        }
	        if (!this.alien) {
	            this.alienTimer += step;
	        }
	        if (this.alienTimer >= 7) {
	            this.alien = new alien_1.BigAlien(0, 0);
	            this.alien.on('expired', function () {
	                _this.alien.destroy();
	                _this.alien = null;
	                _this.alienBullets.forEach(function (b) { return b.destroy(); });
	                _this.alienBullets = [];
	            });
	            this.alien.on('fire', function (alien, bullet) {
	                bullet.on('expired', function () {
	                    _this.alienBullets = _this.alienBullets.filter(function (x) { return x !== bullet; });
	                });
	                _this.alienBullets.push(bullet);
	            });
	            this.alienTimer = 0;
	        }
	        this.blink += step;
	        if (this.blink >= .4) {
	            this.blink = 0;
	            this.showPushStart = !this.showPushStart;
	        }
	        this.updateDemo(step);
	    };
	    DemoState.prototype.render = function (step) {
	        this.renderDemo();
	        if (this.debug) {
	            screen_1.default.draw.text2('debug mode', '12pt', function (width) {
	                return { x: screen_1.default.width - width - 10, y: screen_1.default.height - 40 };
	            });
	        }
	    };
	    DemoState.prototype.updateDemo = function (step) {
	        var _this = this;
	        var check = this.alien;
	        if (check) {
	            this.bounds = [];
	            this.qt = new quadtree_1.Quadtree({ x: 0, y: 0, width: screen_1.default.width, height: screen_1.default.height }, Math.floor(this.rocks.length / 4));
	        }
	        this.rocks.forEach(function (rock) {
	            if (check) {
	                _this.qt.insert(rock.rect);
	            }
	            rock.update(step);
	        });
	        if (this.alien) {
	            if (check) {
	                this.bounds = this.qt.retrieve(this.alien.rect);
	            }
	            this.alien.update(step);
	        }
	        this.alienBullets.forEach(function (bullet) {
	            if (check) {
	                (_a = _this.bounds).push.apply(_a, _this.qt.retrieve(bullet.rect));
	            }
	            bullet.update(step);
	            var _a;
	        });
	    };
	    DemoState.prototype.renderDemo = function () {
	        var _this = this;
	        this.drawBackground();
	        this.drawPushStart();
	        this.rocks.forEach(function (rock) {
	            rock.render();
	            if (_this.debug) {
	                screen_1.default.draw.bounds(rock.rect);
	            }
	        });
	        if (this.alien) {
	            this.alien.render();
	            if (this.debug) {
	                screen_1.default.draw.bounds(this.alien.rect);
	            }
	        }
	        this.alienBullets.forEach(function (bullet) {
	            bullet.render();
	        });
	        if (this.debug) {
	            this.bounds.forEach(function (r) { return screen_1.default.draw.bounds(r, '#fc058d'); });
	            this.bounds = [];
	        }
	    };
	    DemoState.prototype.drawBackground = function () {
	        screen_1.default.draw.background();
	        screen_1.default.draw.scorePlayer1(0);
	        screen_1.default.draw.highscore(this.highscore);
	        screen_1.default.draw.copyright();
	    };
	    DemoState.prototype.drawPushStart = function () {
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
	    return DemoState;
	}());
	exports.DemoState = DemoState;


/***/ },
/* 7 */
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
	            _this.keys[event.keyCode] = true;
	        };
	        window.onkeyup = function (event) {
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
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var object2d_1 = __webpack_require__(9);
	var util_1 = __webpack_require__(11);
	var RockSize;
	(function (RockSize) {
	    RockSize[RockSize["Small"] = 5] = "Small";
	    RockSize[RockSize["Medium"] = 10] = "Medium";
	    RockSize[RockSize["Large"] = 20] = "Large";
	})(RockSize = exports.RockSize || (exports.RockSize = {}));
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
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var lut_1 = __webpack_require__(10);
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
	                x: this.x + xmin,
	                y: this.y + ymin,
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
/* 10 */
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
/* 11 */
/***/ function(module, exports) {

	"use strict";
	function random(start, end) {
	    return Math.floor(Math.random() * end) + start;
	}
	exports.random = random;


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
	var object2d_1 = __webpack_require__(9);
	var bullet_1 = __webpack_require__(13);
	var util_1 = __webpack_require__(11);
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
	        if (this.x >= screen_1.default.width - 5 || this.x <= 5) {
	            this.trigger('expired');
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
	            this.trigger('fire', bullet);
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
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var screen_1 = __webpack_require__(3);
	var lut_1 = __webpack_require__(10);
	var object2d_1 = __webpack_require__(9);
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
	    Object.defineProperty(Bullet.prototype, "rect", {
	        get: function () {
	            var size = 1;
	            return {
	                x: this.x - size,
	                y: this.y - size,
	                width: size,
	                height: size
	            };
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return Bullet;
	}(object2d_1.Object2D));
	exports.Bullet = Bullet;


/***/ },
/* 14 */
/***/ function(module, exports) {

	"use strict";
	var Quadtree = (function () {
	    function Quadtree(bounds, maxObjects, maxLevels, level) {
	        if (maxObjects === void 0) { maxObjects = 10; }
	        if (maxLevels === void 0) { maxLevels = 4; }
	        if (level === void 0) { level = 0; }
	        this.bounds = bounds;
	        this.maxObjects = maxObjects;
	        this.maxLevels = maxLevels;
	        this.level = level;
	        this.objects = [];
	        this.nodes = [];
	        this.width2 = this.bounds.width / 2;
	        this.height2 = this.bounds.height / 2;
	        this.xmid = this.bounds.x + this.width2;
	        this.ymid = this.bounds.y + this.height2;
	    }
	    Quadtree.prototype.insert = function (rect) {
	        var _this = this;
	        var i = 0;
	        var indices;
	        if (this.nodes.length) {
	            indices = this.getIndex(rect);
	            if (indices.length) {
	                indices.forEach(function (i) {
	                    _this.nodes[i].insert(rect);
	                });
	                return;
	            }
	        }
	        this.objects.push(rect);
	        if (this.objects.length > this.maxObjects && this.level < this.maxLevels) {
	            if (!this.nodes.length) {
	                this.split();
	            }
	            var _loop_1 = function () {
	                indices = this_1.getIndex(this_1.objects[i]);
	                if (indices.length) {
	                    var object_1 = this_1.objects.splice(i, 1)[0];
	                    indices.forEach(function (n) {
	                        _this.nodes[n].insert(object_1);
	                    });
	                }
	                else {
	                    i = i + 1;
	                }
	            };
	            var this_1 = this;
	            while (i < this.objects.length) {
	                _loop_1();
	            }
	        }
	    };
	    Quadtree.prototype.retrieve = function (rect) {
	        var _this = this;
	        var indices = this.getIndex(rect);
	        var result = this.objects;
	        if (this.nodes.length) {
	            if (indices.length) {
	                indices.forEach(function (i) {
	                    result = result.concat(_this.nodes[i].retrieve(rect));
	                });
	            }
	            else {
	                for (var i = 0; i < this.nodes.length; i++) {
	                    result = result.concat(this.nodes[i].retrieve(rect));
	                }
	            }
	        }
	        return result.filter(function (x, n, a) { return a.indexOf(x) === n; });
	    };
	    ;
	    Quadtree.prototype.clear = function () {
	        this.objects = [];
	        for (var i = 0; i < this.nodes.length; i++) {
	            if (this.nodes[i]) {
	                this.nodes[i].clear();
	            }
	        }
	        this.nodes = [];
	    };
	    ;
	    Quadtree.prototype.getIndex = function (rect) {
	        if (!rect) {
	            return [];
	        }
	        var index = -1;
	        var results = [];
	        var _a = this, xmid = _a.xmid, ymid = _a.ymid;
	        var top = (rect.y <= ymid);
	        var bottom = (rect.y > ymid);
	        if (rect.x <= xmid) {
	            if (top) {
	                results.push(1);
	                var zero = false;
	                if (rect.x + rect.width > xmid) {
	                    results.push(0);
	                    zero = true;
	                }
	                if (rect.y + rect.height > ymid) {
	                    results.push(2);
	                    if (zero) {
	                        results.push(3);
	                    }
	                }
	            }
	            else if (bottom) {
	                results.push(2);
	                if (rect.x + rect.width > xmid) {
	                    results.push(3);
	                }
	            }
	        }
	        else if (rect.x > xmid) {
	            if (top) {
	                results.push(0);
	                if (rect.y + rect.height > ymid) {
	                    results.push(3);
	                }
	            }
	            else {
	                results.push(3);
	            }
	        }
	        return results;
	    };
	    ;
	    Quadtree.prototype.split = function () {
	        var _this = this;
	        var width = Math.round(this.width2);
	        var height = Math.round(this.height2);
	        var x = Math.round(this.bounds.x);
	        var y = Math.round(this.bounds.y);
	        var create = function (x, y) {
	            var bounds = {
	                x: x,
	                y: y,
	                width: width,
	                height: height
	            };
	            return new Quadtree(bounds, _this.maxObjects, _this.maxLevels, _this.level + 1);
	        };
	        this.nodes = [create(x + width, y), create(x, y), create(x, y + height), create(x + width, y + height)];
	    };
	    ;
	    return Quadtree;
	}());
	exports.Quadtree = Quadtree;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var ship_1 = __webpack_require__(16);
	var screen_1 = __webpack_require__(3);
	var highscores_1 = __webpack_require__(5);
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
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var keys_1 = __webpack_require__(7);
	var screen_1 = __webpack_require__(3);
	var object2d_1 = __webpack_require__(9);
	var bullet_1 = __webpack_require__(13);
	var lut_1 = __webpack_require__(10);
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
	        this.vx -= this.vx * FRICTION;
	        this.vy -= this.vy * FRICTION;
	        this.flame.vx = this.vx;
	        this.flame.vy = this.vy;
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