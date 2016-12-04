export const Key = {
  _pressed: {},

  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  SHIFT: 16,  // special weapon / hyperspace
  CTRL: 17,   // fire
  ONE: 49,    // 1 player start
  
  isDown: function(keyCode) {
    return this._pressed[keyCode];
  },
  
  onKeydown: function(event) {
    this._pressed[event.keyCode] = true;
  },
  
  onKeyup: function(event) {
    delete this._pressed[event.keyCode];
  }

};

window.addEventListener('keyup', (event) => { Key.onKeyup(event); }, false);
window.addEventListener('keydown', (event) => { Key.onKeydown(event); }, false);


