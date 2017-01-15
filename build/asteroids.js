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
/******/ 	__webpack_require__.p = "/build/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var loop_1 = __webpack_require__(1);
	var keys_1 = __webpack_require__(2);
	var world_1 = __webpack_require__(4);
	var sounds_1 = __webpack_require__(13);
	var highscores_1 = __webpack_require__(21);
	var highScoreMode_1 = __webpack_require__(22);
	var initialsMode_1 = __webpack_require__(23);
	var attractMode_1 = __webpack_require__(24);
	var gameMode_1 = __webpack_require__(27);
	var ATTRACT_TIME = 15;
	var Modes;
	(function (Modes) {
	    Modes[Modes["Attract"] = 0] = "Attract";
	    Modes[Modes["Game"] = 1] = "Game";
	    Modes[Modes["Initials"] = 2] = "Initials";
	    Modes[Modes["Start"] = 3] = "Start";
	})(Modes || (Modes = {}));
	var Asteroids = (function () {
	    function Asteroids() {
	        this.lastScore = 0;
	        this.init();
	    }
	    Asteroids.prototype.init = function (world) {
	        var _this = this;
	        sounds_1.Sound.stop();
	        sounds_1.Sound.off();
	        this.mode = Modes.Start;
	        this.highScoreMode = new highScoreMode_1.HighScoreMode(this.lastScore);
	        this.attractMode = new attractMode_1.AttractMode(world || new world_1.World(highscores_1.highscores.top.score));
	        this.gameMode = new gameMode_1.GameMode(new world_1.World(highscores_1.highscores.top.score));
	        this.attractTimer = 0;
	        this.gameMode.on('done', function (source, world) {
	            _this.lastScore = world.score;
	            if (highscores_1.highscores.qualifies(world.score)) {
	                _this.initialsMode = new initialsMode_1.InitialsMode(world.score);
	                _this.initialsMode.on('done', function () {
	                    _this.init(world);
	                });
	                sounds_1.Sound.stop();
	                sounds_1.Sound.off();
	                _this.mode = Modes.Initials;
	            }
	            else {
	                _this.init(world);
	            }
	        });
	        this.attractStarted = false;
	    };
	    Asteroids.prototype.update = function (dt) {
	        switch (this.mode) {
	            case Modes.Start:
	                this.highScoreMode.update(dt);
	                if (this.attractStarted) {
	                    this.attractMode.update(dt);
	                }
	                if (keys_1.Key.isPressed(keys_1.Key.PLAYER_ONE_START)) {
	                    sounds_1.Sound.on();
	                    this.mode = Modes.Game;
	                }
	                else {
	                    this.updateAttractTimer(dt);
	                }
	                break;
	            case Modes.Attract:
	                this.attractMode.update(dt);
	                if (keys_1.Key.isPressed(keys_1.Key.PLAYER_ONE_START)) {
	                    sounds_1.Sound.on();
	                    this.mode = Modes.Game;
	                }
	                else {
	                    this.updateAttractTimer(dt);
	                }
	                break;
	            case Modes.Initials:
	                this.initialsMode.update(dt);
	                break;
	            case Modes.Game:
	                this.gameMode.update(dt);
	                break;
	        }
	    };
	    Asteroids.prototype.render = function (dt) {
	        switch (this.mode) {
	            case Modes.Start:
	                this.highScoreMode.render(dt);
	                break;
	            case Modes.Attract:
	                this.attractMode.render(dt);
	                break;
	            case Modes.Initials:
	                this.initialsMode.render(dt);
	                break;
	            case Modes.Game:
	                this.gameMode.render(dt);
	                break;
	        }
	        keys_1.Key.update();
	    };
	    Asteroids.prototype.updateAttractTimer = function (dt) {
	        this.attractTimer += dt;
	        if (this.attractTimer >= ATTRACT_TIME) {
	            this.attractTimer = 0;
	            this.mode = this.mode === Modes.Attract ? Modes.Start : Modes.Attract;
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
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Hammer = __webpack_require__(3);
	var LEN = 222;
	var _Key = (function () {
	    function _Key() {
	        var _this = this;
	        this.touched = false;
	        this.HYPERSPACE = 32;
	        this.ROTATE_LEFT = 37;
	        this.ROTATE_RIGHT = 39;
	        this.THRUST = 38;
	        this.FIRE = 17;
	        this.PLAYER_ONE_START = 49;
	        this.DEBUG = 68;
	        this.PAUSE = 80;
	        this.GOD = 71;
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
	        var stage = document.getElementById('game');
	        this.mc = new Hammer.Manager(stage);
	        var pan = new Hammer.Pan();
	        var tap = new Hammer.Tap();
	        var pinch = new Hammer.Pinch({
	            enable: true
	        });
	        this.mc.add(pan);
	        this.mc.add(tap, {
	            interval: 50
	        });
	        this.mc.add(pinch);
	        this.mc.on('panup', function (e) {
	            _this.keys[_this.THRUST] = true;
	        });
	        this.mc.on('panleft', function (e) {
	            _this.keys[_this.ROTATE_LEFT] = true;
	        });
	        this.mc.on('panright', function (e) {
	            _this.keys[_this.ROTATE_RIGHT] = true;
	        });
	        this.mc.on('panend', function (e) {
	            _this.keys[_this.THRUST] = false;
	            _this.keys[_this.ROTATE_LEFT] = false;
	            _this.keys[_this.ROTATE_RIGHT] = false;
	        });
	        this.mc.on('tap', function (e) {
	            _this.keys[_this.FIRE] = true;
	            _this.keys[_this.PLAYER_ONE_START] = true;
	            _this.touched = true;
	        });
	        this.mc.on('pinchout', function (e) {
	            _this.keys[_this.HYPERSPACE] = true;
	        });
	        this.mc.on('pinchend', function (e) {
	            _this.keys[_this.HYPERSPACE] = false;
	        });
	    }
	    _Key.prototype.update = function () {
	        for (var i = 0; i < LEN; i++) {
	            this.prev[i] = this.keys[i];
	        }
	        if (this.touched) {
	            this.keys[this.FIRE] = false;
	            this.keys[this.PLAYER_ONE_START] = false;
	        }
	        this.touched = !this.touched;
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
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*! Hammer.JS - v2.0.7 - 2016-04-22
	 * http://hammerjs.github.io/
	 *
	 * Copyright (c) 2016 Jorik Tangelder;
	 * Licensed under the MIT license */
	(function(window, document, exportName, undefined) {
	  'use strict';

	var VENDOR_PREFIXES = ['', 'webkit', 'Moz', 'MS', 'ms', 'o'];
	var TEST_ELEMENT = document.createElement('div');

	var TYPE_FUNCTION = 'function';

	var round = Math.round;
	var abs = Math.abs;
	var now = Date.now;

	/**
	 * set a timeout with a given scope
	 * @param {Function} fn
	 * @param {Number} timeout
	 * @param {Object} context
	 * @returns {number}
	 */
	function setTimeoutContext(fn, timeout, context) {
	    return setTimeout(bindFn(fn, context), timeout);
	}

	/**
	 * if the argument is an array, we want to execute the fn on each entry
	 * if it aint an array we don't want to do a thing.
	 * this is used by all the methods that accept a single and array argument.
	 * @param {*|Array} arg
	 * @param {String} fn
	 * @param {Object} [context]
	 * @returns {Boolean}
	 */
	function invokeArrayArg(arg, fn, context) {
	    if (Array.isArray(arg)) {
	        each(arg, context[fn], context);
	        return true;
	    }
	    return false;
	}

	/**
	 * walk objects and arrays
	 * @param {Object} obj
	 * @param {Function} iterator
	 * @param {Object} context
	 */
	function each(obj, iterator, context) {
	    var i;

	    if (!obj) {
	        return;
	    }

	    if (obj.forEach) {
	        obj.forEach(iterator, context);
	    } else if (obj.length !== undefined) {
	        i = 0;
	        while (i < obj.length) {
	            iterator.call(context, obj[i], i, obj);
	            i++;
	        }
	    } else {
	        for (i in obj) {
	            obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
	        }
	    }
	}

	/**
	 * wrap a method with a deprecation warning and stack trace
	 * @param {Function} method
	 * @param {String} name
	 * @param {String} message
	 * @returns {Function} A new function wrapping the supplied method.
	 */
	function deprecate(method, name, message) {
	    var deprecationMessage = 'DEPRECATED METHOD: ' + name + '\n' + message + ' AT \n';
	    return function() {
	        var e = new Error('get-stack-trace');
	        var stack = e && e.stack ? e.stack.replace(/^[^\(]+?[\n$]/gm, '')
	            .replace(/^\s+at\s+/gm, '')
	            .replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@') : 'Unknown Stack Trace';

	        var log = window.console && (window.console.warn || window.console.log);
	        if (log) {
	            log.call(window.console, deprecationMessage, stack);
	        }
	        return method.apply(this, arguments);
	    };
	}

	/**
	 * extend object.
	 * means that properties in dest will be overwritten by the ones in src.
	 * @param {Object} target
	 * @param {...Object} objects_to_assign
	 * @returns {Object} target
	 */
	var assign;
	if (typeof Object.assign !== 'function') {
	    assign = function assign(target) {
	        if (target === undefined || target === null) {
	            throw new TypeError('Cannot convert undefined or null to object');
	        }

	        var output = Object(target);
	        for (var index = 1; index < arguments.length; index++) {
	            var source = arguments[index];
	            if (source !== undefined && source !== null) {
	                for (var nextKey in source) {
	                    if (source.hasOwnProperty(nextKey)) {
	                        output[nextKey] = source[nextKey];
	                    }
	                }
	            }
	        }
	        return output;
	    };
	} else {
	    assign = Object.assign;
	}

	/**
	 * extend object.
	 * means that properties in dest will be overwritten by the ones in src.
	 * @param {Object} dest
	 * @param {Object} src
	 * @param {Boolean} [merge=false]
	 * @returns {Object} dest
	 */
	var extend = deprecate(function extend(dest, src, merge) {
	    var keys = Object.keys(src);
	    var i = 0;
	    while (i < keys.length) {
	        if (!merge || (merge && dest[keys[i]] === undefined)) {
	            dest[keys[i]] = src[keys[i]];
	        }
	        i++;
	    }
	    return dest;
	}, 'extend', 'Use `assign`.');

	/**
	 * merge the values from src in the dest.
	 * means that properties that exist in dest will not be overwritten by src
	 * @param {Object} dest
	 * @param {Object} src
	 * @returns {Object} dest
	 */
	var merge = deprecate(function merge(dest, src) {
	    return extend(dest, src, true);
	}, 'merge', 'Use `assign`.');

	/**
	 * simple class inheritance
	 * @param {Function} child
	 * @param {Function} base
	 * @param {Object} [properties]
	 */
	function inherit(child, base, properties) {
	    var baseP = base.prototype,
	        childP;

	    childP = child.prototype = Object.create(baseP);
	    childP.constructor = child;
	    childP._super = baseP;

	    if (properties) {
	        assign(childP, properties);
	    }
	}

	/**
	 * simple function bind
	 * @param {Function} fn
	 * @param {Object} context
	 * @returns {Function}
	 */
	function bindFn(fn, context) {
	    return function boundFn() {
	        return fn.apply(context, arguments);
	    };
	}

	/**
	 * let a boolean value also be a function that must return a boolean
	 * this first item in args will be used as the context
	 * @param {Boolean|Function} val
	 * @param {Array} [args]
	 * @returns {Boolean}
	 */
	function boolOrFn(val, args) {
	    if (typeof val == TYPE_FUNCTION) {
	        return val.apply(args ? args[0] || undefined : undefined, args);
	    }
	    return val;
	}

	/**
	 * use the val2 when val1 is undefined
	 * @param {*} val1
	 * @param {*} val2
	 * @returns {*}
	 */
	function ifUndefined(val1, val2) {
	    return (val1 === undefined) ? val2 : val1;
	}

	/**
	 * addEventListener with multiple events at once
	 * @param {EventTarget} target
	 * @param {String} types
	 * @param {Function} handler
	 */
	function addEventListeners(target, types, handler) {
	    each(splitStr(types), function(type) {
	        target.addEventListener(type, handler, false);
	    });
	}

	/**
	 * removeEventListener with multiple events at once
	 * @param {EventTarget} target
	 * @param {String} types
	 * @param {Function} handler
	 */
	function removeEventListeners(target, types, handler) {
	    each(splitStr(types), function(type) {
	        target.removeEventListener(type, handler, false);
	    });
	}

	/**
	 * find if a node is in the given parent
	 * @method hasParent
	 * @param {HTMLElement} node
	 * @param {HTMLElement} parent
	 * @return {Boolean} found
	 */
	function hasParent(node, parent) {
	    while (node) {
	        if (node == parent) {
	            return true;
	        }
	        node = node.parentNode;
	    }
	    return false;
	}

	/**
	 * small indexOf wrapper
	 * @param {String} str
	 * @param {String} find
	 * @returns {Boolean} found
	 */
	function inStr(str, find) {
	    return str.indexOf(find) > -1;
	}

	/**
	 * split string on whitespace
	 * @param {String} str
	 * @returns {Array} words
	 */
	function splitStr(str) {
	    return str.trim().split(/\s+/g);
	}

	/**
	 * find if a array contains the object using indexOf or a simple polyFill
	 * @param {Array} src
	 * @param {String} find
	 * @param {String} [findByKey]
	 * @return {Boolean|Number} false when not found, or the index
	 */
	function inArray(src, find, findByKey) {
	    if (src.indexOf && !findByKey) {
	        return src.indexOf(find);
	    } else {
	        var i = 0;
	        while (i < src.length) {
	            if ((findByKey && src[i][findByKey] == find) || (!findByKey && src[i] === find)) {
	                return i;
	            }
	            i++;
	        }
	        return -1;
	    }
	}

	/**
	 * convert array-like objects to real arrays
	 * @param {Object} obj
	 * @returns {Array}
	 */
	function toArray(obj) {
	    return Array.prototype.slice.call(obj, 0);
	}

	/**
	 * unique array with objects based on a key (like 'id') or just by the array's value
	 * @param {Array} src [{id:1},{id:2},{id:1}]
	 * @param {String} [key]
	 * @param {Boolean} [sort=False]
	 * @returns {Array} [{id:1},{id:2}]
	 */
	function uniqueArray(src, key, sort) {
	    var results = [];
	    var values = [];
	    var i = 0;

	    while (i < src.length) {
	        var val = key ? src[i][key] : src[i];
	        if (inArray(values, val) < 0) {
	            results.push(src[i]);
	        }
	        values[i] = val;
	        i++;
	    }

	    if (sort) {
	        if (!key) {
	            results = results.sort();
	        } else {
	            results = results.sort(function sortUniqueArray(a, b) {
	                return a[key] > b[key];
	            });
	        }
	    }

	    return results;
	}

	/**
	 * get the prefixed property
	 * @param {Object} obj
	 * @param {String} property
	 * @returns {String|Undefined} prefixed
	 */
	function prefixed(obj, property) {
	    var prefix, prop;
	    var camelProp = property[0].toUpperCase() + property.slice(1);

	    var i = 0;
	    while (i < VENDOR_PREFIXES.length) {
	        prefix = VENDOR_PREFIXES[i];
	        prop = (prefix) ? prefix + camelProp : property;

	        if (prop in obj) {
	            return prop;
	        }
	        i++;
	    }
	    return undefined;
	}

	/**
	 * get a unique id
	 * @returns {number} uniqueId
	 */
	var _uniqueId = 1;
	function uniqueId() {
	    return _uniqueId++;
	}

	/**
	 * get the window object of an element
	 * @param {HTMLElement} element
	 * @returns {DocumentView|Window}
	 */
	function getWindowForElement(element) {
	    var doc = element.ownerDocument || element;
	    return (doc.defaultView || doc.parentWindow || window);
	}

	var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;

	var SUPPORT_TOUCH = ('ontouchstart' in window);
	var SUPPORT_POINTER_EVENTS = prefixed(window, 'PointerEvent') !== undefined;
	var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);

	var INPUT_TYPE_TOUCH = 'touch';
	var INPUT_TYPE_PEN = 'pen';
	var INPUT_TYPE_MOUSE = 'mouse';
	var INPUT_TYPE_KINECT = 'kinect';

	var COMPUTE_INTERVAL = 25;

	var INPUT_START = 1;
	var INPUT_MOVE = 2;
	var INPUT_END = 4;
	var INPUT_CANCEL = 8;

	var DIRECTION_NONE = 1;
	var DIRECTION_LEFT = 2;
	var DIRECTION_RIGHT = 4;
	var DIRECTION_UP = 8;
	var DIRECTION_DOWN = 16;

	var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
	var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
	var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;

	var PROPS_XY = ['x', 'y'];
	var PROPS_CLIENT_XY = ['clientX', 'clientY'];

	/**
	 * create new input type manager
	 * @param {Manager} manager
	 * @param {Function} callback
	 * @returns {Input}
	 * @constructor
	 */
	function Input(manager, callback) {
	    var self = this;
	    this.manager = manager;
	    this.callback = callback;
	    this.element = manager.element;
	    this.target = manager.options.inputTarget;

	    // smaller wrapper around the handler, for the scope and the enabled state of the manager,
	    // so when disabled the input events are completely bypassed.
	    this.domHandler = function(ev) {
	        if (boolOrFn(manager.options.enable, [manager])) {
	            self.handler(ev);
	        }
	    };

	    this.init();

	}

	Input.prototype = {
	    /**
	     * should handle the inputEvent data and trigger the callback
	     * @virtual
	     */
	    handler: function() { },

	    /**
	     * bind the events
	     */
	    init: function() {
	        this.evEl && addEventListeners(this.element, this.evEl, this.domHandler);
	        this.evTarget && addEventListeners(this.target, this.evTarget, this.domHandler);
	        this.evWin && addEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
	    },

	    /**
	     * unbind the events
	     */
	    destroy: function() {
	        this.evEl && removeEventListeners(this.element, this.evEl, this.domHandler);
	        this.evTarget && removeEventListeners(this.target, this.evTarget, this.domHandler);
	        this.evWin && removeEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
	    }
	};

	/**
	 * create new input type manager
	 * called by the Manager constructor
	 * @param {Hammer} manager
	 * @returns {Input}
	 */
	function createInputInstance(manager) {
	    var Type;
	    var inputClass = manager.options.inputClass;

	    if (inputClass) {
	        Type = inputClass;
	    } else if (SUPPORT_POINTER_EVENTS) {
	        Type = PointerEventInput;
	    } else if (SUPPORT_ONLY_TOUCH) {
	        Type = TouchInput;
	    } else if (!SUPPORT_TOUCH) {
	        Type = MouseInput;
	    } else {
	        Type = TouchMouseInput;
	    }
	    return new (Type)(manager, inputHandler);
	}

	/**
	 * handle input events
	 * @param {Manager} manager
	 * @param {String} eventType
	 * @param {Object} input
	 */
	function inputHandler(manager, eventType, input) {
	    var pointersLen = input.pointers.length;
	    var changedPointersLen = input.changedPointers.length;
	    var isFirst = (eventType & INPUT_START && (pointersLen - changedPointersLen === 0));
	    var isFinal = (eventType & (INPUT_END | INPUT_CANCEL) && (pointersLen - changedPointersLen === 0));

	    input.isFirst = !!isFirst;
	    input.isFinal = !!isFinal;

	    if (isFirst) {
	        manager.session = {};
	    }

	    // source event is the normalized value of the domEvents
	    // like 'touchstart, mouseup, pointerdown'
	    input.eventType = eventType;

	    // compute scale, rotation etc
	    computeInputData(manager, input);

	    // emit secret event
	    manager.emit('hammer.input', input);

	    manager.recognize(input);
	    manager.session.prevInput = input;
	}

	/**
	 * extend the data with some usable properties like scale, rotate, velocity etc
	 * @param {Object} manager
	 * @param {Object} input
	 */
	function computeInputData(manager, input) {
	    var session = manager.session;
	    var pointers = input.pointers;
	    var pointersLength = pointers.length;

	    // store the first input to calculate the distance and direction
	    if (!session.firstInput) {
	        session.firstInput = simpleCloneInputData(input);
	    }

	    // to compute scale and rotation we need to store the multiple touches
	    if (pointersLength > 1 && !session.firstMultiple) {
	        session.firstMultiple = simpleCloneInputData(input);
	    } else if (pointersLength === 1) {
	        session.firstMultiple = false;
	    }

	    var firstInput = session.firstInput;
	    var firstMultiple = session.firstMultiple;
	    var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;

	    var center = input.center = getCenter(pointers);
	    input.timeStamp = now();
	    input.deltaTime = input.timeStamp - firstInput.timeStamp;

	    input.angle = getAngle(offsetCenter, center);
	    input.distance = getDistance(offsetCenter, center);

	    computeDeltaXY(session, input);
	    input.offsetDirection = getDirection(input.deltaX, input.deltaY);

	    var overallVelocity = getVelocity(input.deltaTime, input.deltaX, input.deltaY);
	    input.overallVelocityX = overallVelocity.x;
	    input.overallVelocityY = overallVelocity.y;
	    input.overallVelocity = (abs(overallVelocity.x) > abs(overallVelocity.y)) ? overallVelocity.x : overallVelocity.y;

	    input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
	    input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;

	    input.maxPointers = !session.prevInput ? input.pointers.length : ((input.pointers.length >
	        session.prevInput.maxPointers) ? input.pointers.length : session.prevInput.maxPointers);

	    computeIntervalInputData(session, input);

	    // find the correct target
	    var target = manager.element;
	    if (hasParent(input.srcEvent.target, target)) {
	        target = input.srcEvent.target;
	    }
	    input.target = target;
	}

	function computeDeltaXY(session, input) {
	    var center = input.center;
	    var offset = session.offsetDelta || {};
	    var prevDelta = session.prevDelta || {};
	    var prevInput = session.prevInput || {};

	    if (input.eventType === INPUT_START || prevInput.eventType === INPUT_END) {
	        prevDelta = session.prevDelta = {
	            x: prevInput.deltaX || 0,
	            y: prevInput.deltaY || 0
	        };

	        offset = session.offsetDelta = {
	            x: center.x,
	            y: center.y
	        };
	    }

	    input.deltaX = prevDelta.x + (center.x - offset.x);
	    input.deltaY = prevDelta.y + (center.y - offset.y);
	}

	/**
	 * velocity is calculated every x ms
	 * @param {Object} session
	 * @param {Object} input
	 */
	function computeIntervalInputData(session, input) {
	    var last = session.lastInterval || input,
	        deltaTime = input.timeStamp - last.timeStamp,
	        velocity, velocityX, velocityY, direction;

	    if (input.eventType != INPUT_CANCEL && (deltaTime > COMPUTE_INTERVAL || last.velocity === undefined)) {
	        var deltaX = input.deltaX - last.deltaX;
	        var deltaY = input.deltaY - last.deltaY;

	        var v = getVelocity(deltaTime, deltaX, deltaY);
	        velocityX = v.x;
	        velocityY = v.y;
	        velocity = (abs(v.x) > abs(v.y)) ? v.x : v.y;
	        direction = getDirection(deltaX, deltaY);

	        session.lastInterval = input;
	    } else {
	        // use latest velocity info if it doesn't overtake a minimum period
	        velocity = last.velocity;
	        velocityX = last.velocityX;
	        velocityY = last.velocityY;
	        direction = last.direction;
	    }

	    input.velocity = velocity;
	    input.velocityX = velocityX;
	    input.velocityY = velocityY;
	    input.direction = direction;
	}

	/**
	 * create a simple clone from the input used for storage of firstInput and firstMultiple
	 * @param {Object} input
	 * @returns {Object} clonedInputData
	 */
	function simpleCloneInputData(input) {
	    // make a simple copy of the pointers because we will get a reference if we don't
	    // we only need clientXY for the calculations
	    var pointers = [];
	    var i = 0;
	    while (i < input.pointers.length) {
	        pointers[i] = {
	            clientX: round(input.pointers[i].clientX),
	            clientY: round(input.pointers[i].clientY)
	        };
	        i++;
	    }

	    return {
	        timeStamp: now(),
	        pointers: pointers,
	        center: getCenter(pointers),
	        deltaX: input.deltaX,
	        deltaY: input.deltaY
	    };
	}

	/**
	 * get the center of all the pointers
	 * @param {Array} pointers
	 * @return {Object} center contains `x` and `y` properties
	 */
	function getCenter(pointers) {
	    var pointersLength = pointers.length;

	    // no need to loop when only one touch
	    if (pointersLength === 1) {
	        return {
	            x: round(pointers[0].clientX),
	            y: round(pointers[0].clientY)
	        };
	    }

	    var x = 0, y = 0, i = 0;
	    while (i < pointersLength) {
	        x += pointers[i].clientX;
	        y += pointers[i].clientY;
	        i++;
	    }

	    return {
	        x: round(x / pointersLength),
	        y: round(y / pointersLength)
	    };
	}

	/**
	 * calculate the velocity between two points. unit is in px per ms.
	 * @param {Number} deltaTime
	 * @param {Number} x
	 * @param {Number} y
	 * @return {Object} velocity `x` and `y`
	 */
	function getVelocity(deltaTime, x, y) {
	    return {
	        x: x / deltaTime || 0,
	        y: y / deltaTime || 0
	    };
	}

	/**
	 * get the direction between two points
	 * @param {Number} x
	 * @param {Number} y
	 * @return {Number} direction
	 */
	function getDirection(x, y) {
	    if (x === y) {
	        return DIRECTION_NONE;
	    }

	    if (abs(x) >= abs(y)) {
	        return x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
	    }
	    return y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
	}

	/**
	 * calculate the absolute distance between two points
	 * @param {Object} p1 {x, y}
	 * @param {Object} p2 {x, y}
	 * @param {Array} [props] containing x and y keys
	 * @return {Number} distance
	 */
	function getDistance(p1, p2, props) {
	    if (!props) {
	        props = PROPS_XY;
	    }
	    var x = p2[props[0]] - p1[props[0]],
	        y = p2[props[1]] - p1[props[1]];

	    return Math.sqrt((x * x) + (y * y));
	}

	/**
	 * calculate the angle between two coordinates
	 * @param {Object} p1
	 * @param {Object} p2
	 * @param {Array} [props] containing x and y keys
	 * @return {Number} angle
	 */
	function getAngle(p1, p2, props) {
	    if (!props) {
	        props = PROPS_XY;
	    }
	    var x = p2[props[0]] - p1[props[0]],
	        y = p2[props[1]] - p1[props[1]];
	    return Math.atan2(y, x) * 180 / Math.PI;
	}

	/**
	 * calculate the rotation degrees between two pointersets
	 * @param {Array} start array of pointers
	 * @param {Array} end array of pointers
	 * @return {Number} rotation
	 */
	function getRotation(start, end) {
	    return getAngle(end[1], end[0], PROPS_CLIENT_XY) + getAngle(start[1], start[0], PROPS_CLIENT_XY);
	}

	/**
	 * calculate the scale factor between two pointersets
	 * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
	 * @param {Array} start array of pointers
	 * @param {Array} end array of pointers
	 * @return {Number} scale
	 */
	function getScale(start, end) {
	    return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
	}

	var MOUSE_INPUT_MAP = {
	    mousedown: INPUT_START,
	    mousemove: INPUT_MOVE,
	    mouseup: INPUT_END
	};

	var MOUSE_ELEMENT_EVENTS = 'mousedown';
	var MOUSE_WINDOW_EVENTS = 'mousemove mouseup';

	/**
	 * Mouse events input
	 * @constructor
	 * @extends Input
	 */
	function MouseInput() {
	    this.evEl = MOUSE_ELEMENT_EVENTS;
	    this.evWin = MOUSE_WINDOW_EVENTS;

	    this.pressed = false; // mousedown state

	    Input.apply(this, arguments);
	}

	inherit(MouseInput, Input, {
	    /**
	     * handle mouse events
	     * @param {Object} ev
	     */
	    handler: function MEhandler(ev) {
	        var eventType = MOUSE_INPUT_MAP[ev.type];

	        // on start we want to have the left mouse button down
	        if (eventType & INPUT_START && ev.button === 0) {
	            this.pressed = true;
	        }

	        if (eventType & INPUT_MOVE && ev.which !== 1) {
	            eventType = INPUT_END;
	        }

	        // mouse must be down
	        if (!this.pressed) {
	            return;
	        }

	        if (eventType & INPUT_END) {
	            this.pressed = false;
	        }

	        this.callback(this.manager, eventType, {
	            pointers: [ev],
	            changedPointers: [ev],
	            pointerType: INPUT_TYPE_MOUSE,
	            srcEvent: ev
	        });
	    }
	});

	var POINTER_INPUT_MAP = {
	    pointerdown: INPUT_START,
	    pointermove: INPUT_MOVE,
	    pointerup: INPUT_END,
	    pointercancel: INPUT_CANCEL,
	    pointerout: INPUT_CANCEL
	};

	// in IE10 the pointer types is defined as an enum
	var IE10_POINTER_TYPE_ENUM = {
	    2: INPUT_TYPE_TOUCH,
	    3: INPUT_TYPE_PEN,
	    4: INPUT_TYPE_MOUSE,
	    5: INPUT_TYPE_KINECT // see https://twitter.com/jacobrossi/status/480596438489890816
	};

	var POINTER_ELEMENT_EVENTS = 'pointerdown';
	var POINTER_WINDOW_EVENTS = 'pointermove pointerup pointercancel';

	// IE10 has prefixed support, and case-sensitive
	if (window.MSPointerEvent && !window.PointerEvent) {
	    POINTER_ELEMENT_EVENTS = 'MSPointerDown';
	    POINTER_WINDOW_EVENTS = 'MSPointerMove MSPointerUp MSPointerCancel';
	}

	/**
	 * Pointer events input
	 * @constructor
	 * @extends Input
	 */
	function PointerEventInput() {
	    this.evEl = POINTER_ELEMENT_EVENTS;
	    this.evWin = POINTER_WINDOW_EVENTS;

	    Input.apply(this, arguments);

	    this.store = (this.manager.session.pointerEvents = []);
	}

	inherit(PointerEventInput, Input, {
	    /**
	     * handle mouse events
	     * @param {Object} ev
	     */
	    handler: function PEhandler(ev) {
	        var store = this.store;
	        var removePointer = false;

	        var eventTypeNormalized = ev.type.toLowerCase().replace('ms', '');
	        var eventType = POINTER_INPUT_MAP[eventTypeNormalized];
	        var pointerType = IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType;

	        var isTouch = (pointerType == INPUT_TYPE_TOUCH);

	        // get index of the event in the store
	        var storeIndex = inArray(store, ev.pointerId, 'pointerId');

	        // start and mouse must be down
	        if (eventType & INPUT_START && (ev.button === 0 || isTouch)) {
	            if (storeIndex < 0) {
	                store.push(ev);
	                storeIndex = store.length - 1;
	            }
	        } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
	            removePointer = true;
	        }

	        // it not found, so the pointer hasn't been down (so it's probably a hover)
	        if (storeIndex < 0) {
	            return;
	        }

	        // update the event in the store
	        store[storeIndex] = ev;

	        this.callback(this.manager, eventType, {
	            pointers: store,
	            changedPointers: [ev],
	            pointerType: pointerType,
	            srcEvent: ev
	        });

	        if (removePointer) {
	            // remove from the store
	            store.splice(storeIndex, 1);
	        }
	    }
	});

	var SINGLE_TOUCH_INPUT_MAP = {
	    touchstart: INPUT_START,
	    touchmove: INPUT_MOVE,
	    touchend: INPUT_END,
	    touchcancel: INPUT_CANCEL
	};

	var SINGLE_TOUCH_TARGET_EVENTS = 'touchstart';
	var SINGLE_TOUCH_WINDOW_EVENTS = 'touchstart touchmove touchend touchcancel';

	/**
	 * Touch events input
	 * @constructor
	 * @extends Input
	 */
	function SingleTouchInput() {
	    this.evTarget = SINGLE_TOUCH_TARGET_EVENTS;
	    this.evWin = SINGLE_TOUCH_WINDOW_EVENTS;
	    this.started = false;

	    Input.apply(this, arguments);
	}

	inherit(SingleTouchInput, Input, {
	    handler: function TEhandler(ev) {
	        var type = SINGLE_TOUCH_INPUT_MAP[ev.type];

	        // should we handle the touch events?
	        if (type === INPUT_START) {
	            this.started = true;
	        }

	        if (!this.started) {
	            return;
	        }

	        var touches = normalizeSingleTouches.call(this, ev, type);

	        // when done, reset the started state
	        if (type & (INPUT_END | INPUT_CANCEL) && touches[0].length - touches[1].length === 0) {
	            this.started = false;
	        }

	        this.callback(this.manager, type, {
	            pointers: touches[0],
	            changedPointers: touches[1],
	            pointerType: INPUT_TYPE_TOUCH,
	            srcEvent: ev
	        });
	    }
	});

	/**
	 * @this {TouchInput}
	 * @param {Object} ev
	 * @param {Number} type flag
	 * @returns {undefined|Array} [all, changed]
	 */
	function normalizeSingleTouches(ev, type) {
	    var all = toArray(ev.touches);
	    var changed = toArray(ev.changedTouches);

	    if (type & (INPUT_END | INPUT_CANCEL)) {
	        all = uniqueArray(all.concat(changed), 'identifier', true);
	    }

	    return [all, changed];
	}

	var TOUCH_INPUT_MAP = {
	    touchstart: INPUT_START,
	    touchmove: INPUT_MOVE,
	    touchend: INPUT_END,
	    touchcancel: INPUT_CANCEL
	};

	var TOUCH_TARGET_EVENTS = 'touchstart touchmove touchend touchcancel';

	/**
	 * Multi-user touch events input
	 * @constructor
	 * @extends Input
	 */
	function TouchInput() {
	    this.evTarget = TOUCH_TARGET_EVENTS;
	    this.targetIds = {};

	    Input.apply(this, arguments);
	}

	inherit(TouchInput, Input, {
	    handler: function MTEhandler(ev) {
	        var type = TOUCH_INPUT_MAP[ev.type];
	        var touches = getTouches.call(this, ev, type);
	        if (!touches) {
	            return;
	        }

	        this.callback(this.manager, type, {
	            pointers: touches[0],
	            changedPointers: touches[1],
	            pointerType: INPUT_TYPE_TOUCH,
	            srcEvent: ev
	        });
	    }
	});

	/**
	 * @this {TouchInput}
	 * @param {Object} ev
	 * @param {Number} type flag
	 * @returns {undefined|Array} [all, changed]
	 */
	function getTouches(ev, type) {
	    var allTouches = toArray(ev.touches);
	    var targetIds = this.targetIds;

	    // when there is only one touch, the process can be simplified
	    if (type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) {
	        targetIds[allTouches[0].identifier] = true;
	        return [allTouches, allTouches];
	    }

	    var i,
	        targetTouches,
	        changedTouches = toArray(ev.changedTouches),
	        changedTargetTouches = [],
	        target = this.target;

	    // get target touches from touches
	    targetTouches = allTouches.filter(function(touch) {
	        return hasParent(touch.target, target);
	    });

	    // collect touches
	    if (type === INPUT_START) {
	        i = 0;
	        while (i < targetTouches.length) {
	            targetIds[targetTouches[i].identifier] = true;
	            i++;
	        }
	    }

	    // filter changed touches to only contain touches that exist in the collected target ids
	    i = 0;
	    while (i < changedTouches.length) {
	        if (targetIds[changedTouches[i].identifier]) {
	            changedTargetTouches.push(changedTouches[i]);
	        }

	        // cleanup removed touches
	        if (type & (INPUT_END | INPUT_CANCEL)) {
	            delete targetIds[changedTouches[i].identifier];
	        }
	        i++;
	    }

	    if (!changedTargetTouches.length) {
	        return;
	    }

	    return [
	        // merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
	        uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true),
	        changedTargetTouches
	    ];
	}

	/**
	 * Combined touch and mouse input
	 *
	 * Touch has a higher priority then mouse, and while touching no mouse events are allowed.
	 * This because touch devices also emit mouse events while doing a touch.
	 *
	 * @constructor
	 * @extends Input
	 */

	var DEDUP_TIMEOUT = 2500;
	var DEDUP_DISTANCE = 25;

	function TouchMouseInput() {
	    Input.apply(this, arguments);

	    var handler = bindFn(this.handler, this);
	    this.touch = new TouchInput(this.manager, handler);
	    this.mouse = new MouseInput(this.manager, handler);

	    this.primaryTouch = null;
	    this.lastTouches = [];
	}

	inherit(TouchMouseInput, Input, {
	    /**
	     * handle mouse and touch events
	     * @param {Hammer} manager
	     * @param {String} inputEvent
	     * @param {Object} inputData
	     */
	    handler: function TMEhandler(manager, inputEvent, inputData) {
	        var isTouch = (inputData.pointerType == INPUT_TYPE_TOUCH),
	            isMouse = (inputData.pointerType == INPUT_TYPE_MOUSE);

	        if (isMouse && inputData.sourceCapabilities && inputData.sourceCapabilities.firesTouchEvents) {
	            return;
	        }

	        // when we're in a touch event, record touches to  de-dupe synthetic mouse event
	        if (isTouch) {
	            recordTouches.call(this, inputEvent, inputData);
	        } else if (isMouse && isSyntheticEvent.call(this, inputData)) {
	            return;
	        }

	        this.callback(manager, inputEvent, inputData);
	    },

	    /**
	     * remove the event listeners
	     */
	    destroy: function destroy() {
	        this.touch.destroy();
	        this.mouse.destroy();
	    }
	});

	function recordTouches(eventType, eventData) {
	    if (eventType & INPUT_START) {
	        this.primaryTouch = eventData.changedPointers[0].identifier;
	        setLastTouch.call(this, eventData);
	    } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
	        setLastTouch.call(this, eventData);
	    }
	}

	function setLastTouch(eventData) {
	    var touch = eventData.changedPointers[0];

	    if (touch.identifier === this.primaryTouch) {
	        var lastTouch = {x: touch.clientX, y: touch.clientY};
	        this.lastTouches.push(lastTouch);
	        var lts = this.lastTouches;
	        var removeLastTouch = function() {
	            var i = lts.indexOf(lastTouch);
	            if (i > -1) {
	                lts.splice(i, 1);
	            }
	        };
	        setTimeout(removeLastTouch, DEDUP_TIMEOUT);
	    }
	}

	function isSyntheticEvent(eventData) {
	    var x = eventData.srcEvent.clientX, y = eventData.srcEvent.clientY;
	    for (var i = 0; i < this.lastTouches.length; i++) {
	        var t = this.lastTouches[i];
	        var dx = Math.abs(x - t.x), dy = Math.abs(y - t.y);
	        if (dx <= DEDUP_DISTANCE && dy <= DEDUP_DISTANCE) {
	            return true;
	        }
	    }
	    return false;
	}

	var PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, 'touchAction');
	var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined;

	// magical touchAction value
	var TOUCH_ACTION_COMPUTE = 'compute';
	var TOUCH_ACTION_AUTO = 'auto';
	var TOUCH_ACTION_MANIPULATION = 'manipulation'; // not implemented
	var TOUCH_ACTION_NONE = 'none';
	var TOUCH_ACTION_PAN_X = 'pan-x';
	var TOUCH_ACTION_PAN_Y = 'pan-y';
	var TOUCH_ACTION_MAP = getTouchActionProps();

	/**
	 * Touch Action
	 * sets the touchAction property or uses the js alternative
	 * @param {Manager} manager
	 * @param {String} value
	 * @constructor
	 */
	function TouchAction(manager, value) {
	    this.manager = manager;
	    this.set(value);
	}

	TouchAction.prototype = {
	    /**
	     * set the touchAction value on the element or enable the polyfill
	     * @param {String} value
	     */
	    set: function(value) {
	        // find out the touch-action by the event handlers
	        if (value == TOUCH_ACTION_COMPUTE) {
	            value = this.compute();
	        }

	        if (NATIVE_TOUCH_ACTION && this.manager.element.style && TOUCH_ACTION_MAP[value]) {
	            this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
	        }
	        this.actions = value.toLowerCase().trim();
	    },

	    /**
	     * just re-set the touchAction value
	     */
	    update: function() {
	        this.set(this.manager.options.touchAction);
	    },

	    /**
	     * compute the value for the touchAction property based on the recognizer's settings
	     * @returns {String} value
	     */
	    compute: function() {
	        var actions = [];
	        each(this.manager.recognizers, function(recognizer) {
	            if (boolOrFn(recognizer.options.enable, [recognizer])) {
	                actions = actions.concat(recognizer.getTouchAction());
	            }
	        });
	        return cleanTouchActions(actions.join(' '));
	    },

	    /**
	     * this method is called on each input cycle and provides the preventing of the browser behavior
	     * @param {Object} input
	     */
	    preventDefaults: function(input) {
	        var srcEvent = input.srcEvent;
	        var direction = input.offsetDirection;

	        // if the touch action did prevented once this session
	        if (this.manager.session.prevented) {
	            srcEvent.preventDefault();
	            return;
	        }

	        var actions = this.actions;
	        var hasNone = inStr(actions, TOUCH_ACTION_NONE) && !TOUCH_ACTION_MAP[TOUCH_ACTION_NONE];
	        var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_Y];
	        var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_X];

	        if (hasNone) {
	            //do not prevent defaults if this is a tap gesture

	            var isTapPointer = input.pointers.length === 1;
	            var isTapMovement = input.distance < 2;
	            var isTapTouchTime = input.deltaTime < 250;

	            if (isTapPointer && isTapMovement && isTapTouchTime) {
	                return;
	            }
	        }

	        if (hasPanX && hasPanY) {
	            // `pan-x pan-y` means browser handles all scrolling/panning, do not prevent
	            return;
	        }

	        if (hasNone ||
	            (hasPanY && direction & DIRECTION_HORIZONTAL) ||
	            (hasPanX && direction & DIRECTION_VERTICAL)) {
	            return this.preventSrc(srcEvent);
	        }
	    },

	    /**
	     * call preventDefault to prevent the browser's default behavior (scrolling in most cases)
	     * @param {Object} srcEvent
	     */
	    preventSrc: function(srcEvent) {
	        this.manager.session.prevented = true;
	        srcEvent.preventDefault();
	    }
	};

	/**
	 * when the touchActions are collected they are not a valid value, so we need to clean things up. *
	 * @param {String} actions
	 * @returns {*}
	 */
	function cleanTouchActions(actions) {
	    // none
	    if (inStr(actions, TOUCH_ACTION_NONE)) {
	        return TOUCH_ACTION_NONE;
	    }

	    var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
	    var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);

	    // if both pan-x and pan-y are set (different recognizers
	    // for different directions, e.g. horizontal pan but vertical swipe?)
	    // we need none (as otherwise with pan-x pan-y combined none of these
	    // recognizers will work, since the browser would handle all panning
	    if (hasPanX && hasPanY) {
	        return TOUCH_ACTION_NONE;
	    }

	    // pan-x OR pan-y
	    if (hasPanX || hasPanY) {
	        return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y;
	    }

	    // manipulation
	    if (inStr(actions, TOUCH_ACTION_MANIPULATION)) {
	        return TOUCH_ACTION_MANIPULATION;
	    }

	    return TOUCH_ACTION_AUTO;
	}

	function getTouchActionProps() {
	    if (!NATIVE_TOUCH_ACTION) {
	        return false;
	    }
	    var touchMap = {};
	    var cssSupports = window.CSS && window.CSS.supports;
	    ['auto', 'manipulation', 'pan-y', 'pan-x', 'pan-x pan-y', 'none'].forEach(function(val) {

	        // If css.supports is not supported but there is native touch-action assume it supports
	        // all values. This is the case for IE 10 and 11.
	        touchMap[val] = cssSupports ? window.CSS.supports('touch-action', val) : true;
	    });
	    return touchMap;
	}

	/**
	 * Recognizer flow explained; *
	 * All recognizers have the initial state of POSSIBLE when a input session starts.
	 * The definition of a input session is from the first input until the last input, with all it's movement in it. *
	 * Example session for mouse-input: mousedown -> mousemove -> mouseup
	 *
	 * On each recognizing cycle (see Manager.recognize) the .recognize() method is executed
	 * which determines with state it should be.
	 *
	 * If the recognizer has the state FAILED, CANCELLED or RECOGNIZED (equals ENDED), it is reset to
	 * POSSIBLE to give it another change on the next cycle.
	 *
	 *               Possible
	 *                  |
	 *            +-----+---------------+
	 *            |                     |
	 *      +-----+-----+               |
	 *      |           |               |
	 *   Failed      Cancelled          |
	 *                          +-------+------+
	 *                          |              |
	 *                      Recognized       Began
	 *                                         |
	 *                                      Changed
	 *                                         |
	 *                                  Ended/Recognized
	 */
	var STATE_POSSIBLE = 1;
	var STATE_BEGAN = 2;
	var STATE_CHANGED = 4;
	var STATE_ENDED = 8;
	var STATE_RECOGNIZED = STATE_ENDED;
	var STATE_CANCELLED = 16;
	var STATE_FAILED = 32;

	/**
	 * Recognizer
	 * Every recognizer needs to extend from this class.
	 * @constructor
	 * @param {Object} options
	 */
	function Recognizer(options) {
	    this.options = assign({}, this.defaults, options || {});

	    this.id = uniqueId();

	    this.manager = null;

	    // default is enable true
	    this.options.enable = ifUndefined(this.options.enable, true);

	    this.state = STATE_POSSIBLE;

	    this.simultaneous = {};
	    this.requireFail = [];
	}

	Recognizer.prototype = {
	    /**
	     * @virtual
	     * @type {Object}
	     */
	    defaults: {},

	    /**
	     * set options
	     * @param {Object} options
	     * @return {Recognizer}
	     */
	    set: function(options) {
	        assign(this.options, options);

	        // also update the touchAction, in case something changed about the directions/enabled state
	        this.manager && this.manager.touchAction.update();
	        return this;
	    },

	    /**
	     * recognize simultaneous with an other recognizer.
	     * @param {Recognizer} otherRecognizer
	     * @returns {Recognizer} this
	     */
	    recognizeWith: function(otherRecognizer) {
	        if (invokeArrayArg(otherRecognizer, 'recognizeWith', this)) {
	            return this;
	        }

	        var simultaneous = this.simultaneous;
	        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
	        if (!simultaneous[otherRecognizer.id]) {
	            simultaneous[otherRecognizer.id] = otherRecognizer;
	            otherRecognizer.recognizeWith(this);
	        }
	        return this;
	    },

	    /**
	     * drop the simultaneous link. it doesnt remove the link on the other recognizer.
	     * @param {Recognizer} otherRecognizer
	     * @returns {Recognizer} this
	     */
	    dropRecognizeWith: function(otherRecognizer) {
	        if (invokeArrayArg(otherRecognizer, 'dropRecognizeWith', this)) {
	            return this;
	        }

	        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
	        delete this.simultaneous[otherRecognizer.id];
	        return this;
	    },

	    /**
	     * recognizer can only run when an other is failing
	     * @param {Recognizer} otherRecognizer
	     * @returns {Recognizer} this
	     */
	    requireFailure: function(otherRecognizer) {
	        if (invokeArrayArg(otherRecognizer, 'requireFailure', this)) {
	            return this;
	        }

	        var requireFail = this.requireFail;
	        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
	        if (inArray(requireFail, otherRecognizer) === -1) {
	            requireFail.push(otherRecognizer);
	            otherRecognizer.requireFailure(this);
	        }
	        return this;
	    },

	    /**
	     * drop the requireFailure link. it does not remove the link on the other recognizer.
	     * @param {Recognizer} otherRecognizer
	     * @returns {Recognizer} this
	     */
	    dropRequireFailure: function(otherRecognizer) {
	        if (invokeArrayArg(otherRecognizer, 'dropRequireFailure', this)) {
	            return this;
	        }

	        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
	        var index = inArray(this.requireFail, otherRecognizer);
	        if (index > -1) {
	            this.requireFail.splice(index, 1);
	        }
	        return this;
	    },

	    /**
	     * has require failures boolean
	     * @returns {boolean}
	     */
	    hasRequireFailures: function() {
	        return this.requireFail.length > 0;
	    },

	    /**
	     * if the recognizer can recognize simultaneous with an other recognizer
	     * @param {Recognizer} otherRecognizer
	     * @returns {Boolean}
	     */
	    canRecognizeWith: function(otherRecognizer) {
	        return !!this.simultaneous[otherRecognizer.id];
	    },

	    /**
	     * You should use `tryEmit` instead of `emit` directly to check
	     * that all the needed recognizers has failed before emitting.
	     * @param {Object} input
	     */
	    emit: function(input) {
	        var self = this;
	        var state = this.state;

	        function emit(event) {
	            self.manager.emit(event, input);
	        }

	        // 'panstart' and 'panmove'
	        if (state < STATE_ENDED) {
	            emit(self.options.event + stateStr(state));
	        }

	        emit(self.options.event); // simple 'eventName' events

	        if (input.additionalEvent) { // additional event(panleft, panright, pinchin, pinchout...)
	            emit(input.additionalEvent);
	        }

	        // panend and pancancel
	        if (state >= STATE_ENDED) {
	            emit(self.options.event + stateStr(state));
	        }
	    },

	    /**
	     * Check that all the require failure recognizers has failed,
	     * if true, it emits a gesture event,
	     * otherwise, setup the state to FAILED.
	     * @param {Object} input
	     */
	    tryEmit: function(input) {
	        if (this.canEmit()) {
	            return this.emit(input);
	        }
	        // it's failing anyway
	        this.state = STATE_FAILED;
	    },

	    /**
	     * can we emit?
	     * @returns {boolean}
	     */
	    canEmit: function() {
	        var i = 0;
	        while (i < this.requireFail.length) {
	            if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
	                return false;
	            }
	            i++;
	        }
	        return true;
	    },

	    /**
	     * update the recognizer
	     * @param {Object} inputData
	     */
	    recognize: function(inputData) {
	        // make a new copy of the inputData
	        // so we can change the inputData without messing up the other recognizers
	        var inputDataClone = assign({}, inputData);

	        // is is enabled and allow recognizing?
	        if (!boolOrFn(this.options.enable, [this, inputDataClone])) {
	            this.reset();
	            this.state = STATE_FAILED;
	            return;
	        }

	        // reset when we've reached the end
	        if (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)) {
	            this.state = STATE_POSSIBLE;
	        }

	        this.state = this.process(inputDataClone);

	        // the recognizer has recognized a gesture
	        // so trigger an event
	        if (this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED)) {
	            this.tryEmit(inputDataClone);
	        }
	    },

	    /**
	     * return the state of the recognizer
	     * the actual recognizing happens in this method
	     * @virtual
	     * @param {Object} inputData
	     * @returns {Const} STATE
	     */
	    process: function(inputData) { }, // jshint ignore:line

	    /**
	     * return the preferred touch-action
	     * @virtual
	     * @returns {Array}
	     */
	    getTouchAction: function() { },

	    /**
	     * called when the gesture isn't allowed to recognize
	     * like when another is being recognized or it is disabled
	     * @virtual
	     */
	    reset: function() { }
	};

	/**
	 * get a usable string, used as event postfix
	 * @param {Const} state
	 * @returns {String} state
	 */
	function stateStr(state) {
	    if (state & STATE_CANCELLED) {
	        return 'cancel';
	    } else if (state & STATE_ENDED) {
	        return 'end';
	    } else if (state & STATE_CHANGED) {
	        return 'move';
	    } else if (state & STATE_BEGAN) {
	        return 'start';
	    }
	    return '';
	}

	/**
	 * direction cons to string
	 * @param {Const} direction
	 * @returns {String}
	 */
	function directionStr(direction) {
	    if (direction == DIRECTION_DOWN) {
	        return 'down';
	    } else if (direction == DIRECTION_UP) {
	        return 'up';
	    } else if (direction == DIRECTION_LEFT) {
	        return 'left';
	    } else if (direction == DIRECTION_RIGHT) {
	        return 'right';
	    }
	    return '';
	}

	/**
	 * get a recognizer by name if it is bound to a manager
	 * @param {Recognizer|String} otherRecognizer
	 * @param {Recognizer} recognizer
	 * @returns {Recognizer}
	 */
	function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
	    var manager = recognizer.manager;
	    if (manager) {
	        return manager.get(otherRecognizer);
	    }
	    return otherRecognizer;
	}

	/**
	 * This recognizer is just used as a base for the simple attribute recognizers.
	 * @constructor
	 * @extends Recognizer
	 */
	function AttrRecognizer() {
	    Recognizer.apply(this, arguments);
	}

	inherit(AttrRecognizer, Recognizer, {
	    /**
	     * @namespace
	     * @memberof AttrRecognizer
	     */
	    defaults: {
	        /**
	         * @type {Number}
	         * @default 1
	         */
	        pointers: 1
	    },

	    /**
	     * Used to check if it the recognizer receives valid input, like input.distance > 10.
	     * @memberof AttrRecognizer
	     * @param {Object} input
	     * @returns {Boolean} recognized
	     */
	    attrTest: function(input) {
	        var optionPointers = this.options.pointers;
	        return optionPointers === 0 || input.pointers.length === optionPointers;
	    },

	    /**
	     * Process the input and return the state for the recognizer
	     * @memberof AttrRecognizer
	     * @param {Object} input
	     * @returns {*} State
	     */
	    process: function(input) {
	        var state = this.state;
	        var eventType = input.eventType;

	        var isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
	        var isValid = this.attrTest(input);

	        // on cancel input and we've recognized before, return STATE_CANCELLED
	        if (isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
	            return state | STATE_CANCELLED;
	        } else if (isRecognized || isValid) {
	            if (eventType & INPUT_END) {
	                return state | STATE_ENDED;
	            } else if (!(state & STATE_BEGAN)) {
	                return STATE_BEGAN;
	            }
	            return state | STATE_CHANGED;
	        }
	        return STATE_FAILED;
	    }
	});

	/**
	 * Pan
	 * Recognized when the pointer is down and moved in the allowed direction.
	 * @constructor
	 * @extends AttrRecognizer
	 */
	function PanRecognizer() {
	    AttrRecognizer.apply(this, arguments);

	    this.pX = null;
	    this.pY = null;
	}

	inherit(PanRecognizer, AttrRecognizer, {
	    /**
	     * @namespace
	     * @memberof PanRecognizer
	     */
	    defaults: {
	        event: 'pan',
	        threshold: 10,
	        pointers: 1,
	        direction: DIRECTION_ALL
	    },

	    getTouchAction: function() {
	        var direction = this.options.direction;
	        var actions = [];
	        if (direction & DIRECTION_HORIZONTAL) {
	            actions.push(TOUCH_ACTION_PAN_Y);
	        }
	        if (direction & DIRECTION_VERTICAL) {
	            actions.push(TOUCH_ACTION_PAN_X);
	        }
	        return actions;
	    },

	    directionTest: function(input) {
	        var options = this.options;
	        var hasMoved = true;
	        var distance = input.distance;
	        var direction = input.direction;
	        var x = input.deltaX;
	        var y = input.deltaY;

	        // lock to axis?
	        if (!(direction & options.direction)) {
	            if (options.direction & DIRECTION_HORIZONTAL) {
	                direction = (x === 0) ? DIRECTION_NONE : (x < 0) ? DIRECTION_LEFT : DIRECTION_RIGHT;
	                hasMoved = x != this.pX;
	                distance = Math.abs(input.deltaX);
	            } else {
	                direction = (y === 0) ? DIRECTION_NONE : (y < 0) ? DIRECTION_UP : DIRECTION_DOWN;
	                hasMoved = y != this.pY;
	                distance = Math.abs(input.deltaY);
	            }
	        }
	        input.direction = direction;
	        return hasMoved && distance > options.threshold && direction & options.direction;
	    },

	    attrTest: function(input) {
	        return AttrRecognizer.prototype.attrTest.call(this, input) &&
	            (this.state & STATE_BEGAN || (!(this.state & STATE_BEGAN) && this.directionTest(input)));
	    },

	    emit: function(input) {

	        this.pX = input.deltaX;
	        this.pY = input.deltaY;

	        var direction = directionStr(input.direction);

	        if (direction) {
	            input.additionalEvent = this.options.event + direction;
	        }
	        this._super.emit.call(this, input);
	    }
	});

	/**
	 * Pinch
	 * Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).
	 * @constructor
	 * @extends AttrRecognizer
	 */
	function PinchRecognizer() {
	    AttrRecognizer.apply(this, arguments);
	}

	inherit(PinchRecognizer, AttrRecognizer, {
	    /**
	     * @namespace
	     * @memberof PinchRecognizer
	     */
	    defaults: {
	        event: 'pinch',
	        threshold: 0,
	        pointers: 2
	    },

	    getTouchAction: function() {
	        return [TOUCH_ACTION_NONE];
	    },

	    attrTest: function(input) {
	        return this._super.attrTest.call(this, input) &&
	            (Math.abs(input.scale - 1) > this.options.threshold || this.state & STATE_BEGAN);
	    },

	    emit: function(input) {
	        if (input.scale !== 1) {
	            var inOut = input.scale < 1 ? 'in' : 'out';
	            input.additionalEvent = this.options.event + inOut;
	        }
	        this._super.emit.call(this, input);
	    }
	});

	/**
	 * Press
	 * Recognized when the pointer is down for x ms without any movement.
	 * @constructor
	 * @extends Recognizer
	 */
	function PressRecognizer() {
	    Recognizer.apply(this, arguments);

	    this._timer = null;
	    this._input = null;
	}

	inherit(PressRecognizer, Recognizer, {
	    /**
	     * @namespace
	     * @memberof PressRecognizer
	     */
	    defaults: {
	        event: 'press',
	        pointers: 1,
	        time: 251, // minimal time of the pointer to be pressed
	        threshold: 9 // a minimal movement is ok, but keep it low
	    },

	    getTouchAction: function() {
	        return [TOUCH_ACTION_AUTO];
	    },

	    process: function(input) {
	        var options = this.options;
	        var validPointers = input.pointers.length === options.pointers;
	        var validMovement = input.distance < options.threshold;
	        var validTime = input.deltaTime > options.time;

	        this._input = input;

	        // we only allow little movement
	        // and we've reached an end event, so a tap is possible
	        if (!validMovement || !validPointers || (input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime)) {
	            this.reset();
	        } else if (input.eventType & INPUT_START) {
	            this.reset();
	            this._timer = setTimeoutContext(function() {
	                this.state = STATE_RECOGNIZED;
	                this.tryEmit();
	            }, options.time, this);
	        } else if (input.eventType & INPUT_END) {
	            return STATE_RECOGNIZED;
	        }
	        return STATE_FAILED;
	    },

	    reset: function() {
	        clearTimeout(this._timer);
	    },

	    emit: function(input) {
	        if (this.state !== STATE_RECOGNIZED) {
	            return;
	        }

	        if (input && (input.eventType & INPUT_END)) {
	            this.manager.emit(this.options.event + 'up', input);
	        } else {
	            this._input.timeStamp = now();
	            this.manager.emit(this.options.event, this._input);
	        }
	    }
	});

	/**
	 * Rotate
	 * Recognized when two or more pointer are moving in a circular motion.
	 * @constructor
	 * @extends AttrRecognizer
	 */
	function RotateRecognizer() {
	    AttrRecognizer.apply(this, arguments);
	}

	inherit(RotateRecognizer, AttrRecognizer, {
	    /**
	     * @namespace
	     * @memberof RotateRecognizer
	     */
	    defaults: {
	        event: 'rotate',
	        threshold: 0,
	        pointers: 2
	    },

	    getTouchAction: function() {
	        return [TOUCH_ACTION_NONE];
	    },

	    attrTest: function(input) {
	        return this._super.attrTest.call(this, input) &&
	            (Math.abs(input.rotation) > this.options.threshold || this.state & STATE_BEGAN);
	    }
	});

	/**
	 * Swipe
	 * Recognized when the pointer is moving fast (velocity), with enough distance in the allowed direction.
	 * @constructor
	 * @extends AttrRecognizer
	 */
	function SwipeRecognizer() {
	    AttrRecognizer.apply(this, arguments);
	}

	inherit(SwipeRecognizer, AttrRecognizer, {
	    /**
	     * @namespace
	     * @memberof SwipeRecognizer
	     */
	    defaults: {
	        event: 'swipe',
	        threshold: 10,
	        velocity: 0.3,
	        direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL,
	        pointers: 1
	    },

	    getTouchAction: function() {
	        return PanRecognizer.prototype.getTouchAction.call(this);
	    },

	    attrTest: function(input) {
	        var direction = this.options.direction;
	        var velocity;

	        if (direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)) {
	            velocity = input.overallVelocity;
	        } else if (direction & DIRECTION_HORIZONTAL) {
	            velocity = input.overallVelocityX;
	        } else if (direction & DIRECTION_VERTICAL) {
	            velocity = input.overallVelocityY;
	        }

	        return this._super.attrTest.call(this, input) &&
	            direction & input.offsetDirection &&
	            input.distance > this.options.threshold &&
	            input.maxPointers == this.options.pointers &&
	            abs(velocity) > this.options.velocity && input.eventType & INPUT_END;
	    },

	    emit: function(input) {
	        var direction = directionStr(input.offsetDirection);
	        if (direction) {
	            this.manager.emit(this.options.event + direction, input);
	        }

	        this.manager.emit(this.options.event, input);
	    }
	});

	/**
	 * A tap is ecognized when the pointer is doing a small tap/click. Multiple taps are recognized if they occur
	 * between the given interval and position. The delay option can be used to recognize multi-taps without firing
	 * a single tap.
	 *
	 * The eventData from the emitted event contains the property `tapCount`, which contains the amount of
	 * multi-taps being recognized.
	 * @constructor
	 * @extends Recognizer
	 */
	function TapRecognizer() {
	    Recognizer.apply(this, arguments);

	    // previous time and center,
	    // used for tap counting
	    this.pTime = false;
	    this.pCenter = false;

	    this._timer = null;
	    this._input = null;
	    this.count = 0;
	}

	inherit(TapRecognizer, Recognizer, {
	    /**
	     * @namespace
	     * @memberof PinchRecognizer
	     */
	    defaults: {
	        event: 'tap',
	        pointers: 1,
	        taps: 1,
	        interval: 300, // max time between the multi-tap taps
	        time: 250, // max time of the pointer to be down (like finger on the screen)
	        threshold: 9, // a minimal movement is ok, but keep it low
	        posThreshold: 10 // a multi-tap can be a bit off the initial position
	    },

	    getTouchAction: function() {
	        return [TOUCH_ACTION_MANIPULATION];
	    },

	    process: function(input) {
	        var options = this.options;

	        var validPointers = input.pointers.length === options.pointers;
	        var validMovement = input.distance < options.threshold;
	        var validTouchTime = input.deltaTime < options.time;

	        this.reset();

	        if ((input.eventType & INPUT_START) && (this.count === 0)) {
	            return this.failTimeout();
	        }

	        // we only allow little movement
	        // and we've reached an end event, so a tap is possible
	        if (validMovement && validTouchTime && validPointers) {
	            if (input.eventType != INPUT_END) {
	                return this.failTimeout();
	            }

	            var validInterval = this.pTime ? (input.timeStamp - this.pTime < options.interval) : true;
	            var validMultiTap = !this.pCenter || getDistance(this.pCenter, input.center) < options.posThreshold;

	            this.pTime = input.timeStamp;
	            this.pCenter = input.center;

	            if (!validMultiTap || !validInterval) {
	                this.count = 1;
	            } else {
	                this.count += 1;
	            }

	            this._input = input;

	            // if tap count matches we have recognized it,
	            // else it has began recognizing...
	            var tapCount = this.count % options.taps;
	            if (tapCount === 0) {
	                // no failing requirements, immediately trigger the tap event
	                // or wait as long as the multitap interval to trigger
	                if (!this.hasRequireFailures()) {
	                    return STATE_RECOGNIZED;
	                } else {
	                    this._timer = setTimeoutContext(function() {
	                        this.state = STATE_RECOGNIZED;
	                        this.tryEmit();
	                    }, options.interval, this);
	                    return STATE_BEGAN;
	                }
	            }
	        }
	        return STATE_FAILED;
	    },

	    failTimeout: function() {
	        this._timer = setTimeoutContext(function() {
	            this.state = STATE_FAILED;
	        }, this.options.interval, this);
	        return STATE_FAILED;
	    },

	    reset: function() {
	        clearTimeout(this._timer);
	    },

	    emit: function() {
	        if (this.state == STATE_RECOGNIZED) {
	            this._input.tapCount = this.count;
	            this.manager.emit(this.options.event, this._input);
	        }
	    }
	});

	/**
	 * Simple way to create a manager with a default set of recognizers.
	 * @param {HTMLElement} element
	 * @param {Object} [options]
	 * @constructor
	 */
	function Hammer(element, options) {
	    options = options || {};
	    options.recognizers = ifUndefined(options.recognizers, Hammer.defaults.preset);
	    return new Manager(element, options);
	}

	/**
	 * @const {string}
	 */
	Hammer.VERSION = '2.0.7';

	/**
	 * default settings
	 * @namespace
	 */
	Hammer.defaults = {
	    /**
	     * set if DOM events are being triggered.
	     * But this is slower and unused by simple implementations, so disabled by default.
	     * @type {Boolean}
	     * @default false
	     */
	    domEvents: false,

	    /**
	     * The value for the touchAction property/fallback.
	     * When set to `compute` it will magically set the correct value based on the added recognizers.
	     * @type {String}
	     * @default compute
	     */
	    touchAction: TOUCH_ACTION_COMPUTE,

	    /**
	     * @type {Boolean}
	     * @default true
	     */
	    enable: true,

	    /**
	     * EXPERIMENTAL FEATURE -- can be removed/changed
	     * Change the parent input target element.
	     * If Null, then it is being set the to main element.
	     * @type {Null|EventTarget}
	     * @default null
	     */
	    inputTarget: null,

	    /**
	     * force an input class
	     * @type {Null|Function}
	     * @default null
	     */
	    inputClass: null,

	    /**
	     * Default recognizer setup when calling `Hammer()`
	     * When creating a new Manager these will be skipped.
	     * @type {Array}
	     */
	    preset: [
	        // RecognizerClass, options, [recognizeWith, ...], [requireFailure, ...]
	        [RotateRecognizer, {enable: false}],
	        [PinchRecognizer, {enable: false}, ['rotate']],
	        [SwipeRecognizer, {direction: DIRECTION_HORIZONTAL}],
	        [PanRecognizer, {direction: DIRECTION_HORIZONTAL}, ['swipe']],
	        [TapRecognizer],
	        [TapRecognizer, {event: 'doubletap', taps: 2}, ['tap']],
	        [PressRecognizer]
	    ],

	    /**
	     * Some CSS properties can be used to improve the working of Hammer.
	     * Add them to this method and they will be set when creating a new Manager.
	     * @namespace
	     */
	    cssProps: {
	        /**
	         * Disables text selection to improve the dragging gesture. Mainly for desktop browsers.
	         * @type {String}
	         * @default 'none'
	         */
	        userSelect: 'none',

	        /**
	         * Disable the Windows Phone grippers when pressing an element.
	         * @type {String}
	         * @default 'none'
	         */
	        touchSelect: 'none',

	        /**
	         * Disables the default callout shown when you touch and hold a touch target.
	         * On iOS, when you touch and hold a touch target such as a link, Safari displays
	         * a callout containing information about the link. This property allows you to disable that callout.
	         * @type {String}
	         * @default 'none'
	         */
	        touchCallout: 'none',

	        /**
	         * Specifies whether zooming is enabled. Used by IE10>
	         * @type {String}
	         * @default 'none'
	         */
	        contentZooming: 'none',

	        /**
	         * Specifies that an entire element should be draggable instead of its contents. Mainly for desktop browsers.
	         * @type {String}
	         * @default 'none'
	         */
	        userDrag: 'none',

	        /**
	         * Overrides the highlight color shown when the user taps a link or a JavaScript
	         * clickable element in iOS. This property obeys the alpha value, if specified.
	         * @type {String}
	         * @default 'rgba(0,0,0,0)'
	         */
	        tapHighlightColor: 'rgba(0,0,0,0)'
	    }
	};

	var STOP = 1;
	var FORCED_STOP = 2;

	/**
	 * Manager
	 * @param {HTMLElement} element
	 * @param {Object} [options]
	 * @constructor
	 */
	function Manager(element, options) {
	    this.options = assign({}, Hammer.defaults, options || {});

	    this.options.inputTarget = this.options.inputTarget || element;

	    this.handlers = {};
	    this.session = {};
	    this.recognizers = [];
	    this.oldCssProps = {};

	    this.element = element;
	    this.input = createInputInstance(this);
	    this.touchAction = new TouchAction(this, this.options.touchAction);

	    toggleCssProps(this, true);

	    each(this.options.recognizers, function(item) {
	        var recognizer = this.add(new (item[0])(item[1]));
	        item[2] && recognizer.recognizeWith(item[2]);
	        item[3] && recognizer.requireFailure(item[3]);
	    }, this);
	}

	Manager.prototype = {
	    /**
	     * set options
	     * @param {Object} options
	     * @returns {Manager}
	     */
	    set: function(options) {
	        assign(this.options, options);

	        // Options that need a little more setup
	        if (options.touchAction) {
	            this.touchAction.update();
	        }
	        if (options.inputTarget) {
	            // Clean up existing event listeners and reinitialize
	            this.input.destroy();
	            this.input.target = options.inputTarget;
	            this.input.init();
	        }
	        return this;
	    },

	    /**
	     * stop recognizing for this session.
	     * This session will be discarded, when a new [input]start event is fired.
	     * When forced, the recognizer cycle is stopped immediately.
	     * @param {Boolean} [force]
	     */
	    stop: function(force) {
	        this.session.stopped = force ? FORCED_STOP : STOP;
	    },

	    /**
	     * run the recognizers!
	     * called by the inputHandler function on every movement of the pointers (touches)
	     * it walks through all the recognizers and tries to detect the gesture that is being made
	     * @param {Object} inputData
	     */
	    recognize: function(inputData) {
	        var session = this.session;
	        if (session.stopped) {
	            return;
	        }

	        // run the touch-action polyfill
	        this.touchAction.preventDefaults(inputData);

	        var recognizer;
	        var recognizers = this.recognizers;

	        // this holds the recognizer that is being recognized.
	        // so the recognizer's state needs to be BEGAN, CHANGED, ENDED or RECOGNIZED
	        // if no recognizer is detecting a thing, it is set to `null`
	        var curRecognizer = session.curRecognizer;

	        // reset when the last recognizer is recognized
	        // or when we're in a new session
	        if (!curRecognizer || (curRecognizer && curRecognizer.state & STATE_RECOGNIZED)) {
	            curRecognizer = session.curRecognizer = null;
	        }

	        var i = 0;
	        while (i < recognizers.length) {
	            recognizer = recognizers[i];

	            // find out if we are allowed try to recognize the input for this one.
	            // 1.   allow if the session is NOT forced stopped (see the .stop() method)
	            // 2.   allow if we still haven't recognized a gesture in this session, or the this recognizer is the one
	            //      that is being recognized.
	            // 3.   allow if the recognizer is allowed to run simultaneous with the current recognized recognizer.
	            //      this can be setup with the `recognizeWith()` method on the recognizer.
	            if (session.stopped !== FORCED_STOP && ( // 1
	                    !curRecognizer || recognizer == curRecognizer || // 2
	                    recognizer.canRecognizeWith(curRecognizer))) { // 3
	                recognizer.recognize(inputData);
	            } else {
	                recognizer.reset();
	            }

	            // if the recognizer has been recognizing the input as a valid gesture, we want to store this one as the
	            // current active recognizer. but only if we don't already have an active recognizer
	            if (!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)) {
	                curRecognizer = session.curRecognizer = recognizer;
	            }
	            i++;
	        }
	    },

	    /**
	     * get a recognizer by its event name.
	     * @param {Recognizer|String} recognizer
	     * @returns {Recognizer|Null}
	     */
	    get: function(recognizer) {
	        if (recognizer instanceof Recognizer) {
	            return recognizer;
	        }

	        var recognizers = this.recognizers;
	        for (var i = 0; i < recognizers.length; i++) {
	            if (recognizers[i].options.event == recognizer) {
	                return recognizers[i];
	            }
	        }
	        return null;
	    },

	    /**
	     * add a recognizer to the manager
	     * existing recognizers with the same event name will be removed
	     * @param {Recognizer} recognizer
	     * @returns {Recognizer|Manager}
	     */
	    add: function(recognizer) {
	        if (invokeArrayArg(recognizer, 'add', this)) {
	            return this;
	        }

	        // remove existing
	        var existing = this.get(recognizer.options.event);
	        if (existing) {
	            this.remove(existing);
	        }

	        this.recognizers.push(recognizer);
	        recognizer.manager = this;

	        this.touchAction.update();
	        return recognizer;
	    },

	    /**
	     * remove a recognizer by name or instance
	     * @param {Recognizer|String} recognizer
	     * @returns {Manager}
	     */
	    remove: function(recognizer) {
	        if (invokeArrayArg(recognizer, 'remove', this)) {
	            return this;
	        }

	        recognizer = this.get(recognizer);

	        // let's make sure this recognizer exists
	        if (recognizer) {
	            var recognizers = this.recognizers;
	            var index = inArray(recognizers, recognizer);

	            if (index !== -1) {
	                recognizers.splice(index, 1);
	                this.touchAction.update();
	            }
	        }

	        return this;
	    },

	    /**
	     * bind event
	     * @param {String} events
	     * @param {Function} handler
	     * @returns {EventEmitter} this
	     */
	    on: function(events, handler) {
	        if (events === undefined) {
	            return;
	        }
	        if (handler === undefined) {
	            return;
	        }

	        var handlers = this.handlers;
	        each(splitStr(events), function(event) {
	            handlers[event] = handlers[event] || [];
	            handlers[event].push(handler);
	        });
	        return this;
	    },

	    /**
	     * unbind event, leave emit blank to remove all handlers
	     * @param {String} events
	     * @param {Function} [handler]
	     * @returns {EventEmitter} this
	     */
	    off: function(events, handler) {
	        if (events === undefined) {
	            return;
	        }

	        var handlers = this.handlers;
	        each(splitStr(events), function(event) {
	            if (!handler) {
	                delete handlers[event];
	            } else {
	                handlers[event] && handlers[event].splice(inArray(handlers[event], handler), 1);
	            }
	        });
	        return this;
	    },

	    /**
	     * emit event to the listeners
	     * @param {String} event
	     * @param {Object} data
	     */
	    emit: function(event, data) {
	        // we also want to trigger dom events
	        if (this.options.domEvents) {
	            triggerDomEvent(event, data);
	        }

	        // no handlers, so skip it all
	        var handlers = this.handlers[event] && this.handlers[event].slice();
	        if (!handlers || !handlers.length) {
	            return;
	        }

	        data.type = event;
	        data.preventDefault = function() {
	            data.srcEvent.preventDefault();
	        };

	        var i = 0;
	        while (i < handlers.length) {
	            handlers[i](data);
	            i++;
	        }
	    },

	    /**
	     * destroy the manager and unbinds all events
	     * it doesn't unbind dom events, that is the user own responsibility
	     */
	    destroy: function() {
	        this.element && toggleCssProps(this, false);

	        this.handlers = {};
	        this.session = {};
	        this.input.destroy();
	        this.element = null;
	    }
	};

	/**
	 * add/remove the css properties as defined in manager.options.cssProps
	 * @param {Manager} manager
	 * @param {Boolean} add
	 */
	function toggleCssProps(manager, add) {
	    var element = manager.element;
	    if (!element.style) {
	        return;
	    }
	    var prop;
	    each(manager.options.cssProps, function(value, name) {
	        prop = prefixed(element.style, name);
	        if (add) {
	            manager.oldCssProps[prop] = element.style[prop];
	            element.style[prop] = value;
	        } else {
	            element.style[prop] = manager.oldCssProps[prop] || '';
	        }
	    });
	    if (!add) {
	        manager.oldCssProps = {};
	    }
	}

	/**
	 * trigger dom event
	 * @param {String} event
	 * @param {Object} data
	 */
	function triggerDomEvent(event, data) {
	    var gestureEvent = document.createEvent('Event');
	    gestureEvent.initEvent(event, true, true);
	    gestureEvent.gesture = data;
	    data.target.dispatchEvent(gestureEvent);
	}

	assign(Hammer, {
	    INPUT_START: INPUT_START,
	    INPUT_MOVE: INPUT_MOVE,
	    INPUT_END: INPUT_END,
	    INPUT_CANCEL: INPUT_CANCEL,

	    STATE_POSSIBLE: STATE_POSSIBLE,
	    STATE_BEGAN: STATE_BEGAN,
	    STATE_CHANGED: STATE_CHANGED,
	    STATE_ENDED: STATE_ENDED,
	    STATE_RECOGNIZED: STATE_RECOGNIZED,
	    STATE_CANCELLED: STATE_CANCELLED,
	    STATE_FAILED: STATE_FAILED,

	    DIRECTION_NONE: DIRECTION_NONE,
	    DIRECTION_LEFT: DIRECTION_LEFT,
	    DIRECTION_RIGHT: DIRECTION_RIGHT,
	    DIRECTION_UP: DIRECTION_UP,
	    DIRECTION_DOWN: DIRECTION_DOWN,
	    DIRECTION_HORIZONTAL: DIRECTION_HORIZONTAL,
	    DIRECTION_VERTICAL: DIRECTION_VERTICAL,
	    DIRECTION_ALL: DIRECTION_ALL,

	    Manager: Manager,
	    Input: Input,
	    TouchAction: TouchAction,

	    TouchInput: TouchInput,
	    MouseInput: MouseInput,
	    PointerEventInput: PointerEventInput,
	    TouchMouseInput: TouchMouseInput,
	    SingleTouchInput: SingleTouchInput,

	    Recognizer: Recognizer,
	    AttrRecognizer: AttrRecognizer,
	    Tap: TapRecognizer,
	    Pan: PanRecognizer,
	    Swipe: SwipeRecognizer,
	    Pinch: PinchRecognizer,
	    Rotate: RotateRecognizer,
	    Press: PressRecognizer,

	    on: addEventListeners,
	    off: removeEventListeners,
	    each: each,
	    merge: merge,
	    extend: extend,
	    assign: assign,
	    inherit: inherit,
	    bindFn: bindFn,
	    prefixed: prefixed
	});

	// this prevents errors when Hammer is loaded in the presence of an AMD
	//  style loader but by script tag, not by the loader.
	var freeGlobal = (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : {})); // jshint ignore:line
	freeGlobal.Hammer = Hammer;

	if (true) {
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	        return Hammer;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (typeof module != 'undefined' && module.exports) {
	    module.exports = Hammer;
	} else {
	    window[exportName] = Hammer;
	}

	})(window, document, 'Hammer');


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var ship_1 = __webpack_require__(5);
	var alien_1 = __webpack_require__(16);
	var explosion_1 = __webpack_require__(17);
	var shockwave_1 = __webpack_require__(18);
	var flash_1 = __webpack_require__(29);
	var rocks_1 = __webpack_require__(19);
	var scoreMarker_1 = __webpack_require__(20);
	var vector_1 = __webpack_require__(11);
	var util_1 = __webpack_require__(15);
	var screen_1 = __webpack_require__(6);
	var sounds_1 = __webpack_require__(13);
	var EXTRA_LIFE = 10000;
	var World = (function () {
	    function World(highscore) {
	        this.level = 7;
	        this.extraLifeScore = 0;
	        this.score = 0;
	        this.lives = 3;
	        this.shipBullets = [];
	        this.alienBullets = [];
	        this.shockwaves = [];
	        this.rocks = [];
	        this.scenery = [];
	        this.shipTimer = 0;
	        this.alienTimer = 0;
	        this.levelTimer = 0;
	        this.gameOverTimer = 0;
	        this.gameOver = false;
	        this.started = false;
	        this.paused = false;
	        this.highscore = highscore;
	    }
	    Object.defineProperty(World.prototype, "objects", {
	        get: function () {
	            return [this.ship, this.alien].concat(this.shipBullets, this.alienBullets, this.rocks, this.shockwaves, this.scenery);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    World.prototype.update = function (dt) {
	        this.objects.forEach(function (obj) {
	            if (obj) {
	                obj.update(dt);
	            }
	        });
	    };
	    World.prototype.render = function (delta) {
	        this.objects.forEach(function (obj) {
	            if (obj) {
	                obj.render(delta);
	            }
	        });
	    };
	    World.prototype.startLevel = function () {
	        this.level++;
	        this.levelTimer = 0;
	        if (!this.alienTimer) {
	            this.alienTimer = util_1.random(10, 15);
	        }
	        this.scenery.length = 0;
	        this.shipBullets.forEach(function (bullet) { return bullet.destroy(); });
	        this.addRocks();
	    };
	    World.prototype.addRocks = function () {
	        var count = Math.min(this.level + 3, 10);
	        var speed = 150;
	        var offset = 20;
	        for (var i = 0; i < count; i++) {
	            var zone = util_1.random(1, 4);
	            var v = new vector_1.Vector(util_1.random(1, 360));
	            var x = void 0;
	            var y = void 0;
	            switch (zone) {
	                case 1:
	                    x = util_1.random(offset, screen_1.default.width - offset);
	                    y = util_1.random(offset, offset * 2);
	                    break;
	                case 2:
	                    x = util_1.random(screen_1.default.width - (offset * 2), screen_1.default.width - offset);
	                    y = util_1.random(screen_1.default.height - offset, screen_1.default.height - offset);
	                    break;
	                case 3:
	                    x = util_1.random(offset, screen_1.default.width - offset);
	                    y = util_1.random(screen_1.default.height - offset, screen_1.default.height - offset);
	                    break;
	                default:
	                    x = util_1.random(offset, offset * 2);
	                    y = util_1.random(screen_1.default.height - offset, screen_1.default.height - offset);
	                    break;
	            }
	            var rock = new rocks_1.Rock(x, y, v, rocks_1.RockSize.Large, speed);
	            this.rocks.push(rock);
	        }
	    };
	    World.prototype.addShip = function (x, y) {
	        var _this = this;
	        this.ship = new ship_1.Ship(x, y);
	        this.ship.on('fire', function (ship, bullet) {
	            bullet.on('expired', function () {
	                _this.shipBullets = _this.shipBullets.filter(function (x) { return x !== bullet; });
	            });
	            _this.shipBullets.push(bullet);
	        });
	        this.ship.on('expired', function () {
	            _this.lives--;
	            _this.ship = null;
	            _this.shipBullets.length = 0;
	        });
	    };
	    World.prototype.createExplosion = function (obj, size, multiplier) {
	        var _this = this;
	        if (size === void 0) { size = 100; }
	        if (multiplier === void 0) { multiplier = 1; }
	        if (!obj) {
	            return;
	        }
	        var explosion = new explosion_1.Explosion(obj.origin.x, obj.origin.y, size);
	        this.addScenery(explosion);
	        var shockwave = new shockwave_1.Shockwave(obj.origin.x, obj.origin.y, obj.vx, obj.vy, size, multiplier);
	        shockwave.on('expired', function () {
	            _this.shockwaves = _this.shockwaves.filter(function (x) { return x !== shockwave; });
	        });
	        this.shockwaves.push(shockwave);
	        return {
	            explosion: explosion,
	            shockwave: shockwave
	        };
	    };
	    World.prototype.shipDestroyed = function () {
	        sounds_1.largeExplosion.play();
	        this.createExplosion(this.ship);
	        this.addFlash(5);
	        this.ship.destroy();
	    };
	    World.prototype.alienDestroyed = function () {
	        if (this.alien) {
	            this.addFlash(5);
	            this.createExplosion(this.alien);
	            this.alien.destroy();
	        }
	    };
	    World.prototype.addFlash = function (frames) {
	        var flash = new flash_1.Flash(frames);
	        this.addScenery(flash);
	    };
	    World.prototype.addScenery = function (obj) {
	        var _this = this;
	        obj.on('expired', function () {
	            _this.scenery = _this.scenery.filter(function (x) { return x !== obj; });
	        });
	        this.scenery.push(obj);
	    };
	    World.prototype.rockDestroyed = function (rock, multiplier) {
	        if (multiplier === void 0) { multiplier = 1; }
	        var boom = this.createExplosion(rock, rock.size * 5, multiplier);
	        var debris = rock.split();
	        this.rocks = this.rocks.filter(function (x) { return x !== rock; });
	        this.shockwaves.forEach(function (shockwave) {
	            shockwave.rocks = shockwave.rocks.filter(function (x) { return x !== rock; });
	        });
	        (_a = this.rocks).push.apply(_a, debris);
	        boom.shockwave.rocks = debris;
	        rock = null;
	        var _a;
	    };
	    World.prototype.addAlien = function () {
	        var _this = this;
	        var lvl = Math.min(this.level, 14);
	        var little = false;
	        var alienSound = sounds_1.largeAlien;
	        if (this.score >= 40000) {
	            little = true;
	        }
	        else {
	            switch (lvl) {
	                case 7:
	                    little = this.levelTimer > 60 && util_1.random(1, 3) === 2;
	                    break;
	                case 8:
	                    little = this.levelTimer > 30 && util_1.random(1, 10) % 2 === 0;
	                    break;
	                default:
	                    little = util_1.random(1, 10) <= lvl + 2;
	                    break;
	            }
	        }
	        if (little) {
	            alienSound = sounds_1.smallAlien;
	            this.alien = new alien_1.SmallAlien(this.ship);
	        }
	        else {
	            this.alien = new alien_1.BigAlien();
	        }
	        alienSound.play();
	        this.alien.on('expired', function () {
	            sounds_1.alienFire.stop();
	            alienSound.stop();
	            sounds_1.largeExplosion.play();
	            _this.alien = null;
	            _this.alienBullets.forEach(function (b) { return b.destroy(); });
	            _this.alienBullets.length = 0;
	        });
	        this.alien.on('fire', function (alien, bullet) {
	            sounds_1.alienFire.play();
	            bullet.on('expired', function () {
	                _this.alienBullets = _this.alienBullets.filter(function (x) { return x !== bullet; });
	            });
	            _this.alienBullets.push(bullet);
	        });
	    };
	    World.prototype.addScore = function (obj) {
	        this.score += obj.score;
	        this.extraLifeScore += obj.score;
	        if (this.score > this.highscore) {
	            this.highscore = this.score;
	        }
	        if (this.extraLifeScore >= EXTRA_LIFE) {
	            this.lives++;
	            this.extraLifeScore -= EXTRA_LIFE;
	            sounds_1.extraLife.play();
	        }
	        var marker = new scoreMarker_1.ScoreMarker(obj, "+" + obj.score);
	        this.addScenery(marker);
	    };
	    World.prototype.tryPlaceShip = function (dt) {
	        this.shipTimer += dt;
	        if (this.shipTimer <= 2) {
	            return;
	        }
	        var rect = screen_1.default.shipRect;
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
	    World.prototype.updateAlienTimer = function (dt) {
	        var level = Math.min(this.level, 7);
	        if (!this.alien) {
	            this.alienTimer -= dt;
	            if (this.alienTimer <= 0) {
	                this.addAlien();
	                this.alienTimer = util_1.random(10, 15);
	            }
	        }
	    };
	    World.prototype.shouldTryToPlaceShip = function () {
	        return !!this.shipTimer || (!this.ship && !!this.lives);
	    };
	    World.prototype.shouldCheckForNextLevel = function () {
	        return !this.rocks.length && !!this.lives;
	    };
	    World.prototype.shouldCheckCollisions = function () {
	        return !!this.ship || !!this.shipBullets.length;
	    };
	    return World;
	}());
	exports.World = World;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var screen_1 = __webpack_require__(6);
	var keys_1 = __webpack_require__(2);
	var object2d_1 = __webpack_require__(8);
	var vector_1 = __webpack_require__(11);
	var bullet_1 = __webpack_require__(12);
	var sounds_1 = __webpack_require__(13);
	var util_1 = __webpack_require__(15);
	var ACCELERATION = 0.1;
	var BULLET_SPEED = 1000 * screen_1.default.objectScale;
	var BULLET_TIME = .02;
	var FRICTION = 0.005;
	var ROTATION = 5;
	var MAX_ACCELERATION = 1100 * screen_1.default.objectScale;
	var MAX_BULLETS = 10;
	var VELOCITY = 150 * screen_1.default.objectScale;
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
	        this.draw(false);
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
	        _this.shield = 2;
	        _this.flame = new Flame(x, y);
	        _this.points = [
	            { x: 0, y: -15 },
	            { x: 10, y: 10 },
	            { x: 5, y: 5 },
	            { x: -5, y: 5 },
	            { x: -10, y: 10 }
	        ];
	        _this.angle = 270;
	        return _this;
	    }
	    Object.defineProperty(Ship.prototype, "pointInPolyCheck", {
	        get: function () {
	            return true;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Ship.prototype.render = function () {
	        this.draw();
	        if (this.moving && (Math.floor(Math.random() * 10) + 1) % 2 === 0) {
	            this.flame.draw(false);
	        }
	    };
	    Ship.prototype.update = function (dt) {
	        this.move(dt);
	        this.flame.move(dt);
	        if (keys_1.Key.isDown(keys_1.Key.THRUST)) {
	            this.moving = true;
	            this.thrust();
	        }
	        else {
	            this.moving = false;
	        }
	        if (keys_1.Key.isPressed(keys_1.Key.ROTATE_LEFT)) {
	            this.rotate(-1);
	        }
	        if (keys_1.Key.isDown(keys_1.Key.ROTATE_LEFT)) {
	            this.rotate(-ROTATION);
	        }
	        if (keys_1.Key.isPressed(keys_1.Key.ROTATE_RIGHT)) {
	            this.rotate(1);
	        }
	        if (keys_1.Key.isDown(keys_1.Key.ROTATE_RIGHT)) {
	            this.rotate(ROTATION);
	        }
	        if (keys_1.Key.isDown(keys_1.Key.FIRE)) {
	            this.fire();
	        }
	        if (keys_1.Key.isPressed(keys_1.Key.HYPERSPACE)) {
	            this.hyperspace();
	        }
	        if (this.bulletTimer >= 0) {
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
	        sounds_1.thrust.play();
	    };
	    Ship.prototype.fire = function () {
	        var _this = this;
	        if (this.bulletTimer <= 0 && this.bulletCount < MAX_BULLETS) {
	            sounds_1.fire.play();
	            this.bulletTimer = BULLET_TIME;
	            this.bulletCount++;
	            var v = new vector_1.Vector(this.angle);
	            var bullet = new bullet_1.Bullet(this.origin.x, this.origin.y, v, 1);
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
	            var kba = (this.angle + 180) % 360;
	            var kbv = new vector_1.Vector(kba, 3);
	            this.origin.x += kbv.x;
	            this.origin.y += kbv.y;
	            this.flame.origin.x += kbv.x;
	            this.flame.origin.y += kbv.y;
	            this.trigger('fire', bullet);
	        }
	    };
	    Ship.prototype.hyperspace = function () {
	        var x = util_1.random(40, screen_1.default.width - 40);
	        var y = util_1.random(40, screen_1.default.height - 40);
	        this.vx = 0;
	        this.vy = 0;
	        this.x = this.flame.x = x;
	        this.y = this.flame.y = y;
	        this.flame.vx = 0;
	        this.flame.vy = 0;
	    };
	    Ship.prototype.destroy = function () {
	        this.trigger('expired');
	    };
	    return Ship;
	}(object2d_1.Object2D));
	exports.Ship = Ship;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var draw_1 = __webpack_require__(7);
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
	        if (this.width >= 1280) {
	            this._fontXL = 60;
	            this._fontL = 30;
	            this._fontM = 24;
	            this._fontS = 12;
	            this._objectScale = 1;
	        }
	        else if (this.width >= 800) {
	            this._fontXL = 48;
	            this._fontL = 24;
	            this._fontM = 18;
	            this._fontS = 10;
	            this._objectScale = .75;
	        }
	        else {
	            this._fontXL = 36;
	            this._fontL = 12;
	            this._fontM = 10;
	            this._fontS = 6;
	            this._objectScale = .5;
	        }
	        var offRect = (120 * this._objectScale);
	        this._shipRect = {
	            x: this.width2 - offRect,
	            y: this.height2 - offRect,
	            width: offRect * 2,
	            height: offRect * 2
	        };
	    };
	    Object.defineProperty(Screen.prototype, "font", {
	        get: function () {
	            var self = this;
	            return {
	                get xlarge() {
	                    return self._fontXL;
	                },
	                get large() {
	                    return self._fontL;
	                },
	                get medium() {
	                    return self._fontM;
	                },
	                get small() {
	                    return self._fontS;
	                }
	            };
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Screen.prototype, "objectScale", {
	        get: function () {
	            return this._objectScale;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Screen.prototype, "shipRect", {
	        get: function () {
	            return this._shipRect;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Screen.prototype.preShake = function () {
	        this.ctx.save();
	        var dx = Math.random() * 10;
	        var dy = Math.random() * 10;
	        this.ctx.translate(dx, dy);
	    };
	    Screen.prototype.postShake = function () {
	        this.ctx.restore();
	    };
	    return Screen;
	}());
	exports.Screen = Screen;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = new Screen();


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var screen_1 = __webpack_require__(6);
	var ship_1 = __webpack_require__(5);
	var VectorLine = 'rgba(255,255,255,1)';
	var Y_START = 20;
	var DEFAULT_LINE_WIDTH = 2;
	var Draw = (function () {
	    function Draw(ctx) {
	        this.ctx = ctx;
	    }
	    Draw.prototype.line = function (p1, p2, color, width) {
	        if (color === void 0) { color = VectorLine; }
	        if (width === void 0) { width = DEFAULT_LINE_WIDTH; }
	        var ctx = this.ctx;
	        var old = ctx.strokeStyle;
	        ctx.beginPath();
	        ctx.strokeStyle = color;
	        ctx.lineWidth = width;
	        ctx.moveTo(p1.x, p1.y);
	        ctx.lineTo(p2.x, p2.y);
	        ctx.stroke();
	        ctx.closePath();
	        ctx.strokeStyle = old;
	    };
	    Draw.prototype.shape = function (points, x, y, color, closed) {
	        if (color === void 0) { color = VectorLine; }
	        if (closed === void 0) { closed = true; }
	        var p1, p2;
	        var l = points.length - 1;
	        var i = 0;
	        this.ctx.save();
	        for (var i_1 = 0; i_1 < l; i_1++) {
	            p1 = { x: x + points[i_1].x, y: y + points[i_1].y };
	            p2 = { x: x + points[i_1 + 1].x, y: y + points[i_1 + 1].y };
	            this.line(p1, p2, color);
	        }
	        if (closed) {
	            this.line({ x: x + points[l].x, y: y + points[l].y }, { x: x + points[0].x, y: y + points[0].y }, color);
	        }
	        this.ctx.restore();
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
	        var size = 4 * screen_1.default.objectScale;
	        this.rect(p, { x: size, y: size }, fillStyle);
	    };
	    Draw.prototype.background = function (color) {
	        if (color === void 0) { color = '#000000'; }
	        var ctx = this.ctx;
	        ctx.fillStyle = color;
	        ctx.fillRect(0, 0, screen_1.default.width, screen_1.default.height);
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
	    Draw.prototype.text = function (text, x, y, size, color) {
	        if (color === void 0) { color = VectorLine; }
	        var ctx = this.ctx;
	        ctx.save();
	        ctx.font = size + "pt hyperspace";
	        ctx.textBaseline = 'middle';
	        ctx.lineWidth = 1;
	        ctx.strokeStyle = color;
	        ctx.strokeText(text, x, y);
	        ctx.restore();
	    };
	    Draw.prototype.text2 = function (text, size, cb) {
	        var ctx = this.ctx;
	        ctx.save();
	        ctx.font = size + "pt hyperspace";
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
	        ctx.font = size + "pt hyperspace";
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
	        this.text(text, 100, Y_START, screen_1.default.font.medium);
	    };
	    Draw.prototype.highscore = function (score) {
	        var text = score.toString();
	        while (text.length < 2)
	            text = '0' + text;
	        this.text2(text, screen_1.default.font.small, function (width) {
	            return {
	                x: screen_1.default.width2 - (width / 2),
	                y: Y_START
	            };
	        });
	    };
	    Draw.prototype.oneCoinOnePlay = function () {
	        this.text2('1  coin  1  play', screen_1.default.font.medium, function (width) {
	            return {
	                x: screen_1.default.width2 - (width / 2),
	                y: (screen_1.default.height / 8) * 7
	            };
	        });
	    };
	    Draw.prototype.pushStart = function () {
	        screen_1.default.draw.text2('push start', screen_1.default.font.medium, function (width) {
	            return {
	                x: screen_1.default.width2 - (width / 2),
	                y: screen_1.default.height / 8
	            };
	        });
	    };
	    Draw.prototype.player1 = function () {
	        screen_1.default.draw.text2('player 1', screen_1.default.font.medium, function (width) {
	            return {
	                x: screen_1.default.width2 - (width / 2),
	                y: screen_1.default.height / 4.5
	            };
	        });
	    };
	    Draw.prototype.gameOver = function () {
	        screen_1.default.draw.text2('game over', screen_1.default.font.medium, function (width) {
	            return {
	                x: screen_1.default.width2 - (width / 2),
	                y: screen_1.default.height / 4.5
	            };
	        });
	    };
	    Draw.prototype.copyright = function () {
	        this.text2(String.fromCharCode(169) + ' 1979 atari inc', screen_1.default.font.small, function (width) {
	            return {
	                x: screen_1.default.width2 - (width / 2),
	                y: screen_1.default.height - screen_1.default.font.small
	            };
	        });
	    };
	    Draw.prototype.drawExtraLives = function (lives) {
	        lives = Math.min(lives, 10);
	        var life = new ship_1.Ship(0, 0);
	        var loc = (life.x + life.width) * 2;
	        var y = Y_START + screen_1.default.font.medium + 10;
	        for (var i = 0; i < lives; i++) {
	            life.origin.x = 80 + (i * loc);
	            life.origin.y = y;
	            life.render();
	        }
	    };
	    Draw.prototype.circle = function (x, y, radius, color) {
	        if (color === void 0) { color = VectorLine; }
	        var ctx = this.ctx;
	        ctx.beginPath();
	        ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
	        ctx.strokeStyle = color;
	        ctx.stroke();
	        ctx.closePath();
	    };
	    return Draw;
	}());
	exports.Draw = Draw;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var screen_1 = __webpack_require__(6);
	var events_1 = __webpack_require__(9);
	var lut_1 = __webpack_require__(10);
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
	        _this._score = 0;
	        _this.origin = { x: x, y: y };
	        return _this;
	    }
	    Object.defineProperty(Object2D.prototype, "score", {
	        get: function () {
	            return this._score;
	        },
	        set: function (value) {
	            this._score = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Object2D.prototype, "points", {
	        get: function () {
	            return this._points;
	        },
	        set: function (points) {
	            points.forEach(function (p) {
	                p.x *= screen_1.default.objectScale;
	                p.y *= screen_1.default.objectScale;
	            });
	            this._points = points;
	            this.calcBounds();
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Object2D.prototype, "pointInPolyCheck", {
	        get: function () {
	            return false;
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
	    Object2D.prototype.draw = function (closed) {
	        if (closed === void 0) { closed = true; }
	        screen_1.default.draw.shape(this.points, this.origin.x, this.origin.y, this.color, closed);
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
	    Object.defineProperty(Object2D.prototype, "vertices", {
	        get: function () {
	            var _this = this;
	            return this.points.map(function (p) {
	                return {
	                    x: _this.origin.x + p.x,
	                    y: _this.origin.y + p.y
	                };
	            });
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
/* 9 */
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
	for (var i = 0; i <= 360; i++) {
	    RAD[i] = i * r;
	    COS[i] = Math.cos(RAD[i]);
	    SIN[i] = Math.sin(RAD[i]);
	    RAD[-i] = -i * r;
	    COS[-i] = Math.cos(RAD[-i]);
	    SIN[-i] = Math.sin(RAD[-i]);
	}


/***/ },
/* 11 */
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
	    Vector.fromXY = function (p1, p2, velocity) {
	        if (velocity === void 0) { velocity = 1; }
	        var x = p1.x - p2.x;
	        var y = p1.y - p2.y;
	        var hyp = Math.sqrt(x * x + y * y);
	        x /= hyp;
	        y /= hyp;
	        var v = new Vector(0);
	        v.x = x * velocity;
	        v.y = y * velocity;
	        return v;
	    };
	    return Vector;
	}());
	exports.Vector = Vector;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var screen_1 = __webpack_require__(6);
	var object2d_1 = __webpack_require__(8);
	var Bullet = (function (_super) {
	    __extends(Bullet, _super);
	    function Bullet(x, y, v, life) {
	        if (life === void 0) { life = 1.25; }
	        var _this = _super.call(this, x, y) || this;
	        _this.life = life;
	        _this.frame = 0;
	        _this.vx = v.x;
	        _this.vy = v.y;
	        return _this;
	    }
	    Bullet.prototype.render = function () {
	        this.draw();
	    };
	    Bullet.prototype.update = function (dt) {
	        this.frame++;
	        this.move(dt);
	        this.life -= dt;
	        if (this.life <= 0) {
	            this.destroy();
	        }
	    };
	    Bullet.prototype.draw = function () {
	        var size = this.frame <= 1 ? 8 * screen_1.default.objectScale : 4 * screen_1.default.objectScale;
	        screen_1.default.draw.rect({ x: this.origin.x - (size / 2), y: this.origin.y }, { x: size, y: size });
	    };
	    Bullet.prototype.destroy = function () {
	        this.trigger('expired');
	    };
	    Object.defineProperty(Bullet.prototype, "vertices", {
	        get: function () {
	            return [this.origin];
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return Bullet;
	}(object2d_1.Object2D));
	exports.Bullet = Bullet;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var howler_1 = __webpack_require__(14);
	var VOLUME = .5;
	var soundOn = true;
	exports.all = [];
	function createSound(options) {
	    var count = 0;
	    var sound = new howler_1.Howl(options);
	    sound.on('end', function () {
	        if (options.max) {
	            count--;
	        }
	    });
	    var play = sound.play.bind(sound);
	    var canPlay = options.max ? count < options.max && soundOn : soundOn;
	    sound.play = function () {
	        if (soundOn) {
	            if (options.max) {
	                if (count < options.max) {
	                    play();
	                    count++;
	                }
	            }
	            else {
	                play();
	            }
	        }
	    };
	    sound._origVolume = options.volume;
	    exports.all.push(sound);
	    return sound;
	}
	exports.fire = createSound({
	    src: ['./assets/fire.wav'],
	    volume: .2
	});
	exports.thrust = createSound({
	    src: ['./assets/thrust.wav'],
	    volume: 0.3
	});
	exports.alienFire = createSound({
	    src: ['./assets/sfire.wav'],
	    volume: VOLUME
	});
	exports.largeExplosion = createSound({
	    src: ['./assets/explode1.wav'],
	    volume: VOLUME,
	    max: 2
	});
	exports.mediumExplosion = createSound({
	    src: ['./assets/explode2.wav'],
	    volume: VOLUME,
	    max: 2
	});
	exports.smallExplosion = createSound({
	    src: ['./assets/explode3.wav'],
	    volume: VOLUME,
	    max: 2
	});
	exports.largeAlien = createSound({
	    src: ['./assets/lsaucer.wav'],
	    volume: VOLUME,
	    loop: true
	});
	exports.smallAlien = createSound({
	    src: ['./assets/ssaucer.wav'],
	    volume: VOLUME,
	    loop: true
	});
	exports.thumpLo = createSound({
	    src: ['./assets/thumplo.wav'],
	    volume: .3
	});
	exports.thumpHi = createSound({
	    src: ['./assets/thumphi.wav'],
	    volume: .3
	});
	exports.extraLife = createSound({
	    src: ['./assets/life.wav'],
	    volume: .5
	});
	exports.Sound = {
	    on: function () {
	        soundOn = true;
	        exports.all.forEach(function (sound) { return sound.volume(sound._origVolume); });
	    },
	    off: function () {
	        soundOn = false;
	        exports.all.forEach(function (sound) { return sound.volume(0); });
	    },
	    stop: function () {
	        exports.all.forEach(function (sound) { return sound.stop(); });
	    }
	};


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(global) {/*!
	 *  howler.js v2.0.2
	 *  howlerjs.com
	 *
	 *  (c) 2013-2016, James Simpson of GoldFire Studios
	 *  goldfirestudios.com
	 *
	 *  MIT License
	 */

	(function() {

	  'use strict';

	  /** Global Methods **/
	  /***************************************************************************/

	  /**
	   * Create the global controller. All contained methods and properties apply
	   * to all sounds that are currently playing or will be in the future.
	   */
	  var HowlerGlobal = function() {
	    this.init();
	  };
	  HowlerGlobal.prototype = {
	    /**
	     * Initialize the global Howler object.
	     * @return {Howler}
	     */
	    init: function() {
	      var self = this || Howler;

	      // Internal properties.
	      self._codecs = {};
	      self._howls = [];
	      self._muted = false;
	      self._volume = 1;
	      self._canPlayEvent = 'canplaythrough';
	      self._navigator = (typeof window !== 'undefined' && window.navigator) ? window.navigator : null;

	      // Public properties.
	      self.masterGain = null;
	      self.noAudio = false;
	      self.usingWebAudio = true;
	      self.autoSuspend = true;
	      self.ctx = null;

	      // Set to false to disable the auto iOS enabler.
	      self.mobileAutoEnable = true;

	      // Setup the various state values for global tracking.
	      self._setup();

	      return self;
	    },

	    /**
	     * Get/set the global volume for all sounds.
	     * @param  {Float} vol Volume from 0.0 to 1.0.
	     * @return {Howler/Float}     Returns self or current volume.
	     */
	    volume: function(vol) {
	      var self = this || Howler;
	      vol = parseFloat(vol);

	      // If we don't have an AudioContext created yet, run the setup.
	      if (!self.ctx) {
	        setupAudioContext();
	      }

	      if (typeof vol !== 'undefined' && vol >= 0 && vol <= 1) {
	        self._volume = vol;

	        // Don't update any of the nodes if we are muted.
	        if (self._muted) {
	          return self;
	        }

	        // When using Web Audio, we just need to adjust the master gain.
	        if (self.usingWebAudio) {
	          self.masterGain.gain.value = vol;
	        }

	        // Loop through and change volume for all HTML5 audio nodes.
	        for (var i=0; i<self._howls.length; i++) {
	          if (!self._howls[i]._webAudio) {
	            // Get all of the sounds in this Howl group.
	            var ids = self._howls[i]._getSoundIds();

	            // Loop through all sounds and change the volumes.
	            for (var j=0; j<ids.length; j++) {
	              var sound = self._howls[i]._soundById(ids[j]);

	              if (sound && sound._node) {
	                sound._node.volume = sound._volume * vol;
	              }
	            }
	          }
	        }

	        return self;
	      }

	      return self._volume;
	    },

	    /**
	     * Handle muting and unmuting globally.
	     * @param  {Boolean} muted Is muted or not.
	     */
	    mute: function(muted) {
	      var self = this || Howler;

	      // If we don't have an AudioContext created yet, run the setup.
	      if (!self.ctx) {
	        setupAudioContext();
	      }

	      self._muted = muted;

	      // With Web Audio, we just need to mute the master gain.
	      if (self.usingWebAudio) {
	        self.masterGain.gain.value = muted ? 0 : self._volume;
	      }

	      // Loop through and mute all HTML5 Audio nodes.
	      for (var i=0; i<self._howls.length; i++) {
	        if (!self._howls[i]._webAudio) {
	          // Get all of the sounds in this Howl group.
	          var ids = self._howls[i]._getSoundIds();

	          // Loop through all sounds and mark the audio node as muted.
	          for (var j=0; j<ids.length; j++) {
	            var sound = self._howls[i]._soundById(ids[j]);

	            if (sound && sound._node) {
	              sound._node.muted = (muted) ? true : sound._muted;
	            }
	          }
	        }
	      }

	      return self;
	    },

	    /**
	     * Unload and destroy all currently loaded Howl objects.
	     * @return {Howler}
	     */
	    unload: function() {
	      var self = this || Howler;

	      for (var i=self._howls.length-1; i>=0; i--) {
	        self._howls[i].unload();
	      }

	      // Create a new AudioContext to make sure it is fully reset.
	      if (self.usingWebAudio && self.ctx && typeof self.ctx.close !== 'undefined') {
	        self.ctx.close();
	        self.ctx = null;
	        setupAudioContext();
	      }

	      return self;
	    },

	    /**
	     * Check for codec support of specific extension.
	     * @param  {String} ext Audio file extention.
	     * @return {Boolean}
	     */
	    codecs: function(ext) {
	      return (this || Howler)._codecs[ext.replace(/^x-/, '')];
	    },

	    /**
	     * Setup various state values for global tracking.
	     * @return {Howler}
	     */
	    _setup: function() {
	      var self = this || Howler;

	      // Keeps track of the suspend/resume state of the AudioContext.
	      self.state = self.ctx ? self.ctx.state || 'running' : 'running';

	      // Automatically begin the 30-second suspend process
	      self._autoSuspend();

	      // Check if audio is available.
	      if (!self.usingWebAudio) {
	        // No audio is available on this system if noAudio is set to true.
	        if (typeof Audio !== 'undefined') {
	          try {
	            var test = new Audio();

	            // Check if the canplaythrough event is available.
	            if (typeof test.oncanplaythrough === 'undefined') {
	              self._canPlayEvent = 'canplay';
	            }
	          } catch(e) {
	            self.noAudio = true;
	          }
	        } else {
	          self.noAudio = true;
	        }
	      }

	      // Test to make sure audio isn't disabled in Internet Explorer.
	      try {
	        var test = new Audio();
	        if (test.muted) {
	          self.noAudio = true;
	        }
	      } catch (e) {}

	      // Check for supported codecs.
	      if (!self.noAudio) {
	        self._setupCodecs();
	      }

	      return self;
	    },

	    /**
	     * Check for browser support for various codecs and cache the results.
	     * @return {Howler}
	     */
	    _setupCodecs: function() {
	      var self = this || Howler;
	      var audioTest = null;

	      // Must wrap in a try/catch because IE11 in server mode throws an error.
	      try {
	        audioTest = (typeof Audio !== 'undefined') ? new Audio() : null;
	      } catch (err) {
	        return self;
	      }

	      if (!audioTest || typeof audioTest.canPlayType !== 'function') {
	        return self;
	      }

	      var mpegTest = audioTest.canPlayType('audio/mpeg;').replace(/^no$/, '');

	      // Opera version <33 has mixed MP3 support, so we need to check for and block it.
	      var checkOpera = self._navigator && self._navigator.userAgent.match(/OPR\/([0-6].)/g);
	      var isOldOpera = (checkOpera && parseInt(checkOpera[0].split('/')[1], 10) < 33);

	      self._codecs = {
	        mp3: !!(!isOldOpera && (mpegTest || audioTest.canPlayType('audio/mp3;').replace(/^no$/, ''))),
	        mpeg: !!mpegTest,
	        opus: !!audioTest.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, ''),
	        ogg: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ''),
	        oga: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ''),
	        wav: !!audioTest.canPlayType('audio/wav; codecs="1"').replace(/^no$/, ''),
	        aac: !!audioTest.canPlayType('audio/aac;').replace(/^no$/, ''),
	        caf: !!audioTest.canPlayType('audio/x-caf;').replace(/^no$/, ''),
	        m4a: !!(audioTest.canPlayType('audio/x-m4a;') || audioTest.canPlayType('audio/m4a;') || audioTest.canPlayType('audio/aac;')).replace(/^no$/, ''),
	        mp4: !!(audioTest.canPlayType('audio/x-mp4;') || audioTest.canPlayType('audio/mp4;') || audioTest.canPlayType('audio/aac;')).replace(/^no$/, ''),
	        weba: !!audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, ''),
	        webm: !!audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, ''),
	        dolby: !!audioTest.canPlayType('audio/mp4; codecs="ec-3"').replace(/^no$/, ''),
	        flac: !!(audioTest.canPlayType('audio/x-flac;') || audioTest.canPlayType('audio/flac;')).replace(/^no$/, '')
	      };

	      return self;
	    },

	    /**
	     * Mobile browsers will only allow audio to be played after a user interaction.
	     * Attempt to automatically unlock audio on the first user interaction.
	     * Concept from: http://paulbakaus.com/tutorials/html5/web-audio-on-ios/
	     * @return {Howler}
	     */
	    _enableMobileAudio: function() {
	      var self = this || Howler;

	      // Only run this on mobile devices if audio isn't already eanbled.
	      var isMobile = /iPhone|iPad|iPod|Android|BlackBerry|BB10|Silk|Mobi/i.test(self._navigator && self._navigator.userAgent);
	      var isTouch = !!(('ontouchend' in window) || (self._navigator && self._navigator.maxTouchPoints > 0) || (self._navigator && self._navigator.msMaxTouchPoints > 0));
	      if (self._mobileEnabled || !self.ctx || (!isMobile && !isTouch)) {
	        return;
	      }

	      self._mobileEnabled = false;

	      // Some mobile devices/platforms have distortion issues when opening/closing tabs and/or web views.
	      // Bugs in the browser (especially Mobile Safari) can cause the sampleRate to change from 44100 to 48000.
	      // By calling Howler.unload(), we create a new AudioContext with the correct sampleRate.
	      if (!self._mobileUnloaded && self.ctx.sampleRate !== 44100) {
	        self._mobileUnloaded = true;
	        self.unload();
	      }

	      // Scratch buffer for enabling iOS to dispose of web audio buffers correctly, as per:
	      // http://stackoverflow.com/questions/24119684
	      self._scratchBuffer = self.ctx.createBuffer(1, 1, 22050);

	      // Call this method on touch start to create and play a buffer,
	      // then check if the audio actually played to determine if
	      // audio has now been unlocked on iOS, Android, etc.
	      var unlock = function() {
	        // Create an empty buffer.
	        var source = self.ctx.createBufferSource();
	        source.buffer = self._scratchBuffer;
	        source.connect(self.ctx.destination);

	        // Play the empty buffer.
	        if (typeof source.start === 'undefined') {
	          source.noteOn(0);
	        } else {
	          source.start(0);
	        }

	        // Setup a timeout to check that we are unlocked on the next event loop.
	        source.onended = function() {
	          source.disconnect(0);

	          // Update the unlocked state and prevent this check from happening again.
	          self._mobileEnabled = true;
	          self.mobileAutoEnable = false;

	          // Remove the touch start listener.
	          document.removeEventListener('touchend', unlock, true);
	        };
	      };

	      // Setup a touch start listener to attempt an unlock in.
	      document.addEventListener('touchend', unlock, true);

	      return self;
	    },

	    /**
	     * Automatically suspend the Web Audio AudioContext after no sound has played for 30 seconds.
	     * This saves processing/energy and fixes various browser-specific bugs with audio getting stuck.
	     * @return {Howler}
	     */
	    _autoSuspend: function() {
	      var self = this;

	      if (!self.autoSuspend || !self.ctx || typeof self.ctx.suspend === 'undefined' || !Howler.usingWebAudio) {
	        return;
	      }

	      // Check if any sounds are playing.
	      for (var i=0; i<self._howls.length; i++) {
	        if (self._howls[i]._webAudio) {
	          for (var j=0; j<self._howls[i]._sounds.length; j++) {
	            if (!self._howls[i]._sounds[j]._paused) {
	              return self;
	            }
	          }
	        }
	      }

	      if (self._suspendTimer) {
	        clearTimeout(self._suspendTimer);
	      }

	      // If no sound has played after 30 seconds, suspend the context.
	      self._suspendTimer = setTimeout(function() {
	        if (!self.autoSuspend) {
	          return;
	        }

	        self._suspendTimer = null;
	        self.state = 'suspending';
	        self.ctx.suspend().then(function() {
	          self.state = 'suspended';

	          if (self._resumeAfterSuspend) {
	            delete self._resumeAfterSuspend;
	            self._autoResume();
	          }
	        });
	      }, 30000);

	      return self;
	    },

	    /**
	     * Automatically resume the Web Audio AudioContext when a new sound is played.
	     * @return {Howler}
	     */
	    _autoResume: function() {
	      var self = this;

	      if (!self.ctx || typeof self.ctx.resume === 'undefined' || !Howler.usingWebAudio) {
	        return;
	      }

	      if (self.state === 'running' && self._suspendTimer) {
	        clearTimeout(self._suspendTimer);
	        self._suspendTimer = null;
	      } else if (self.state === 'suspended') {
	        self.state = 'resuming';
	        self.ctx.resume().then(function() {
	          self.state = 'running';

	          // Emit to all Howls that the audio has resumed.
	          for (var i=0; i<self._howls.length; i++) {
	            self._howls[i]._emit('resume');
	          }
	        });

	        if (self._suspendTimer) {
	          clearTimeout(self._suspendTimer);
	          self._suspendTimer = null;
	        }
	      } else if (self.state === 'suspending') {
	        self._resumeAfterSuspend = true;
	      }

	      return self;
	    }
	  };

	  // Setup the global audio controller.
	  var Howler = new HowlerGlobal();

	  /** Group Methods **/
	  /***************************************************************************/

	  /**
	   * Create an audio group controller.
	   * @param {Object} o Passed in properties for this group.
	   */
	  var Howl = function(o) {
	    var self = this;

	    // Throw an error if no source is provided.
	    if (!o.src || o.src.length === 0) {
	      console.error('An array of source files must be passed with any new Howl.');
	      return;
	    }

	    self.init(o);
	  };
	  Howl.prototype = {
	    /**
	     * Initialize a new Howl group object.
	     * @param  {Object} o Passed in properties for this group.
	     * @return {Howl}
	     */
	    init: function(o) {
	      var self = this;

	      // If we don't have an AudioContext created yet, run the setup.
	      if (!Howler.ctx) {
	        setupAudioContext();
	      }

	      // Setup user-defined default properties.
	      self._autoplay = o.autoplay || false;
	      self._format = (typeof o.format !== 'string') ? o.format : [o.format];
	      self._html5 = o.html5 || false;
	      self._muted = o.mute || false;
	      self._loop = o.loop || false;
	      self._pool = o.pool || 5;
	      self._preload = (typeof o.preload === 'boolean') ? o.preload : true;
	      self._rate = o.rate || 1;
	      self._sprite = o.sprite || {};
	      self._src = (typeof o.src !== 'string') ? o.src : [o.src];
	      self._volume = o.volume !== undefined ? o.volume : 1;

	      // Setup all other default properties.
	      self._duration = 0;
	      self._state = 'unloaded';
	      self._sounds = [];
	      self._endTimers = {};
	      self._queue = [];

	      // Setup event listeners.
	      self._onend = o.onend ? [{fn: o.onend}] : [];
	      self._onfade = o.onfade ? [{fn: o.onfade}] : [];
	      self._onload = o.onload ? [{fn: o.onload}] : [];
	      self._onloaderror = o.onloaderror ? [{fn: o.onloaderror}] : [];
	      self._onpause = o.onpause ? [{fn: o.onpause}] : [];
	      self._onplay = o.onplay ? [{fn: o.onplay}] : [];
	      self._onstop = o.onstop ? [{fn: o.onstop}] : [];
	      self._onmute = o.onmute ? [{fn: o.onmute}] : [];
	      self._onvolume = o.onvolume ? [{fn: o.onvolume}] : [];
	      self._onrate = o.onrate ? [{fn: o.onrate}] : [];
	      self._onseek = o.onseek ? [{fn: o.onseek}] : [];
	      self._onresume = [];

	      // Web Audio or HTML5 Audio?
	      self._webAudio = Howler.usingWebAudio && !self._html5;

	      // Automatically try to enable audio on iOS.
	      if (typeof Howler.ctx !== 'undefined' && Howler.ctx && Howler.mobileAutoEnable) {
	        Howler._enableMobileAudio();
	      }

	      // Keep track of this Howl group in the global controller.
	      Howler._howls.push(self);

	      // If they selected autoplay, add a play event to the load queue.
	      if (self._autoplay) {
	        self._queue.push({
	          event: 'play',
	          action: function() {
	            self.play();
	          }
	        });
	      }

	      // Load the source file unless otherwise specified.
	      if (self._preload) {
	        self.load();
	      }

	      return self;
	    },

	    /**
	     * Load the audio file.
	     * @return {Howler}
	     */
	    load: function() {
	      var self = this;
	      var url = null;

	      // If no audio is available, quit immediately.
	      if (Howler.noAudio) {
	        self._emit('loaderror', null, 'No audio support.');
	        return;
	      }

	      // Make sure our source is in an array.
	      if (typeof self._src === 'string') {
	        self._src = [self._src];
	      }

	      // Loop through the sources and pick the first one that is compatible.
	      for (var i=0; i<self._src.length; i++) {
	        var ext, str;

	        if (self._format && self._format[i]) {
	          // If an extension was specified, use that instead.
	          ext = self._format[i];
	        } else {
	          // Make sure the source is a string.
	          str = self._src[i];
	          if (typeof str !== 'string') {
	            self._emit('loaderror', null, 'Non-string found in selected audio sources - ignoring.');
	            continue;
	          }

	          // Extract the file extension from the URL or base64 data URI.
	          ext = /^data:audio\/([^;,]+);/i.exec(str);
	          if (!ext) {
	            ext = /\.([^.]+)$/.exec(str.split('?', 1)[0]);
	          }

	          if (ext) {
	            ext = ext[1].toLowerCase();
	          }
	        }

	        // Check if this extension is available.
	        if (Howler.codecs(ext)) {
	          url = self._src[i];
	          break;
	        }
	      }

	      if (!url) {
	        self._emit('loaderror', null, 'No codec support for selected audio sources.');
	        return;
	      }

	      self._src = url;
	      self._state = 'loading';

	      // If the hosting page is HTTPS and the source isn't,
	      // drop down to HTML5 Audio to avoid Mixed Content errors.
	      if (window.location.protocol === 'https:' && url.slice(0, 5) === 'http:') {
	        self._html5 = true;
	        self._webAudio = false;
	      }

	      // Create a new sound object and add it to the pool.
	      new Sound(self);

	      // Load and decode the audio data for playback.
	      if (self._webAudio) {
	        loadBuffer(self);
	      }

	      return self;
	    },

	    /**
	     * Play a sound or resume previous playback.
	     * @param  {String/Number} sprite   Sprite name for sprite playback or sound id to continue previous.
	     * @param  {Boolean} internal Internal Use: true prevents event firing.
	     * @return {Number}          Sound ID.
	     */
	    play: function(sprite, internal) {
	      var self = this;
	      var id = null;

	      // Determine if a sprite, sound id or nothing was passed
	      if (typeof sprite === 'number') {
	        id = sprite;
	        sprite = null;
	      } else if (typeof sprite === 'string' && self._state === 'loaded' && !self._sprite[sprite]) {
	        // If the passed sprite doesn't exist, do nothing.
	        return null;
	      } else if (typeof sprite === 'undefined') {
	        // Use the default sound sprite (plays the full audio length).
	        sprite = '__default';

	        // Check if there is a single paused sound that isn't ended.
	        // If there is, play that sound. If not, continue as usual.
	        var num = 0;
	        for (var i=0; i<self._sounds.length; i++) {
	          if (self._sounds[i]._paused && !self._sounds[i]._ended) {
	            num++;
	            id = self._sounds[i]._id;
	          }
	        }

	        if (num === 1) {
	          sprite = null;
	        } else {
	          id = null;
	        }
	      }

	      // Get the selected node, or get one from the pool.
	      var sound = id ? self._soundById(id) : self._inactiveSound();

	      // If the sound doesn't exist, do nothing.
	      if (!sound) {
	        return null;
	      }

	      // Select the sprite definition.
	      if (id && !sprite) {
	        sprite = sound._sprite || '__default';
	      }

	      // If we have no sprite and the sound hasn't loaded, we must wait
	      // for the sound to load to get our audio's duration.
	      if (self._state !== 'loaded' && !self._sprite[sprite]) {
	        self._queue.push({
	          event: 'play',
	          action: function() {
	            self.play(self._soundById(sound._id) ? sound._id : undefined);
	          }
	        });

	        return sound._id;
	      }

	      // Don't play the sound if an id was passed and it is already playing.
	      if (id && !sound._paused) {
	        // Trigger the play event, in order to keep iterating through queue.
	        if (!internal) {
	          setTimeout(function() {
	            self._emit('play', sound._id);
	          }, 0);
	        }

	        return sound._id;
	      }

	      // Make sure the AudioContext isn't suspended, and resume it if it is.
	      if (self._webAudio) {
	        Howler._autoResume();
	      }

	      // Determine how long to play for and where to start playing.
	      var seek = Math.max(0, sound._seek > 0 ? sound._seek : self._sprite[sprite][0] / 1000);
	      var duration = Math.max(0, ((self._sprite[sprite][0] + self._sprite[sprite][1]) / 1000) - seek);
	      var timeout = (duration * 1000) / Math.abs(sound._rate);

	      // Update the parameters of the sound
	      sound._paused = false;
	      sound._ended = false;
	      sound._sprite = sprite;
	      sound._seek = seek;
	      sound._start = self._sprite[sprite][0] / 1000;
	      sound._stop = (self._sprite[sprite][0] + self._sprite[sprite][1]) / 1000;
	      sound._loop = !!(sound._loop || self._sprite[sprite][2]);

	      // Begin the actual playback.
	      var node = sound._node;
	      if (self._webAudio) {
	        // Fire this when the sound is ready to play to begin Web Audio playback.
	        var playWebAudio = function() {
	          self._refreshBuffer(sound);

	          // Setup the playback params.
	          var vol = (sound._muted || self._muted) ? 0 : sound._volume;
	          node.gain.setValueAtTime(vol, Howler.ctx.currentTime);
	          sound._playStart = Howler.ctx.currentTime;

	          // Play the sound using the supported method.
	          if (typeof node.bufferSource.start === 'undefined') {
	            sound._loop ? node.bufferSource.noteGrainOn(0, seek, 86400) : node.bufferSource.noteGrainOn(0, seek, duration);
	          } else {
	            sound._loop ? node.bufferSource.start(0, seek, 86400) : node.bufferSource.start(0, seek, duration);
	          }

	          // Start a new timer if none is present.
	          if (timeout !== Infinity) {
	            self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
	          }

	          if (!internal) {
	            setTimeout(function() {
	              self._emit('play', sound._id);
	            }, 0);
	          }
	        };

	        var isRunning = (Howler.state === 'running');
	        if (self._state === 'loaded' && isRunning) {
	          playWebAudio();
	        } else {
	          // Wait for the audio to load and then begin playback.
	          self.once(isRunning ? 'load' : 'resume', playWebAudio, isRunning ? sound._id : null);

	          // Cancel the end timer.
	          self._clearTimer(sound._id);
	        }
	      } else {
	        // Fire this when the sound is ready to play to begin HTML5 Audio playback.
	        var playHtml5 = function() {
	          node.currentTime = seek;
	          node.muted = sound._muted || self._muted || Howler._muted || node.muted;
	          node.volume = sound._volume * Howler.volume();
	          node.playbackRate = sound._rate;

	          setTimeout(function() {
	            node.play();

	            // Setup the new end timer.
	            if (timeout !== Infinity) {
	              self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
	            }

	            if (!internal) {
	              self._emit('play', sound._id);
	            }
	          }, 0);
	        };

	        // Play immediately if ready, or wait for the 'canplaythrough'e vent.
	        var loadedNoReadyState = (self._state === 'loaded' && (window && window.ejecta || !node.readyState && Howler._navigator.isCocoonJS));
	        if (node.readyState === 4 || loadedNoReadyState) {
	          playHtml5();
	        } else {
	          var listener = function() {
	            // Begin playback.
	            playHtml5();

	            // Clear this listener.
	            node.removeEventListener(Howler._canPlayEvent, listener, false);
	          };
	          node.addEventListener(Howler._canPlayEvent, listener, false);

	          // Cancel the end timer.
	          self._clearTimer(sound._id);
	        }
	      }

	      return sound._id;
	    },

	    /**
	     * Pause playback and save current position.
	     * @param  {Number} id The sound ID (empty to pause all in group).
	     * @return {Howl}
	     */
	    pause: function(id) {
	      var self = this;

	      // If the sound hasn't loaded, add it to the load queue to pause when capable.
	      if (self._state !== 'loaded') {
	        self._queue.push({
	          event: 'pause',
	          action: function() {
	            self.pause(id);
	          }
	        });

	        return self;
	      }

	      // If no id is passed, get all ID's to be paused.
	      var ids = self._getSoundIds(id);

	      for (var i=0; i<ids.length; i++) {
	        // Clear the end timer.
	        self._clearTimer(ids[i]);

	        // Get the sound.
	        var sound = self._soundById(ids[i]);

	        if (sound && !sound._paused) {
	          // Reset the seek position.
	          sound._seek = self.seek(ids[i]);
	          sound._rateSeek = 0;
	          sound._paused = true;

	          // Stop currently running fades.
	          self._stopFade(ids[i]);

	          if (sound._node) {
	            if (self._webAudio) {
	              // make sure the sound has been created
	              if (!sound._node.bufferSource) {
	                return self;
	              }

	              if (typeof sound._node.bufferSource.stop === 'undefined') {
	                sound._node.bufferSource.noteOff(0);
	              } else {
	                sound._node.bufferSource.stop(0);
	              }

	              // Clean up the buffer source.
	              self._cleanBuffer(sound._node);
	            } else if (!isNaN(sound._node.duration) || sound._node.duration === Infinity) {
	              sound._node.pause();
	            }
	          }
	        }

	        // Fire the pause event, unless `true` is passed as the 2nd argument.
	        if (!arguments[1]) {
	          self._emit('pause', sound ? sound._id : null);
	        }
	      }

	      return self;
	    },

	    /**
	     * Stop playback and reset to start.
	     * @param  {Number} id The sound ID (empty to stop all in group).
	     * @param  {Boolean} internal Internal Use: true prevents event firing.
	     * @return {Howl}
	     */
	    stop: function(id, internal) {
	      var self = this;

	      // If the sound hasn't loaded, add it to the load queue to stop when capable.
	      if (self._state !== 'loaded') {
	        self._queue.push({
	          event: 'stop',
	          action: function() {
	            self.stop(id);
	          }
	        });

	        return self;
	      }

	      // If no id is passed, get all ID's to be stopped.
	      var ids = self._getSoundIds(id);

	      for (var i=0; i<ids.length; i++) {
	        // Clear the end timer.
	        self._clearTimer(ids[i]);

	        // Get the sound.
	        var sound = self._soundById(ids[i]);

	        if (sound) {
	          // Reset the seek position.
	          sound._seek = sound._start || 0;
	          sound._rateSeek = 0;
	          sound._paused = true;
	          sound._ended = true;

	          // Stop currently running fades.
	          self._stopFade(ids[i]);

	          if (sound._node) {
	            if (self._webAudio) {
	              // make sure the sound has been created
	              if (!sound._node.bufferSource) {
	                if (!internal) {
	                  self._emit('stop', sound._id);
	                }

	                return self;
	              }

	              if (typeof sound._node.bufferSource.stop === 'undefined') {
	                sound._node.bufferSource.noteOff(0);
	              } else {
	                sound._node.bufferSource.stop(0);
	              }

	              // Clean up the buffer source.
	              self._cleanBuffer(sound._node);
	            } else if (!isNaN(sound._node.duration) || sound._node.duration === Infinity) {
	              sound._node.currentTime = sound._start || 0;
	              sound._node.pause();
	            }
	          }
	        }

	        if (sound && !internal) {
	          self._emit('stop', sound._id);
	        }
	      }

	      return self;
	    },

	    /**
	     * Mute/unmute a single sound or all sounds in this Howl group.
	     * @param  {Boolean} muted Set to true to mute and false to unmute.
	     * @param  {Number} id    The sound ID to update (omit to mute/unmute all).
	     * @return {Howl}
	     */
	    mute: function(muted, id) {
	      var self = this;

	      // If the sound hasn't loaded, add it to the load queue to mute when capable.
	      if (self._state !== 'loaded') {
	        self._queue.push({
	          event: 'mute',
	          action: function() {
	            self.mute(muted, id);
	          }
	        });

	        return self;
	      }

	      // If applying mute/unmute to all sounds, update the group's value.
	      if (typeof id === 'undefined') {
	        if (typeof muted === 'boolean') {
	          self._muted = muted;
	        } else {
	          return self._muted;
	        }
	      }

	      // If no id is passed, get all ID's to be muted.
	      var ids = self._getSoundIds(id);

	      for (var i=0; i<ids.length; i++) {
	        // Get the sound.
	        var sound = self._soundById(ids[i]);

	        if (sound) {
	          sound._muted = muted;

	          if (self._webAudio && sound._node) {
	            sound._node.gain.setValueAtTime(muted ? 0 : sound._volume, Howler.ctx.currentTime);
	          } else if (sound._node) {
	            sound._node.muted = Howler._muted ? true : muted;
	          }

	          self._emit('mute', sound._id);
	        }
	      }

	      return self;
	    },

	    /**
	     * Get/set the volume of this sound or of the Howl group. This method can optionally take 0, 1 or 2 arguments.
	     *   volume() -> Returns the group's volume value.
	     *   volume(id) -> Returns the sound id's current volume.
	     *   volume(vol) -> Sets the volume of all sounds in this Howl group.
	     *   volume(vol, id) -> Sets the volume of passed sound id.
	     * @return {Howl/Number} Returns self or current volume.
	     */
	    volume: function() {
	      var self = this;
	      var args = arguments;
	      var vol, id;

	      // Determine the values based on arguments.
	      if (args.length === 0) {
	        // Return the value of the groups' volume.
	        return self._volume;
	      } else if (args.length === 1 || args.length === 2 && typeof args[1] === 'undefined') {
	        // First check if this is an ID, and if not, assume it is a new volume.
	        var ids = self._getSoundIds();
	        var index = ids.indexOf(args[0]);
	        if (index >= 0) {
	          id = parseInt(args[0], 10);
	        } else {
	          vol = parseFloat(args[0]);
	        }
	      } else if (args.length >= 2) {
	        vol = parseFloat(args[0]);
	        id = parseInt(args[1], 10);
	      }

	      // Update the volume or return the current volume.
	      var sound;
	      if (typeof vol !== 'undefined' && vol >= 0 && vol <= 1) {
	        // If the sound hasn't loaded, add it to the load queue to change volume when capable.
	        if (self._state !== 'loaded') {
	          self._queue.push({
	            event: 'volume',
	            action: function() {
	              self.volume.apply(self, args);
	            }
	          });

	          return self;
	        }

	        // Set the group volume.
	        if (typeof id === 'undefined') {
	          self._volume = vol;
	        }

	        // Update one or all volumes.
	        id = self._getSoundIds(id);
	        for (var i=0; i<id.length; i++) {
	          // Get the sound.
	          sound = self._soundById(id[i]);

	          if (sound) {
	            sound._volume = vol;

	            // Stop currently running fades.
	            if (!args[2]) {
	              self._stopFade(id[i]);
	            }

	            if (self._webAudio && sound._node && !sound._muted) {
	              sound._node.gain.setValueAtTime(vol, Howler.ctx.currentTime);
	            } else if (sound._node && !sound._muted) {
	              sound._node.volume = vol * Howler.volume();
	            }

	            self._emit('volume', sound._id);
	          }
	        }
	      } else {
	        sound = id ? self._soundById(id) : self._sounds[0];
	        return sound ? sound._volume : 0;
	      }

	      return self;
	    },

	    /**
	     * Fade a currently playing sound between two volumes (if no id is passsed, all sounds will fade).
	     * @param  {Number} from The value to fade from (0.0 to 1.0).
	     * @param  {Number} to   The volume to fade to (0.0 to 1.0).
	     * @param  {Number} len  Time in milliseconds to fade.
	     * @param  {Number} id   The sound id (omit to fade all sounds).
	     * @return {Howl}
	     */
	    fade: function(from, to, len, id) {
	      var self = this;
	      var diff = Math.abs(from - to);
	      var dir = from > to ? 'out' : 'in';
	      var steps = diff / 0.01;
	      var stepLen = (steps > 0) ? len / steps : len;

	      // Since browsers clamp timeouts to 4ms, we need to clamp our steps to that too.
	      if (stepLen < 4) {
	        steps = Math.ceil(steps / (4 / stepLen));
	        stepLen = 4;
	      }

	      // If the sound hasn't loaded, add it to the load queue to fade when capable.
	      if (self._state !== 'loaded') {
	        self._queue.push({
	          event: 'fade',
	          action: function() {
	            self.fade(from, to, len, id);
	          }
	        });

	        return self;
	      }

	      // Set the volume to the start position.
	      self.volume(from, id);

	      // Fade the volume of one or all sounds.
	      var ids = self._getSoundIds(id);
	      for (var i=0; i<ids.length; i++) {
	        // Get the sound.
	        var sound = self._soundById(ids[i]);

	        // Create a linear fade or fall back to timeouts with HTML5 Audio.
	        if (sound) {
	          // Stop the previous fade if no sprite is being used (otherwise, volume handles this).
	          if (!id) {
	            self._stopFade(ids[i]);
	          }

	          // If we are using Web Audio, let the native methods do the actual fade.
	          if (self._webAudio && !sound._muted) {
	            var currentTime = Howler.ctx.currentTime;
	            var end = currentTime + (len / 1000);
	            sound._volume = from;
	            sound._node.gain.setValueAtTime(from, currentTime);
	            sound._node.gain.linearRampToValueAtTime(to, end);
	          }

	          var vol = from;
	          sound._interval = setInterval(function(soundId, sound) {
	            // Update the volume amount, but only if the volume should change.
	            if (steps > 0) {
	              vol += (dir === 'in' ? 0.01 : -0.01);
	            }

	            // Make sure the volume is in the right bounds.
	            vol = Math.max(0, vol);
	            vol = Math.min(1, vol);

	            // Round to within 2 decimal points.
	            vol = Math.round(vol * 100) / 100;

	            // Change the volume.
	            if (self._webAudio) {
	              if (typeof id === 'undefined') {
	                self._volume = vol;
	              }

	              sound._volume = vol;
	            } else {
	              self.volume(vol, soundId, true);
	            }

	            // When the fade is complete, stop it and fire event.
	            if (vol === to) {
	              clearInterval(sound._interval);
	              sound._interval = null;
	              self.volume(vol, soundId);
	              self._emit('fade', soundId);
	            }
	          }.bind(self, ids[i], sound), stepLen);
	        }
	      }

	      return self;
	    },

	    /**
	     * Internal method that stops the currently playing fade when
	     * a new fade starts, volume is changed or the sound is stopped.
	     * @param  {Number} id The sound id.
	     * @return {Howl}
	     */
	    _stopFade: function(id) {
	      var self = this;
	      var sound = self._soundById(id);

	      if (sound && sound._interval) {
	        if (self._webAudio) {
	          sound._node.gain.cancelScheduledValues(Howler.ctx.currentTime);
	        }

	        clearInterval(sound._interval);
	        sound._interval = null;
	        self._emit('fade', id);
	      }

	      return self;
	    },

	    /**
	     * Get/set the loop parameter on a sound. This method can optionally take 0, 1 or 2 arguments.
	     *   loop() -> Returns the group's loop value.
	     *   loop(id) -> Returns the sound id's loop value.
	     *   loop(loop) -> Sets the loop value for all sounds in this Howl group.
	     *   loop(loop, id) -> Sets the loop value of passed sound id.
	     * @return {Howl/Boolean} Returns self or current loop value.
	     */
	    loop: function() {
	      var self = this;
	      var args = arguments;
	      var loop, id, sound;

	      // Determine the values for loop and id.
	      if (args.length === 0) {
	        // Return the grou's loop value.
	        return self._loop;
	      } else if (args.length === 1) {
	        if (typeof args[0] === 'boolean') {
	          loop = args[0];
	          self._loop = loop;
	        } else {
	          // Return this sound's loop value.
	          sound = self._soundById(parseInt(args[0], 10));
	          return sound ? sound._loop : false;
	        }
	      } else if (args.length === 2) {
	        loop = args[0];
	        id = parseInt(args[1], 10);
	      }

	      // If no id is passed, get all ID's to be looped.
	      var ids = self._getSoundIds(id);
	      for (var i=0; i<ids.length; i++) {
	        sound = self._soundById(ids[i]);

	        if (sound) {
	          sound._loop = loop;
	          if (self._webAudio && sound._node && sound._node.bufferSource) {
	            sound._node.bufferSource.loop = loop;
	            if (loop) {
	              sound._node.bufferSource.loopStart = sound._start || 0;
	              sound._node.bufferSource.loopEnd = sound._stop;
	            }
	          }
	        }
	      }

	      return self;
	    },

	    /**
	     * Get/set the playback rate of a sound. This method can optionally take 0, 1 or 2 arguments.
	     *   rate() -> Returns the first sound node's current playback rate.
	     *   rate(id) -> Returns the sound id's current playback rate.
	     *   rate(rate) -> Sets the playback rate of all sounds in this Howl group.
	     *   rate(rate, id) -> Sets the playback rate of passed sound id.
	     * @return {Howl/Number} Returns self or the current playback rate.
	     */
	    rate: function() {
	      var self = this;
	      var args = arguments;
	      var rate, id;

	      // Determine the values based on arguments.
	      if (args.length === 0) {
	        // We will simply return the current rate of the first node.
	        id = self._sounds[0]._id;
	      } else if (args.length === 1) {
	        // First check if this is an ID, and if not, assume it is a new rate value.
	        var ids = self._getSoundIds();
	        var index = ids.indexOf(args[0]);
	        if (index >= 0) {
	          id = parseInt(args[0], 10);
	        } else {
	          rate = parseFloat(args[0]);
	        }
	      } else if (args.length === 2) {
	        rate = parseFloat(args[0]);
	        id = parseInt(args[1], 10);
	      }

	      // Update the playback rate or return the current value.
	      var sound;
	      if (typeof rate === 'number') {
	        // If the sound hasn't loaded, add it to the load queue to change playback rate when capable.
	        if (self._state !== 'loaded') {
	          self._queue.push({
	            event: 'rate',
	            action: function() {
	              self.rate.apply(self, args);
	            }
	          });

	          return self;
	        }

	        // Set the group rate.
	        if (typeof id === 'undefined') {
	          self._rate = rate;
	        }

	        // Update one or all volumes.
	        id = self._getSoundIds(id);
	        for (var i=0; i<id.length; i++) {
	          // Get the sound.
	          sound = self._soundById(id[i]);

	          if (sound) {
	            // Keep track of our position when the rate changed and update the playback
	            // start position so we can properly adjust the seek position for time elapsed.
	            sound._rateSeek = self.seek(id[i]);
	            sound._playStart = self._webAudio ? Howler.ctx.currentTime : sound._playStart;
	            sound._rate = rate;

	            // Change the playback rate.
	            if (self._webAudio && sound._node && sound._node.bufferSource) {
	              sound._node.bufferSource.playbackRate.value = rate;
	            } else if (sound._node) {
	              sound._node.playbackRate = rate;
	            }

	            // Reset the timers.
	            var seek = self.seek(id[i]);
	            var duration = ((self._sprite[sound._sprite][0] + self._sprite[sound._sprite][1]) / 1000) - seek;
	            var timeout = (duration * 1000) / Math.abs(sound._rate);

	            // Start a new end timer if sound is already playing.
	            if (self._endTimers[id[i]] || !sound._paused) {
	              self._clearTimer(id[i]);
	              self._endTimers[id[i]] = setTimeout(self._ended.bind(self, sound), timeout);
	            }

	            self._emit('rate', sound._id);
	          }
	        }
	      } else {
	        sound = self._soundById(id);
	        return sound ? sound._rate : self._rate;
	      }

	      return self;
	    },

	    /**
	     * Get/set the seek position of a sound. This method can optionally take 0, 1 or 2 arguments.
	     *   seek() -> Returns the first sound node's current seek position.
	     *   seek(id) -> Returns the sound id's current seek position.
	     *   seek(seek) -> Sets the seek position of the first sound node.
	     *   seek(seek, id) -> Sets the seek position of passed sound id.
	     * @return {Howl/Number} Returns self or the current seek position.
	     */
	    seek: function() {
	      var self = this;
	      var args = arguments;
	      var seek, id;

	      // Determine the values based on arguments.
	      if (args.length === 0) {
	        // We will simply return the current position of the first node.
	        id = self._sounds[0]._id;
	      } else if (args.length === 1) {
	        // First check if this is an ID, and if not, assume it is a new seek position.
	        var ids = self._getSoundIds();
	        var index = ids.indexOf(args[0]);
	        if (index >= 0) {
	          id = parseInt(args[0], 10);
	        } else {
	          id = self._sounds[0]._id;
	          seek = parseFloat(args[0]);
	        }
	      } else if (args.length === 2) {
	        seek = parseFloat(args[0]);
	        id = parseInt(args[1], 10);
	      }

	      // If there is no ID, bail out.
	      if (typeof id === 'undefined') {
	        return self;
	      }

	      // If the sound hasn't loaded, add it to the load queue to seek when capable.
	      if (self._state !== 'loaded') {
	        self._queue.push({
	          event: 'seek',
	          action: function() {
	            self.seek.apply(self, args);
	          }
	        });

	        return self;
	      }

	      // Get the sound.
	      var sound = self._soundById(id);

	      if (sound) {
	        if (typeof seek === 'number' && seek >= 0) {
	          // Pause the sound and update position for restarting playback.
	          var playing = self.playing(id);
	          if (playing) {
	            self.pause(id, true);
	          }

	          // Move the position of the track and cancel timer.
	          sound._seek = seek;
	          sound._ended = false;
	          self._clearTimer(id);

	          // Restart the playback if the sound was playing.
	          if (playing) {
	            self.play(id, true);
	          }

	          // Update the seek position for HTML5 Audio.
	          if (!self._webAudio && sound._node) {
	            sound._node.currentTime = seek;
	          }

	          self._emit('seek', id);
	        } else {
	          if (self._webAudio) {
	            var realTime = self.playing(id) ? Howler.ctx.currentTime - sound._playStart : 0;
	            var rateSeek = sound._rateSeek ? sound._rateSeek - sound._seek : 0;
	            return sound._seek + (rateSeek + realTime * Math.abs(sound._rate));
	          } else {
	            return sound._node.currentTime;
	          }
	        }
	      }

	      return self;
	    },

	    /**
	     * Check if a specific sound is currently playing or not (if id is provided), or check if at least one of the sounds in the group is playing or not.
	     * @param  {Number}  id The sound id to check. If none is passed, the whole sound group is checked.
	     * @return {Boolean} True if playing and false if not.
	     */
	    playing: function(id) {
	      var self = this;

	      // Check the passed sound ID (if any).
	      if (typeof id === 'number') {
	        var sound = self._soundById(id);
	        return sound ? !sound._paused : false;
	      }

	      // Otherwise, loop through all sounds and check if any are playing.
	      for (var i=0; i<self._sounds.length; i++) {
	        if (!self._sounds[i]._paused) {
	          return true;
	        }
	      }

	      return false;
	    },

	    /**
	     * Get the duration of this sound. Passing a sound id will return the sprite duration.
	     * @param  {Number} id The sound id to check. If none is passed, return full source duration.
	     * @return {Number} Audio duration in seconds.
	     */
	    duration: function(id) {
	      var self = this;
	      var duration = self._duration;

	      // If we pass an ID, get the sound and return the sprite length.
	      var sound = self._soundById(id);
	      if (sound) {
	        duration = self._sprite[sound._sprite][1] / 1000;
	      }

	      return duration;
	    },

	    /**
	     * Returns the current loaded state of this Howl.
	     * @return {String} 'unloaded', 'loading', 'loaded'
	     */
	    state: function() {
	      return this._state;
	    },

	    /**
	     * Unload and destroy the current Howl object.
	     * This will immediately stop all sound instances attached to this group.
	     */
	    unload: function() {
	      var self = this;

	      // Stop playing any active sounds.
	      var sounds = self._sounds;
	      for (var i=0; i<sounds.length; i++) {
	        // Stop the sound if it is currently playing.
	        if (!sounds[i]._paused) {
	          self.stop(sounds[i]._id);
	          self._emit('end', sounds[i]._id);
	        }

	        // Remove the source or disconnect.
	        if (!self._webAudio) {
	          // Set the source to 0-second silence to stop any downloading.
	          sounds[i]._node.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';

	          // Remove any event listeners.
	          sounds[i]._node.removeEventListener('error', sounds[i]._errorFn, false);
	          sounds[i]._node.removeEventListener(Howler._canPlayEvent, sounds[i]._loadFn, false);
	        }

	        // Empty out all of the nodes.
	        delete sounds[i]._node;

	        // Make sure all timers are cleared out.
	        self._clearTimer(sounds[i]._id);

	        // Remove the references in the global Howler object.
	        var index = Howler._howls.indexOf(self);
	        if (index >= 0) {
	          Howler._howls.splice(index, 1);
	        }
	      }

	      // Delete this sound from the cache (if no other Howl is using it).
	      var remCache = true;
	      for (i=0; i<Howler._howls.length; i++) {
	        if (Howler._howls[i]._src === self._src) {
	          remCache = false;
	          break;
	        }
	      }

	      if (cache && remCache) {
	        delete cache[self._src];
	      }

	      // Clear global errors.
	      Howler.noAudio = false;

	      // Clear out `self`.
	      self._state = 'unloaded';
	      self._sounds = [];
	      self = null;

	      return null;
	    },

	    /**
	     * Listen to a custom event.
	     * @param  {String}   event Event name.
	     * @param  {Function} fn    Listener to call.
	     * @param  {Number}   id    (optional) Only listen to events for this sound.
	     * @param  {Number}   once  (INTERNAL) Marks event to fire only once.
	     * @return {Howl}
	     */
	    on: function(event, fn, id, once) {
	      var self = this;
	      var events = self['_on' + event];

	      if (typeof fn === 'function') {
	        events.push(once ? {id: id, fn: fn, once: once} : {id: id, fn: fn});
	      }

	      return self;
	    },

	    /**
	     * Remove a custom event. Call without parameters to remove all events.
	     * @param  {String}   event Event name.
	     * @param  {Function} fn    Listener to remove. Leave empty to remove all.
	     * @param  {Number}   id    (optional) Only remove events for this sound.
	     * @return {Howl}
	     */
	    off: function(event, fn, id) {
	      var self = this;
	      var events = self['_on' + event];
	      var i = 0;

	      if (fn) {
	        // Loop through event store and remove the passed function.
	        for (i=0; i<events.length; i++) {
	          if (fn === events[i].fn && id === events[i].id) {
	            events.splice(i, 1);
	            break;
	          }
	        }
	      } else if (event) {
	        // Clear out all events of this type.
	        self['_on' + event] = [];
	      } else {
	        // Clear out all events of every type.
	        var keys = Object.keys(self);
	        for (i=0; i<keys.length; i++) {
	          if ((keys[i].indexOf('_on') === 0) && Array.isArray(self[keys[i]])) {
	            self[keys[i]] = [];
	          }
	        }
	      }

	      return self;
	    },

	    /**
	     * Listen to a custom event and remove it once fired.
	     * @param  {String}   event Event name.
	     * @param  {Function} fn    Listener to call.
	     * @param  {Number}   id    (optional) Only listen to events for this sound.
	     * @return {Howl}
	     */
	    once: function(event, fn, id) {
	      var self = this;

	      // Setup the event listener.
	      self.on(event, fn, id, 1);

	      return self;
	    },

	    /**
	     * Emit all events of a specific type and pass the sound id.
	     * @param  {String} event Event name.
	     * @param  {Number} id    Sound ID.
	     * @param  {Number} msg   Message to go with event.
	     * @return {Howl}
	     */
	    _emit: function(event, id, msg) {
	      var self = this;
	      var events = self['_on' + event];

	      // Loop through event store and fire all functions.
	      for (var i=events.length-1; i>=0; i--) {
	        if (!events[i].id || events[i].id === id || event === 'load') {
	          setTimeout(function(fn) {
	            fn.call(this, id, msg);
	          }.bind(self, events[i].fn), 0);

	          // If this event was setup with `once`, remove it.
	          if (events[i].once) {
	            self.off(event, events[i].fn, events[i].id);
	          }
	        }
	      }

	      return self;
	    },

	    /**
	     * Queue of actions initiated before the sound has loaded.
	     * These will be called in sequence, with the next only firing
	     * after the previous has finished executing (even if async like play).
	     * @return {Howl}
	     */
	    _loadQueue: function() {
	      var self = this;

	      if (self._queue.length > 0) {
	        var task = self._queue[0];

	        // don't move onto the next task until this one is done
	        self.once(task.event, function() {
	          self._queue.shift();
	          self._loadQueue();
	        });

	        task.action();
	      }

	      return self;
	    },

	    /**
	     * Fired when playback ends at the end of the duration.
	     * @param  {Sound} sound The sound object to work with.
	     * @return {Howl}
	     */
	    _ended: function(sound) {
	      var self = this;
	      var sprite = sound._sprite;

	      // Should this sound loop?
	      var loop = !!(sound._loop || self._sprite[sprite][2]);

	      // Fire the ended event.
	      self._emit('end', sound._id);

	      // Restart the playback for HTML5 Audio loop.
	      if (!self._webAudio && loop) {
	        self.stop(sound._id, true).play(sound._id);
	      }

	      // Restart this timer if on a Web Audio loop.
	      if (self._webAudio && loop) {
	        self._emit('play', sound._id);
	        sound._seek = sound._start || 0;
	        sound._rateSeek = 0;
	        sound._playStart = Howler.ctx.currentTime;

	        var timeout = ((sound._stop - sound._start) * 1000) / Math.abs(sound._rate);
	        self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
	      }

	      // Mark the node as paused.
	      if (self._webAudio && !loop) {
	        sound._paused = true;
	        sound._ended = true;
	        sound._seek = sound._start || 0;
	        sound._rateSeek = 0;
	        self._clearTimer(sound._id);

	        // Clean up the buffer source.
	        self._cleanBuffer(sound._node);

	        // Attempt to auto-suspend AudioContext if no sounds are still playing.
	        Howler._autoSuspend();
	      }

	      // When using a sprite, end the track.
	      if (!self._webAudio && !loop) {
	        self.stop(sound._id);
	      }

	      return self;
	    },

	    /**
	     * Clear the end timer for a sound playback.
	     * @param  {Number} id The sound ID.
	     * @return {Howl}
	     */
	    _clearTimer: function(id) {
	      var self = this;

	      if (self._endTimers[id]) {
	        clearTimeout(self._endTimers[id]);
	        delete self._endTimers[id];
	      }

	      return self;
	    },

	    /**
	     * Return the sound identified by this ID, or return null.
	     * @param  {Number} id Sound ID
	     * @return {Object}    Sound object or null.
	     */
	    _soundById: function(id) {
	      var self = this;

	      // Loop through all sounds and find the one with this ID.
	      for (var i=0; i<self._sounds.length; i++) {
	        if (id === self._sounds[i]._id) {
	          return self._sounds[i];
	        }
	      }

	      return null;
	    },

	    /**
	     * Return an inactive sound from the pool or create a new one.
	     * @return {Sound} Sound playback object.
	     */
	    _inactiveSound: function() {
	      var self = this;

	      self._drain();

	      // Find the first inactive node to recycle.
	      for (var i=0; i<self._sounds.length; i++) {
	        if (self._sounds[i]._ended) {
	          return self._sounds[i].reset();
	        }
	      }

	      // If no inactive node was found, create a new one.
	      return new Sound(self);
	    },

	    /**
	     * Drain excess inactive sounds from the pool.
	     */
	    _drain: function() {
	      var self = this;
	      var limit = self._pool;
	      var cnt = 0;
	      var i = 0;

	      // If there are less sounds than the max pool size, we are done.
	      if (self._sounds.length < limit) {
	        return;
	      }

	      // Count the number of inactive sounds.
	      for (i=0; i<self._sounds.length; i++) {
	        if (self._sounds[i]._ended) {
	          cnt++;
	        }
	      }

	      // Remove excess inactive sounds, going in reverse order.
	      for (i=self._sounds.length - 1; i>=0; i--) {
	        if (cnt <= limit) {
	          return;
	        }

	        if (self._sounds[i]._ended) {
	          // Disconnect the audio source when using Web Audio.
	          if (self._webAudio && self._sounds[i]._node) {
	            self._sounds[i]._node.disconnect(0);
	          }

	          // Remove sounds until we have the pool size.
	          self._sounds.splice(i, 1);
	          cnt--;
	        }
	      }
	    },

	    /**
	     * Get all ID's from the sounds pool.
	     * @param  {Number} id Only return one ID if one is passed.
	     * @return {Array}    Array of IDs.
	     */
	    _getSoundIds: function(id) {
	      var self = this;

	      if (typeof id === 'undefined') {
	        var ids = [];
	        for (var i=0; i<self._sounds.length; i++) {
	          ids.push(self._sounds[i]._id);
	        }

	        return ids;
	      } else {
	        return [id];
	      }
	    },

	    /**
	     * Load the sound back into the buffer source.
	     * @param  {Sound} sound The sound object to work with.
	     * @return {Howl}
	     */
	    _refreshBuffer: function(sound) {
	      var self = this;

	      // Setup the buffer source for playback.
	      sound._node.bufferSource = Howler.ctx.createBufferSource();
	      sound._node.bufferSource.buffer = cache[self._src];

	      // Connect to the correct node.
	      if (sound._panner) {
	        sound._node.bufferSource.connect(sound._panner);
	      } else {
	        sound._node.bufferSource.connect(sound._node);
	      }

	      // Setup looping and playback rate.
	      sound._node.bufferSource.loop = sound._loop;
	      if (sound._loop) {
	        sound._node.bufferSource.loopStart = sound._start || 0;
	        sound._node.bufferSource.loopEnd = sound._stop;
	      }
	      sound._node.bufferSource.playbackRate.value = sound._rate;

	      return self;
	    },

	    /**
	     * Prevent memory leaks by cleaning up the buffer source after playback.
	     * @param  {Object} node Sound's audio node containing the buffer source.
	     * @return {Howl}
	     */
	    _cleanBuffer: function(node) {
	      var self = this;

	      if (self._scratchBuffer) {
	        node.bufferSource.onended = null;
	        node.bufferSource.disconnect(0);
	        try { node.bufferSource.buffer = self._scratchBuffer; } catch(e) {}
	      }
	      node.bufferSource = null;

	      return self;
	    }
	  };

	  /** Single Sound Methods **/
	  /***************************************************************************/

	  /**
	   * Setup the sound object, which each node attached to a Howl group is contained in.
	   * @param {Object} howl The Howl parent group.
	   */
	  var Sound = function(howl) {
	    this._parent = howl;
	    this.init();
	  };
	  Sound.prototype = {
	    /**
	     * Initialize a new Sound object.
	     * @return {Sound}
	     */
	    init: function() {
	      var self = this;
	      var parent = self._parent;

	      // Setup the default parameters.
	      self._muted = parent._muted;
	      self._loop = parent._loop;
	      self._volume = parent._volume;
	      self._muted = parent._muted;
	      self._rate = parent._rate;
	      self._seek = 0;
	      self._paused = true;
	      self._ended = true;
	      self._sprite = '__default';

	      // Generate a unique ID for this sound.
	      self._id = Math.round(Date.now() * Math.random());

	      // Add itself to the parent's pool.
	      parent._sounds.push(self);

	      // Create the new node.
	      self.create();

	      return self;
	    },

	    /**
	     * Create and setup a new sound object, whether HTML5 Audio or Web Audio.
	     * @return {Sound}
	     */
	    create: function() {
	      var self = this;
	      var parent = self._parent;
	      var volume = (Howler._muted || self._muted || self._parent._muted) ? 0 : self._volume;

	      if (parent._webAudio) {
	        // Create the gain node for controlling volume (the source will connect to this).
	        self._node = (typeof Howler.ctx.createGain === 'undefined') ? Howler.ctx.createGainNode() : Howler.ctx.createGain();
	        self._node.gain.setValueAtTime(volume, Howler.ctx.currentTime);
	        self._node.paused = true;
	        self._node.connect(Howler.masterGain);
	      } else {
	        self._node = new Audio();

	        // Listen for errors (http://dev.w3.org/html5/spec-author-view/spec.html#mediaerror).
	        self._errorFn = self._errorListener.bind(self);
	        self._node.addEventListener('error', self._errorFn, false);

	        // Listen for 'canplaythrough' event to let us know the sound is ready.
	        self._loadFn = self._loadListener.bind(self);
	        self._node.addEventListener(Howler._canPlayEvent, self._loadFn, false);

	        // Setup the new audio node.
	        self._node.src = parent._src;
	        self._node.preload = 'auto';
	        self._node.volume = volume * Howler.volume();

	        // Begin loading the source.
	        self._node.load();
	      }

	      return self;
	    },

	    /**
	     * Reset the parameters of this sound to the original state (for recycle).
	     * @return {Sound}
	     */
	    reset: function() {
	      var self = this;
	      var parent = self._parent;

	      // Reset all of the parameters of this sound.
	      self._muted = parent._muted;
	      self._loop = parent._loop;
	      self._volume = parent._volume;
	      self._muted = parent._muted;
	      self._rate = parent._rate;
	      self._seek = 0;
	      self._rateSeek = 0;
	      self._paused = true;
	      self._ended = true;
	      self._sprite = '__default';

	      // Generate a new ID so that it isn't confused with the previous sound.
	      self._id = Math.round(Date.now() * Math.random());

	      return self;
	    },

	    /**
	     * HTML5 Audio error listener callback.
	     */
	    _errorListener: function() {
	      var self = this;

	      // Fire an error event and pass back the code.
	      self._parent._emit('loaderror', self._id, self._node.error ? self._node.error.code : 0);

	      // Clear the event listener.
	      self._node.removeEventListener('error', self._errorListener, false);
	    },

	    /**
	     * HTML5 Audio canplaythrough listener callback.
	     */
	    _loadListener: function() {
	      var self = this;
	      var parent = self._parent;

	      // Round up the duration to account for the lower precision in HTML5 Audio.
	      parent._duration = Math.ceil(self._node.duration * 10) / 10;

	      // Setup a sprite if none is defined.
	      if (Object.keys(parent._sprite).length === 0) {
	        parent._sprite = {__default: [0, parent._duration * 1000]};
	      }

	      if (parent._state !== 'loaded') {
	        parent._state = 'loaded';
	        parent._emit('load');
	        parent._loadQueue();
	      }

	      // Clear the event listener.
	      self._node.removeEventListener(Howler._canPlayEvent, self._loadFn, false);
	    }
	  };

	  /** Helper Methods **/
	  /***************************************************************************/

	  var cache = {};

	  /**
	   * Buffer a sound from URL, Data URI or cache and decode to audio source (Web Audio API).
	   * @param  {Howl} self
	   */
	  var loadBuffer = function(self) {
	    var url = self._src;

	    // Check if the buffer has already been cached and use it instead.
	    if (cache[url]) {
	      // Set the duration from the cache.
	      self._duration = cache[url].duration;

	      // Load the sound into this Howl.
	      loadSound(self);

	      return;
	    }

	    if (/^data:[^;]+;base64,/.test(url)) {
	      // Decode the base64 data URI without XHR, since some browsers don't support it.
	      var data = atob(url.split(',')[1]);
	      var dataView = new Uint8Array(data.length);
	      for (var i=0; i<data.length; ++i) {
	        dataView[i] = data.charCodeAt(i);
	      }

	      decodeAudioData(dataView.buffer, self);
	    } else {
	      // Load the buffer from the URL.
	      var xhr = new XMLHttpRequest();
	      xhr.open('GET', url, true);
	      xhr.responseType = 'arraybuffer';
	      xhr.onload = function() {
	        // Make sure we get a successful response back.
	        var code = (xhr.status + '')[0];
	        if (code !== '0' && code !== '2' && code !== '3') {
	          self._emit('loaderror', null, 'Failed loading audio file with status: ' + xhr.status + '.');
	          return;
	        }

	        decodeAudioData(xhr.response, self);
	      };
	      xhr.onerror = function() {
	        // If there is an error, switch to HTML5 Audio.
	        if (self._webAudio) {
	          self._html5 = true;
	          self._webAudio = false;
	          self._sounds = [];
	          delete cache[url];
	          self.load();
	        }
	      };
	      safeXhrSend(xhr);
	    }
	  };

	  /**
	   * Send the XHR request wrapped in a try/catch.
	   * @param  {Object} xhr XHR to send.
	   */
	  var safeXhrSend = function(xhr) {
	    try {
	      xhr.send();
	    } catch (e) {
	      xhr.onerror();
	    }
	  };

	  /**
	   * Decode audio data from an array buffer.
	   * @param  {ArrayBuffer} arraybuffer The audio data.
	   * @param  {Howl}        self
	   */
	  var decodeAudioData = function(arraybuffer, self) {
	    // Decode the buffer into an audio source.
	    Howler.ctx.decodeAudioData(arraybuffer, function(buffer) {
	      if (buffer && self._sounds.length > 0) {
	        cache[self._src] = buffer;
	        loadSound(self, buffer);
	      }
	    }, function() {
	      self._emit('loaderror', null, 'Decoding audio data failed.');
	    });
	  };

	  /**
	   * Sound is now loaded, so finish setting everything up and fire the loaded event.
	   * @param  {Howl} self
	   * @param  {Object} buffer The decoded buffer sound source.
	   */
	  var loadSound = function(self, buffer) {
	    // Set the duration.
	    if (buffer && !self._duration) {
	      self._duration = buffer.duration;
	    }

	    // Setup a sprite if none is defined.
	    if (Object.keys(self._sprite).length === 0) {
	      self._sprite = {__default: [0, self._duration * 1000]};
	    }

	    // Fire the loaded event.
	    if (self._state !== 'loaded') {
	      self._state = 'loaded';
	      self._emit('load');
	      self._loadQueue();
	    }
	  };

	  /**
	   * Setup the audio context when available, or switch to HTML5 Audio mode.
	   */
	  var setupAudioContext = function() {
	    // Check if we are using Web Audio and setup the AudioContext if we are.
	    try {
	      if (typeof AudioContext !== 'undefined') {
	        Howler.ctx = new AudioContext();
	      } else if (typeof webkitAudioContext !== 'undefined') {
	        Howler.ctx = new webkitAudioContext();
	      } else {
	        Howler.usingWebAudio = false;
	      }
	    } catch(e) {
	      Howler.usingWebAudio = false;
	    }

	    // Check if a webview is being used on iOS8 or earlier (rather than the browser).
	    // If it is, disable Web Audio as it causes crashing.
	    var iOS = (/iP(hone|od|ad)/.test(Howler._navigator && Howler._navigator.platform));
	    var appVersion = Howler._navigator && Howler._navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
	    var version = appVersion ? parseInt(appVersion[1], 10) : null;
	    if (iOS && version && version < 9) {
	      var safari = /safari/.test(Howler._navigator && Howler._navigator.userAgent.toLowerCase());
	      if (Howler._navigator && Howler._navigator.standalone && !safari || Howler._navigator && !Howler._navigator.standalone && !safari) {
	        Howler.usingWebAudio = false;
	      }
	    }

	    // Create and expose the master GainNode when using Web Audio (useful for plugins or advanced usage).
	    if (Howler.usingWebAudio) {
	      Howler.masterGain = (typeof Howler.ctx.createGain === 'undefined') ? Howler.ctx.createGainNode() : Howler.ctx.createGain();
	      Howler.masterGain.gain.value = 1;
	      Howler.masterGain.connect(Howler.ctx.destination);
	    }

	    // Re-run the setup on Howler.
	    Howler._setup();
	  };

	  // Add support for AMD (Asynchronous Module Definition) libraries such as require.js.
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
	      return {
	        Howler: Howler,
	        Howl: Howl
	      };
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }

	  // Add support for CommonJS libraries such as browserify.
	  if (true) {
	    exports.Howler = Howler;
	    exports.Howl = Howl;
	  }

	  // Define globally in case AMD is not available or unused.
	  if (typeof window !== 'undefined') {
	    window.HowlerGlobal = HowlerGlobal;
	    window.Howler = Howler;
	    window.Howl = Howl;
	    window.Sound = Sound;
	  } else if (typeof global !== 'undefined') { // Add to global in Node.js (for testing, etc).
	    global.HowlerGlobal = HowlerGlobal;
	    global.Howler = Howler;
	    global.Howl = Howl;
	    global.Sound = Sound;
	  }
	})();


	/*!
	 *  Spatial Plugin - Adds support for stereo and 3D audio where Web Audio is supported.
	 *  
	 *  howler.js v2.0.2
	 *  howlerjs.com
	 *
	 *  (c) 2013-2016, James Simpson of GoldFire Studios
	 *  goldfirestudios.com
	 *
	 *  MIT License
	 */

	(function() {

	  'use strict';

	  // Setup default properties.
	  HowlerGlobal.prototype._pos = [0, 0, 0];
	  HowlerGlobal.prototype._orientation = [0, 0, -1, 0, 1, 0];
	  
	  /** Global Methods **/
	  /***************************************************************************/

	  /**
	   * Helper method to update the stereo panning position of all current Howls.
	   * Future Howls will not use this value unless explicitly set.
	   * @param  {Number} pan A value of -1.0 is all the way left and 1.0 is all the way right.
	   * @return {Howler/Number}     Self or current stereo panning value.
	   */
	  HowlerGlobal.prototype.stereo = function(pan) {
	    var self = this;

	    // Stop right here if not using Web Audio.
	    if (!self.ctx || !self.ctx.listener) {
	      return self;
	    }

	    // Loop through all Howls and update their stereo panning.
	    for (var i=self._howls.length-1; i>=0; i--) {
	      self._howls[i].stereo(pan);
	    }

	    return self;
	  };

	  /**
	   * Get/set the position of the listener in 3D cartesian space. Sounds using
	   * 3D position will be relative to the listener's position.
	   * @param  {Number} x The x-position of the listener.
	   * @param  {Number} y The y-position of the listener.
	   * @param  {Number} z The z-position of the listener.
	   * @return {Howler/Array}   Self or current listener position.
	   */
	  HowlerGlobal.prototype.pos = function(x, y, z) {
	    var self = this;

	    // Stop right here if not using Web Audio.
	    if (!self.ctx || !self.ctx.listener) {
	      return self;
	    }

	    // Set the defaults for optional 'y' & 'z'.
	    y = (typeof y !== 'number') ? self._pos[1] : y;
	    z = (typeof z !== 'number') ? self._pos[2] : z;

	    if (typeof x === 'number') {
	      self._pos = [x, y, z];
	      self.ctx.listener.setPosition(self._pos[0], self._pos[1], self._pos[2]);
	    } else {
	      return self._pos;
	    }

	    return self;
	  };

	  /**
	   * Get/set the direction the listener is pointing in the 3D cartesian space.
	   * A front and up vector must be provided. The front is the direction the
	   * face of the listener is pointing, and up is the direction the top of the
	   * listener is pointing. Thus, these values are expected to be at right angles
	   * from each other.
	   * @param  {Number} x   The x-orientation of the listener.
	   * @param  {Number} y   The y-orientation of the listener.
	   * @param  {Number} z   The z-orientation of the listener.
	   * @param  {Number} xUp The x-orientation of the top of the listener.
	   * @param  {Number} yUp The y-orientation of the top of the listener.
	   * @param  {Number} zUp The z-orientation of the top of the listener.
	   * @return {Howler/Array}     Returns self or the current orientation vectors.
	   */
	  HowlerGlobal.prototype.orientation = function(x, y, z, xUp, yUp, zUp) {
	    var self = this;

	    // Stop right here if not using Web Audio.
	    if (!self.ctx || !self.ctx.listener) {
	      return self;
	    }

	    // Set the defaults for optional 'y' & 'z'.
	    var or = self._orientation;
	    y = (typeof y !== 'number') ? or[1] : y;
	    z = (typeof z !== 'number') ? or[2] : z;
	    xUp = (typeof xUp !== 'number') ? or[3] : xUp;
	    yUp = (typeof yUp !== 'number') ? or[4] : yUp;
	    zUp = (typeof zUp !== 'number') ? or[5] : zUp;

	    if (typeof x === 'number') {
	      self._orientation = [x, y, z, xUp, yUp, zUp];
	      self.ctx.listener.setOrientation(x, y, z, xUp, yUp, zUp);
	    } else {
	      return or;
	    }

	    return self;
	  };

	  /** Group Methods **/
	  /***************************************************************************/

	  /**
	   * Add new properties to the core init.
	   * @param  {Function} _super Core init method.
	   * @return {Howl}
	   */
	  Howl.prototype.init = (function(_super) {
	    return function(o) {
	      var self = this;

	      // Setup user-defined default properties.
	      self._orientation = o.orientation || [1, 0, 0];
	      self._stereo = o.stereo || null;
	      self._pos = o.pos || null;
	      self._pannerAttr = {
	        coneInnerAngle: typeof o.coneInnerAngle !== 'undefined' ? o.coneInnerAngle : 360,
	        coneOuterAngle: typeof o.coneOuterAngle !== 'undefined' ? o.coneOuterAngle : 360,
	        coneOuterGain: typeof o.coneOuterGain !== 'undefined' ? o.coneOuterGain : 0,
	        distanceModel: typeof o.distanceModel !== 'undefined' ? o.distanceModel : 'inverse',
	        maxDistance: typeof o.maxDistance !== 'undefined' ? o.maxDistance : 10000,
	        panningModel: typeof o.panningModel !== 'undefined' ? o.panningModel : 'HRTF',
	        refDistance: typeof o.refDistance !== 'undefined' ? o.refDistance : 1,
	        rolloffFactor: typeof o.rolloffFactor !== 'undefined' ? o.rolloffFactor : 1
	      };

	      // Setup event listeners.
	      self._onstereo = o.onstereo ? [{fn: o.onstereo}] : [];
	      self._onpos = o.onpos ? [{fn: o.onpos}] : [];
	      self._onorientation = o.onorientation ? [{fn: o.onorientation}] : [];

	      // Complete initilization with howler.js core's init function.
	      return _super.call(this, o);
	    };
	  })(Howl.prototype.init);

	  /**
	   * Get/set the stereo panning of the audio source for this sound or all in the group.
	   * @param  {Number} pan  A value of -1.0 is all the way left and 1.0 is all the way right.
	   * @param  {Number} id (optional) The sound ID. If none is passed, all in group will be updated.
	   * @return {Howl/Number}    Returns self or the current stereo panning value.
	   */
	  Howl.prototype.stereo = function(pan, id) {
	    var self = this;

	    // Stop right here if not using Web Audio.
	    if (!self._webAudio) {
	      return self;
	    }

	    // If the sound hasn't loaded, add it to the load queue to change stereo pan when capable.
	    if (self._state !== 'loaded') {
	      self._queue.push({
	        event: 'stereo',
	        action: function() {
	          self.stereo(pan, id);
	        }
	      });

	      return self;
	    }

	    // Check for PannerStereoNode support and fallback to PannerNode if it doesn't exist.
	    var pannerType = (typeof Howler.ctx.createStereoPanner === 'undefined') ? 'spatial' : 'stereo';

	    // Setup the group's stereo panning if no ID is passed.
	    if (typeof id === 'undefined') {
	      // Return the group's stereo panning if no parameters are passed.
	      if (typeof pan === 'number') {
	        self._stereo = pan;
	        self._pos = [pan, 0, 0];
	      } else {
	        return self._stereo;
	      }
	    }

	    // Change the streo panning of one or all sounds in group.
	    var ids = self._getSoundIds(id);
	    for (var i=0; i<ids.length; i++) {
	      // Get the sound.
	      var sound = self._soundById(ids[i]);

	      if (sound) {
	        if (typeof pan === 'number') {
	          sound._stereo = pan;
	          sound._pos = [pan, 0, 0];

	          if (sound._node) {
	            // If we are falling back, make sure the panningModel is equalpower.
	            sound._pannerAttr.panningModel = 'equalpower';

	            // Check if there is a panner setup and create a new one if not.
	            if (!sound._panner || !sound._panner.pan) {
	              setupPanner(sound, pannerType);
	            }

	            if (pannerType === 'spatial') {
	              sound._panner.setPosition(pan, 0, 0);
	            } else {
	              sound._panner.pan.value = pan;
	            }
	          }

	          self._emit('stereo', sound._id);
	        } else {
	          return sound._stereo;
	        }
	      }
	    }

	    return self;
	  };

	  /**
	   * Get/set the 3D spatial position of the audio source for this sound or
	   * all in the group. The most common usage is to set the 'x' position for
	   * left/right panning. Setting any value higher than 1.0 will begin to
	   * decrease the volume of the sound as it moves further away.
	   * @param  {Number} x  The x-position of the audio from -1000.0 to 1000.0.
	   * @param  {Number} y  The y-position of the audio from -1000.0 to 1000.0.
	   * @param  {Number} z  The z-position of the audio from -1000.0 to 1000.0.
	   * @param  {Number} id (optional) The sound ID. If none is passed, all in group will be updated.
	   * @return {Howl/Array}    Returns self or the current 3D spatial position: [x, y, z].
	   */
	  Howl.prototype.pos = function(x, y, z, id) {
	    var self = this;

	    // Stop right here if not using Web Audio.
	    if (!self._webAudio) {
	      return self;
	    }

	    // If the sound hasn't loaded, add it to the load queue to change position when capable.
	    if (self._state !== 'loaded') {
	      self._queue.push({
	        event: 'pos',
	        action: function() {
	          self.pos(x, y, z, id);
	        }
	      });

	      return self;
	    }

	    // Set the defaults for optional 'y' & 'z'.
	    y = (typeof y !== 'number') ? 0 : y;
	    z = (typeof z !== 'number') ? -0.5 : z;

	    // Setup the group's spatial position if no ID is passed.
	    if (typeof id === 'undefined') {
	      // Return the group's spatial position if no parameters are passed.
	      if (typeof x === 'number') {
	        self._pos = [x, y, z];
	      } else {
	        return self._pos;
	      }
	    }

	    // Change the spatial position of one or all sounds in group.
	    var ids = self._getSoundIds(id);
	    for (var i=0; i<ids.length; i++) {
	      // Get the sound.
	      var sound = self._soundById(ids[i]);

	      if (sound) {
	        if (typeof x === 'number') {
	          sound._pos = [x, y, z];

	          if (sound._node) {
	            // Check if there is a panner setup and create a new one if not.
	            if (!sound._panner || sound._panner.pan) {
	              setupPanner(sound, 'spatial');
	            }

	            sound._panner.setPosition(x, y, z);
	          }

	          self._emit('pos', sound._id);
	        } else {
	          return sound._pos;
	        }
	      }
	    }

	    return self;
	  };

	  /**
	   * Get/set the direction the audio source is pointing in the 3D cartesian coordinate
	   * space. Depending on how direction the sound is, based on the `cone` attributes,
	   * a sound pointing away from the listener can be quiet or silent.
	   * @param  {Number} x  The x-orientation of the source.
	   * @param  {Number} y  The y-orientation of the source.
	   * @param  {Number} z  The z-orientation of the source.
	   * @param  {Number} id (optional) The sound ID. If none is passed, all in group will be updated.
	   * @return {Howl/Array}    Returns self or the current 3D spatial orientation: [x, y, z].
	   */
	  Howl.prototype.orientation = function(x, y, z, id) {
	    var self = this;

	    // Stop right here if not using Web Audio.
	    if (!self._webAudio) {
	      return self;
	    }

	    // If the sound hasn't loaded, add it to the load queue to change orientation when capable.
	    if (self._state !== 'loaded') {
	      self._queue.push({
	        event: 'orientation',
	        action: function() {
	          self.orientation(x, y, z, id);
	        }
	      });

	      return self;
	    }

	    // Set the defaults for optional 'y' & 'z'.
	    y = (typeof y !== 'number') ? self._orientation[1] : y;
	    z = (typeof z !== 'number') ? self._orientation[2] : z;

	    // Setup the group's spatial orientation if no ID is passed.
	    if (typeof id === 'undefined') {
	      // Return the group's spatial orientation if no parameters are passed.
	      if (typeof x === 'number') {
	        self._orientation = [x, y, z];
	      } else {
	        return self._orientation;
	      }
	    }

	    // Change the spatial orientation of one or all sounds in group.
	    var ids = self._getSoundIds(id);
	    for (var i=0; i<ids.length; i++) {
	      // Get the sound.
	      var sound = self._soundById(ids[i]);

	      if (sound) {
	        if (typeof x === 'number') {
	          sound._orientation = [x, y, z];

	          if (sound._node) {
	            // Check if there is a panner setup and create a new one if not.
	            if (!sound._panner) {
	              // Make sure we have a position to setup the node with.
	              if (!sound._pos) {
	                sound._pos = self._pos || [0, 0, -0.5];
	              }

	              setupPanner(sound, 'spatial');
	            }

	            sound._panner.setOrientation(x, y, z);
	          }

	          self._emit('orientation', sound._id);
	        } else {
	          return sound._orientation;
	        }
	      }
	    }

	    return self;
	  };

	  /**
	   * Get/set the panner node's attributes for a sound or group of sounds.
	   * This method can optionall take 0, 1 or 2 arguments.
	   *   pannerAttr() -> Returns the group's values.
	   *   pannerAttr(id) -> Returns the sound id's values.
	   *   pannerAttr(o) -> Set's the values of all sounds in this Howl group.
	   *   pannerAttr(o, id) -> Set's the values of passed sound id.
	   *
	   *   Attributes:
	   *     coneInnerAngle - (360 by default) There will be no volume reduction inside this angle.
	   *     coneOuterAngle - (360 by default) The volume will be reduced to a constant value of
	   *                      `coneOuterGain` outside this angle.
	   *     coneOuterGain - (0 by default) The amount of volume reduction outside of `coneOuterAngle`.
	   *     distanceModel - ('inverse' by default) Determines algorithm to use to reduce volume as audio moves
	   *                      away from listener. Can be `linear`, `inverse` or `exponential`.
	   *     maxDistance - (10000 by default) Volume won't reduce between source/listener beyond this distance.
	   *     panningModel - ('HRTF' by default) Determines which spatialization algorithm is used to position audio.
	   *                     Can be `HRTF` or `equalpower`.
	   *     refDistance - (1 by default) A reference distance for reducing volume as the source
	   *                    moves away from the listener.
	   *     rolloffFactor - (1 by default) How quickly the volume reduces as source moves from listener.
	   * 
	   * @return {Howl/Object} Returns self or current panner attributes.
	   */
	  Howl.prototype.pannerAttr = function() {
	    var self = this;
	    var args = arguments;
	    var o, id, sound;

	    // Stop right here if not using Web Audio.
	    if (!self._webAudio) {
	      return self;
	    }

	    // Determine the values based on arguments.
	    if (args.length === 0) {
	      // Return the group's panner attribute values.
	      return self._pannerAttr;
	    } else if (args.length === 1) {
	      if (typeof args[0] === 'object') {
	        o = args[0];

	        // Set the grou's panner attribute values.
	        if (typeof id === 'undefined') {
	          self._pannerAttr = {
	            coneInnerAngle: typeof o.coneInnerAngle !== 'undefined' ? o.coneInnerAngle : self._coneInnerAngle,
	            coneOuterAngle: typeof o.coneOuterAngle !== 'undefined' ? o.coneOuterAngle : self._coneOuterAngle,
	            coneOuterGain: typeof o.coneOuterGain !== 'undefined' ? o.coneOuterGain : self._coneOuterGain,
	            distanceModel: typeof o.distanceModel !== 'undefined' ? o.distanceModel : self._distanceModel,
	            maxDistance: typeof o.maxDistance !== 'undefined' ? o.maxDistance : self._maxDistance,
	            panningModel: typeof o.panningModel !== 'undefined' ? o.panningModel : self._panningModel,
	            refDistance: typeof o.refDistance !== 'undefined' ? o.refDistance : self._refDistance,
	            rolloffFactor: typeof o.rolloffFactor !== 'undefined' ? o.rolloffFactor : self._rolloffFactor
	          };
	        }
	      } else {
	        // Return this sound's panner attribute values.
	        sound = self._soundById(parseInt(args[0], 10));
	        return sound ? sound._pannerAttr : self._pannerAttr;
	      }
	    } else if (args.length === 2) {
	      o = args[0];
	      id = parseInt(args[1], 10);
	    }

	    // Update the values of the specified sounds.
	    var ids = self._getSoundIds(id);
	    for (var i=0; i<ids.length; i++) {
	      sound = self._soundById(ids[i]);

	      if (sound) {
	        // Merge the new values into the sound.
	        var pa = sound._pannerAttr;
	        pa = {
	          coneInnerAngle: typeof o.coneInnerAngle !== 'undefined' ? o.coneInnerAngle : pa.coneInnerAngle,
	          coneOuterAngle: typeof o.coneOuterAngle !== 'undefined' ? o.coneOuterAngle : pa.coneOuterAngle,
	          coneOuterGain: typeof o.coneOuterGain !== 'undefined' ? o.coneOuterGain : pa.coneOuterGain,
	          distanceModel: typeof o.distanceModel !== 'undefined' ? o.distanceModel : pa.distanceModel,
	          maxDistance: typeof o.maxDistance !== 'undefined' ? o.maxDistance : pa.maxDistance,
	          panningModel: typeof o.panningModel !== 'undefined' ? o.panningModel : pa.panningModel,
	          refDistance: typeof o.refDistance !== 'undefined' ? o.refDistance : pa.refDistance,
	          rolloffFactor: typeof o.rolloffFactor !== 'undefined' ? o.rolloffFactor : pa.rolloffFactor
	        };

	        // Update the panner values or create a new panner if none exists.
	        var panner = sound._panner;
	        if (panner) {
	          panner.coneInnerAngle = pa.coneInnerAngle;
	          panner.coneOuterAngle = pa.coneOuterAngle;
	          panner.coneOuterGain = pa.coneOuterGain;
	          panner.distanceModel = pa.distanceModel;
	          panner.maxDistance = pa.maxDistance;
	          panner.panningModel = pa.panningModel;
	          panner.refDistance = pa.refDistance;
	          panner.rolloffFactor = pa.rolloffFactor;
	        } else {
	          // Make sure we have a position to setup the node with.
	          if (!sound._pos) {
	            sound._pos = self._pos || [0, 0, -0.5];
	          }

	          // Create a new panner node.
	          setupPanner(sound, 'spatial');
	        }
	      }
	    }

	    return self;
	  };

	  /** Single Sound Methods **/
	  /***************************************************************************/

	  /**
	   * Add new properties to the core Sound init.
	   * @param  {Function} _super Core Sound init method.
	   * @return {Sound}
	   */
	  Sound.prototype.init = (function(_super) {
	    return function() {
	      var self = this;
	      var parent = self._parent;

	      // Setup user-defined default properties.
	      self._orientation = parent._orientation;
	      self._stereo = parent._stereo;
	      self._pos = parent._pos;
	      self._pannerAttr = parent._pannerAttr;

	      // Complete initilization with howler.js core Sound's init function.
	      _super.call(this);

	      // If a stereo or position was specified, set it up.
	      if (self._stereo) {
	        parent.stereo(self._stereo);
	      } else if (self._pos) {
	        parent.pos(self._pos[0], self._pos[1], self._pos[2], self._id);
	      }
	    };
	  })(Sound.prototype.init);

	  /**
	   * Override the Sound.reset method to clean up properties from the spatial plugin.
	   * @param  {Function} _super Sound reset method.
	   * @return {Sound}
	   */
	  Sound.prototype.reset = (function(_super) {
	    return function() {
	      var self = this;
	      var parent = self._parent;

	      // Reset all spatial plugin properties on this sound.
	      self._orientation = parent._orientation;
	      self._pos = parent._pos;
	      self._pannerAttr = parent._pannerAttr;

	      // Complete resetting of the sound.
	      return _super.call(this);
	    };
	  })(Sound.prototype.reset);

	  /** Helper Methods **/
	  /***************************************************************************/

	  /**
	   * Create a new panner node and save it on the sound.
	   * @param  {Sound} sound Specific sound to setup panning on.
	   * @param {String} type Type of panner to create: 'stereo' or 'spatial'.
	   */
	  var setupPanner = function(sound, type) {
	    type = type || 'spatial';

	    // Create the new panner node.
	    if (type === 'spatial') {
	      sound._panner = Howler.ctx.createPanner();
	      sound._panner.coneInnerAngle = sound._pannerAttr.coneInnerAngle;
	      sound._panner.coneOuterAngle = sound._pannerAttr.coneOuterAngle;
	      sound._panner.coneOuterGain = sound._pannerAttr.coneOuterGain;
	      sound._panner.distanceModel = sound._pannerAttr.distanceModel;
	      sound._panner.maxDistance = sound._pannerAttr.maxDistance;
	      sound._panner.panningModel = sound._pannerAttr.panningModel;
	      sound._panner.refDistance = sound._pannerAttr.refDistance;
	      sound._panner.rolloffFactor = sound._pannerAttr.rolloffFactor;
	      sound._panner.setPosition(sound._pos[0], sound._pos[1], sound._pos[2]);
	      sound._panner.setOrientation(sound._orientation[0], sound._orientation[1], sound._orientation[2]);
	    } else {
	      sound._panner = Howler.ctx.createStereoPanner();
	      sound._panner.pan.value = sound._stereo;
	    }

	    sound._panner.connect(sound._node);

	    // Update the connections.
	    if (!sound._paused) {
	      sound._parent.pause(sound._id, true).play(sound._id);
	    }
	  };
	})();

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 15 */
/***/ function(module, exports) {

	"use strict";
	function random(start, end) {
	    return Math.floor(Math.random() * (end - start + 1)) + start;
	}
	exports.random = random;
	function randomFloat(start, end) {
	    return Math.random() * (end - start) + start;
	}
	exports.randomFloat = randomFloat;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var screen_1 = __webpack_require__(6);
	var util_1 = __webpack_require__(15);
	var object2d_1 = __webpack_require__(8);
	var bullet_1 = __webpack_require__(12);
	var vector_1 = __webpack_require__(11);
	var BIG_ALIEN_BULLET_SPEED = 600 * screen_1.default.objectScale;
	var SMALL_ALIEN_BULLET_SPEED = 800 * screen_1.default.objectScale;
	var BIG_ALIEN_SPEED = 225 * screen_1.default.objectScale;
	var SMALL_ALIEN_SPEED = 250 * screen_1.default.objectScale;
	var Alien = (function (_super) {
	    __extends(Alien, _super);
	    function Alien(speed) {
	        var _this = _super.call(this, 0, 0) || this;
	        _this.moveTimer = 0;
	        _this.moveTime = 1;
	        _this.bulletTimer = 0;
	        _this.bulletTime = .7;
	        _this.vy = 0;
	        _this.origin.y = util_1.random(100, screen_1.default.height - 100);
	        if (_this.origin.y % 2 === 0) {
	            _this.origin.x = 40;
	            _this.vx = speed;
	        }
	        else {
	            _this.origin.x = screen_1.default.width - 40;
	            _this.vx = -speed;
	        }
	        _this.points = [
	            { x: .5, y: -2 },
	            { x: 1, y: -1 },
	            { x: 2.5, y: 0 },
	            { x: 1, y: 1 },
	            { x: -1, y: 1 },
	            { x: -2.5, y: 0 },
	            { x: -1, y: -1 },
	            { x: -.5, y: -2 }
	        ];
	        return _this;
	    }
	    Alien.prototype.update = function (dt) {
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
	        }
	        this.bulletTimer += dt;
	        if (this.bulletTimer >= this.bulletTime) {
	            this.fire();
	            this.bulletTimer = 0;
	        }
	    };
	    Alien.prototype.render = function () {
	        this.draw();
	    };
	    Alien.prototype.draw = function () {
	        _super.prototype.draw.call(this);
	        screen_1.default.draw.shape([this.points[1], this.points[6]], this.origin.x, this.origin.y);
	        screen_1.default.draw.shape([this.points[2], this.points[5]], this.origin.x, this.origin.y);
	    };
	    return Alien;
	}(object2d_1.Object2D));
	exports.Alien = Alien;
	var BigAlien = (function (_super) {
	    __extends(BigAlien, _super);
	    function BigAlien() {
	        var _this = _super.call(this, BIG_ALIEN_SPEED) || this;
	        _this.score = 200;
	        _this.scale(7);
	        return _this;
	    }
	    BigAlien.prototype.fire = function () {
	        var v = new vector_1.Vector(util_1.random(1, 360), BIG_ALIEN_BULLET_SPEED);
	        var bullet = new bullet_1.Bullet(this.origin.x, this.origin.y, v);
	        this.trigger('fire', bullet);
	    };
	    BigAlien.prototype.destroy = function () {
	        this.trigger('expired');
	    };
	    return BigAlien;
	}(Alien));
	exports.BigAlien = BigAlien;
	var SmallAlien = (function (_super) {
	    __extends(SmallAlien, _super);
	    function SmallAlien(ship) {
	        var _this = _super.call(this, SMALL_ALIEN_SPEED) || this;
	        _this.ship = ship;
	        _this.score = 1000;
	        _this.bulletTime = 1;
	        _this.scale(4);
	        return _this;
	    }
	    SmallAlien.prototype.fire = function () {
	        var bullet;
	        if (this.ship) {
	            var v = vector_1.Vector.fromXY(this.ship.origin, this.origin, SMALL_ALIEN_BULLET_SPEED);
	            bullet = new bullet_1.Bullet(this.origin.x, this.origin.y, v, 2);
	        }
	        else {
	            var v = new vector_1.Vector(util_1.random(1, 360), SMALL_ALIEN_BULLET_SPEED);
	            bullet = new bullet_1.Bullet(this.origin.x, this.origin.y, v, 2);
	        }
	        this.trigger('fire', bullet);
	    };
	    SmallAlien.prototype.destroy = function () {
	        this.ship = null;
	        this.trigger('expired');
	    };
	    return SmallAlien;
	}(Alien));
	exports.SmallAlien = SmallAlien;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var events_1 = __webpack_require__(9);
	var screen_1 = __webpack_require__(6);
	var vector_1 = __webpack_require__(11);
	var util_1 = __webpack_require__(15);
	var VELOCITY = 300 * screen_1.default.objectScale;
	var Explosion = (function (_super) {
	    __extends(Explosion, _super);
	    function Explosion(x, y, size) {
	        if (size === void 0) { size = 100; }
	        var _this = _super.call(this) || this;
	        _this.x = x;
	        _this.y = y;
	        _this.size = size;
	        _this.life = 3;
	        _this.points = [];
	        for (var i = 0; i < 15; i++) {
	            var v = new vector_1.Vector(util_1.random(1, 360), Math.random() * VELOCITY);
	            _this.points.push({ x: x, y: y, vx: v.x, vy: v.y, alpha: Math.random() });
	        }
	        return _this;
	    }
	    Explosion.prototype.update = function (dt) {
	        this.points.forEach(function (point) {
	            point.x += point.vx * dt;
	            point.y += point.vy * dt;
	            point.alpha -= .002;
	        });
	        this.life -= dt;
	        if (this.life <= .1) {
	            this.trigger('expired');
	        }
	    };
	    Explosion.prototype.render = function (dt) {
	        this.points.forEach(function (point) {
	            if (util_1.random(1, 10) % 2 === 0) {
	                screen_1.default.draw.rect(point, { x: 2, y: 2 }, "rgba(255,255,255," + point.alpha + ")");
	            }
	        });
	    };
	    return Explosion;
	}(events_1.EventSource));
	exports.Explosion = Explosion;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var screen_1 = __webpack_require__(6);
	var object2d_1 = __webpack_require__(8);
	var util_1 = __webpack_require__(15);
	var Shockwave = (function (_super) {
	    __extends(Shockwave, _super);
	    function Shockwave(x, y, vx, vy, size, multiplier) {
	        if (multiplier === void 0) { multiplier = 1; }
	        var _this = _super.call(this, x, y) || this;
	        _this.vx = vx;
	        _this.vy = vy;
	        _this.size = size;
	        _this.multiplier = multiplier;
	        _this.life = 1;
	        _this.frame = 0;
	        _this.radius = 1;
	        _this.rocks = [];
	        return _this;
	    }
	    Shockwave.prototype.update = function (dt) {
	        this.frame++;
	        this.radius = this.size * (this.frame / 10);
	        this.life -= dt;
	        this.origin.x += this.vx * dt;
	        this.origin.y += this.vy * dt;
	        if (this.life <= .1) {
	            this.rocks.length = 0;
	            this.trigger('expired');
	        }
	    };
	    Shockwave.prototype.render = function (dt) {
	        if (this.frame === 1) {
	            var radius = (this.size * (util_1.random(25, 55))) / 10;
	            var ctx = screen_1.default.ctx;
	            ctx.beginPath();
	            ctx.arc(this.origin.x, this.origin.y, radius, 0, 2 * Math.PI, false);
	            ctx.fillStyle = "rgba(255, 255, 255, " + util_1.random(.2, .5) + ")";
	            ctx.fill();
	            ctx.stroke();
	            ctx.closePath();
	        }
	        screen_1.default.draw.circle(this.origin.x, this.origin.y, this.radius, "rgba(128,128,128," + (.5 - (this.frame / 100)) + ")");
	    };
	    Object.defineProperty(Shockwave.prototype, "x", {
	        get: function () {
	            return this.origin.x - this.radius;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Shockwave.prototype, "y", {
	        get: function () {
	            return this.origin.y - this.radius;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Shockwave.prototype, "width", {
	        get: function () {
	            return this.radius * 2;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Shockwave.prototype, "height", {
	        get: function () {
	            return this.radius * 2;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return Shockwave;
	}(object2d_1.Object2D));
	exports.Shockwave = Shockwave;


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var screen_1 = __webpack_require__(6);
	var object2d_1 = __webpack_require__(8);
	var vector_1 = __webpack_require__(11);
	var util_1 = __webpack_require__(15);
	var sounds_1 = __webpack_require__(13);
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
	            [-1, -2]
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
	            [-1, -2]
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
	            [-1, -2]
	        ];
	        _this.rocks = [_this.rock1, _this.rock2, _this.rock3];
	        var velocity = speed * screen_1.default.objectScale;
	        _this.vx = v.x * velocity;
	        _this.vy = v.y * velocity;
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
	        _this.rot = util_1.random(.01, 1) % 2 === 0 ? 1 : -1;
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
	        var sound;
	        switch (this.size) {
	            case RockSize.Large:
	                sound = sounds_1.largeExplosion;
	                break;
	            case RockSize.Medium:
	                sound = sounds_1.mediumExplosion;
	                break;
	            case RockSize.Small:
	                sound = sounds_1.smallExplosion;
	                break;
	        }
	        var rate = util_1.randomFloat(.7, 1);
	        sound.rate(rate);
	        sound.play();
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
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var screen_1 = __webpack_require__(6);
	var object2d_1 = __webpack_require__(8);
	var ScoreMarker = (function (_super) {
	    __extends(ScoreMarker, _super);
	    function ScoreMarker(obj, text) {
	        var _this = _super.call(this, obj.origin.x, obj.origin.y) || this;
	        _this.text = text;
	        _this.life = 1;
	        _this.vx = obj.vx;
	        _this.vy = obj.vy;
	        return _this;
	    }
	    ScoreMarker.prototype.render = function () {
	        this.draw();
	    };
	    ScoreMarker.prototype.update = function (dt) {
	        this.move(dt);
	        this.life -= dt;
	        if (this.life <= 0) {
	            this.destroy();
	        }
	    };
	    ScoreMarker.prototype.draw = function () {
	        screen_1.default.draw.text(this.text, this.origin.x, this.origin.y, this.life * 50, "rgba(255,255,255," + this.life + ")");
	    };
	    ScoreMarker.prototype.destroy = function () {
	        this.life = 0;
	        this.trigger('expired');
	    };
	    return ScoreMarker;
	}(object2d_1.Object2D));
	exports.ScoreMarker = ScoreMarker;


/***/ },
/* 21 */
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
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var screen_1 = __webpack_require__(6);
	var highscores_1 = __webpack_require__(21);
	var HighScoreMode = (function () {
	    function HighScoreMode(score) {
	        this.score = score;
	        this.blink = 0;
	        this.showPushStart = true;
	        this.highscore = highscores_1.highscores.top.score;
	    }
	    HighScoreMode.prototype.update = function (dt) {
	        this.blink += dt;
	        if (this.blink >= .4) {
	            this.blink = 0;
	            this.showPushStart = !this.showPushStart;
	        }
	    };
	    HighScoreMode.prototype.render = function () {
	        this.drawBackground();
	        this.drawPushStart();
	        this.drawHighScores();
	    };
	    HighScoreMode.prototype.drawBackground = function () {
	        screen_1.default.draw.background();
	        screen_1.default.draw.scorePlayer1(this.score);
	        screen_1.default.draw.oneCoinOnePlay();
	        screen_1.default.draw.highscore(this.highscore);
	        screen_1.default.draw.copyright();
	    };
	    HighScoreMode.prototype.drawHighScores = function () {
	        var screenX = screen_1.default.width / 2;
	        var startY = Math.ceil(screen_1.default.height / 4.5) + (screen_1.default.font.xlarge + screen_1.default.font.small);
	        var spacing = screen_1.default.font.medium + screen_1.default.font.small;
	        screen_1.default.draw.text2('high scores', screen_1.default.font.medium, function (width) {
	            return {
	                x: screenX - (width / 2),
	                y: screen_1.default.height / 4.5
	            };
	        });
	        var _loop_1 = function (i) {
	            var y = startY + (i * spacing);
	            var text = this_1.pad(i + 1, ' ', 2) + "." + this_1.pad(highscores_1.highscores.scores[i].score, ' ', 6) + " " + highscores_1.highscores.scores[i].initials;
	            screen_1.default.draw.text2(text, screen_1.default.font.medium, function (width) {
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
	    HighScoreMode.prototype.drawPushStart = function () {
	        if (this.showPushStart) {
	            screen_1.default.draw.pushStart();
	        }
	    };
	    HighScoreMode.prototype.pad = function (text, char, count) {
	        text = text.toString();
	        while (text.length < count) {
	            text = char + text;
	        }
	        return text;
	    };
	    return HighScoreMode;
	}());
	exports.HighScoreMode = HighScoreMode;


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var screen_1 = __webpack_require__(6);
	var keys_1 = __webpack_require__(2);
	var highscores_1 = __webpack_require__(21);
	var events_1 = __webpack_require__(9);
	var letters = '_abcdefghijklmnopqrstuvwxyz';
	var InitialsMode = (function (_super) {
	    __extends(InitialsMode, _super);
	    function InitialsMode(score) {
	        var _this = _super.call(this) || this;
	        _this.index = 1;
	        _this.score = score;
	        _this.init();
	        return _this;
	    }
	    InitialsMode.prototype.init = function () {
	        this.position = 0;
	        this.index = 1;
	        this.initials = ['a', '_', '_'];
	    };
	    InitialsMode.prototype.update = function (dt) {
	        if (keys_1.Key.isPressed(keys_1.Key.ROTATE_LEFT)) {
	            this.index--;
	            if (this.index < 0) {
	                this.index = letters.length - 1;
	            }
	            this.initials[this.position] = letters[this.index];
	        }
	        if (keys_1.Key.isPressed(keys_1.Key.ROTATE_RIGHT)) {
	            this.index++;
	            if (this.index > letters.length - 1) {
	                this.index = 0;
	            }
	            this.initials[this.position] = letters[this.index];
	        }
	        if (keys_1.Key.isPressed(keys_1.Key.HYPERSPACE)) {
	            this.position++;
	            if (this.position >= 3) {
	                highscores_1.highscores.save(this.score, this.initials.join('').replace('_', ' '));
	                this.init();
	                this.trigger('done');
	            }
	            this.index = 1;
	            this.initials[this.position] = letters[this.index];
	        }
	    };
	    InitialsMode.prototype.render = function () {
	        var offset = screen_1.default.height / 4.5;
	        var text = (function (t) { return screen_1.default.draw.text(t, 50, offset += screen_1.default.font.large + 5, screen_1.default.font.large); });
	        screen_1.default.draw.background();
	        screen_1.default.draw.highscore(highscores_1.highscores.top.score);
	        screen_1.default.draw.scorePlayer1(this.score);
	        screen_1.default.draw.copyright();
	        text('your score is one of the ten best');
	        text('please enter your initials');
	        text('push rotate to select letter');
	        text('push hyperspace when letter is correct');
	        screen_1.default.draw.text3(this.initials.join(''), screen_1.default.font.xlarge, function (width) {
	            return { x: screen_1.default.width2 - (width / 2), y: screen_1.default.height / 2 + screen_1.default.font.xlarge };
	        });
	    };
	    return InitialsMode;
	}(events_1.EventSource));
	exports.InitialsMode = InitialsMode;


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var screen_1 = __webpack_require__(6);
	var collisions_1 = __webpack_require__(25);
	var AttractMode = (function () {
	    function AttractMode(world) {
	        this.world = world;
	        this.showPushStart = true;
	        this.pushStartTimer = 0;
	        this.init();
	    }
	    AttractMode.prototype.init = function () {
	        if (!this.world.started) {
	            this.world.startLevel();
	        }
	    };
	    AttractMode.prototype.update = function (dt) {
	        this.checkCollisions();
	        this.world.updateAlienTimer(dt);
	        if (!this.world.rocks.length && !this.world.scenery.length && !this.world.alien) {
	            this.world.startLevel();
	        }
	        this.updatePushStartTimer(dt);
	        this.world.update(dt);
	    };
	    AttractMode.prototype.updatePushStartTimer = function (dt) {
	        this.pushStartTimer += dt;
	        if (this.pushStartTimer >= .4) {
	            this.pushStartTimer = 0;
	            this.showPushStart = !this.showPushStart;
	        }
	    };
	    AttractMode.prototype.checkCollisions = function () {
	        var _this = this;
	        var _a = this.world, alien = _a.alien, rocks = _a.rocks, alienBullets = _a.alienBullets;
	        var check = !!alien || !!alienBullets.length;
	        if (!check) {
	            return;
	        }
	        var collisions = new collisions_1.Collisions();
	        collisions.check([alien], rocks, function (alien, rock) {
	            _this.world.alienDestroyed();
	            _this.world.rockDestroyed(rock);
	        });
	        collisions.check(alienBullets, rocks, function (bullet, rock) {
	            _this.world.rockDestroyed(rock);
	        });
	    };
	    AttractMode.prototype.render = function (delta) {
	        this.drawBackground();
	        this.drawPushStart();
	        this.world.render(delta);
	    };
	    AttractMode.prototype.drawBackground = function () {
	        screen_1.default.draw.background();
	        screen_1.default.draw.scorePlayer1(this.world.score);
	        screen_1.default.draw.oneCoinOnePlay();
	        screen_1.default.draw.highscore(this.world.highscore);
	        screen_1.default.draw.copyright();
	    };
	    AttractMode.prototype.drawPushStart = function () {
	        if (this.showPushStart) {
	            screen_1.default.draw.pushStart();
	        }
	    };
	    return AttractMode;
	}());
	exports.AttractMode = AttractMode;


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var screen_1 = __webpack_require__(6);
	var quadtree_1 = __webpack_require__(26);
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
	        var candidates = [];
	        this.tree.clear();
	        targets.forEach(function (target) {
	            _this.tree.insert(target);
	        });
	        sources.forEach(function (source) {
	            candidates.length = 0;
	            candidates.push.apply(candidates, _this.tree.retrieve(source));
	            candidates.forEach(function (candidate) {
	                if (candidate.collided(source)) {
	                    if (source.pointInPolyCheck || candidate.pointInPolyCheck) {
	                        if (_this.pointsInPolygon(source, candidate)) {
	                            cb(source, candidate);
	                        }
	                    }
	                    else {
	                        cb(source, candidate);
	                    }
	                }
	                else if (dcb) {
	                    dcb(source, candidate);
	                }
	            });
	        });
	    };
	    Collisions.prototype.pointsInPolygon = function (source, candidate) {
	        var vert1 = source.vertices.length > candidate.vertices.length ? source.vertices : candidate.vertices;
	        var vert2 = source.vertices.length <= candidate.vertices.length ? source.vertices : candidate.vertices;
	        for (var i = 0, l = vert2.length; i < l; i++) {
	            if (this.pointInPoly(vert1, vert2[i])) {
	                return true;
	            }
	        }
	        return false;
	    };
	    Collisions.prototype.pointInPoly = function (v, t) {
	        var polyCorners = v.length - 1;
	        var i, j = polyCorners - 1;
	        var polyX = v.map(function (p) { return p.x; });
	        var polyY = v.map(function (p) { return p.y; });
	        var x = t.x;
	        var y = t.y;
	        var oddNodes = 0;
	        for (i = 0; i < polyCorners; i++) {
	            if ((polyY[i] < y && polyY[j] >= y
	                || polyY[j] < y && polyY[i] >= y)
	                && (polyX[i] <= x || polyX[j] <= x)) {
	                oddNodes ^= polyX[i] + (y - polyY[i]) / (polyY[j] - polyY[i]) * (polyX[j] - polyX[i]) < x;
	            }
	            j = i;
	        }
	        return oddNodes;
	    };
	    return Collisions;
	}());
	exports.Collisions = Collisions;


/***/ },
/* 26 */
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
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var keys_1 = __webpack_require__(2);
	var events_1 = __webpack_require__(9);
	var collisions_1 = __webpack_require__(25);
	var screen_1 = __webpack_require__(6);
	var sounds_1 = __webpack_require__(13);
	var thump_1 = __webpack_require__(28);
	var SHAKE_TIME = .5;
	var GameMode = (function (_super) {
	    __extends(GameMode, _super);
	    function GameMode(world) {
	        var _this = _super.call(this) || this;
	        _this.world = world;
	        _this.debug = false;
	        _this.bounds = [];
	        _this.god = false;
	        _this.shakeTime = 0;
	        return _this;
	    }
	    GameMode.prototype.init = function () {
	        this.world.addShip(screen_1.default.width2, screen_1.default.height2);
	        this.world.startLevel();
	        this.thumper = new thump_1.Thumper();
	    };
	    GameMode.prototype.update = function (dt) {
	        if (keys_1.Key.isPressed(keys_1.Key.GOD)) {
	            this.god = !this.god;
	        }
	        if (keys_1.Key.isPressed(keys_1.Key.DEBUG)) {
	            this.debug = !this.debug;
	        }
	        if (keys_1.Key.isPressed(keys_1.Key.PAUSE)) {
	            this.world.paused = !this.world.paused;
	            if (this.world.paused) {
	                sounds_1.Sound.off();
	                console.log(this);
	            }
	            else {
	                sounds_1.Sound.on();
	            }
	        }
	        if (this.world.paused) {
	            return;
	        }
	        this.world.levelTimer += dt;
	        if (this.thumper && this.world.ship) {
	            this.thumper.update(dt);
	        }
	        if (this.world.gameOver) {
	            this.world.gameOverTimer += dt;
	            if (this.world.gameOverTimer >= 5) {
	                this.trigger('done', this.world);
	            }
	        }
	        if (!this.world.started) {
	            if (this.world.levelTimer >= 2) {
	                this.init();
	                this.world.started = true;
	            }
	            return;
	        }
	        this.checkCollisions(dt);
	        this.world.updateAlienTimer(dt);
	        if (this.shakeTime > 0) {
	            this.shakeTime -= dt;
	        }
	        if (!this.world.gameOver) {
	            if (this.world.shouldTryToPlaceShip()) {
	                this.world.tryPlaceShip(dt);
	            }
	            if (this.world.shouldCheckForNextLevel()) {
	                this.world.startLevel();
	                this.thumper.reset();
	            }
	        }
	        if (!this.world.lives) {
	            this.world.gameOver = true;
	        }
	        this.world.update(dt);
	    };
	    GameMode.prototype.render = function (delta) {
	        if (this.world.paused) {
	            return;
	        }
	        if (this.shakeTime > 0) {
	            screen_1.default.preShake();
	        }
	        this.renderStatic();
	        this.world.render(delta);
	        if (this.shakeTime > 0) {
	            screen_1.default.postShake();
	        }
	    };
	    GameMode.prototype.renderStatic = function () {
	        screen_1.default.draw.background();
	        screen_1.default.draw.copyright();
	        screen_1.default.draw.scorePlayer1(this.world.score);
	        screen_1.default.draw.highscore(this.world.highscore);
	        screen_1.default.draw.drawExtraLives(this.world.lives);
	        if (this.world.ship) {
	            screen_1.default.draw.line({ x: 40, y: 80 }, { x: 140, y: 80 }, "rgba(255,255,255,.4)");
	            screen_1.default.draw.line({ x: 40, y: 80 }, { x: 40 + this.world.ship.shield * 50, y: 80 }, "rgba(255,255,255,.6)");
	        }
	        if (!this.world.started) {
	            screen_1.default.draw.player1();
	        }
	        if (this.world.gameOver) {
	            screen_1.default.draw.gameOver();
	        }
	        if (this.debug) {
	            this.renderDebug();
	        }
	    };
	    GameMode.prototype.renderDebug = function () {
	        if (this.god) {
	            screen_1.default.draw.text2('god', screen_1.default.font.small, function (width) {
	                return { x: screen_1.default.width - width - 10, y: screen_1.default.height - 80 };
	            });
	        }
	        screen_1.default.draw.text2('debug mode', screen_1.default.font.small, function (width) {
	            return { x: screen_1.default.width - width - 10, y: screen_1.default.height - 40 };
	        });
	        if (this.bounds) {
	            this.bounds.forEach(function (r) {
	                screen_1.default.draw.bounds(r, '#fc058d');
	            });
	        }
	        if (!this.world.ship && this.world.lives) {
	            var rect = screen_1.default.shipRect;
	            screen_1.default.draw.bounds(rect, '#00ff00');
	        }
	        if (this.world.ship) {
	            screen_1.default.draw.text(this.world.ship.angle.toString(), this.world.ship.origin.x + 20, this.world.ship.origin.y + 20, 10);
	        }
	        var date = new Date(null);
	        date.setSeconds(this.world.levelTimer);
	        screen_1.default.draw.text2(date.toISOString().substr(11, 8), screen_1.default.font.small, function (width) {
	            return { x: 10, y: screen_1.default.height - 40 };
	        });
	    };
	    GameMode.prototype.setShake = function () {
	        if (this.shakeTime <= 0.0) {
	            this.shakeTime = SHAKE_TIME;
	        }
	    };
	    GameMode.prototype.checkCollisions = function (dt) {
	        var _this = this;
	        var _a = this.world, ship = _a.ship, rocks = _a.rocks, shipBullets = _a.shipBullets, alien = _a.alien, alienBullets = _a.alienBullets, shockwaves = _a.shockwaves;
	        if (!this.world.shouldCheckCollisions()) {
	            return;
	        }
	        this.bounds.length = 0;
	        var collisions = new collisions_1.Collisions();
	        collisions.check(shipBullets, rocks, function (bullet, rock) {
	            _this.setShake();
	            _this.world.addScore(rock);
	            _this.world.rockDestroyed(rock);
	            bullet.destroy();
	        }, function (bullet, rock) {
	            if (_this.debug) {
	                _this.bounds.push(rock);
	            }
	        });
	        collisions.check(shipBullets, [alien], function (bullet, alien) {
	            _this.setShake();
	            _this.world.addScore(alien);
	            _this.world.alienDestroyed();
	            bullet.destroy();
	        }, function (bullet, alien) {
	            if (_this.debug) {
	                _this.bounds.push(alien);
	            }
	        });
	        var cowboys = [];
	        shockwaves.filter(function (x) { return x.rocks.length; }).forEach(function (y) { return cowboys.push.apply(cowboys, y.rocks); });
	        var indians = this.world.rocks.filter(function (x) { return cowboys.indexOf(x) < 0; });
	        collisions.check(cowboys, indians, function (cowboy, indian) {
	            _this.world.addScore(cowboy);
	            _this.world.addScore(indian);
	            _this.world.rockDestroyed(cowboy);
	            _this.world.rockDestroyed(indian);
	        });
	        if (!this.god) {
	            collisions.check([ship], rocks, function (ship, rock) {
	                _this.setShake();
	                _this.world.addScore(rock);
	                _this.world.rockDestroyed(rock);
	                ship.shield -= .5;
	                if (ship.shield <= 0) {
	                    _this.world.shipDestroyed();
	                }
	            }, function (ship, rock) {
	                if (_this.debug) {
	                    _this.bounds.push(rock);
	                }
	            });
	            collisions.check([ship], [alien], function (ship, alien) {
	                _this.setShake();
	                _this.world.addScore(alien);
	                _this.world.alienDestroyed();
	                ship.shield -= .5;
	                if (ship.shield <= 0) {
	                    _this.world.shipDestroyed();
	                }
	            }, function (ship, alien) {
	                if (_this.debug) {
	                    _this.bounds.push(alien);
	                }
	            });
	            collisions.check(alienBullets, [ship], function (bullet, ship) {
	                _this.setShake();
	                ship.shield -= 1;
	                if (ship.shield <= 0) {
	                    _this.world.shipDestroyed();
	                }
	                bullet.destroy();
	            }, function (bullet, ship) {
	                if (_this.debug) {
	                    _this.bounds.push(ship);
	                }
	            });
	        }
	        collisions.check([alien], rocks, function (alien, rock) {
	            _this.setShake();
	            _this.world.alienDestroyed();
	            _this.world.rockDestroyed(rock);
	        }, function (alien, rock) {
	            if (_this.debug) {
	                _this.bounds.push(rock);
	            }
	        });
	        collisions.check(alienBullets, rocks, function (bullet, rock) {
	            _this.setShake();
	            _this.world.rockDestroyed(rock);
	        }, function (bullet, rock) {
	            if (_this.debug) {
	                _this.bounds.push(rock);
	            }
	        });
	    };
	    return GameMode;
	}(events_1.EventSource));
	exports.GameMode = GameMode;


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var sounds_1 = __webpack_require__(13);
	var MIN = .15;
	var MAX_VOL = 1;
	var Thumper = (function () {
	    function Thumper() {
	        this.lo = true;
	        this.reset();
	    }
	    Thumper.prototype.reset = function () {
	        this.thumpBeatTimer = 0;
	        this.thumpBeat = 1;
	        this.thumpTimer = 0;
	        this.thumpTime = 10;
	        this.max = false;
	    };
	    Thumper.prototype.update = function (dt) {
	        this.thumpTimer += dt;
	        this.thumpBeatTimer += dt;
	        this.thumpBeat -= .0002;
	        if (this.thumpBeat <= MIN) {
	            this.thumpBeat = MIN;
	        }
	        if (this.thumpBeatTimer >= this.thumpBeat) {
	            if (this.lo) {
	                sounds_1.thumpLo.play();
	            }
	            else {
	                sounds_1.thumpHi.play();
	            }
	            this.lo = !this.lo;
	            this.thumpBeatTimer = 0;
	        }
	    };
	    return Thumper;
	}());
	exports.Thumper = Thumper;


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var screen_1 = __webpack_require__(6);
	var events_1 = __webpack_require__(9);
	var Flash = (function (_super) {
	    __extends(Flash, _super);
	    function Flash(frames) {
	        var _this = _super.call(this) || this;
	        _this.frames = frames;
	        return _this;
	    }
	    Flash.prototype.render = function () {
	        this.draw();
	    };
	    Flash.prototype.update = function (dt) {
	        this.frames--;
	        if (this.frames <= 0) {
	            this.trigger('expired');
	        }
	    };
	    Flash.prototype.draw = function () {
	        screen_1.default.draw.background('#ffffff');
	    };
	    return Flash;
	}(events_1.EventSource));
	exports.Flash = Flash;


/***/ }
/******/ ]);