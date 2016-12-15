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
	var highscores_1 = __webpack_require__(2);
	var highscorestate_1 = __webpack_require__(3);
	var enterhighscorestate_1 = __webpack_require__(6);
	var demostate_1 = __webpack_require__(9);
	var gamestate_1 = __webpack_require__(19);
	var keys_1 = __webpack_require__(7);
	var DEMO_TIME = 15;
	var Asteroids = (function () {
	    function Asteroids() {
	        this.state = 'start';
	        this.demoTimer = 0;
	        this.init();
	    }
	    Asteroids.prototype.init = function () {
	        var _this = this;
	        this.highScoreState = new highscorestate_1.HighScoreState();
	        this.demoState = new demostate_1.DemoState();
	        this.gameState = new gamestate_1.GameState();
	        this.gameState.on('done', function (source, score) {
	            _this.init();
	            if (highscores_1.highscores.qualifies(score)) {
	                _this.initialsState = new enterhighscorestate_1.EnterHighScoreState(score);
	                _this.initialsState.on('done', function () {
	                    _this.state = 'start';
	                });
	                _this.state = 'initials';
	            }
	            else {
	                _this.state = 'start';
	            }
	        });
	        this.demoStarted = false;
	    };
	    Asteroids.prototype.update = function (dt) {
	        switch (this.state) {
	            case 'start':
	                this.highScoreState.update(dt);
	                if (this.demoStarted) {
	                    this.demoState.update(dt);
	                }
	                if (keys_1.Key.isPressed(keys_1.Key.ONE)) {
	                    this.state = 'game';
	                }
	                this.updateDemoTimer(dt);
	                break;
	            case 'demo':
	                this.demoState.update(dt);
	                if (keys_1.Key.isPressed(keys_1.Key.ONE)) {
	                    this.state = 'game';
	                }
	                this.updateDemoTimer(dt);
	                break;
	            case 'initials':
	                this.initialsState.update(dt);
	                break;
	            case 'game':
	                this.gameState.update(dt);
	                break;
	        }
	    };
	    Asteroids.prototype.render = function (dt) {
	        switch (this.state) {
	            case 'start':
	                this.highScoreState.render(dt);
	                break;
	            case 'demo':
	                this.demoState.render(dt);
	                break;
	            case 'initials':
	                this.initialsState.render(dt);
	                break;
	            case 'game':
	                this.gameState.render(dt);
	                break;
	        }
	        keys_1.Key.update();
	    };
	    Asteroids.prototype.updateDemoTimer = function (dt) {
	        this.demoTimer += dt;
	        if (this.demoTimer >= DEMO_TIME) {
	            this.demoTimer = 0;
	            this.state = this.state === 'demo' ? 'start' : 'demo';
	        }
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
	var DT = 1 / 60;
	var ONE_SECOND = 1000;
	var init = function (state) {
	    var frame = function () {
	        now = timestamp();
	        delta += Math.min(1, (now - last) / ONE_SECOND);
	        while (delta > DT) {
	            state.update(DT);
	            delta -= DT;
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
/***/ function(module, exports) {

	"use strict";
	var defaults = [
	    { score: 20140, initials: 'J H' },
	    { score: 20050, initials: 'P A' },
	    { score: 19930, initials: '  M' },
	    { score: 19870, initials: 'G I' },
	    { score: 19840, initials: 'A L' },
	    { score: 19790, initials: 'M T' },
	    { score: 19700, initials: 'E O' },
	    { score: 19660, initials: 'S N' },
	    { score: 190, initials: '   ' },
	    { score: 70, initials: '   ' },
	];
	var SCORE_KEY = 'jph_asteroids_hs';
	var _Highscores = (function () {
	    function _Highscores() {
	        this.scores = [];
	        var str = window.localStorage.getItem(SCORE_KEY);
	        this.scores = str ? JSON.parse(str) || [] : defaults;
	    }
	    Object.defineProperty(_Highscores.prototype, "top", {
	        get: function () {
	            return this.scores[0];
	        },
	        enumerable: true,
	        configurable: true
	    });
	    _Highscores.prototype.qualifies = function (score) {
	        var less = exports.highscores.scores.filter(function (x) { return x.score < score; });
	        return !!less.length;
	    };
	    _Highscores.prototype.save = function (score, initials) {
	        if (this.qualifies(score)) {
	            this.scores.push({ score: score, initials: initials });
	            this.scores = this.scores.sort(function (a, b) { return a.score > b.score ? -1 : 1; }).slice(0, 10);
	            window.localStorage.setItem(SCORE_KEY, JSON.stringify(this.scores));
	        }
	    };
	    return _Highscores;
	}());
	exports.highscores = new _Highscores();


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var screen_1 = __webpack_require__(4);
	var highscores_1 = __webpack_require__(2);
	var HighScoreState = (function () {
	    function HighScoreState() {
	        this.blink = 0;
	        this.showPushStart = true;
	        this.highscore = highscores_1.highscores.top.score;
	    }
	    HighScoreState.prototype.update = function (dt) {
	        this.blink += dt;
	        if (this.blink >= .4) {
	            this.blink = 0;
	            this.showPushStart = !this.showPushStart;
	        }
	    };
	    HighScoreState.prototype.render = function () {
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
	            var text = this_1.pad(i + 1, ' ', 2) + "." + this_1.pad(highscores_1.highscores.scores[i].score, ' ', 6) + " " + highscores_1.highscores.scores[i].initials;
	            screen_1.default.draw.text2(text, '30pt', function (width) {
	                return {
	                    x: screenX - (width / 2),
	                    y: y
	                };
	            });
	        };
	        var this_1 = this;
	        for (var i = 0; i < highscores_1.highscores.scores.length; i++) {
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
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var draw_1 = __webpack_require__(5);
	var Screen = (function () {
	    function Screen() {
	        var _this = this;
	        this.x = 0;
	        this.y = 0;
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
	        this.width2 = this.width / 2;
	        this.height2 = this.height / 2;
	    };
	    return Screen;
	}());
	exports.Screen = Screen;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = new Screen();


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var screen_1 = __webpack_require__(4);
	var VectorLine = 'rgba(255,255,255,1)';
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
	        if (!rect) {
	            return;
	        }
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
	    Draw.prototype.text3 = function (text, size, cb) {
	        var ctx = this.ctx;
	        ctx.save();
	        ctx.font = size + " hyperspace";
	        ctx.textBaseline = 'middle';
	        ctx.lineWidth = 2;
	        ctx.fillStyle = VectorLine;
	        var width = ctx.measureText(text).width;
	        var point = cb(width);
	        ctx.fillText(text, point.x, point.y);
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
	    Draw.prototype.quadtree = function (tree) {
	        if (!tree) {
	            return;
	        }
	        var drawNodes = function (nodes) {
	            if (!nodes) {
	                return;
	            }
	            nodes.forEach(function (n) {
	                screen_1.default.draw.bounds(n.bounds);
	                drawNodes(n.nodes);
	            });
	        };
	        drawNodes(tree.nodes);
	    };
	    return Draw;
	}());
	exports.Draw = Draw;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var screen_1 = __webpack_require__(4);
	var keys_1 = __webpack_require__(7);
	var highscores_1 = __webpack_require__(2);
	var events_1 = __webpack_require__(8);
	var letters = '_abcdefghijklmnopqrstuvwxyz';
	var EnterHighScoreState = (function (_super) {
	    __extends(EnterHighScoreState, _super);
	    function EnterHighScoreState(score) {
	        var _this = _super.call(this) || this;
	        _this.index = 1;
	        _this.score = score;
	        _this.init();
	        return _this;
	    }
	    EnterHighScoreState.prototype.init = function () {
	        this.position = 0;
	        this.index = 1;
	        this.initials = ['a', '_', '_'];
	    };
	    EnterHighScoreState.prototype.update = function (dt) {
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
	                console.log(this.score, this.initials.join(''));
	                highscores_1.highscores.save(this.score, this.initials.join(''));
	                this.init();
	                this.trigger('done');
	            }
	            this.index = 1;
	            this.initials[this.position] = letters[this.index];
	        }
	    };
	    EnterHighScoreState.prototype.render = function () {
	        var offset = 165;
	        var text = (function (t) { return screen_1.default.draw.text(t, 50, offset += 35, '30pt'); });
	        screen_1.default.draw.background();
	        screen_1.default.draw.highscore(highscores_1.highscores.top.score);
	        screen_1.default.draw.scorePlayer1(this.score);
	        screen_1.default.draw.copyright();
	        text('your score is one of the ten best');
	        text('please enter your initials');
	        text('push rotate to select letter');
	        text('push hyperspace when letter is correct');
	        screen_1.default.draw.text3(this.initials.join(''), '60pt', function (width) {
	            return { x: (screen_1.default.width / 2) - width, y: screen_1.default.height / 2 };
	        });
	    };
	    return EnterHighScoreState;
	}(events_1.EventSource));
	exports.EnterHighScoreState = EnterHighScoreState;


/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	var LEN = 222;
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
	        this.keys = new Array(LEN);
	        this.prev = new Array(LEN);
	        for (var i = 0; i < LEN; i++) {
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
	        for (var i = 0; i < LEN; i++) {
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
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var screen_1 = __webpack_require__(4);
	var util_1 = __webpack_require__(10);
	var highscores_1 = __webpack_require__(2);
	var keys_1 = __webpack_require__(7);
	var rocks_1 = __webpack_require__(11);
	var alien_1 = __webpack_require__(15);
	var explosion_1 = __webpack_require__(17);
	var quadtree_1 = __webpack_require__(18);
	var vector_1 = __webpack_require__(14);
	var DemoState = (function () {
	    function DemoState() {
	        this.blinkTimer = 0;
	        this.modeTimer = 0;
	        this.alienTimer = 7;
	        this.showPushStart = true;
	        this.rocks = [];
	        this.explosions = [];
	        this.alienBullets = [];
	        this.debug = false;
	        this.paused = false;
	        this.level = 1;
	        this.highscore = highscores_1.highscores.scores.length ? highscores_1.highscores.top.score : 0;
	        this.addRocks();
	    }
	    DemoState.prototype.update = function (dt) {
	        if (keys_1.Key.isPressed(keys_1.Key.DEBUG)) {
	            this.debug = !this.debug;
	        }
	        if (keys_1.Key.isPressed(keys_1.Key.PAUSE)) {
	            this.paused = !this.paused;
	        }
	        if (this.paused) {
	            return;
	        }
	        if (!this.alien && !this.rocks.length) {
	            this.level++;
	            this.addRocks();
	        }
	        this.updateAlienTimer(dt);
	        this.pushStart(dt);
	        this.checkCollisions();
	        this.updateAllObjects(dt);
	    };
	    DemoState.prototype.updateAlienTimer = function (dt) {
	        if (!this.alien) {
	            this.alienTimer -= dt;
	        }
	        if (this.alienTimer <= 0) {
	            this.addAlien();
	            this.alienTimer = 7;
	        }
	    };
	    DemoState.prototype.pushStart = function (dt) {
	        this.blinkTimer += dt;
	        if (this.blinkTimer >= .4) {
	            this.blinkTimer = 0;
	            this.showPushStart = !this.showPushStart;
	        }
	    };
	    DemoState.prototype.checkCollisions = function () {
	        var _this = this;
	        if (this.alien) {
	            this.bounds = [];
	            this.qt = new quadtree_1.Quadtree({ x: 0, y: 0, width: screen_1.default.width, height: screen_1.default.height }, 1);
	            this.rocks.forEach(function (rock) {
	                if (_this.alien) {
	                    _this.qt.insert(rock);
	                }
	            });
	        }
	        this.checkAlienCollision();
	        this.checkAlienBulletCollision();
	    };
	    DemoState.prototype.checkAlienCollision = function () {
	        var _this = this;
	        if (this.alien) {
	            var rocks = this.qt.retrieve(this.alien);
	            rocks.forEach(function (rock) {
	                if (rock.collided(_this.alien)) {
	                    _this.createExplosion(_this.alien.origin.x, _this.alien.origin.y);
	                    _this.createExplosion(rock.origin.x, rock.origin.y);
	                    _this.splitRock(rock);
	                    _this.alien = null;
	                    _this.alienBullets = [];
	                }
	                if (_this.debug) {
	                    _this.bounds.push(rock);
	                }
	            });
	        }
	    };
	    DemoState.prototype.checkAlienBulletCollision = function () {
	        var _this = this;
	        this.alienBullets.forEach(function (bullet) {
	            var rocks = [];
	            if (_this.alien) {
	                rocks.push.apply(rocks, _this.qt.retrieve(bullet));
	                rocks.forEach(function (rock) {
	                    if (rock.collided(bullet)) {
	                        _this.createExplosion(rock.origin.x, rock.origin.y);
	                        _this.alienBullets = _this.alienBullets.filter(function (x) { return x !== bullet; });
	                        _this.splitRock(rock);
	                        bullet = null;
	                    }
	                    if (_this.debug) {
	                        _this.bounds.push(rock);
	                    }
	                });
	            }
	            if (_this.debug) {
	                (_a = _this.bounds).push.apply(_a, rocks.concat([_this.alien]));
	            }
	            var _a;
	        });
	    };
	    DemoState.prototype.updateAllObjects = function (dt) {
	        var objects = [this.alien].concat(this.rocks, this.alienBullets, this.explosions);
	        objects.forEach(function (obj) {
	            if (obj) {
	                obj.update(dt);
	            }
	        });
	    };
	    DemoState.prototype.render = function () {
	        this.drawBackground();
	        this.drawPushStart();
	        var objects = this.rocks.concat([this.alien], this.alienBullets, this.explosions);
	        objects.forEach(function (obj) {
	            if (obj) {
	                obj.render();
	            }
	        });
	        if (this.alien && this.debug) {
	            if (this.qt) {
	                screen_1.default.draw.quadtree(this.qt);
	            }
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
	    DemoState.prototype.addRocks = function () {
	        var count = Math.min(this.level + 3, 7);
	        var speed = 200;
	        for (var i = 0; i < count; i++) {
	            var v = new vector_1.Vector(util_1.random(1, 360));
	            var x = util_1.random(40, screen_1.default.width - 40);
	            var y = util_1.random(40, screen_1.default.height - 40);
	            var rock = new rocks_1.Rock(x, y, v, rocks_1.RockSize.Large, speed);
	            this.rocks.push(rock);
	        }
	    };
	    DemoState.prototype.addAlien = function () {
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
	        });
	        this.explosions.push(explosion);
	    };
	    DemoState.prototype.splitRock = function (rock) {
	        this.rocks = this.rocks.filter(function (x) { return x !== rock; });
	        (_a = this.rocks).push.apply(_a, rock.split());
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
	    return DemoState;
	}());
	exports.DemoState = DemoState;


/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";
	function random(start, end) {
	    return Math.floor(Math.random() * (end - start + 1)) + start;
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
	var object2d_1 = __webpack_require__(12);
	var vector_1 = __webpack_require__(14);
	var util_1 = __webpack_require__(10);
	var RockSize;
	(function (RockSize) {
	    RockSize[RockSize["Small"] = 5] = "Small";
	    RockSize[RockSize["Medium"] = 10] = "Medium";
	    RockSize[RockSize["Large"] = 20] = "Large";
	})(RockSize = exports.RockSize || (exports.RockSize = {}));
	var Rock = (function (_super) {
	    __extends(Rock, _super);
	    function Rock(x, y, v, size, speed) {
	        if (speed === void 0) { speed = 1; }
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
	        _this.vx = v.x * speed;
	        _this.vy = v.y * speed;
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
	    Rock.prototype.update = function (dt) {
	        this.rotTimer += 1;
	        this.move(dt);
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
	    Rock.prototype.split = function () {
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
	            var size = this.size === RockSize.Large ? RockSize.Medium : RockSize.Small;
	            var v1 = new vector_1.Vector(angle1);
	            var v2 = new vector_1.Vector(angle2);
	            var speed1 = size === RockSize.Medium ? util_1.random(150, 250) : util_1.random(250, 350);
	            var speed2 = size === RockSize.Medium ? util_1.random(150, 250) : util_1.random(250, 350);
	            var rock1 = new Rock(this.origin.x, this.origin.y, v1, size, speed1);
	            var rock2 = new Rock(this.origin.x, this.origin.y, v2, size, speed2);
	            return [rock1, rock2];
	        }
	        return [];
	    };
	    Object.defineProperty(Rock.prototype, "score", {
	        get: function () {
	            return this.size === RockSize.Large ? 20 : this.size === RockSize.Medium ? 50 : 100;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return Rock;
	}(object2d_1.Object2D));
	exports.Rock = Rock;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var screen_1 = __webpack_require__(4);
	var events_1 = __webpack_require__(8);
	var lut_1 = __webpack_require__(13);
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
	    Object2D.prototype.move = function (dt) {
	        dt = dt ? dt : 1;
	        this.origin.x += this.vx * dt;
	        this.origin.y += this.vy * dt;
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
	        set: function (x) {
	            this.origin.x = x;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Object2D.prototype, "y", {
	        get: function () {
	            return this.origin.y + this._ymin;
	        },
	        set: function (y) {
	            this.origin.y = y;
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
/* 13 */
/***/ function(module, exports) {

	"use strict";
	var RAD = {};
	exports.RAD = RAD;
	var COS = {};
	exports.COS = COS;
	var SIN = {};
	exports.SIN = SIN;
	var r = Math.PI / 180;
	for (var i = 0; i <= 360; i++) {
	    RAD[i] = i * r;
	    COS[i] = Math.cos(RAD[i]);
	    SIN[i] = Math.sin(RAD[i]);
	    RAD[-i] = -i * r;
	    COS[-i] = Math.cos(RAD[-i]);
	    SIN[-i] = Math.sin(RAD[-i]);
	}


/***/ },
/* 14 */
/***/ function(module, exports) {

	"use strict";
	var VECTOR = {};
	var PI2 = 2 * Math.PI;
	for (var i = 0; i <= 360; i++) {
	    var t = PI2 * (i / 360);
	    VECTOR[i] = {
	        x: Math.cos(t),
	        y: Math.sin(t)
	    };
	}
	var Vector = (function () {
	    function Vector(angleInDegrees, velocity) {
	        if (velocity === void 0) { velocity = 1; }
	        this.x = VECTOR[angleInDegrees].x * velocity;
	        this.y = VECTOR[angleInDegrees].y * velocity;
	    }
	    return Vector;
	}());
	exports.Vector = Vector;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var screen_1 = __webpack_require__(4);
	var util_1 = __webpack_require__(10);
	var object2d_1 = __webpack_require__(12);
	var bullet_1 = __webpack_require__(16);
	var vector_1 = __webpack_require__(14);
	var BULLET_SPEED = 600;
	var BIG_ALIEN_SPEED = 225;
	var BigAlien = (function (_super) {
	    __extends(BigAlien, _super);
	    function BigAlien() {
	        var _this = _super.call(this, 0, 0) || this;
	        _this.moveTimer = 0;
	        _this.bulletTimer = .7;
	        _this.moveTime = 2;
	        _this.score = 200;
	        _this.vy = 0;
	        _this.origin.y = util_1.random(100, screen_1.default.height - 100);
	        if (_this.origin.y % 2 === 0) {
	            _this.origin.x = 40;
	            _this.vx = BIG_ALIEN_SPEED;
	        }
	        else {
	            _this.origin.x = screen_1.default.width - 40;
	            _this.vx = -BIG_ALIEN_SPEED;
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
	    BigAlien.prototype.update = function (dt) {
	        this.move(dt);
	        if (this.origin.x >= screen_1.default.width - 5 || this.origin.x <= 5) {
	            this.trigger('expired');
	            return;
	        }
	        this.moveTimer += dt;
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
	        this.bulletTimer += dt;
	        if (this.bulletTimer >= .7) {
	            var v = new vector_1.Vector(util_1.random(1, 360), BULLET_SPEED);
	            var bullet = new bullet_1.Bullet(this.origin.x, this.origin.y, v);
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
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var screen_1 = __webpack_require__(4);
	var object2d_1 = __webpack_require__(12);
	var Bullet = (function (_super) {
	    __extends(Bullet, _super);
	    function Bullet(x, y, v) {
	        var _this = _super.call(this, x, y) || this;
	        _this.life = 1.25;
	        _this.vx = v.x;
	        _this.vy = v.y;
	        return _this;
	    }
	    Bullet.prototype.render = function () {
	        this.draw();
	    };
	    Bullet.prototype.update = function (dt) {
	        this.move(dt);
	        this.life -= dt;
	        if (this.life <= 0) {
	            this.trigger('expired');
	            this.destroy();
	        }
	    };
	    Bullet.prototype.draw = function () {
	        screen_1.default.draw.point({ x: this.origin.x, y: this.origin.y });
	    };
	    Bullet.prototype.expire = function () {
	        this.life = 0;
	        this.trigger('expire');
	    };
	    return Bullet;
	}(object2d_1.Object2D));
	exports.Bullet = Bullet;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var events_1 = __webpack_require__(8);
	var screen_1 = __webpack_require__(4);
	var vector_1 = __webpack_require__(14);
	var util_1 = __webpack_require__(10);
	var VELOCITY = 150;
	var Explosion = (function (_super) {
	    __extends(Explosion, _super);
	    function Explosion(x, y) {
	        var _this = _super.call(this) || this;
	        _this.life = 1.25;
	        _this.points = [];
	        for (var i = 0; i < 15; i++) {
	            var v = new vector_1.Vector(util_1.random(1, 360), Math.random() * VELOCITY);
	            _this.points.push({ x: x, y: y, vx: v.x, vy: v.y });
	        }
	        return _this;
	    }
	    Explosion.prototype.update = function (dt) {
	        this.points.forEach(function (point) {
	            point.x += point.vx * dt;
	            point.y += point.vy * dt;
	        });
	        this.life -= dt;
	        if (this.life <= 0) {
	            this.trigger('expired');
	        }
	    };
	    Explosion.prototype.render = function (dt) {
	        var _this = this;
	        this.points.forEach(function (point) {
	            screen_1.default.draw.point(point, "rgba(255,255,255," + _this.life + ")");
	        });
	    };
	    return Explosion;
	}(events_1.EventSource));
	exports.Explosion = Explosion;


/***/ },
/* 18 */
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
	        if (!rect) {
	            return;
	        }
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
	        if (!rect) {
	            return [];
	        }
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
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var keys_1 = __webpack_require__(7);
	var events_1 = __webpack_require__(8);
	var ship_1 = __webpack_require__(20);
	var alien_1 = __webpack_require__(15);
	var rocks_1 = __webpack_require__(11);
	var explosion_1 = __webpack_require__(17);
	var vector_1 = __webpack_require__(14);
	var collisions_1 = __webpack_require__(21);
	var screen_1 = __webpack_require__(4);
	var highscores_1 = __webpack_require__(2);
	var util_1 = __webpack_require__(10);
	var GameState = (function (_super) {
	    __extends(GameState, _super);
	    function GameState() {
	        var _this = _super.call(this) || this;
	        _this.level = 0;
	        _this.extraLifeScore = 0;
	        _this.score = 0;
	        _this.lives = 3;
	        _this.shipBullets = [];
	        _this.alienBullets = [];
	        _this.explosions = [];
	        _this.rocks = [];
	        _this.bounds = [];
	        _this.shipTimer = 0;
	        _this.alienTimer = 0;
	        _this.levelTimer = 0;
	        _this.debug = false;
	        _this.paused = false;
	        _this.highscore = highscores_1.highscores.top.score;
	        _this.init();
	        return _this;
	    }
	    GameState.prototype.init = function () {
	        this.addShip(screen_1.default.width2, screen_1.default.height2);
	        this.startLevel();
	    };
	    GameState.prototype.startLevel = function () {
	        this.level++;
	        this.levelTimer = 0;
	        this.alienTimer = util_1.random(10, 15);
	        this.addRocks();
	    };
	    GameState.prototype.update = function (dt) {
	        if (keys_1.Key.isPressed(keys_1.Key.DEBUG)) {
	            this.debug = !this.debug;
	        }
	        if (keys_1.Key.isPressed(keys_1.Key.PAUSE)) {
	            this.paused = !this.paused;
	        }
	        if (keys_1.Key.isPressed(keys_1.Key.SPACE)) {
	            this.hyperspace();
	        }
	        if (this.paused) {
	            return;
	        }
	        this.levelTimer += dt;
	        this.handleAlien(dt);
	        if (this.shipTimer || (!this.ship && this.lives && !this.explosions.length)) {
	            this.tryPlaceShip(dt);
	        }
	        if (!this.rocks.length && this.lives && !this.explosions.length) {
	            this.startLevel();
	        }
	        if (!this.lives && !this.explosions.length) {
	            this.trigger('done', this.score);
	            return;
	        }
	        this.checkCollisions();
	        var objects = [this.ship, this.alien].concat(this.shipBullets, this.alienBullets, this.rocks, this.explosions);
	        objects.forEach(function (obj) {
	            if (obj) {
	                obj.update(dt);
	            }
	        });
	    };
	    GameState.prototype.render = function (delta) {
	        this.renderStatic();
	        var objects = [this.ship, this.alien].concat(this.shipBullets, this.alienBullets, this.rocks, this.explosions);
	        objects.forEach(function (obj) {
	            if (obj) {
	                obj.render();
	            }
	        });
	    };
	    GameState.prototype.renderStatic = function () {
	        screen_1.default.draw.background();
	        screen_1.default.draw.copyright();
	        screen_1.default.draw.scorePlayer1(this.score);
	        screen_1.default.draw.highscore(this.highscore);
	        this.drawExtraLives();
	        if (this.debug) {
	            this.renderDebug();
	        }
	    };
	    GameState.prototype.renderDebug = function () {
	        screen_1.default.draw.text2('debug mode', '12pt', function (width) {
	            return { x: screen_1.default.width - width - 10, y: screen_1.default.height - 40 };
	        });
	        if (this.bounds) {
	            this.bounds.forEach(function (r) {
	                screen_1.default.draw.bounds(r, '#fc058d');
	            });
	        }
	        if (!this.ship && this.lives) {
	            var rect = {
	                x: screen_1.default.width2 - 120,
	                y: screen_1.default.height2 - 120,
	                width: 240,
	                height: 240
	            };
	            screen_1.default.draw.bounds(rect, '#00ff00');
	        }
	        if (this.ship) {
	            screen_1.default.draw.text(this.ship.angle.toString(), this.ship.origin.x + 20, this.ship.origin.y + 20, '10pt');
	        }
	        var date = new Date(null);
	        date.setSeconds(this.levelTimer);
	        screen_1.default.draw.text2(date.toISOString().substr(11, 8), '12pt', function (width) {
	            return { x: 10, y: screen_1.default.height - 40 };
	        });
	    };
	    GameState.prototype.drawExtraLives = function () {
	        var lives = Math.min(this.lives, 10);
	        for (var i = 0; i < lives; i++) {
	            var life = new ship_1.Ship(80 + (i * 20), 55);
	            life.render();
	        }
	    };
	    GameState.prototype.handleAlien = function (dt) {
	        if (!this.alien) {
	            this.alienTimer -= dt;
	            if (this.alienTimer <= 0) {
	                this.addAlien();
	                this.alienTimer = util_1.random(10, 15);
	            }
	        }
	    };
	    GameState.prototype.addShip = function (x, y) {
	        var _this = this;
	        this.ship = new ship_1.Ship(x, y);
	        this.ship.on('fire', function (ship, bullet) {
	            bullet.on('expired', function () {
	                _this.shipBullets = _this.shipBullets.filter(function (x) { return x !== bullet; });
	            });
	            _this.shipBullets.push(bullet);
	        });
	    };
	    GameState.prototype.addAlien = function () {
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
	    };
	    GameState.prototype.addRocks = function () {
	        var count = Math.min(this.level + 3, 7);
	        var speed = 150;
	        for (var i = 0; i < count; i++) {
	            var zone = util_1.random(1, 4);
	            var v = new vector_1.Vector(util_1.random(1, 360));
	            var x = void 0;
	            var y = void 0;
	            switch (zone) {
	                case 1:
	                    x = util_1.random(40, screen_1.default.width - 40);
	                    y = util_1.random(40, 80);
	                    break;
	                case 2:
	                    x = util_1.random(screen_1.default.width - 80, screen_1.default.width - 40);
	                    y = util_1.random(screen_1.default.height - 40, screen_1.default.height - 40);
	                    break;
	                case 3:
	                    x = util_1.random(40, screen_1.default.width - 40);
	                    y = util_1.random(screen_1.default.height - 40, screen_1.default.height - 40);
	                    break;
	                default:
	                    x = util_1.random(40, 80);
	                    y = util_1.random(screen_1.default.height - 40, screen_1.default.height - 40);
	                    break;
	            }
	            var rock = new rocks_1.Rock(x, y, v, rocks_1.RockSize.Large, speed);
	            this.rocks.push(rock);
	        }
	    };
	    GameState.prototype.shipDestroyed = function () {
	        this.lives--;
	        this.ship = null;
	        this.shipBullets = [];
	    };
	    GameState.prototype.checkCollisions = function () {
	        var _this = this;
	        var check = !!this.ship || !!this.shipBullets.length || !!this.alien || !!this.alienBullets.length;
	        if (!check) {
	            return;
	        }
	        this.bounds = [];
	        this.collisions = new collisions_1.Collisions();
	        this.collisions.check([this.ship], this.rocks, function (ship, rock) {
	            _this.addScore(rock.score);
	            _this.createExplosion(ship.origin.x, ship.origin.y);
	            _this.createExplosion(rock.origin.x, rock.origin.y);
	            _this.splitRock(rock);
	            _this.shipDestroyed();
	        }, function (ship, rock) {
	            if (_this.debug) {
	                _this.bounds.push(rock);
	            }
	        });
	        this.collisions.check(this.shipBullets, this.rocks, function (bullet, rock) {
	            _this.addScore(rock.score);
	            _this.createExplosion(rock.origin.x, rock.origin.y);
	            bullet.expire();
	            _this.splitRock(rock);
	        }, function (bullet, rock) {
	            if (_this.debug) {
	                _this.bounds.push(rock);
	            }
	        });
	        this.collisions.check(this.shipBullets, [this.alien], function (bullet, alien) {
	            _this.addScore(alien.score);
	            _this.createExplosion(alien.origin.x, alien.origin.y);
	            bullet.expire();
	            _this.alienBullets = [];
	            _this.alien = null;
	        }, function (bullet, alien) {
	            if (_this.debug) {
	                _this.bounds.push(alien);
	            }
	        });
	        this.collisions.check([this.ship], [this.alien], function (ship, alien) {
	            _this.addScore(alien.score);
	            _this.createExplosion(ship.origin.x, ship.origin.y);
	            _this.createExplosion(alien.origin.x, alien.origin.y);
	            _this.shipBullets = [];
	            _this.alienBullets = [];
	            _this.alien = null;
	            _this.ship = null;
	        }, function (ship, alien) {
	            if (_this.debug) {
	                _this.bounds.push(alien);
	            }
	        });
	        this.collisions.check(this.alienBullets, this.rocks, function (bullet, rock) {
	            _this.createExplosion(rock.origin.x, rock.origin.y);
	            _this.splitRock(rock);
	        }, function (bullet, rock) {
	            if (_this.debug) {
	                _this.bounds.push(rock);
	            }
	        });
	        this.collisions.check(this.alienBullets, [this.ship], function (bullet, ship) {
	            _this.createExplosion(ship.origin.x, ship.origin.y);
	            _this.ship = null;
	            _this.shipBullets = [];
	        }, function (bullet, ship) {
	            if (_this.debug) {
	                _this.bounds.push(ship);
	            }
	        });
	    };
	    GameState.prototype.addScore = function (score) {
	        this.score += score;
	        this.extraLifeScore += score;
	        if (this.score > this.highscore) {
	            this.highscore = this.score;
	        }
	        if (this.extraLifeScore >= 10000) {
	            this.lives++;
	            this.extraLifeScore = 0;
	        }
	    };
	    GameState.prototype.splitRock = function (rock) {
	        this.rocks = this.rocks.filter(function (x) { return x !== rock; });
	        (_a = this.rocks).push.apply(_a, rock.split());
	        rock = null;
	        var _a;
	    };
	    GameState.prototype.createExplosion = function (x, y) {
	        var _this = this;
	        var explosion = new explosion_1.Explosion(x, y);
	        explosion.on('expired', function () {
	            _this.explosions = _this.explosions.filter(function (x) { return x !== explosion; });
	        });
	        this.explosions.push(explosion);
	    };
	    GameState.prototype.tryPlaceShip = function (dt) {
	        this.shipTimer += dt;
	        if (this.shipTimer <= 2) {
	            return;
	        }
	        var rect = {
	            x: screen_1.default.width2 - 120,
	            y: screen_1.default.height2 - 120,
	            width: 240,
	            height: 240
	        };
	        var collided = false;
	        this.rocks.forEach(function (rock) {
	            collided = collided || rock.collided(rect);
	        });
	        if (this.alien) {
	            collided = collided || this.alien.collided(rect);
	        }
	        if (!collided) {
	            this.shipTimer = 0;
	            this.addShip(screen_1.default.width2, screen_1.default.height2);
	        }
	    };
	    GameState.prototype.hyperspace = function () {
	        var x = util_1.random(40, screen_1.default.width - 40);
	        var y = util_1.random(40, screen_1.default.height - 40);
	        var angle = this.ship.angle;
	        this.addShip(x, y);
	        if (this.ship.angle > angle) {
	            angle = -(this.ship.angle - angle);
	        }
	        else if (this.ship.angle < angle) {
	            angle = angle - this.ship.angle;
	        }
	        this.ship.rotate(angle);
	    };
	    return GameState;
	}(events_1.EventSource));
	exports.GameState = GameState;


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var screen_1 = __webpack_require__(4);
	var keys_1 = __webpack_require__(7);
	var object2d_1 = __webpack_require__(12);
	var vector_1 = __webpack_require__(14);
	var bullet_1 = __webpack_require__(16);
	var ACCELERATION = 0.1;
	var BULLET_SPEED = 800;
	var BULLET_TIME = .15;
	var FRICTION = 0.007;
	var ROTATION = 5;
	var MAX_ACCELERATION = 1100;
	var MAX_BULLETS = 4;
	var VELOCITY = 100;
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
	        _this.bulletTimer = 0;
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
	    Ship.prototype.update = function (dt) {
	        this.move(dt);
	        this.flame.move(dt);
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
	        if (keys_1.Key.isDown(keys_1.Key.CTRL)) {
	            this.fire();
	        }
	        if (this.bulletTimer > 0) {
	            this.bulletTimer -= dt;
	        }
	        if (!this.moving) {
	            this.vx -= this.vx * FRICTION;
	            this.vy -= this.vy * FRICTION;
	            this.flame.vx = this.vx;
	            this.flame.vy = this.vy;
	        }
	    };
	    Ship.prototype.rotate = function (n) {
	        _super.prototype.rotate.call(this, n);
	        this.flame.rotate(n);
	    };
	    Ship.prototype.thrust = function () {
	        var v = new vector_1.Vector(this.angle, VELOCITY * ACCELERATION);
	        var velocity = this.magnitude;
	        if (velocity < MAX_ACCELERATION) {
	            this.vx += v.x;
	            this.flame.vx = this.vx;
	            this.vy += v.y;
	            this.flame.vy = this.vy;
	        }
	    };
	    Ship.prototype.fire = function () {
	        var _this = this;
	        if (this.bulletTimer <= 0 && this.bulletCount < MAX_BULLETS) {
	            this.bulletTimer = BULLET_TIME;
	            this.bulletCount++;
	            var v = new vector_1.Vector(this.angle);
	            var bullet = new bullet_1.Bullet(this.origin.x, this.origin.y, v);
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
	            speed = Math.max(BULLET_SPEED, speed + BULLET_SPEED);
	            bullet.vx *= speed;
	            bullet.vy *= speed;
	            this.trigger('fire', bullet);
	        }
	    };
	    return Ship;
	}(object2d_1.Object2D));
	exports.Ship = Ship;


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var screen_1 = __webpack_require__(4);
	var quadtree_1 = __webpack_require__(18);
	var Collisions = (function () {
	    function Collisions() {
	        this.tree = new quadtree_1.Quadtree({
	            x: 0,
	            y: 0,
	            width: screen_1.default.width,
	            height: screen_1.default.height
	        }, 1);
	    }
	    Collisions.prototype.check = function (sources, targets, cb, dcb) {
	        var _this = this;
	        if (!sources || !sources.length || !targets || !targets.length) {
	            return;
	        }
	        this.tree.clear();
	        targets.forEach(function (target) {
	            _this.tree.insert(target);
	        });
	        sources.forEach(function (source) {
	            var candidates = [];
	            candidates.push.apply(candidates, _this.tree.retrieve(source));
	            candidates.forEach(function (candidate) {
	                if (candidate.collided(source)) {
	                    cb(source, candidate);
	                }
	                else if (dcb) {
	                    dcb(source, candidate);
	                }
	            });
	        });
	    };
	    return Collisions;
	}());
	exports.Collisions = Collisions;


/***/ }
/******/ ]);