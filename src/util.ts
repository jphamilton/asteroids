export function random(start: number, end: number): number {
     return Math.floor(Math.random() * (end - start + 1)) + start;
}

export function randomFloat(start: number, end: number): number {
    return Math.random() * (end - start) + start;
}