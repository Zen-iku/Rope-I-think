class Vec {
  constructor(x, y){
    this.x = x || 0
    this.y = y || 0
  }
  setV(x, y){
    this.x = x || 0
    this.y = y || 0
    return this
  }
  len(){
    return Math.sqrt(x * x + y * y);
  }
  len2(){
    return x * x + y * y;
  }
  cpy(){
    return new Vec(this.x, this.y)
  }
  add(x, y){
    this.x += x;
    this.y += y;
    return this
  }
  addV(v){
    this.x += v.x
    this.y += v.y
    return this
  }
  sub(x, y){
    this.x -= x;
    this.y -= y;
    return this
  }
  subV(v){
    this.x -= v.x
    this.y -= v.y
    return this
  }
  scale(x, y){
    this.x *= x
    this.y *= y
    return this
  }
  scl(v){
    this.x *= v
    this.y *= v
    return this
  }
}
class PointMass {
  constructor(x, y, mass){
    this.position = new Vec(x, y);
    this.velocity = new Vec(0, 0);
    this.oldV = this.velocity.cpy()
    this.mass = mass || 1;
    this.locked = false
  };
  draw(){
    let ctx = Global.ctx
    ctx.beginPath()
    ctx.arc(Math.floor(this.position.x), Math.floor(this.position.y), 3, 0, Mathf.PI2)
    ctx.fill()
  }
  constrict(x, y){
    this.locked = true
    this.position.setV(x,y)
    this.velocity.setV(0,0)
  }
  constraint(){
    let { width, height } = Global
    this.velocity.scl(0.999)
    if(this.position.x > width){
      this.position.x = width
      this.velocity.x *= -0.80
    }
    if(this.position.x < 0){
      this.position.x = 0
      this.velocity.x *= -0.80
    }
    if(this.position.y > height){
      this.position.y = height 
      this.velocity.y *= -0.50
      //this.applyForce(0,scl)
      this.velocity.scl(0.98)
    }
    if(this.position.y < 0){
      this.position.y = 0
      this.velocity.y *= -0.80
    }
  }
  update(){
    this.constraint()
    this.oldV = this.velocity.cpy()
    if(!this.locked) this.applyForce(0, 0.9 * this.mass)
    this.position.add(this.velocity.x * Global.delta, this.velocity.y * Global.delta)
  }
  applyForce(x, y){
    let sc = 1 / (this.mass * Global.delta);
    let fx = x * sc, fy = y * sc;
    this.velocity.add(fx, fy)
  }
  applyForceV(force){
    let sc = 1 / (this.mass * Global.delta)
    force.scale(sc, sc)
    this.velocity.add(force.x, force.y)
  }
}
class Segment {
  constructor(p1, p2, length){
    this.point1 = p1;
    this.point2 = p2;
    this.length = length || Mathf.dst(p1.position.x, p1.position.y, p2.position.x, p2.position.y);
  }
  
  update(){
    let mult = (this.point1.locked || this.point2.locked)? 1 : 0.5
    let point1 = this.point1.position.cpy();
    let point2 = this.point2.position.cpy();
    let dx = point2.x - point1.x, 
        dy = point2.y - point1.y,
        distance = Math.sqrt(dx * dx + dy * dy),
        percentage = ((this.length - distance) / distance) * mult,
        fx = dx * percentage, 
        fy = dy * percentage;
        
    if(!this.point1.locked){
      this.point1.position.x -= fx;
      this.point1.position.y -= fy;
    }
    if(!this.point2.locked){
      this.point2.position.x += fx;
      this.point2.position.y += fy;
    }
    if(!this.point1.locked){
      this.point1.velocity.add(this.point1.position.cpy().x - point1.x, this.point1.position.cpy().y - point1.y)
    }
    if(!this.point2.locked){
    this.point2.velocity.x += this.point2.position.cpy().x - point2.x
    this.point2.velocity.y += this.point2.position.cpy().y - point2.y
    }
  }
  intersects(other){
    
  }
  draw(){
    let ctx = Global.ctx;
    ctx.beginPath();
    ctx.moveTo(Math.floor(this.point1.position.x), Math.floor(this.point1.position.y));
    ctx.lineTo(Math.floor(this.point2.position.x), Math.floor(this.point2.position.y));
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
  }
}