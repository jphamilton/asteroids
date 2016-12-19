
This is an attempt to recreate the classic arcade game, Asteroids.

[You can give it a try here](https://jphamilton.github.io/asteroids/)

## About

I tried to be faithful to the original as much as possible, recreating all screens in the arcade version, and trying to make it feel like the original upright.

The game will cycle between the highscore screen and 'attraction mode' every 15 seconds. Like the cabinet, attraction mode will continue to play itself out until a new game is started. 
After a game is completed, attraction mode will continue, using the state of the last game. High scores are tracked and saved in local storage.

There are a few minor differences (e.g. rocks rotate, ship explosion is different). I'm sure all my timers are completely wrong (e.g. when aliens appear and what type, the thump thump pulse etc).
I will probably tweak some of this when I get bored sometime in the future.

Collision detection occurs in 3 stages. First, a quadtree is used to determine potential collision candidates. Second, candidates are checked using Axis-Aligned Bounding Boxes (AABB).
Finally, if the bounds of any objects overlap, a point in polygon routine (from http://alienryderflex.com/polygon/ and translated to js by me) is used to determine if an actual collision has taken place. 
This process is visualized in debug mode (hit D during game to view).

I only used two libraries for the game: [howler.js](https://howlerjs.com/) for sound and [hammer.js](http://hammerjs.github.io/) for touch support. I have to say, both of the libraries are amazing. 
I can't believe how quickly I was able to put them to use. As for the rest of the game, it was important for me to do all the dirty work myself. I had almost zero exposure to the HTML 5 canvas before
starting this project.

## Controls

* 1 or Tap for Player 1 start
* Left/Right arrow or pan left/right to rotate
* Up arrow/pan up to thrust
* Ctrl/tap to fire
* Space/pinch out for hyperspace
* D for debug mode (during game only). Primarily shows collision related information.

## Screenshots

![Sceenshot 2](https://jphamilton.github.com/asteroids/assets/2.png)
![Sceenshot 1](https://jphamilton.github.com/asteroids/assets/1.png)
![Sceenshot 3](https://jphamilton.github.com/asteroids/assets/3.png)