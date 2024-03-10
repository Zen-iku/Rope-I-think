class QRect {
  constructor(x, y, width, height){
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }
  contains(point) {
    let h = point
    if(point instanceof PointMass) h = point.position
    return (
      h.x >= this.x &&
      h.x <= this.x + this.width &&
      h.y >= this.y &&
      h.y <= this.y + this.height
    );
  }
  intersects(range) {
    return !(
      range.x + range.w < this.x ||
      range.x > this.x + this.w ||
      range.y + range.h < this.y ||
      range.y > this.y + this.h
    );
  }
  draw(){
    let ctx = Global.ctx
    let cx = /*(center) ? x - (width / 2) :*/ this.x
    let cy = /*(center) ? y - (height / 2) :*/ this.y
    ctx.beginPath()
    ctx.lineWidth = 2;
    ctx.strokeRect(Math.floor(cx), Math.floor(cy), this.width, this.height)
    ctx.stroke()
  }
}
class QuadTree {
  constructor(boundary, capacity, depth){
    this.boundary = boundary
    this.capacity = capacity; 
    this.maxDepth = 6
    this.depth = depth || 0
    this.points = [];
    this.divided = false;
    this.nw = null; 
    this.ne = null; 
    this.sw = null;
    this.se = null; 
    //console.log(this.points)
  }
  insert(point){
    if(!this.boundary.contains(point)) return false;
    if(!this.divided){
      if(this.points.length < this.capacity || 
        this.depth === this.maxDepth
      ){
        this.points.push(point)
        return true
      }
      this.subdivide()
    }
    //console.log(point)
    return (
      this.nw.insert(point) ||
      this.ne.insert(point) ||
      this.sw.insert(point) ||
      this.se.insert(point)
    )
  }
  subdivide(){
    const x = this.boundary.x;
    const y = this.boundary.y;
    const w = this.boundary.width / 2;
    const h = this.boundary.height / 2;

    const nwBoundary = new QRect(x, y, w, h);
    this.nw = new QuadTree(nwBoundary, this.capacity, this.depth + 1);

    const neBoundary = new QRect(x + w, y, w, h);
    this.ne = new QuadTree(neBoundary, this.capacity, this.depth + 1);

    const swBoundary = new QRect(x, y + h, w, h);
    this.sw = new QuadTree(swBoundary, this.capacity, this.depth + 1);

    const seBoundary = new QRect(x + w, y + h, w, h);
    this.se = new QuadTree(seBoundary, this.capacity, this.depth + 1);
    
    this.divided = true;
    
    for (const p of this.points) {
      const inserted =
        this.ne.insert(p) ||
        this.nw.insert(p) ||
        this.se.insert(p) ||
        this.sw.insert(p);
      //console.log(inserted)
    }
    this.points = null
  }
  query(range, found) {
    if (!found) {
      found = [];
    }

    if (!range.intersects(this.boundary)) {
      return found;
    }

    if (this.divided) {
      this.nw.query(range, found);
      this.ne.query(range, found);
      this.sw.query(range, found);
      this.se.query(range, found);
      return found;
    }

    for (const p of this.points) {
      if (range.contains(p)) {
        found.push(p);
      }
    }

    return found;
  }
  draw(){
    if(this.divided){
      this.nw.draw()
      this.ne.draw()
      this.sw.draw()
      this.se.draw()
    }
    this.boundary.draw()
  }
  clear(){
    if(this.divided){
      this.nw = null
      this.ne = null
      this.sw = null
      this.se = null
      this.divided = false
    }
    this.points = []
    this.depth = 0
  }
}