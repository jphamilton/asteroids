
/* lookup tables */

let RAD = {};
let COS = {};
let SIN = {};

let r = Math.PI / 180;
let PI2 = 2 * Math.PI;

for(let i = 0; i <= 360; i++) {
    RAD[i] = i * r; 
    COS[i] = Math.cos(RAD[i]);
    SIN[i] = Math.sin(RAD[i]);

    RAD[-i] = -i * r; 
    COS[-i] = Math.cos(RAD[-i]);
    SIN[-i] = Math.sin(RAD[-i]);
}

export { RAD, COS, SIN } 

