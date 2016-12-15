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
                if (candidate.collided(source)) {
                    cb(source, candidate);
                } else if (dcb) {
                    dcb(source, candidate);
                }
            });

        });

    }

}