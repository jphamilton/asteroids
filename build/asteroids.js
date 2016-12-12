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
	var enterhighscorestate_1 = __webpack_require__(6);
	var demostate_1 = __webpack_require__(7);
	var gamestate_1 = __webpack_require__(16);
	var keys_1 = __webpack_require__(8);
	var Asteroids = (function () {
	    function Asteroids() {
	        var _this = this;
	        this.state = 'demo';
	        this.demoTimer = 0;
	        this.highScoreState = new highscorestate_1.HighScoreState();
	        this.demoState;
	        this.gameState = new gamestate_1.GameState();
	        this.initialsState = new enterhighscorestate_1.EnterHighScoreState();
	        this.initialsState.on('done', function () { return _this.state = 'start'; });
	    }
	    Asteroids.prototype.update = function (step) {
	        this.timers(step);
	        switch (this.state) {
	            case 'start':
	                this.highScoreState.update(step);
	                if (this.demoState) {
	                    this.demoState.update(step);
	                }
	                if (keys_1.Key.isPressed(keys_1.Key.ONE)) {
	                    this.state = 'game';
	                }
	                break;
	            case 'demo':
	                if (!this.demoState) {
	                    this.demoState = new demostate_1.DemoState();
	                }
	                this.demoState.update(step);
	                if (keys_1.Key.isPressed(keys_1.Key.ONE)) {
	                    this.state = 'game';
	                }
	                break;
	            case 'initials':
	                this.initialsState.update(step);
	                break;
	            case 'game':
	                this.gameState.update(step);
	                break;
	        }
	    };
	    Asteroids.prototype.render = function (step) {
	        switch (this.state) {
	            case 'start':
	                this.highScoreState.render(step);
	                break;
	            case 'demo':
	                this.demoState.render(step);
	                break;
	            case 'initials':
	                this.initialsState.render(step);
	                break;
	            case 'game':
	                this.gameState.render(step);
	                break;
	        }
	        keys_1.Key.update();
	    };
	    Asteroids.prototype.timers = function (step) {
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
	        var ctx = this.ctx;
	        this.rect({ x: 0, y: 0 }, { x: screen_1.default.width, y: screen_1.default.height }, '#000000');
	    };
	    Draw.prototype.bounds = function (rect, color) {
	        if (color === void 0) { color = VectorLine; }
	        var ctx = this.ctx;
	        ctx.save();
	        ctx.beginPath();
	        ctx.strokeStyle = color;
	        ctx.lineWidth = 2;
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
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var screen_1 = __webpack_require__(3);
	var keys_1 = __webpack_require__(8);
	var highscores_1 = __webpack_require__(5);
	var events_1 = __webpack_require__(18);
	var letters = '_abcdefghijklmnopqrstuvwxyz';
	var EnterHighScoreState = (function (_super) {
	    __extends(EnterHighScoreState, _super);
	    function EnterHighScoreState() {
	        var _this = _super.call(this) || this;
	        _this.index = 1;
	        _this.init();
	        return _this;
	    }
	    EnterHighScoreState.prototype.init = function () {
	        this.position = 0;
	        this.index = 1;
	        this.score = 0;
	        this.initials = ['a', '_', '_'];
	    };
	    EnterHighScoreState.prototype.update = function (step) {
	        if (keys_1.Key.isPressed(keys_1.Key.LEFT)) {
	            this.index--;
	            if (this.index < 0) {
	                this.index = letters.length - 1;
	            }
	            this.initials[this.position] = letters[this.index];
	        }
	        if (keys_1.Key.isPressed(keys_1.Key.RIGHT)) {
	            this.index++;
	            if (this.index > letters.length - 1) {
	                this.index = 0;
	            }
	            this.initials[this.position] = letters[this.index];
	        }
	        if (keys_1.Key.isPressed(keys_1.Key.SPACE)) {
	            this.position++;
	            if (this.position >= 3) {
	                this.init();
	                this.trigger('done');
	            }
	            this.index = 1;
	            this.initials[this.position] = letters[this.index];
	        }
	    };
	    EnterHighScoreState.prototype.render = function (step) {
	        var offset = 165;
	        var text = (function (t) { return screen_1.default.draw.text(t, 50, offset += 35, '30pt'); });
	        screen_1.default.draw.background();
	        screen_1.default.draw.highscore(highscores_1.highscores[0].score);
	        screen_1.default.draw.scorePlayer1(this.score);
	        screen_1.default.draw.copyright();
	        text('your score is one of the ten best');
	        text('please enter your initials');
	        text('push rotate to select letter');
	        text('push hyperspace when letter is correct');
	        screen_1.default.draw.text2(this.initials.join(''), '60pt', function (width) {
	            return { x: (screen_1.default.width / 2) - width, y: screen_1.default.height / 2 };
	        });
	    };
	    return EnterHighScoreState;
	}(events_1.EventSource));
	exports.EnterHighScoreState = EnterHighScoreState;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var screen_1 = __webpack_require__(3);
	var keys_1 = __webpack_require__(8);
	var highscores_1 = __webpack_require__(5);
	var rocks_1 = __webpack_require__(9);
	var alien_1 = __webpack_require__(13);
	var explosion_1 = __webpack_require__(19);
	var quadtree_1 = __webpack_require__(15);
	var DemoState = (function () {
	    function DemoState() {
	        this.blink = 0;
	        this.showPushStart = true;
	        this.modeTimer = 0;
	        this.alienTimer = 0;
	        this.explosions = [];
	        this.alienBullets = [];
	        this.debug = false;
	        this.paused = false;
	        this.highscore = highscores_1.highscores.length ? highscores_1.highscores[0].score : 0;
	        var rock1 = new rocks_1.Rock(20, screen_1.default.height - 40, 2, -2, rocks_1.RockSize.Large);
	        var rock2 = new rocks_1.Rock(screen_1.default.width - 40, 40, -2, 2, rocks_1.RockSize.Large);
	        var rock3 = new rocks_1.Rock(screen_1.default.width - 80, screen_1.default.height - 80, -1, 2, rocks_1.RockSize.Large);
	        var rock4 = new rocks_1.Rock(screen_1.default.width - 80, screen_1.default.height - 120, 1, -2, rocks_1.RockSize.Large);
	        this.rocks = [rock1, rock2, rock3, rock4];
	    }
	    DemoState.prototype.update = function (step) {
	        if (keys_1.Key.isPressed(keys_1.Key.DEBUG)) {
	            this.debug = !this.debug;
	        }
	        if (keys_1.Key.isPressed(keys_1.Key.PAUSE)) {
	            this.paused = !this.paused;
	        }
	        if (this.paused) {
	            return;
	        }
	        if (!this.alien) {
	            this.alienTimer += step;
	        }
	        if (this.alienTimer >= 7) {
	            this.createBigAlien();
	        }
	        this.blink += step;
	        if (this.blink >= .4) {
	            this.blink = 0;
	            this.showPushStart = !this.showPushStart;
	        }
	        this.updateDemo(step);
	    };
	    DemoState.prototype.render = function (step) {
	        this.drawBackground();
	        this.drawPushStart();
	        var objects = this.rocks.concat([this.alien], this.alienBullets, this.explosions);
	        objects.forEach(function (obj) {
	            if (obj) {
	                obj.render();
	            }
	        });
	        if (this.alien && this.debug) {
	            this.drawQuadtree();
	            this.bounds.forEach(function (r) {
	                screen_1.default.draw.bounds(r, '#fc058d');
	            });
	        }
	        this.bounds = [];
	        if (this.debug) {
	            screen_1.default.draw.text2('debug mode', '12pt', function (width) {
	                return { x: screen_1.default.width - width - 10, y: screen_1.default.height - 40 };
	            });
	        }
	    };
	    DemoState.prototype.updateDemo = function (step) {
	        var _this = this;
	        var check = !!this.alien;
	        if (check) {
	            this.bounds = [];
	            this.qt = new quadtree_1.Quadtree({ x: 0, y: 0, width: screen_1.default.width, height: screen_1.default.height }, 1);
	        }
	        this.rocks.forEach(function (rock) {
	            if (check) {
	                _this.qt.insert(rock);
	            }
	        });
	        if (this.alien) {
	            if (check) {
	                var rocks = this.qt.retrieve(this.alien);
	                rocks.forEach(function (rock) {
	                    if (rock.collided(_this.alien)) {
	                        _this.createExplosion(_this.alien.origin.x, _this.alien.origin.y);
	                        _this.createExplosion(rock.origin.x, rock.origin.y);
	                        _this.splitRock(rock, _this.alien);
	                        _this.alien = null;
	                        _this.alienBullets = [];
	                    }
	                    if (_this.debug) {
	                        _this.bounds.push(rock);
	                    }
	                });
	            }
	        }
	        this.alienBullets.forEach(function (bullet) {
	            var rocks = [];
	            if (check) {
	                rocks.push.apply(rocks, _this.qt.retrieve(bullet));
	                rocks.forEach(function (rock) {
	                    if (rock.collided(bullet)) {
	                        _this.createExplosion(rock.origin.x, rock.origin.y);
	                        _this.alienBullets = _this.alienBullets.filter(function (x) { return x !== bullet; });
	                        _this.splitRock(rock, bullet);
	                        bullet = null;
	                    }
	                    if (_this.debug) {
	                        _this.bounds.push(rock);
	                    }
	                });
	            }
	            if (_this.debug) {
	                (_a = _this.bounds).push.apply(_a, rocks);
	            }
	            var _a;
	        });
	        var objects = [this.alien].concat(this.rocks, this.alienBullets, this.explosions);
	        objects.forEach(function (obj) {
	            if (obj) {
	                obj.update(step);
	            }
	        });
	    };
	    DemoState.prototype.createBigAlien = function () {
	        var _this = this;
	        this.alien = new alien_1.BigAlien();
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
	    };
	    DemoState.prototype.createExplosion = function (x, y) {
	        var _this = this;
	        var explosion = new explosion_1.Explosion(x, y);
	        explosion.on('expired', function () {
	            _this.explosions = _this.explosions.filter(function (x) { return x !== explosion; });
	            explosion = null;
	        });
	        this.explosions.push(explosion);
	    };
	    DemoState.prototype.splitRock = function (rock, obj) {
	        this.rocks = this.rocks.filter(function (x) { return x !== rock; });
	        (_a = this.rocks).push.apply(_a, rock.split(obj));
	        rock = null;
	        var _a;
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
	    DemoState.prototype.drawQuadtree = function () {
	        if (this.qt) {
	            var drawNodes_1 = function (nodes) {
	                if (!nodes) {
	                    return;
	                }
	                nodes.forEach(function (n) {
	                    screen_1.default.draw.bounds(n.bounds);
	                    drawNodes_1(n.nodes);
	                });
	            };
	            drawNodes_1(this.qt.nodes);
	        }
	    };
	    return DemoState;
	}());
	exports.DemoState = DemoState;


/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";
	var _Key = (function () {
	    function _Key() {
	        var _this = this;
	        this.SPACE = 32;
	        this.LEFT = 37;
	        this.UP = 38;
	        this.RIGHT = 39;
	        this.SHIFT = 16;
	        this.CTRL = 17;
	        this.ONE = 49;
	        this.DEBUG = 68;
	        this.PAUSE = 80;
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
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var object2d_1 = __webpack_require__(10);
	var util_1 = __webpack_require__(12);
	var lut_1 = __webpack_require__(11);
	var RockSize;
	(function (RockSize) {
	    RockSize[RockSize["Small"] = 5] = "Small";
	    RockSize[RockSize["Medium"] = 10] = "Medium";
	    RockSize[RockSize["Large"] = 20] = "Large";
	})(RockSize = exports.RockSize || (exports.RockSize = {}));
	var Rock = (function (_super) {
	    __extends(Rock, _super);
	    function Rock(x, y, vx, vy, size) {
	        var _this = _super.call(this, x, y) || this;
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
	        _this.vx = vx;
	        _this.vy = vy;
	        var type = util_1.random(0, 2);
	        var def = _this.rocks[type];
	        _this.points = def.map(function (p) {
	            return {
	                x: p[0] * size,
	                y: p[1] * size
	            };
	        });
	        _this.size = size;
	        _this.rotate(util_1.random(1, 90));
	        _this.rot = util_1.random(1, 10) % 2 === 0 ? 1 : -1;
	        _this.timeToRot = util_1.random(1, 5);
	        return _this;
	    }
	    Rock.prototype.update = function (step) {
	        this.rotTimer += 1;
	        this.move(step);
	        if (this.rotTimer === this.timeToRot) {
	            this.rotate(this.rot);
	            this.rotTimer = 0;
	        }
	    };
	    Rock.prototype.render = function () {
	        this.draw();
	    };
	    Object.defineProperty(Rock.prototype, "direction", {
	        get: function () {
	            var radians = Math.atan2(this.vy, this.vx);
	            var degrees = radians * (180 / Math.PI);
	            degrees = degrees > 0.0 ? degrees : 360 + degrees;
	            return Math.floor(degrees);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Rock.prototype.split = function (obj) {
	        if (this.size > RockSize.Small) {
	            var angle1 = util_1.random(this.direction, this.direction + 80);
	            var angle2 = util_1.random(this.direction - 80, this.direction);
	            if (angle1 < 0) {
	                angle1 += 360;
	            }
	            if (angle1 > 360) {
	                angle1 -= 360;
	            }
	            if (angle2 < 0) {
	                angle2 += 360;
	            }
	            if (angle2 > 360) {
	                angle2 -= 360;
	            }
	            var v1 = lut_1.VECTOR[angle1];
	            var v2 = lut_1.VECTOR[angle2];
	            var r1 = util_1.random(1, 6);
	            var r2 = util_1.random(1, 6);
	            var size = this.size === RockSize.Large ? RockSize.Medium : RockSize.Small;
	            var rock1 = new Rock(this.origin.x, this.origin.y, v1.x *= r1, v1.y *= r1, size);
	            var rock2 = new Rock(this.origin.x, this.origin.y, v2.x *= r2, v2.y *= r2, size);
	            return [rock1, rock2];
	        }
	        return [];
	    };
	    return Rock;
	}(object2d_1.Object2D));
	exports.Rock = Rock;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var events_1 = __webpack_require__(18);
	var lut_1 = __webpack_require__(11);
	var screen_1 = __webpack_require__(3);
	var Object2D = (function (_super) {
	    __extends(Object2D, _super);
	    function Object2D(x, y) {
	        var _this = _super.call(this) || this;
	        _this.color = 'rgba(255,255,255,.9)';
	        _this.angle = 360;
	        _this.vx = 0;
	        _this.vy = 0;
	        _this._xmin = 0;
	        _this._xmax = 0;
	        _this._ymin = 0;
	        _this._ymax = 0;
	        _this._width = 0;
	        _this._height = 0;
	        _this.origin = { x: x, y: y };
	        return _this;
	    }
	    Object.defineProperty(Object2D.prototype, "points", {
	        get: function () {
	            return this._points;
	        },
	        set: function (points) {
	            this._points = points;
	            this.calcBounds();
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object2D.prototype.calcBounds = function () {
	        var _this = this;
	        this._points.forEach(function (p) {
	            if (p.x < _this._xmin)
	                _this._xmin = p.x;
	            if (p.x > _this._xmax)
	                _this._xmax = p.x;
	            if (p.y < _this._ymin)
	                _this._ymin = p.y;
	            if (p.y > _this._ymax)
	                _this._ymax = p.y;
	        });
	        this._width = this._xmax - this._xmin;
	        this._height = this._ymax - this._ymin;
	    };
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
	        this.calcBounds();
	    };
	    Object2D.prototype.move = function (step) {
	        this.origin.x += this.vx;
	        this.origin.y += this.vy;
	        if (this.origin.x > screen_1.default.width) {
	            this.origin.x -= screen_1.default.width;
	        }
	        if (this.origin.x < 0) {
	            this.origin.x += screen_1.default.width;
	        }
	        if (this.origin.y > screen_1.default.height) {
	            this.origin.y -= screen_1.default.height;
	        }
	        if (this.origin.y < 0) {
	            this.origin.y += screen_1.default.height;
	        }
	    };
	    Object2D.prototype.scale = function (factor) {
	        this.points.forEach(function (point) {
	            point.x *= factor;
	            point.y *= factor;
	        });
	        this.calcBounds();
	    };
	    Object2D.prototype.draw = function () {
	        screen_1.default.draw.shape(this.points, this.origin.x, this.origin.y, this.color);
	    };
	    Object.defineProperty(Object2D.prototype, "magnitude", {
	        get: function () {
	            return Math.sqrt((this.vx * this.vx) + (this.vy * this.vy));
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Object2D.prototype, "x", {
	        get: function () {
	            return this.origin.x + this._xmin;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Object2D.prototype, "y", {
	        get: function () {
	            return this.origin.y + this._ymin;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Object2D.prototype, "width", {
	        get: function () {
	            return this._width;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Object2D.prototype, "height", {
	        get: function () {
	            return this._height;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object2D.prototype.collided = function (rect2) {
	        if (rect2 && this.x < rect2.x + rect2.width &&
	            this.x + this.width > rect2.x &&
	            this.y < rect2.y + rect2.height &&
	            this.height + this.y > rect2.y) {
	            return true;
	        }
	        return false;
	    };
	    Object2D.prototype.destroy = function () {
	        for (var event_1 in this.handlers) {
	            this.handlers[event_1] = null;
	        }
	        this.handlers = {};
	    };
	    return Object2D;
	}(events_1.EventSource));
	exports.Object2D = Object2D;


/***/ },
/* 11 */
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
	for (var i = 0; i <= 360; i++) {
	    RAD[i] = i * r;
	    COS[i] = Math.cos(RAD[i]);
	    SIN[i] = Math.sin(RAD[i]);
	    RAD[-i] = -i * r;
	    COS[-i] = Math.cos(RAD[-i]);
	    SIN[-i] = Math.sin(RAD[-i]);
	    var t = PI2 * (i / 360);
	    VECTOR[i] = {
	        x: Math.cos(t),
	        y: Math.sin(t)
	    };
	}


/***/ },
/* 12 */
/***/ function(module, exports) {

	"use strict";
	function random(start, end) {
	    return Math.floor(Math.random() * (end - start + 1)) + start;
	}
	exports.random = random;


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
	var object2d_1 = __webpack_require__(10);
	var bullet_1 = __webpack_require__(14);
	var util_1 = __webpack_require__(12);
	var MAX_BULLETS = 3;
	var BigAlien = (function (_super) {
	    __extends(BigAlien, _super);
	    function BigAlien() {
	        var _this = _super.call(this, 0, 0) || this;
	        _this.moveTimer = 0;
	        _this.bulletTimer = 1;
	        _this.bulletCount = 0;
	        _this.moveTime = 2;
	        _this.vy = 0;
	        _this.origin.y = util_1.random(100, screen_1.default.height - 100);
	        if (_this.origin.y % 2 === 0) {
	            _this.origin.x = 40;
	            _this.vx = 3;
	        }
	        else {
	            _this.origin.x = screen_1.default.width - 40;
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
	        this.move(step);
	        if (this.origin.x >= screen_1.default.width - 5 || this.origin.x <= 5) {
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
	                this.vy = this.origin.x % 2 === 0 ? this.vx : -this.vx;
	            }
	            this.moveTimer = 0;
	            this.moveTime++;
	        }
	        this.bulletTimer += step;
	        if (this.bulletTimer >= 1 && this.bulletCount <= MAX_BULLETS) {
	            var bullet = new bullet_1.Bullet(this.origin.x, this.origin.y, util_1.random(1, 360));
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
	        screen_1.default.draw.shape([this.points[1], this.points[6]], this.origin.x, this.origin.y);
	        screen_1.default.draw.shape([this.points[2], this.points[5]], this.origin.x, this.origin.y);
	    };
	    return BigAlien;
	}(object2d_1.Object2D));
	exports.BigAlien = BigAlien;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var screen_1 = __webpack_require__(3);
	var lut_1 = __webpack_require__(11);
	var object2d_1 = __webpack_require__(10);
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
	        this.move(step);
	        this.life -= step;
	        if (this.life <= 0) {
	            this.trigger('expired');
	            this.destroy();
	        }
	    };
	    Bullet.prototype.draw = function () {
	        screen_1.default.draw.point({ x: this.origin.x, y: this.origin.y });
	    };
	    return Bullet;
	}(object2d_1.Object2D));
	exports.Bullet = Bullet;


/***/ },
/* 15 */
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
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var ship_1 = __webpack_require__(17);
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
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var keys_1 = __webpack_require__(8);
	var screen_1 = __webpack_require__(3);
	var object2d_1 = __webpack_require__(10);
	var bullet_1 = __webpack_require__(14);
	var lut_1 = __webpack_require__(11);
	var ACCELERATION = 0.2;
	var FRICTION = 0.007;
	var ROTATION = 5;
	var MAX_ACCELERATION = 20.0;
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
	        _this.flame = new Flame(x, y);
	        _this.points = [
	            { x: 0, y: -15 },
	            { x: 10, y: 10 },
	            { x: 5, y: 5 },
	            { x: -5, y: 5 },
	            { x: -10, y: 10 },
	            { x: 0, y: -15 }
	        ];
	        _this.angle = 270;
	        return _this;
	    }
	    Ship.prototype.render = function () {
	        screen_1.default.draw.shape(this.points, this.origin.x, this.origin.y, this.color);
	        if (this.moving && (Math.floor(Math.random() * 10) + 1) % 2 === 0) {
	            this.flame.draw();
	        }
	    };
	    Ship.prototype.update = function (step) {
	        if (!this.moving) {
	            this.vx -= this.vx * FRICTION;
	            this.vy -= this.vy * FRICTION;
	            this.flame.vx = this.vx;
	            this.flame.vy = this.vy;
	        }
	        this.move(step);
	        this.flame.move(step);
	        if (keys_1.Key.isDown(keys_1.Key.UP)) {
	            this.moving = true;
	            this.thrust();
	        }
	        else {
	            this.moving = false;
	        }
	        if (keys_1.Key.isDown(keys_1.Key.LEFT)) {
	            this.rotate(-ROTATION);
	        }
	        if (keys_1.Key.isDown(keys_1.Key.RIGHT)) {
	            this.rotate(ROTATION);
	        }
	        if (keys_1.Key.isPressed(keys_1.Key.CTRL)) {
	            this.fire();
	        }
	    };
	    Ship.prototype.rotate = function (n) {
	        _super.prototype.rotate.call(this, n);
	        this.flame.rotate(n);
	    };
	    Ship.prototype.thrust = function () {
	        var v = lut_1.VECTOR[this.angle];
	        console.clear();
	        console.log(this.angle);
	        this.vx += v.x * ACCELERATION;
	        this.flame.vx = this.vx;
	        this.vy += v.y * ACCELERATION;
	        this.flame.vy = this.vy;
	        var velocity = this.magnitude;
	        if (velocity > MAX_ACCELERATION) {
	            this.vx = this.vx / velocity;
	            this.vy = this.vy / velocity;
	            this.vx *= MAX_ACCELERATION;
	            this.vy *= MAX_ACCELERATION;
	            this.flame.vx = this.vx;
	            this.flame.vy = this.vy;
	        }
	    };
	    Ship.prototype.fire = function () {
	        var _this = this;
	        if (this.bulletCount < MAX_BULLETS) {
	            this.bulletCount++;
	            var bullet = new bullet_1.Bullet(this.origin.x, this.origin.y, this.angle);
	            bullet.on('expired', function () {
	                _this.bulletCount--;
	            });
	            bullet.origin.x += bullet.vx * 20;
	            bullet.origin.y += bullet.vy * 20;
	            var speed = 0;
	            var dot = (this.vx * bullet.vx) + (this.vy * bullet.vy);
	            if (dot > 0) {
	                speed = this.magnitude;
	            }
	            bullet.vx *= (10 + speed);
	            bullet.vy *= (10 + speed);
	            this.trigger('fire', bullet);
	        }
	    };
	    return Ship;
	}(object2d_1.Object2D));
	exports.Ship = Ship;


/***/ },
/* 18 */
/***/ function(module, exports) {

	"use strict";
	var EventSource = (function () {
	    function EventSource() {
	        this.handlers = {};
	    }
	    EventSource.prototype.on = function (event, handler) {
	        if (!this.handlers[event]) {
	            this.handlers[event] = [];
	        }
	        this.handlers[event].push(handler);
	    };
	    EventSource.prototype.off = function (event, handler) {
	        this.handlers[event] = this.handlers[event].filter(function (x) { return x !== handler; });
	    };
	    EventSource.prototype.trigger = function (event) {
	        var _this = this;
	        var args = [];
	        for (var _i = 1; _i < arguments.length; _i++) {
	            args[_i - 1] = arguments[_i];
	        }
	        var handlers = this.handlers[event] || [];
	        handlers.forEach(function (x) { return x.apply(void 0, [_this].concat(args)); });
	    };
	    return EventSource;
	}());
	exports.EventSource = EventSource;


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var events_1 = __webpack_require__(18);
	var screen_1 = __webpack_require__(3);
	var lut_1 = __webpack_require__(11);
	var util_1 = __webpack_require__(12);
	var Explosion = (function (_super) {
	    __extends(Explosion, _super);
	    function Explosion(x, y) {
	        var _this = _super.call(this) || this;
	        _this.life = 1;
	        _this.points = [];
	        for (var i = 0; i < 10; i++) {
	            var t = lut_1.VECTOR[util_1.random(1, 360)];
	            _this.points.push({ x: x, y: y, vx: t.x + Math.random(), vy: t.y + Math.random() });
	        }
	        return _this;
	    }
	    Explosion.prototype.update = function (step) {
	        this.points.forEach(function (point) {
	            point.x += point.vx;
	            point.y += point.vy;
	        });
	        this.life -= step;
	        if (this.life <= 0) {
	            this.trigger('expired');
	        }
	    };
	    Explosion.prototype.render = function (step) {
	        var _this = this;
	        this.points.forEach(function (point) {
	            screen_1.default.draw.point(point, "rgba(255,255,255," + _this.life + ")");
	        });
	    };
	    return Explosion;
	}(events_1.EventSource));
	exports.Explosion = Explosion;


/***/ }
/******/ ]);