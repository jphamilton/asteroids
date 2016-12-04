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
	var startstate_1 = __webpack_require__(3);
	var gamestate_1 = __webpack_require__(6);
	var keys_1 = __webpack_require__(8);
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
	                if (keys_1.Key.isDown(keys_1.Key.ONE)) {
	                    state = 'game';
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
	    };
	    return Asteroids;
	}());
	exports.Asteroids = Asteroids;
	var game = new Asteroids();
	loop_1.loop(game);


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
/* 2 */,
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var screen_1 = __webpack_require__(4);
	var highscores_1 = __webpack_require__(12);
	var StartState = (function () {
	    function StartState() {
	        this.blink = 0;
	        this.show = true;
	    }
	    StartState.prototype.update = function (step) {
	        this.blink += step;
	        if (this.blink >= .4) {
	            this.blink = 0;
	            this.show = !this.show;
	        }
	    };
	    StartState.prototype.render = function (step) {
	        var ctx = screen_1.default.ctx;
	        var screenX = screen_1.default.width / 2;
	        var text = 'PUSH START';
	        screen_1.default.draw.background();
	        screen_1.default.draw.scorePlayer1(0);
	        if (this.show) {
	            ctx.save();
	            ctx.font = '30pt hyperspace';
	            ctx.strokeStyle = '#ffffff';
	            ctx.lineWidth = 1;
	            ctx.strokeText(text, screenX - (ctx.measureText(text).width / 2), 120);
	            ctx.restore();
	        }
	        text = 'HIGH SCORES';
	        ctx.save();
	        ctx.font = '30pt hyperspace';
	        ctx.strokeStyle = '#ffffff';
	        ctx.lineWidth = 1;
	        ctx.strokeText(text, screenX - (ctx.measureText(text).width / 2), 200);
	        ctx.restore();
	        var width = ctx.measureText('_10._000000_AAA').width / 2;
	        for (var i = 0; i < highscores_1.highscores.length; i++) {
	            var y = 280 + (i * 40);
	            ctx.font = '30pt hyperspace';
	            ctx.strokeStyle = '#ffffff';
	            ctx.lineWidth = 1;
	            ctx.strokeText(this.pad(i + 1, ' ', 3) + ". " + this.pad(highscores_1.highscores[i].score, ' ', 6) + " " + highscores_1.highscores[i].initials, screenX - width, y);
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
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var draw_1 = __webpack_require__(5);
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
/* 5 */
/***/ function(module, exports) {

	"use strict";
	var Draw = (function () {
	    function Draw(ctx) {
	        this.ctx = ctx;
	    }
	    Draw.prototype.line = function (p1, p2, strokeStyle, width) {
	        if (width === void 0) { width = 2; }
	        var ctx = this.ctx;
	        ctx.beginPath();
	        ctx.strokeStyle = strokeStyle;
	        ctx.lineWidth = width;
	        ctx.moveTo(p1.x, p1.y);
	        ctx.lineTo(p2.x, p2.y);
	        ctx.stroke();
	        ctx.closePath();
	    };
	    Draw.prototype.shape = function (points, x, y, color) {
	        var p1, p2;
	        for (var i = 0; i < points.length - 1; i++) {
	            p1 = { x: x + points[i].x, y: y + points[i].y };
	            p2 = { x: x + points[i + 1].x, y: y + points[i + 1].y };
	            this.line(p1, p2, color, 2);
	        }
	    };
	    Draw.prototype.rect = function (p1, p2, fillStyle) {
	        var ctx = this.ctx;
	        ctx.beginPath();
	        ctx.fillStyle = fillStyle;
	        ctx.fillRect(p1.x, p1.y, p2.x, p2.y);
	        ctx.stroke();
	        ctx.closePath();
	    };
	    Draw.prototype.point = function (p, fillStyle) {
	        if (fillStyle === void 0) { fillStyle = '#ffffff'; }
	        this.rect(p, { x: 2, y: 2 }, fillStyle);
	    };
	    Draw.prototype.background = function () {
	        this.rect({ x: 0, y: 0 }, { x: screen.width, y: screen.height }, '#000000');
	    };
	    Draw.prototype.text = function (text, x, y, size) {
	        var ctx = this.ctx;
	        ctx.save();
	        ctx.font = size + " hyperspace";
	        ctx.textBaseline = 'middle';
	        ctx.lineWidth = 1;
	        ctx.strokeStyle = '#ffffff';
	        ctx.strokeText(text, x, y);
	        ctx.restore();
	    };
	    Draw.prototype.scorePlayer1 = function (score) {
	        var text = score.toString();
	        while (text.length < 2)
	            text = '0' + text;
	        this.text(text, 100, 50, '24pt');
	    };
	    return Draw;
	}());
	exports.Draw = Draw;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var ship_1 = __webpack_require__(7);
	var bullet_1 = __webpack_require__(11);
	var keys_1 = __webpack_require__(8);
	var screen_1 = __webpack_require__(4);
	var GameState = (function () {
	    function GameState() {
	        this.bulletTimer = 0;
	        this.score = 0;
	        this.lives = 3;
	        this.ship = new ship_1.Ship(screen_1.default.width / 2, screen_1.default.height / 2);
	        this.bullets = [];
	        this.extraLives = [];
	        for (var i = 0; i < this.lives; i++) {
	            var life = new ship_1.Ship(80 + (i * 20), 85);
	            this.extraLives.push(life);
	        }
	    }
	    GameState.prototype.update = function (step) {
	        this.ship.update(step);
	        for (var i = 0; i < this.bullets.length; i++) {
	            this.bullets[i].update(step);
	        }
	        this.bullets = this.bullets.filter(function (x) { return x.life > 0; });
	        if (this.bulletTimer > 0) {
	            this.bulletTimer -= step;
	        }
	        if (keys_1.Key.isDown(keys_1.Key.CTRL)) {
	            if (this.bulletTimer <= 0) {
	                this.bulletTimer = .2;
	                this.bullet();
	            }
	        }
	    };
	    GameState.prototype.render = function (delta) {
	        screen_1.default.draw.background();
	        this.ship.render(delta);
	        for (var i = 0; i < this.bullets.length; i++) {
	            this.bullets[i].render();
	        }
	        screen_1.default.draw.scorePlayer1(this.score);
	        this.drawExtraLives();
	    };
	    GameState.prototype.bullet = function () {
	        if (this.bullets.length < 4) {
	            this.bullets.push(new bullet_1.Bullet(this.ship));
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
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var keys_1 = __webpack_require__(8);
	var screen_1 = __webpack_require__(4);
	var object2d_1 = __webpack_require__(9);
	var ACCELERATION = 0.2;
	var FRICTION = 0.007;
	var ROTATION = 5;
	var MAX_SPEED = 15;
	var Ship = (function (_super) {
	    __extends(Ship, _super);
	    function Ship(x, y) {
	        var _this = _super.call(this, x, y) || this;
	        _this.moving = false;
	        _this.angle = 360;
	        _this.color = '#ffffff';
	        _this.points = [
	            { x: 0, y: -15 },
	            { x: 10, y: 10 },
	            { x: 5, y: 5 },
	            { x: -5, y: 5 },
	            { x: -10, y: 10 },
	            { x: 0, y: -15 }
	        ];
	        _this.flame = [
	            { x: 5, y: 8 },
	            { x: 0, y: 20 },
	            { x: -5, y: 8 },
	        ];
	        return _this;
	    }
	    Object.defineProperty(Ship.prototype, "geometry", {
	        get: function () {
	            return this.points.concat(this.flame);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Ship.prototype.render = function () {
	        screen_1.default.draw.shape(this.points, this.x, this.y, this.color);
	        if (this.moving && (Math.floor(Math.random() * 10) + 1) % 2 === 0) {
	            screen_1.default.draw.shape(this.flame, this.x, this.y, this.color);
	        }
	    };
	    Ship.prototype.update = function (step) {
	        this.move();
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
	        this.vx -= this.vx * FRICTION;
	        this.vy -= this.vy * FRICTION;
	    };
	    Ship.prototype.thrust = function () {
	        var t = 2 * Math.PI * (this.angle / 360);
	        var x = Math.sin(t);
	        var y = Math.cos(t);
	        this.vx += x * ACCELERATION;
	        this.vy -= y * ACCELERATION;
	    };
	    return Ship;
	}(object2d_1.Object2D));
	exports.Ship = Ship;


/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";
	exports.Key = {
	    _pressed: {},
	    LEFT: 37,
	    UP: 38,
	    RIGHT: 39,
	    SHIFT: 16,
	    CTRL: 17,
	    ONE: 49,
	    isDown: function (keyCode) {
	        return this._pressed[keyCode];
	    },
	    onKeydown: function (event) {
	        this._pressed[event.keyCode] = true;
	    },
	    onKeyup: function (event) {
	        delete this._pressed[event.keyCode];
	    }
	};
	window.addEventListener('keyup', function (event) { exports.Key.onKeyup(event); }, false);
	window.addEventListener('keydown', function (event) { exports.Key.onKeydown(event); }, false);


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var lut_1 = __webpack_require__(10);
	var Object2D = (function () {
	    function Object2D(x, y) {
	        this.angle = 360;
	        this.vx = 0;
	        this.vy = 0;
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
	        var points = this.geometry;
	        points.forEach(function (p) {
	            var newX = (c * p.x) - (s * p.y);
	            var newY = (s * p.x) + (c * p.y);
	            p.x = newX;
	            p.y = newY;
	        });
	    };
	    Object2D.prototype.move = function () {
	        this.x += this.vx;
	        this.y += this.vy;
	        if (this.x > screen.width) {
	            this.x -= screen.width;
	        }
	        if (this.x < 0) {
	            this.x += screen.width;
	        }
	        if (this.y > screen.height) {
	            this.y -= screen.height;
	        }
	        if (this.y < 0) {
	            this.y += screen.height;
	        }
	    };
	    Object.defineProperty(Object2D.prototype, "speed", {
	        get: function () {
	            return Math.sqrt(Math.pow(this.vx, 2) + Math.pow(this.vy, 2));
	        },
	        enumerable: true,
	        configurable: true
	    });
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
	var r = Math.PI / 180;
	for (var i = 1; i <= 360; i++) {
	    RAD[i] = i * r;
	    COS[i] = Math.cos(RAD[i]);
	    SIN[i] = Math.sin(RAD[i]);
	    RAD[-i] = -i * r;
	    COS[-i] = Math.cos(RAD[-i]);
	    SIN[-i] = Math.sin(RAD[-i]);
	}


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var screen_1 = __webpack_require__(4);
	var lut_1 = __webpack_require__(10);
	var object2d_1 = __webpack_require__(9);
	var BulletSpeed = 10;
	var Bullet = (function (_super) {
	    __extends(Bullet, _super);
	    function Bullet(ship) {
	        var _this = _super.call(this, ship.x, ship.y) || this;
	        _this.ship = ship;
	        _this.life = 1.25;
	        _this.visible = true;
	        var angle = ship.angle;
	        _this.vx = lut_1.SIN[angle];
	        _this.vy = -lut_1.COS[angle];
	        _this.x += _this.vx * 20;
	        _this.y += _this.vy * 20;
	        var speed = 0;
	        var dot = (ship.vx * _this.vx) + (ship.vy * _this.vy);
	        if (dot > 0) {
	            speed = ship.speed;
	        }
	        _this.vx *= (BulletSpeed + speed);
	        _this.vy *= (BulletSpeed + speed);
	        return _this;
	    }
	    Object.defineProperty(Bullet.prototype, "geometry", {
	        get: function () {
	            return [{ x: this.x, y: this.y }];
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Bullet.prototype.render = function () {
	        if (this.visible) {
	            screen_1.default.draw.point({ x: this.x, y: this.y });
	        }
	    };
	    Bullet.prototype.update = function (step) {
	        this.move();
	        this.life -= step;
	        if (this.life <= 0) {
	            this.visible = false;
	        }
	    };
	    Object.defineProperty(Bullet.prototype, "speed", {
	        get: function () {
	            return Math.sqrt(Math.pow(this.vx, 2) + Math.pow(this.vy, 2));
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return Bullet;
	}(object2d_1.Object2D));
	exports.Bullet = Bullet;


/***/ },
/* 12 */
/***/ function(module, exports) {

	"use strict";
	exports.highscores = [
	    { score: '20140', initials: 'J H' },
	    { score: '20050', initials: 'O A' },
	    { score: '19930', initials: 'N M' },
	    { score: '19870', initials: '  I' },
	    { score: '19840', initials: 'P L' },
	    { score: '19790', initials: 'A T' },
	    { score: '19700', initials: 'U O' },
	    { score: '19660', initials: 'L N' },
	    { score: '190', initials: 'GAM' },
	    { score: '70', initials: 'ES ' },
	];


/***/ }
/******/ ]);