interface IGameState {
    update: (step: number) => void;
    render: (step: number) => void;
}

interface Point {
    x: number,
    y: number
}

interface IObject2D {
    x: number;
    y: number;
    vx: number;
    vy: number; 
    color?: string;
    angle: number; 
}

