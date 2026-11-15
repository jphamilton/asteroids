declare module '*.wav' {
  const src: string;
  export default src;
}

declare module 'howler' {
    export class Howl {
        constructor(options: { src: string[]; volume?: number; loop?: boolean });
        play(): number;
        stop(): void;
        volume(volume?: number): number;
        on(event: string, fn: () => void): void;
        rate(rate: number): void;
    }
}

interface IGameState {
    update: (step: number) => void;
    render: (dt: number) => void;
}

interface Point {
    x: number,
    y: number
}

interface Rect extends Point {
    width: number;
    height: number;
}

interface IQuadtree {
    nodes: IQuadtree[];
    objects: Rect[];
    width2: number;
    height2: number;
    xmid: number;
    ymid: number;
}

