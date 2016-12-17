!function(t){function i(n){if(e[n])return e[n].exports;var s=e[n]={exports:{},id:n,loaded:!1};return t[n].call(s.exports,s,s.exports,i),s.loaded=!0,s.exports}var e={};return i.m=t,i.c=e,i.p="",i(0)}([function(t,i,e){"use strict";var n,s=e(1),r=e(2),o=e(3),h=e(6),a=e(9),c=e(20),u=e(7),l=15;!function(t){t[t.Attract=0]="Attract",t[t.Game=1]="Game",t[t.Initials=2]="Initials",t[t.Start=3]="Start"}(n||(n={}));var d=function(){function t(){this.lastScore=0,this.init()}return t.prototype.init=function(){var t=this;this.state=n.Start,this.highScoreState=new o.HighScoreState(this.lastScore),this.attractState=new a.AttractState(this.lastScore),this.gameState=new c.GameState,this.attractTimer=0,this.gameState.on("done",function(i,e){t.lastScore=e,r.highscores.qualifies(e)?(t.initialsState=new h.EnterHighScoreState(e),t.initialsState.on("done",function(){t.init()}),t.state=n.Initials):t.init()}),this.attractStarted=!1},t.prototype.update=function(t){switch(this.state){case n.Start:this.highScoreState.update(t),this.attractStarted&&this.attractState.update(t),u.Key.isPressed(u.Key.ONE)&&(this.state=n.Game),this.updateAttractTimer(t);break;case n.Attract:this.attractState.update(t),u.Key.isPressed(u.Key.ONE)&&(this.state=n.Game),this.updateAttractTimer(t);break;case n.Initials:this.initialsState.update(t);break;case n.Game:this.gameState.update(t)}},t.prototype.render=function(t){switch(this.state){case n.Start:this.highScoreState.render(t);break;case n.Attract:this.attractState.render(t);break;case n.Initials:this.initialsState.render(t);break;case n.Game:this.gameState.render(t)}u.Key.update()},t.prototype.updateAttractTimer=function(t){this.attractTimer+=t,this.attractTimer>=l&&(this.attractTimer=0,this.state=this.state===n.Attract?n.Start:n.Attract)},t}();i.Asteroids=d;var p=new d;setTimeout(function(){s.loop(p)},1e3)},function(t,i){"use strict";var e,n=function(){return window.performance&&window.performance.now?window.performance.now():(new Date).getTime()},s=0,r=n(),o=1/60,h=1e3,a=function(t){var i=function(){for(e=n(),s+=Math.min(1,(e-r)/h);s>o;)t.update(o),s-=o;t.render(s),r=e,requestAnimationFrame(i)};i()};i.loop=function(t){a(t)}},function(t,i){"use strict";var e=[{score:20140,initials:"J H"},{score:20050,initials:"P A"},{score:19930,initials:"  M"},{score:19870,initials:"G I"},{score:19840,initials:"A L"},{score:19790,initials:"M T"},{score:19700,initials:"E O"},{score:19660,initials:"S N"},{score:190,initials:"   "},{score:70,initials:"   "}],n="jph_asteroids_hs",s=function(){function t(){this.scores=[];var t=window.localStorage.getItem(n);this.scores=t?JSON.parse(t)||[]:e}return Object.defineProperty(t.prototype,"top",{get:function(){return this.scores[0]},enumerable:!0,configurable:!0}),t.prototype.qualifies=function(t){var e=i.highscores.scores.filter(function(i){return i.score<t});return!!e.length},t.prototype.save=function(t,i){this.qualifies(t)&&(this.scores.push({score:t,initials:i}),this.scores=this.scores.sort(function(t,i){return t.score>i.score?-1:1}).slice(0,10),window.localStorage.setItem(n,JSON.stringify(this.scores)))},t}();i.highscores=new s},function(t,i,e){"use strict";var n=e(4),s=e(2),r=function(){function t(t){this.score=t,this.blink=0,this.showPushStart=!0,this.highscore=s.highscores.top.score}return t.prototype.update=function(t){this.blink+=t,this.blink>=.4&&(this.blink=0,this.showPushStart=!this.showPushStart)},t.prototype.render=function(){this.drawBackground(),this.drawPushStart(),this.drawHighScores()},t.prototype.drawBackground=function(){n.default.draw.background(),n.default.draw.scorePlayer1(this.score),n.default.draw.oneCoinOnePlay(),n.default.draw.highscore(this.highscore),n.default.draw.copyright()},t.prototype.drawHighScores=function(){var t=n.default.width/2;n.default.draw.text2("high scores","30pt",function(i){return{x:t-i/2,y:200}});for(var i=function(i){var r=280+40*i,o=e.pad(i+1," ",2)+"."+e.pad(s.highscores.scores[i].score," ",6)+" "+s.highscores.scores[i].initials;n.default.draw.text2(o,"30pt",function(i){return{x:t-i/2,y:r}})},e=this,r=0;r<s.highscores.scores.length;r++)i(r)},t.prototype.drawPushStart=function(){this.showPushStart&&n.default.draw.pushStart()},t.prototype.pad=function(t,i,e){for(t=t.toString();t.length<e;)t=i+t;return t},t}();i.HighScoreState=r},function(t,i,e){"use strict";var n=e(5),s=function(){function t(){var t=this;this.x=0,this.y=0,this.canvas=document.getElementById("canvas"),this.ctx=this.canvas.getContext("2d"),this.draw=new n.Draw(this.ctx),this.init(),window.addEventListener("resize",function(){t.init()})}return t.prototype.init=function(){this.canvas.width=document.body.clientWidth,this.canvas.height=document.body.clientHeight,this.width=this.canvas.width,this.height=this.canvas.height,this.width2=this.width/2,this.height2=this.height/2},t}();i.Screen=s,Object.defineProperty(i,"__esModule",{value:!0}),i.default=new s},function(t,i,e){"use strict";var n=e(4),s="rgba(255,255,255,1)",r=function(){function t(t){this.ctx=t}return t.prototype.line=function(t,i,e,n){void 0===e&&(e=s),void 0===n&&(n=2);var r=this.ctx;r.beginPath(),r.strokeStyle=e,r.lineWidth=n,r.moveTo(t.x,t.y),r.lineTo(i.x,i.y),r.stroke(),r.closePath()},t.prototype.shape=function(t,i,e,n){void 0===n&&(n=s);for(var r,o,h=0;h<t.length-1;h++)r={x:i+t[h].x,y:e+t[h].y},o={x:i+t[h+1].x,y:e+t[h+1].y},this.line(r,o,n,2)},t.prototype.rect=function(t,i,e){void 0===e&&(e=s);var n=this.ctx;n.beginPath(),n.fillStyle=e,n.fillRect(t.x,t.y,i.x,i.y),n.stroke(),n.closePath()},t.prototype.point=function(t,i){void 0===i&&(i=s),this.rect(t,{x:4,y:4},i)},t.prototype.background=function(){this.rect({x:0,y:0},{x:n.default.width,y:n.default.height},"#000000")},t.prototype.bounds=function(t,i){void 0===i&&(i=s);var e=this.ctx;t&&(e.save(),e.beginPath(),e.strokeStyle=i,e.lineWidth=2,e.moveTo(t.x,t.y),e.lineTo(t.x+t.width,t.y),e.lineTo(t.x+t.width,t.y+t.height),e.lineTo(t.x,t.y+t.height),e.lineTo(t.x,t.y),e.stroke(),e.closePath(),e.restore())},t.prototype.text=function(t,i,e,n){var r=this.ctx;r.save(),r.font=n+" hyperspace",r.textBaseline="middle",r.lineWidth=1,r.strokeStyle=s,r.strokeText(t,i,e),r.restore()},t.prototype.text2=function(t,i,e){var n=this.ctx;n.save(),n.font=i+" hyperspace",n.textBaseline="middle",n.lineWidth=1,n.strokeStyle=s;var r=n.measureText(t).width,o=e(r);n.strokeText(t,o.x,o.y),n.restore()},t.prototype.text3=function(t,i,e){var n=this.ctx;n.save(),n.font=i+" hyperspace",n.textBaseline="middle",n.lineWidth=2,n.fillStyle=s;var r=n.measureText(t).width,o=e(r);n.fillText(t,o.x,o.y),n.restore()},t.prototype.scorePlayer1=function(t){for(var i=t.toString();i.length<2;)i="0"+i;this.text(i,100,20,"24pt")},t.prototype.highscore=function(t){for(var i=t.toString();i.length<2;)i="0"+i;this.text2(i,"12pt",function(t){return{x:n.default.width2-t/2,y:20}})},t.prototype.oneCoinOnePlay=function(){this.text2("1  coin  1  play","24pt",function(t){return{x:n.default.width2-t/2,y:n.default.height-120}})},t.prototype.pushStart=function(){n.default.draw.text2("push start","30pt",function(t){return{x:n.default.width2-t/2,y:120}})},t.prototype.player1=function(){n.default.draw.text2("player 1","30pt",function(t){return{x:n.default.width2-t/2,y:140}})},t.prototype.gameOver=function(){n.default.draw.text2("game over","30pt",function(t){return{x:n.default.width2-t/2,y:180}})},t.prototype.copyright=function(){this.text2(String.fromCharCode(169)+" 1979 atari inc","12pt",function(t){return{x:n.default.width2-t/2,y:n.default.height-20}})},t.prototype.quadtree=function(t){if(t){var i=function(t){t&&t.forEach(function(t){n.default.draw.bounds(t.bounds),i(t.nodes)})};i(t.nodes)}},t}();i.Draw=r},function(t,i,e){"use strict";var n=this&&this.__extends||function(t,i){function e(){this.constructor=t}for(var n in i)i.hasOwnProperty(n)&&(t[n]=i[n]);t.prototype=null===i?Object.create(i):(e.prototype=i.prototype,new e)},s=e(4),r=e(7),o=e(2),h=e(8),a="_abcdefghijklmnopqrstuvwxyz",c=function(t){function i(i){var e=t.call(this)||this;return e.index=1,e.score=i,e.init(),e}return n(i,t),i.prototype.init=function(){this.position=0,this.index=1,this.initials=["a","_","_"]},i.prototype.update=function(t){r.Key.isPressed(r.Key.LEFT)&&(this.index--,this.index<0&&(this.index=a.length-1),this.initials[this.position]=a[this.index]),r.Key.isPressed(r.Key.RIGHT)&&(this.index++,this.index>a.length-1&&(this.index=0),this.initials[this.position]=a[this.index]),r.Key.isPressed(r.Key.SPACE)&&(this.position++,this.position>=3&&(console.log(this.score,this.initials.join("")),o.highscores.save(this.score,this.initials.join("")),this.init(),this.trigger("done")),this.index=1,this.initials[this.position]=a[this.index])},i.prototype.render=function(){var t=165,i=function(i){return s.default.draw.text(i,50,t+=35,"30pt")};s.default.draw.background(),s.default.draw.highscore(o.highscores.top.score),s.default.draw.scorePlayer1(this.score),s.default.draw.copyright(),i("your score is one of the ten best"),i("please enter your initials"),i("push rotate to select letter"),i("push hyperspace when letter is correct"),s.default.draw.text3(this.initials.join(""),"60pt",function(t){return{x:s.default.width/2-t,y:s.default.height/2}})},i}(h.EventSource);i.EnterHighScoreState=c},function(t,i){"use strict";var e=222,n=function(){function t(){var t=this;this.SPACE=32,this.LEFT=37,this.UP=38,this.RIGHT=39,this.SHIFT=16,this.CTRL=17,this.ONE=49,this.DEBUG=68,this.PAUSE=80,this.keys=new Array(e),this.prev=new Array(e);for(var i=0;i<e;i++)this.keys[i]=this.prev[i]=!1;window.onkeydown=function(i){t.keys[i.keyCode]=!0},window.onkeyup=function(i){t.keys[i.keyCode]=!1}}return t.prototype.update=function(){for(var t=0;t<e;t++)this.prev[t]=this.keys[t]},t.prototype.isPressed=function(t){return this.prev[t]===!1&&this.keys[t]===!0},t.prototype.wasPressed=function(t){return this.prev[t]&&!this.keys[t]},t.prototype.isDown=function(t){return this.keys[t]},t}();i._Key=n,i.Key=new n},function(t,i){"use strict";var e=function(){function t(){this.handlers={}}return t.prototype.on=function(t,i){this.handlers[t]||(this.handlers[t]=[]),this.handlers[t].push(i)},t.prototype.off=function(t,i){this.handlers[t]=this.handlers[t].filter(function(t){return t!==i})},t.prototype.trigger=function(t){for(var i=this,e=[],n=1;n<arguments.length;n++)e[n-1]=arguments[n];var s=this.handlers[t]||[];s.forEach(function(t){return t.apply(void 0,[i].concat(e))})},t}();i.EventSource=e},function(t,i,e){"use strict";var n=e(4),s=e(10),r=e(2),o=e(11),h=e(15),a=e(17),c=e(18),u=e(14),l=function(){function t(t){this.score=t,this.level=0,this.rocks=[],this.explosions=[],this.alienBullets=[],this.showPushStart=!0,this.levelTimer=0,this.pushStartTimer=0,this.modeTimer=0,this.alienTimer=7,this.highscore=r.highscores.scores.length?r.highscores.top.score:0,this.init()}return t.prototype.init=function(){this.startLevel()},t.prototype.startLevel=function(){this.level++,this.levelTimer=0,this.alienTimer=s.random(5,10),this.addRocks()},t.prototype.update=function(t){this.levelTimer+=t,this.updateAlienTimer(t),this.rocks.length||this.explosions.length||this.alien||this.startLevel(),this.updatePushStartTimer(t),this.checkCollisions();var i=[this.alien].concat(this.rocks,this.alienBullets,this.explosions);i.forEach(function(i){i&&i.update(t)})},t.prototype.updateAlienTimer=function(t){this.alien||(this.alienTimer-=t,this.alienTimer<=0&&(this.addAlien(),this.alienTimer=s.random(5,10)))},t.prototype.updatePushStartTimer=function(t){this.pushStartTimer+=t,this.pushStartTimer>=.4&&(this.pushStartTimer=0,this.showPushStart=!this.showPushStart)},t.prototype.alienDestroyed=function(){this.createExplosion(this.alien.origin.x,this.alien.origin.y),this.alien=null,this.alienBullets=[]},t.prototype.rockDestroyed=function(t){this.createExplosion(t.origin.x,t.origin.y),this.rocks=this.rocks.filter(function(i){return i!==t}),(i=this.rocks).push.apply(i,t.split()),t=null;var i},t.prototype.checkCollisions=function(){var t=this,i=!!this.alien||!!this.alienBullets.length;i&&(this.collisions=new c.Collisions,this.collisions.check([this.alien],this.rocks,function(i,e){t.alienDestroyed(),t.rockDestroyed(e)}),this.collisions.check(this.alienBullets,this.rocks,function(i,e){t.rockDestroyed(e)}))},t.prototype.render=function(){this.drawBackground(),this.drawPushStart();var t=this.rocks.concat([this.alien],this.alienBullets,this.explosions);t.forEach(function(t){t&&t.render()})},t.prototype.addRocks=function(){for(var t=Math.min(this.level+3,7),i=150,e=0;e<t;e++){var r=s.random(1,4),h=new u.Vector(s.random(1,360)),a=void 0,c=void 0;switch(r){case 1:a=s.random(40,n.default.width-40),c=s.random(40,80);break;case 2:a=s.random(n.default.width-80,n.default.width-40),c=s.random(n.default.height-40,n.default.height-40);break;case 3:a=s.random(40,n.default.width-40),c=s.random(n.default.height-40,n.default.height-40);break;default:a=s.random(40,80),c=s.random(n.default.height-40,n.default.height-40)}var l=new o.Rock(a,c,h,o.RockSize.Large,i);this.rocks.push(l)}},t.prototype.addAlien=function(){var t=this;this.alien=new h.BigAlien,this.alien.on("expired",function(){t.alien.destroy(),t.alien=null,t.alienBullets.forEach(function(t){return t.destroy()}),t.alienBullets=[]}),this.alien.on("fire",function(i,e){e.on("expired",function(){t.alienBullets=t.alienBullets.filter(function(t){return t!==e})}),t.alienBullets.push(e)}),this.alienTimer=0},t.prototype.createExplosion=function(t,i){var e=this,n=new a.Explosion(t,i);n.on("expired",function(){e.explosions=e.explosions.filter(function(t){return t!==n})}),this.explosions.push(n)},t.prototype.drawBackground=function(){n.default.draw.background(),n.default.draw.scorePlayer1(this.score),n.default.draw.oneCoinOnePlay(),n.default.draw.highscore(this.highscore),n.default.draw.copyright()},t.prototype.drawPushStart=function(){this.showPushStart&&n.default.draw.pushStart()},t}();i.AttractState=l},function(t,i){"use strict";function e(t,i){return Math.floor(Math.random()*(i-t+1))+t}i.random=e},function(t,i,e){"use strict";var n,s=this&&this.__extends||function(t,i){function e(){this.constructor=t}for(var n in i)i.hasOwnProperty(n)&&(t[n]=i[n]);t.prototype=null===i?Object.create(i):(e.prototype=i.prototype,new e)},r=e(12),o=e(14),h=e(10);!function(t){t[t.Small=5]="Small",t[t.Medium=10]="Medium",t[t.Large=20]="Large"}(n=i.RockSize||(i.RockSize={}));var a=function(t){function i(i,e,n,s,r){void 0===r&&(r=1);var o=t.call(this,i,e)||this;o.rotTimer=0,o.rock1=[[.5,-2],[2,-1],[2,-.7],[1.2,0],[2,1],[1,2],[.5,1.5],[-1,2],[-2,.7],[-2,-1],[-.5,-1],[-1,-2],[.5,-2]],o.rock2=[[0,-1.5],[1,-2],[2,-1],[1,-.5],[2,.5],[1,2],[-.5,1.5],[-1,2],[-2,1],[-1.5,0],[-2,-1],[-1,-2],[0,-1.5]],o.rock3=[[0,-1],[1,-2],[2,-1],[1.5,0],[2,1],[1,2],[-1,2],[-2,1],[-2,-1],[-1,-2],[0,-1]],o.rocks=[o.rock1,o.rock2,o.rock3],o.vx=n.x*r,o.vy=n.y*r;var a=h.random(0,2),c=o.rocks[a];return o.points=c.map(function(t){return{x:t[0]*s,y:t[1]*s}}),o.size=s,o.rotate(h.random(1,90)),o.rot=h.random(.01,1)%2===0?1:-1,o.timeToRot=h.random(1,5),o}return s(i,t),i.prototype.update=function(t){this.rotTimer+=1,this.move(t),this.rotTimer===this.timeToRot&&(this.rotate(this.rot),this.rotTimer=0)},i.prototype.render=function(){this.draw()},Object.defineProperty(i.prototype,"direction",{get:function(){var t=Math.atan2(this.vy,this.vx),i=t*(180/Math.PI);return i=i>0?i:360+i,Math.floor(i)},enumerable:!0,configurable:!0}),i.prototype.split=function(){if(this.size>n.Small){var t=h.random(this.direction,this.direction+80),e=h.random(this.direction-80,this.direction);t<0&&(t+=360),t>360&&(t-=360),e<0&&(e+=360),e>360&&(e-=360);var s=this.size===n.Large?n.Medium:n.Small,r=new o.Vector(t),a=new o.Vector(e),c=s===n.Medium?h.random(150,250):h.random(250,350),u=s===n.Medium?h.random(150,250):h.random(250,350),l=new i(this.origin.x,this.origin.y,r,s,c),d=new i(this.origin.x,this.origin.y,a,s,u);return[l,d]}return[]},Object.defineProperty(i.prototype,"score",{get:function(){return this.size===n.Large?20:this.size===n.Medium?50:100},enumerable:!0,configurable:!0}),i}(r.Object2D);i.Rock=a},function(t,i,e){"use strict";var n=this&&this.__extends||function(t,i){function e(){this.constructor=t}for(var n in i)i.hasOwnProperty(n)&&(t[n]=i[n]);t.prototype=null===i?Object.create(i):(e.prototype=i.prototype,new e)},s=e(4),r=e(8),o=e(13),h=function(t){function i(i,e){var n=t.call(this)||this;return n.color="rgba(255,255,255,.9)",n.angle=360,n.vx=0,n.vy=0,n._xmin=0,n._xmax=0,n._ymin=0,n._ymax=0,n._width=0,n._height=0,n.origin={x:i,y:e},n}return n(i,t),Object.defineProperty(i.prototype,"points",{get:function(){return this._points},set:function(t){this._points=t,this.calcBounds()},enumerable:!0,configurable:!0}),i.prototype.calcBounds=function(){var t=this;this._points.forEach(function(i){i.x<t._xmin&&(t._xmin=i.x),i.x>t._xmax&&(t._xmax=i.x),i.y<t._ymin&&(t._ymin=i.y),i.y>t._ymax&&(t._ymax=i.y)}),this._width=this._xmax-this._xmin,this._height=this._ymax-this._ymin},i.prototype.rotate=function(t){this.angle+=t,this.angle<1&&(this.angle+=360),this.angle>360&&(this.angle-=360);var i=o.COS[t],e=o.SIN[t];this.points.forEach(function(t){var n=i*t.x-e*t.y,s=e*t.x+i*t.y;t.x=n,t.y=s}),this.calcBounds()},i.prototype.move=function(t){t=t?t:1,this.origin.x+=this.vx*t,this.origin.y+=this.vy*t,this.origin.x>s.default.width&&(this.origin.x-=s.default.width),this.origin.x<0&&(this.origin.x+=s.default.width),this.origin.y>s.default.height&&(this.origin.y-=s.default.height),this.origin.y<0&&(this.origin.y+=s.default.height)},i.prototype.scale=function(t){this.points.forEach(function(i){i.x*=t,i.y*=t}),this.calcBounds()},i.prototype.draw=function(){s.default.draw.shape(this.points,this.origin.x,this.origin.y,this.color)},Object.defineProperty(i.prototype,"magnitude",{get:function(){return Math.sqrt(this.vx*this.vx+this.vy*this.vy)},enumerable:!0,configurable:!0}),Object.defineProperty(i.prototype,"x",{get:function(){return this.origin.x+this._xmin},set:function(t){this.origin.x=t},enumerable:!0,configurable:!0}),Object.defineProperty(i.prototype,"y",{get:function(){return this.origin.y+this._ymin},set:function(t){this.origin.y=t},enumerable:!0,configurable:!0}),Object.defineProperty(i.prototype,"width",{get:function(){return this._width},enumerable:!0,configurable:!0}),Object.defineProperty(i.prototype,"height",{get:function(){return this._height},enumerable:!0,configurable:!0}),Object.defineProperty(i.prototype,"vertices",{get:function(){var t=this;return this.points.map(function(i){return{x:t.origin.x+i.x,y:t.origin.y+i.y}})},enumerable:!0,configurable:!0}),i.prototype.collided=function(t){return!!(t&&this.x<t.x+t.width&&this.x+this.width>t.x&&this.y<t.y+t.height&&this.height+this.y>t.y)},i.prototype.destroy=function(){for(var t in this.handlers)this.handlers[t]=null;this.handlers={}},i}(r.EventSource);i.Object2D=h},function(t,i){"use strict";var e={};i.RAD=e;var n={};i.COS=n;var s={};i.SIN=s;for(var r=Math.PI/180,o=0;o<=360;o++)e[o]=o*r,n[o]=Math.cos(e[o]),s[o]=Math.sin(e[o]),e[-o]=-o*r,n[-o]=Math.cos(e[-o]),s[-o]=Math.sin(e[-o])},function(t,i){"use strict";for(var e={},n=2*Math.PI,s=0;s<=360;s++){var r=n*(s/360);e[s]={x:Math.cos(r),y:Math.sin(r)}}var o=function(){function t(t,i){void 0===i&&(i=1),this.x=e[t].x*i,this.y=e[t].y*i}return t.fromXY=function(i,e,n){void 0===n&&(n=1);var s=i.x-e.x,r=i.y-e.y,o=Math.sqrt(s*s+r*r);s/=o,r/=o;var h=new t(0);return h.x=s*n,h.y=r*n,h},t}();i.Vector=o},function(t,i,e){"use strict";var n=this&&this.__extends||function(t,i){function e(){this.constructor=t}for(var n in i)i.hasOwnProperty(n)&&(t[n]=i[n]);t.prototype=null===i?Object.create(i):(e.prototype=i.prototype,new e)},s=e(4),r=e(10),o=e(12),h=e(16),a=e(14),c=600,u=225,l=250,d=function(t){function i(i){var e=t.call(this,0,0)||this;return e.moveTimer=0,e.moveTime=1,e.bulletTimer=0,e.bulletTime=.7,e.vy=0,e.origin.y=r.random(100,s.default.height-100),e.origin.y%2===0?(e.origin.x=40,e.vx=i):(e.origin.x=s.default.width-40,e.vx=-i),e.points=[{x:.5,y:-2},{x:1,y:-1},{x:2.5,y:0},{x:1,y:1},{x:-1,y:1},{x:-2.5,y:0},{x:-1,y:-1},{x:-.5,y:-2},{x:.5,y:-2}],e}return n(i,t),i.prototype.update=function(t){if(this.move(t),this.origin.x>=s.default.width-5||this.origin.x<=5)return void this.trigger("expired");if(this.moveTimer+=t,this.moveTimer>=1&&0!==this.vy&&(this.vy=0,this.moveTimer=0),this.moveTimer>=this.moveTime){var i=r.random(1,20)%2===0;i&&(this.vy=this.origin.x%2===0?this.vx:-this.vx),this.moveTimer=0}this.bulletTimer+=t,this.bulletTimer>=this.bulletTime&&(this.fire(),this.bulletTimer=0)},i.prototype.render=function(){this.draw()},i.prototype.draw=function(){t.prototype.draw.call(this),s.default.draw.shape([this.points[1],this.points[6]],this.origin.x,this.origin.y),s.default.draw.shape([this.points[2],this.points[5]],this.origin.x,this.origin.y)},i}(o.Object2D),p=function(t){function i(){var i=t.call(this,u)||this;return i.score=200,i.scale(7),i}return n(i,t),i.prototype.fire=function(){var t=new a.Vector(r.random(1,360),c),i=new h.Bullet(this.origin.x,this.origin.y,t);this.trigger("fire",i)},i.prototype.destroy=function(){},i}(d);i.BigAlien=p;var f=function(t){function i(i){var e=t.call(this,l)||this;return e.ship=i,e.score=1e3,e.bulletTime=1,e.scale(4),e}return n(i,t),i.prototype.fire=function(){var t;if(this.ship){var i=a.Vector.fromXY(this.ship.origin,this.origin,c);t=new h.Bullet(this.origin.x,this.origin.y,i)}else{var i=new a.Vector(r.random(1,360),c);t=new h.Bullet(this.origin.x,this.origin.y,i)}this.trigger("fire",t)},i.prototype.destroy=function(){this.ship=null},i}(d);i.SmallAlien=f},function(t,i,e){"use strict";var n=this&&this.__extends||function(t,i){function e(){this.constructor=t}for(var n in i)i.hasOwnProperty(n)&&(t[n]=i[n]);t.prototype=null===i?Object.create(i):(e.prototype=i.prototype,new e)},s=e(4),r=e(12),o=function(t){function i(i,e,n){var s=t.call(this,i,e)||this;return s.life=1.25,s.vx=n.x,s.vy=n.y,s}return n(i,t),i.prototype.render=function(){this.draw()},i.prototype.update=function(t){this.move(t),this.life-=t,this.life<=0&&(this.trigger("expired"),this.destroy())},i.prototype.draw=function(){s.default.draw.point({x:this.origin.x,y:this.origin.y})},i.prototype.destroy=function(){this.life=0,this.trigger("expire")},Object.defineProperty(i.prototype,"vertices",{get:function(){return[this.origin]},enumerable:!0,configurable:!0}),i}(r.Object2D);i.Bullet=o},function(t,i,e){"use strict";var n=this&&this.__extends||function(t,i){function e(){this.constructor=t}for(var n in i)i.hasOwnProperty(n)&&(t[n]=i[n]);t.prototype=null===i?Object.create(i):(e.prototype=i.prototype,new e)},s=e(8),r=e(4),o=e(14),h=e(10),a=150,c=function(t){function i(i,e){var n=t.call(this)||this;n.life=1.25,n.points=[];for(var s=0;s<15;s++){var r=new o.Vector(h.random(1,360),Math.random()*a);n.points.push({x:i,y:e,vx:r.x,vy:r.y})}return n}return n(i,t),i.prototype.update=function(t){this.points.forEach(function(i){i.x+=i.vx*t,i.y+=i.vy*t}),this.life-=t,this.life<=0&&this.trigger("expired")},i.prototype.render=function(t){var i=this;this.points.forEach(function(t){r.default.draw.point(t,"rgba(255,255,255,"+i.life+")")})},i}(s.EventSource);i.Explosion=c},function(t,i,e){"use strict";var n=e(4),s=e(19),r=function(){function t(){this.tree=new s.Quadtree({x:0,y:0,width:n.default.width,height:n.default.height},1)}return t.prototype.check=function(t,i,e,n){var s=this;t&&t.length&&i&&i.length&&(this.tree.clear(),i.forEach(function(t){s.tree.insert(t)}),t.forEach(function(t){var i=[];i.push.apply(i,s.tree.retrieve(t)),i.forEach(function(i){i.collided(t)?s.pointsInPolygon(t,i)&&e(t,i):n&&n(t,i)})}))},t.prototype.pointsInPolygon=function(t,i){for(var e=t.vertices,n=i.vertices,s=0,r=n.length;s<r;s++)if(this.pointInPoly(e,n[s]))return!0;return!1},t.prototype.pointInPoly=function(t,i){for(var e=t.length-1,n=0,s=0,r=t.length;s<r;s++)(t[s].y<i.y&&t[e].y>=i.y||t[e].y<i.y&&t[s].y>=i.y)&&(t[s].x<=i.x||t[e].x<=i.x)&&(n^=t[s].x+(i.y-t[s].y)/(t[e].y-t[s].y)*(t[e].x-t[s].x)<i.x),e=s;return n%2===0},t}();i.Collisions=r},function(t,i){"use strict";var e=function(){function t(t,i,e,n){void 0===i&&(i=10),void 0===e&&(e=4),void 0===n&&(n=0),this.bounds=t,this.maxObjects=i,this.maxLevels=e,this.level=n,this.objects=[],this.nodes=[],this.width2=this.bounds.width/2,this.height2=this.bounds.height/2,this.xmid=this.bounds.x+this.width2,this.ymid=this.bounds.y+this.height2}return t.prototype.insert=function(t){var i=this;if(t){var e,n=0;if(this.nodes.length&&(e=this.getIndex(t),e.length))return void e.forEach(function(e){i.nodes[e].insert(t)});if(this.objects.push(t),this.objects.length>this.maxObjects&&this.level<this.maxLevels){this.nodes.length||this.split();for(var s=function(){if(e=r.getIndex(r.objects[n]),e.length){var t=r.objects.splice(n,1)[0];e.forEach(function(e){i.nodes[e].insert(t)})}else n+=1},r=this;n<this.objects.length;)s()}}},t.prototype.retrieve=function(t){var i=this;if(!t)return[];var e=this.getIndex(t),n=this.objects;if(this.nodes.length)if(e.length)e.forEach(function(e){n=n.concat(i.nodes[e].retrieve(t))});else for(var s=0;s<this.nodes.length;s++)n=n.concat(this.nodes[s].retrieve(t));return n.filter(function(t,i,e){return e.indexOf(t)===i})},t.prototype.clear=function(){this.objects=[];for(var t=0;t<this.nodes.length;t++)this.nodes[t]&&this.nodes[t].clear();this.nodes=[]},t.prototype.getIndex=function(t){if(!t)return[];var i=[],e=this,n=e.xmid,s=e.ymid,r=t.y<=s,o=t.y>s;if(t.x<=n)if(r){i.push(1);var h=!1;t.x+t.width>n&&(i.push(0),h=!0),t.y+t.height>s&&(i.push(2),h&&i.push(3))}else o&&(i.push(2),t.x+t.width>n&&i.push(3));else t.x>n&&(r?(i.push(0),t.y+t.height>s&&i.push(3)):i.push(3));return i},t.prototype.split=function(){var i=this,e=Math.round(this.width2),n=Math.round(this.height2),s=Math.round(this.bounds.x),r=Math.round(this.bounds.y),o=function(s,r){var o={x:s,y:r,width:e,height:n};return new t(o,i.maxObjects,i.maxLevels,i.level+1)};this.nodes=[o(s+e,r),o(s,r),o(s,r+n),o(s+e,r+n)]},t}();i.Quadtree=e},function(t,i,e){"use strict";var n=this&&this.__extends||function(t,i){function e(){this.constructor=t}for(var n in i)i.hasOwnProperty(n)&&(t[n]=i[n]);t.prototype=null===i?Object.create(i):(e.prototype=i.prototype,new e)},s=e(7),r=e(8),o=e(21),h=e(15),a=e(11),c=e(17),u=e(14),l=e(18),d=e(4),p=e(2),f=e(10),y=function(t){function i(){var i=t.call(this)||this;return i.level=0,i.extraLifeScore=0,i.score=0,i.lives=3,i.shipBullets=[],i.alienBullets=[],i.explosions=[],i.rocks=[],i.bounds=[],i.shipTimer=0,i.alienTimer=0,i.levelTimer=0,i.gameOverTimer=0,i.gameOver=!1,i.started=!1,i.debug=!1,i.paused=!1,i.highscore=p.highscores.top.score,i}return n(i,t),i.prototype.init=function(){this.addShip(d.default.width2,d.default.height2),this.startLevel()},i.prototype.startLevel=function(){this.level++,this.levelTimer=0,this.alienTimer=f.random(10,15),this.addRocks()},i.prototype.update=function(t){if(s.Key.isPressed(s.Key.DEBUG)&&(this.debug=!this.debug),s.Key.isPressed(s.Key.PAUSE)&&(this.paused=!this.paused),s.Key.isPressed(s.Key.SPACE)&&this.hyperspace(),!this.paused){if(this.levelTimer+=t,this.gameOver&&(this.gameOverTimer+=t,this.gameOverTimer>=5&&this.trigger("done",this.score)),!this.started)return void(this.levelTimer>=2&&(this.init(),this.started=!0));this.updateAlienTimer(t),this.gameOver||((this.shipTimer||!this.ship&&this.lives&&!this.explosions.length)&&this.tryPlaceShip(t),this.rocks.length||!this.lives||this.explosions.length||this.alien||this.startLevel()),this.lives||(this.gameOver=!0),this.checkCollisions();var i=[this.ship,this.alien].concat(this.shipBullets,this.alienBullets,this.rocks,this.explosions);i.forEach(function(i){i&&i.update(t)})}},i.prototype.render=function(t){this.renderStatic();var i=[this.ship,this.alien].concat(this.shipBullets,this.alienBullets,this.rocks,this.explosions);i.forEach(function(t){t&&t.render()})},i.prototype.renderStatic=function(){d.default.draw.background(),d.default.draw.copyright(),d.default.draw.scorePlayer1(this.score),d.default.draw.highscore(this.highscore),this.drawExtraLives(),this.started||d.default.draw.player1(),this.gameOver&&d.default.draw.gameOver(),this.debug&&this.renderDebug()},i.prototype.renderDebug=function(){if(d.default.draw.text2("debug mode","12pt",function(t){return{x:d.default.width-t-10,y:d.default.height-40}}),this.bounds&&this.bounds.forEach(function(t){d.default.draw.bounds(t,"#fc058d")}),!this.ship&&this.lives){var t={x:d.default.width2-120,y:d.default.height2-120,width:240,height:240};d.default.draw.bounds(t,"#00ff00")}this.ship&&d.default.draw.text(this.ship.angle.toString(),this.ship.origin.x+20,this.ship.origin.y+20,"10pt");var i=new Date(null);i.setSeconds(this.levelTimer),d.default.draw.text2(i.toISOString().substr(11,8),"12pt",function(t){return{x:10,y:d.default.height-40}})},i.prototype.drawExtraLives=function(){for(var t=Math.min(this.lives,10),i=new o.Ship(0,0),e=0;e<t;e++)i.origin.x=80+20*e,i.origin.y=55,i.render()},i.prototype.updateAlienTimer=function(t){this.alien||(this.alienTimer-=t,this.alienTimer<=0&&(this.addAlien(),this.alienTimer=f.random(10,15)))},i.prototype.addShip=function(t,i){var e=this;this.ship=new o.Ship(t,i),this.ship.on("fire",function(t,i){i.on("expired",function(){e.shipBullets=e.shipBullets.filter(function(t){return t!==i})}),e.shipBullets.push(i)})},i.prototype.shipDestroyed=function(){this.createExplosion(this.ship.origin.x,this.ship.origin.y),this.lives--,this.ship=null,this.shipBullets=[]},i.prototype.alienDestroyed=function(){this.createExplosion(this.alien.origin.x,this.alien.origin.y),this.alien=null,this.alienBullets=[]},i.prototype.rockDestroyed=function(t){this.createExplosion(t.origin.x,t.origin.y),this.rocks=this.rocks.filter(function(i){return i!==t}),(i=this.rocks).push.apply(i,t.split()),t=null;var i},i.prototype.checkCollisions=function(){var t=this,i=!!(this.ship||this.shipBullets.length||this.alien||this.alienBullets.length);i&&(this.bounds=[],this.collisions=new l.Collisions,this.collisions.check([this.ship],this.rocks,function(i,e){t.addScore(e.score),t.rockDestroyed(e),t.shipDestroyed()},function(i,e){t.debug&&t.bounds.push(e)}),this.collisions.check(this.shipBullets,this.rocks,function(i,e){t.addScore(e.score),t.rockDestroyed(e),i.destroy()},function(i,e){t.debug&&t.bounds.push(e)}),this.collisions.check(this.shipBullets,[this.alien],function(i,e){t.addScore(e.score),t.alienDestroyed(),i.destroy()},function(i,e){t.debug&&t.bounds.push(e)}),this.collisions.check([this.ship],[this.alien],function(i,e){t.addScore(e.score),t.alienDestroyed(),t.shipDestroyed()},function(i,e){t.debug&&t.bounds.push(e)}),this.collisions.check(this.alienBullets,this.rocks,function(i,e){t.rockDestroyed(e)},function(i,e){t.debug&&t.bounds.push(e)}),this.collisions.check(this.alienBullets,[this.ship],function(i,e){t.shipDestroyed(),i.destroy()},function(i,e){t.debug&&t.bounds.push(e)}),this.collisions.check([this.alien],this.rocks,function(i,e){t.alienDestroyed(),t.rockDestroyed(e)},function(i,e){t.debug&&t.bounds.push(e)}))},i.prototype.addScore=function(t){this.score+=t,this.extraLifeScore+=t,this.score>this.highscore&&(this.highscore=this.score),this.extraLifeScore>=1e4&&(this.lives++,this.extraLifeScore=0)},i.prototype.addAlien=function(){var t=this,i=Math.min(this.level,7);this.score>4e4?this.alien=new h.SmallAlien(this.ship):1===i?this.levelTimer<90?this.alien=new h.BigAlien:f.random(1,3)%2===0?this.alien=new h.SmallAlien(this.ship):this.alien=new h.BigAlien:this.alien=new h.BigAlien,this.alien.on("expired",function(){t.alien.destroy(),t.alien=null,t.alienBullets.forEach(function(t){return t.destroy()}),t.alienBullets=[]}),this.alien.on("fire",function(i,e){e.on("expired",function(){t.alienBullets=t.alienBullets.filter(function(t){return t!==e})}),t.alienBullets.push(e)})},i.prototype.addRocks=function(){for(var t=Math.min(this.level+3,7),i=150,e=0;e<t;e++){var n=f.random(1,4),s=new u.Vector(f.random(1,360)),r=void 0,o=void 0;switch(n){case 1:r=f.random(40,d.default.width-40),o=f.random(40,80);break;case 2:r=f.random(d.default.width-80,d.default.width-40),o=f.random(d.default.height-40,d.default.height-40);break;case 3:r=f.random(40,d.default.width-40),
o=f.random(d.default.height-40,d.default.height-40);break;default:r=f.random(40,80),o=f.random(d.default.height-40,d.default.height-40)}var h=new a.Rock(r,o,s,a.RockSize.Large,i);this.rocks.push(h)}},i.prototype.createExplosion=function(t,i){var e=this,n=new c.Explosion(t,i);n.on("expired",function(){e.explosions=e.explosions.filter(function(t){return t!==n})}),this.explosions.push(n)},i.prototype.tryPlaceShip=function(t){if(this.shipTimer+=t,!(this.shipTimer<=2)){var i={x:d.default.width2-120,y:d.default.height2-120,width:240,height:240},e=!1;this.rocks.forEach(function(t){e=e||t.collided(i)}),this.alien&&(e=e||this.alien.collided(i)),e||(this.shipTimer=0,this.addShip(d.default.width2,d.default.height2))}},i.prototype.hyperspace=function(){var t=f.random(40,d.default.width-40),i=f.random(40,d.default.height-40),e=this.ship.angle;this.addShip(t,i),this.ship.angle>e?e=-(this.ship.angle-e):this.ship.angle<e&&(e-=this.ship.angle),this.ship.rotate(e)},i}(r.EventSource);i.GameState=y},function(t,i,e){"use strict";var n=this&&this.__extends||function(t,i){function e(){this.constructor=t}for(var n in i)i.hasOwnProperty(n)&&(t[n]=i[n]);t.prototype=null===i?Object.create(i):(e.prototype=i.prototype,new e)},s=e(4),r=e(7),o=e(12),h=e(14),a=e(16),c=.1,u=800,l=.1,d=.007,p=5,f=1100,y=4,g=100,v=function(t){function i(i,e){var n=t.call(this,i,e)||this;return n.points=[{x:5,y:8},{x:0,y:20},{x:-5,y:8}],n}return n(i,t),i.prototype.update=function(){},i.prototype.render=function(){this.draw()},i}(o.Object2D),x=function(t){function i(i,e){var n=t.call(this,i,e)||this;return n.moving=!1,n.bulletCount=0,n.bulletTimer=0,n.flame=new v(i,e),n.points=[{x:0,y:-15},{x:10,y:10},{x:5,y:5},{x:-5,y:5},{x:-10,y:10},{x:0,y:-15}],n.angle=270,n}return n(i,t),i.prototype.render=function(){s.default.draw.shape(this.points,this.origin.x,this.origin.y,this.color),this.moving&&(Math.floor(10*Math.random())+1)%2===0&&this.flame.draw()},i.prototype.update=function(t){this.move(t),this.flame.move(t),r.Key.isDown(r.Key.UP)?(this.moving=!0,this.thrust()):this.moving=!1,r.Key.isPressed(r.Key.LEFT)&&this.rotate(-1),r.Key.isDown(r.Key.LEFT)&&this.rotate(-p),r.Key.isPressed(r.Key.RIGHT)&&this.rotate(1),r.Key.isDown(r.Key.RIGHT)&&this.rotate(p),r.Key.isDown(r.Key.CTRL)&&this.fire(),this.bulletTimer>0&&(this.bulletTimer-=t),this.moving||(this.vx-=this.vx*d,this.vy-=this.vy*d,this.flame.vx=this.vx,this.flame.vy=this.vy)},i.prototype.rotate=function(i){t.prototype.rotate.call(this,i),this.flame.rotate(i)},i.prototype.thrust=function(){var t=new h.Vector(this.angle,g*c),i=this.magnitude;i<f&&(this.vx+=t.x,this.flame.vx=this.vx,this.vy+=t.y,this.flame.vy=this.vy)},i.prototype.fire=function(){var t=this;if(this.bulletTimer<=0&&this.bulletCount<y){this.bulletTimer=l,this.bulletCount++;var i=new h.Vector(this.angle),e=new a.Bullet(this.origin.x,this.origin.y,i);e.on("expired",function(){t.bulletCount--}),e.origin.x+=20*e.vx,e.origin.y+=20*e.vy;var n=0,s=this.vx*e.vx+this.vy*e.vy;s>0&&(n=this.magnitude),n=Math.max(u,n+u),e.vx*=n,e.vy*=n,this.trigger("fire",e)}},i}(o.Object2D);i.Ship=x}]);