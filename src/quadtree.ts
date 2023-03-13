export class Quadtree implements IQuadtree {

    nodes: Quadtree[];
    objects: Rect[];
    width2: number;
    height2: number;
    xmid: number;
    ymid: number;

    constructor(public bounds: Rect, private maxObjects: number = 1, private maxLevels: number = 4, private level = 0) {
        this.objects = [];
        this.nodes = [];
        this.width2 = this.bounds.width / 2;
        this.height2 = this.bounds.height / 2;
        this.xmid = this.bounds.x + this.width2;
        this.ymid = this.bounds.y + this.height2;
    }

    insert(rect: Rect) {
        if (!rect) {
            return;
        }
        
        let i = 0;
        let indices: number[];

        if (this.nodes.length) {
            indices = this.getIndex(rect);

            if (indices.length) {
                indices.forEach(i => {
                    this.nodes[i].insert(rect);
                });
                return;
            }
        }

        this.objects.push(rect);

        if (this.objects.length > this.maxObjects && this.level < this.maxLevels) {
            if (!this.nodes.length) {
                this.split();
            }

            while (i < this.objects.length) {
                indices = this.getIndex(this.objects[i]);

                if (indices.length) {
                    let object = this.objects.splice(i, 1)[0];
                    indices.forEach(n => {
                        this.nodes[n].insert(object);
                    });
                } else {
                    i = i + 1;
                }
            }
        }
    }

    retrieve(rect: Rect) {
        if (!rect) {
            return [];
        }
        
        let indices = this.getIndex(rect);
        let result = this.objects;

        if (this.nodes.length) {
            if (indices.length) {
                indices.forEach(i => {
                    result = result.concat(this.nodes[i].retrieve(rect));
                });
            } else {
                for (let i = 0; i < this.nodes.length; i++) {
                    result = result.concat(this.nodes[i].retrieve(rect));
                }
            }
        }

        return result.filter((x, n, a) => a.indexOf(x) === n);
    };

    clear() {
        this.objects = [];

        for (let i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i]) {
                this.nodes[i].clear();
            }
        }

        this.nodes = [];
    };

    private getIndex(rect: Rect): number[] {
        if (!rect) {
            return [];
        }
        
        const results = [];
        const { xmid, ymid } = this;
        const top = (rect.y <= ymid); 
        const bottom = (rect.y > ymid);

        if (rect.x <= xmid) {
            if (top) {
                results.push(1);
                let zero = false;

                if (rect.x + rect.width > xmid) {
                    results.push(0);
                    zero = true;
                }

                if (rect.y + rect.height > ymid) {
                    results.push(2);
                    if (zero) {
                        results.push(3);
                    }
                }
            } else if (bottom) {
                results.push(2);

                if (rect.x + rect.width > xmid) {
                    results.push(3);
                }
            }

        } else if (rect.x > xmid) {
            if (top) {
                results.push(0);
                if (rect.y + rect.height > ymid) {
                    results.push(3);
                }
            } else {
                results.push(3)
            }
        }

        return results;
    };

    private split() {
        const width = Math.round(this.width2);
        const height = Math.round(this.height2);
        const x = Math.round(this.bounds.x);
        const y = Math.round(this.bounds.y);

        const create = (x, y) => {
            const bounds: Rect = {
                x: x,
                y: y,
                width: width,
                height: height
            };
            return new Quadtree(bounds, this.maxObjects, this.maxLevels, this.level + 1);
        };

        // top right, top left, bottom left, bottom right
        this.nodes = [create(x + width, y), create(x, y), create(x, y + height), create(x + width, y + height)];
    };
}