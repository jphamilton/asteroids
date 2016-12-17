import screen from './screen';
import { Quadtree } from './quadtree';
import { Object2D } from './object2d';

export class Collisions {

    tree: Quadtree;

    constructor() {
        this.tree = new Quadtree({
            x: 0, 
            y: 0, 
            width: screen.width, 
            height: screen.height
        }, 1);
    }
     
    check<TSource extends Object2D, TTarget extends Object2D>(sources: TSource[], targets: TTarget[], cb: (a: TSource, b: TTarget) => void, dcb?: (a: TSource, b: TTarget) => void) {
        if (!sources || !sources.length || !targets || !targets.length) {
            return;
        }

        this.tree.clear();
        
        targets.forEach(target => {
            this.tree.insert(target);
        });
        
        sources.forEach(source => {
            let candidates = [];

            candidates.push(...this.tree.retrieve(source));
            
            candidates.forEach(candidate => {
                
                // AABB first
                if (candidate.collided(source)) {
                    if (this.pointsInPolygon(source, candidate)) {
                        cb(source, candidate);
                    }
                } else if (dcb) {
                    dcb(source, candidate);
                }
            });

        });

    }

    private pointsInPolygon(source: Object2D, target: Object2D): boolean {
        let vert1 = source.vertices;
        let vert2 = target.vertices;

        for (let i = 0, l = vert2.length; i < l; i++) {
            if (this.pointInPoly(vert1, vert2[i])) {
                return true;
            }
        }

        return false;
    }

    // credit: Nathan Mercer http://alienryderflex.com/polygon/
    private pointInPoly(points: Point[], t: Point): boolean {
        let j = points.length - 1;
        let c = 0;

        for(let i = 0, l = points.length; i < l; i++) {
            if ((points[i].y < t.y && points[j].y >= t.y  || points[j].y < t.y && points[i].y >= t.y) && 
                (points[i].x <= t.x || points[j].x <= t.x)) {
                c ^= (points[i].x + (t.y - points[i].y) / (points[j].y - points[i].y) * (points[j].x - points[i].x) < t.x as any);    
            }
            j = i;
        }

        return c % 2 === 0;
    }
}

