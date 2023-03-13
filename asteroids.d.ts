interface IGameState {
    update: (step: number) => void;
    render: (dt?: number) => void;
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

