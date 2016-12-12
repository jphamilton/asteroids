interface IGameState {
    update: (step: number) => void;
    render: (delta?: number) => void;
}

interface Point {
    x: number,
    y: number
}

interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}

