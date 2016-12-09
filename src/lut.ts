
/* lookup tables */

let RAD = {};
let COS = {};
let SIN = {};
let VECTOR = {};

let r = Math.PI/180;
let PI2 = 2 * Math.PI;

for(let i = 1; i <= 360; i++) {
    RAD[i] = i * r; 
    COS[i] = Math.cos(RAD[i]);
    SIN[i] = Math.sin(RAD[i]);

    RAD[-i] = -i * r; 
    COS[-i] = Math.cos(RAD[-i]);
    SIN[-i] = Math.sin(RAD[-i]);

    let t = PI2 * (i / 360);
    
    VECTOR[i] = {
        x: Math.sin(t),
        y: -Math.cos(t)
    }
}

export { RAD, COS, SIN, VECTOR }

