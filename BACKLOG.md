# Backlog

One item at a time. For anything still open, agree on the behavior before editing. Checked items stay here so they are not reopened.

## Done

- [x] **Fire input.** One press fires one shot. Holding the key does not repeat. A tap is its own one-frame latch and does not clear the keyboard fire key. A second press still waits on the existing 0.1s bullet timer, and there are still at most 10 bullets in flight.
- [x] **Double rock destruction.** `rockDestroyed` marks the rock destroyed before it splits. Later bullets and other collision checks in that pass skip it, so it scores and splits once. The line between two consecutive bullets can still destroy a rock that neither bullet touches directly.
- [x] **AABB bounds only grow.** `calcBounds` resets its min and max from the current points before measuring. `rotate` and `scale` already call it, so the box shrinks again when the shape rotates or scales.
- [x] **Point in polygon.** The hit test walks every vertex. A deep collision counts when either shape has a vertex inside the other.
- [x] **Slow-mo timer.** Only `update` advances the timer. A ship death stays at one-eighth speed for the full 0.25 seconds of slowed time, about two seconds of real time. The massive-damage slow-mo is the same clock at one-quarter speed.
- [x] **Small alien target.** The small alien aims at the ship currently in the world. With no ship, it fires in a random direction, and it follows the ship that respawns.
- [x] **Extra lives.** Each 10000 points grants one life, including when a single award crosses that threshold more than once. The remainder carries toward the next life.
- [x] **Initials.** Every blank slot is stored as a space, so `J`, `JP`, and `JPH` save as three-character names. An all-blank name is refused and entry stays on the last slot.
- [x] **Rock spawn zones.** Top, bottom, left, and right each spawn in a 20px band. The right and left edges are no longer pinned to the bottom row.
- [x] **Thrust sound.** The thrust loop starts when thrust is pressed and stops on release or when the ship is destroyed.
- [x] **Ship trails.** Each trail keeps its own copy of the ship points, so later rotation leaves it in place. Trails are removed once their alpha reaches 0.
- [x] **Thumper.** The beat still starts at one second and tightens to 0.15 seconds as the level goes on. The tightening follows elapsed time, at the same rate as the old per-step decay at 60Hz.
- [x] **High scores.** Bad JSON, an empty list, or entries that are not a score and initials fall back to the default table. `Highscores.top.score` stays readable.
- [x] **Opening level.** `level` starts at 0, and `startLevel` still increments before spawning. The first wave is level 1 and has 4 large rocks.
- [x] **Massive damage.** Each world tracks its own live explosions. Crossing a new peak above the threshold awards 5 times those scores, then the threshold grows by 10. The count is not reset while explosions are still alive.
- [x] **Chain reactions.** Debris from a recent explosion still breaks rocks it overlaps. The two lists are `debris` and `otherRocks`. The shockwave ring stays visual.
- [x] **Powerups and dramatic pause.** The unused pause timer, powerup timer, `addPowerup`, powerup sounds, and `src/utils/timers.ts` are removed.
- [x] **Attract mode after a game.** When a game ends, that world is passed into attract mode, including after initials entry. A key still held from the initials screen does not start a new game. A new game still starts on a fresh world.

## Cleanup

- [ ] **Sound URLs.** Wav imports exist so webpack emits the files, then `console.log` keeps them alive, while Howl loads a hardcoded `./assets/...` path. Pass the imported URL into Howl and delete the logs and the unused `canPlay`.
- [ ] **Draw helpers.** `text`, `text2`, and `text3` repeat the same burn-offset text. `drawExtraLives` constructs a new `Ship` every frame. Use one text path, and reuse the life icon.
- [ ] **HTML and README.** `src/index.html` has an unclosed `div` and a `link rel="font"` that the CSS `@font-face` already covers. The README says debug is F1. The key is Z.
- [ ] **Strictness last.** `tsconfig.json` has `strict` set to false. Turn it on only after the items above, and fix the errors it reports. Leave the vendored line-clip code in `src/lineclip.ts` as-is. `polygonclip` is unused, and it belongs to that file.
