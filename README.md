
This is an attempt to recreate the classic arcade game, Asteroids.

[You can give it a try here](https://jphamilton.github.io/asteroids/)

## About

This is my "re-imagining" of the classic arcade game, Asteroids. I tried to stay true to the spirit of the original as much as possible, while adding a more modern "game feel" 
(e.g. camera shake, kick back, bigger explosions, faster movement, etc). While the original was designed to encourage you to part with your quarters, this version is designed for you to
blow lots of stuff up. It's a little more forgiving, too. Your ship has a little shielding that can protect you from damage for a bit and you can fire more bullets.

Like the arcade upright, the game will cycle between the highscore screen and 'attraction mode' every 15 seconds. Attraction mode will continue to play itself out until a new game is started. 
After a game is completed, attraction mode will continue, using the state of the last game. High scores are tracked and saved in local storage.

Collision detection occurs in 3 stages. First, a quadtree is used to determine potential collision candidates. Second, candidates are checked using Axis-Aligned Bounding Boxes (AABB).
Finally, if the ship is involved, a point in polygon routine (credit Lascha Lagidse http://alienryderflex.com/polygon/) is used to determine if an actual collision has taken place. 
Using point in poly for all collisions didn't "feel right". Bullet collisions (from the ship) also the Cohen-Sutherland line clipping algorithm - the result being that rocks in between 2 bullets
will be destroyed. This vastly speeds up the game and gives the player the illusion that they are actually better than they are :) Basically, everything in the game is favored to the player. 
This entire process is visualized in debug mode (hit F1 during game to view).

I only used two libraries for the game: [howler.js](https://howlerjs.com/) for sound and [hammer.js](http://hammerjs.github.io/) for touch support. I have to say, both of the libraries are amazing. 
I can't believe how quickly I was able to put them to use. As for the rest of the game, it was important for me to do all the dirty work myself. I had almost zero exposure to the HTML 5 canvas before
starting this project.

## Controls

* 1 or Tap for Player 1 start
* Rotate: Left/Right arrow keys, pan left/right to rotate on mobile
* Thrust: Up arrow, pan up to thrust on mobile
* Fire: CTRL, tap 
* Hyperspace: Space bar, pinch out for hyperspace
* Debug Mode: D (during game only). Primarily shows collision related information.

## Screenshots

![Sceenshot 1](https://jphamilton.github.com/asteroids/assets/1.png)
![Sceenshot 2](https://jphamilton.github.com/asteroids/assets/2.png)
![Sceenshot 3](https://jphamilton.github.com/asteroids/assets/3.png)
