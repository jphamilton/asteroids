import screen from './screen';
import { Quadtree } from './quadtree';
import { Object2D } from './object2d';
import { lineclip } from './lineclip';

export type CollisionCallback<TSource, TTarget> = (a: TSource, b: TTarget) => void;
export type BulletCollisionCallback<TSource, TTarget> = (a: TSource, b: TSource, c: TTarget) => void;

export class Collisions {

    tree: Quadtree;

    constructor() {
        this.tree = new Quadtree({
            x: 0, 
            y: 0, 
            width: screen.width, 
            height: screen.height
        });
    }

    // special case for ship bullets
    bulletCheck<TSource extends Object2D, TTarget extends Object2D>(bullets: TSource[], targets: TTarget[], cb: CollisionCallback<TSource, TTarget>, dcb?: BulletCollisionCallback<TSource, TTarget>) {
        if (!bullets || !bullets.length || !targets || !targets.length) {
            return;
        }

        let candidates: TTarget[] = [];
        let results = [];

        this.tree.clear();
        
        targets.forEach(target => {
            this.tree.insert(target);
        });

        // check bullet here
        for(let i = 0; i < bullets.length; i++) {

            const bullet1 = bullets[i];
            
            candidates.length = 0;
            candidates.push(...this.tree.retrieve(bullet1) as any);
            
            candidates.forEach(candidate => {
                
                if (candidate.collided(bullet1)) {
                    cb(bullet1, candidate);
                    return; // bail
                } else if (dcb) {
                    dcb(bullet1, bullet1, candidate);
                }
                
                // line clip
                if (i < bullets.length - 1) {
                    const bullet2 = bullets[i + 1];
                    const bbox = [candidate.x, candidate.y, candidate.x + candidate.width, candidate.y + candidate.height ];

                    results.length = 0;
                    
                    lineclip([[bullet1.origin.x, bullet1.origin.y], [bullet2.origin.x, bullet2.origin.y]], bbox, results);

                    if (results.length) {
                        if (dcb) {
                            dcb(bullet1, bullet2, candidate);
                        }
                        
                        cb(bullet1, candidate);
                    } 
                }
                

            });
        }

    } 


    check<TSource extends Object2D, TTarget extends Object2D>(sources: TSource[], targets: TTarget[], deep: boolean, cb: CollisionCallback<TSource, TTarget>, dcb?: CollisionCallback<TSource, TTarget>) {
        if (!sources || !sources.length || !targets || !targets.length) {
            return;
        }

        this.tree.clear();
        
        targets.forEach(target => {
            this.tree.insert(target);
        });
        
        sources.forEach(source => {

            const candidates: any[] = this.tree.retrieve(source);
            
            candidates.forEach(candidate => {
                
                // AABB first
               if (candidate.collided(source)) {
                    if (deep) {
                        if (this.pointsInPolygon(source, candidate || this.pointsInPolygon(candidate, source))) {
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

