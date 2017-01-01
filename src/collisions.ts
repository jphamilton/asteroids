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

            candidates.push(...this.tree.retrieve(source) as any);
            
            candidates.forEach(candidate => {
                
                // AABB first
               if (candidate.collided(source)) {
                    if (source.pointInPolyCheck || candidate.pointInPolyCheck) {
                        if (this.pointsInPolygon(source, candidate)) {
                            cb(source, candidate);
                        }
                    } else {
                        cb(source, candidate);
                    }
                } else if (dcb) {
                    dcb(source, candidate);
                }
            });

        });

    }

    private pointsInPolygon(source: Object2D, candidate: Object2D): boolean {
        let vert1 = source.vertices.length > candidate.vertices.length ? source.vertices : candidate.vertices;
        let vert2 = source.vertices.length <= candidate.vertices.length ? source.vertices : candidate.vertices;

        for (let i = 0, l = vert2.length; i < l; i++) {
            if (this.pointInPoly(vert1, vert2[i])) {
                return true;
            }
        }

        return false;
    }

    // credit: Lascha Lagidse http://alienryderflex.com/polygon/
    private pointInPoly(v: Point[], t: Point) {
        let polyCorners = v.length - 1;
        let i, j = polyCorners - 1;
        let polyX = v.map(p => p.x);
        let polyY = v.map(p => p.y);
        let x = t.x;
        let y = t.y;
        let oddNodes = 0;
  
        for (i=0; i<polyCorners; i++) {
            if ((polyY[i]< y && polyY[j]>=y
                ||   polyY[j]< y && polyY[i]>=y)
                &&  (polyX[i]<=x || polyX[j]<=x)) {
                oddNodes^=(polyX[i] + (y-polyY[i]) / (polyY[j] - polyY[i]) * (polyX[j]-polyX[i]) < x as any); 
            }
            j=i; 
        }

        return oddNodes; 
    }
}

