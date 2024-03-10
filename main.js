
/*const points = [
      { x: 50, y: 200 },
      { x: 100, y: 50 },
      { x: 200, y: 250 },
      { x: 600, y: 100 },
      { x: 390, y: 200 },
      new PointMass(400, 300),
      { x: 40, y: 10}
    ];

    function drawSpline() {
      let ctx = Global.ctx
      ctx.clearRect(0, 0, Global.canvas.width, Global.canvas.height);
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);

      for (let i = 0; i < points.length - 1; i++) {
        let p = (points[i] instanceof PointMass)? points[i].position : points[i];
        const xc = (p.x + points[i + 1].x) / 2;
        const yc = (p.y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(p.x, p.y, xc, yc);
      }

      ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
      ctx.stroke();
    }
    
*/
class Game {
  mouseX = Global.width / 2
  mouseY = Global.height / 2
  update(timestamp) {
    Global.quadTree.clear();
    
    for(let h = 0; h < 1 ; h++)
      Global.segment.forEach(e => e.update());
    Global.points.forEach(e => e.update())
    for(let h = 0; h < 200 ; h++)
      Global.segment.forEach(e => e.update());
    Global.points.forEach(e => e.constraint())
      if(this.jk){
        Global.points[0].constrict(this.mouseX, this.mouseY)
      }
      this.jk = false
    Global.points.forEach(e => {
      Global.quadTree.insert(e);
    })
  }
  draw(timestamp) {
    let ctx = Global.ctx
    ctx.clearRect(0, 0, Global.width, Global.height)
    //drawSpline();
    Global.points.forEach(e => {
      //e.draw();
    })
    Global.segment.forEach(e => {
      e.draw();
    })
    ctx.strokeStyle = "red";
    //Global.quadTree.draw()
  }
  init() {
    Global.quadTree = new QuadTree(
      new QRect(-5, -5, Global.width + 10, Global.height +10), 4, 0)
    
    for(let i = 0; i < Global.width/50; i++){
      let h = new PointMass(i * 100, 0 * Math.random(), 2)
      h.velocity.add((Math.random() * 10) - 5, Math.random() * -5)
      Global.points.push(h)
      Global.quadTree.insert(h)
    }
    Global.points.forEach((v, i, a) => {
      let h = a[i + 1]
      if(!h) return 
      Global.segment.push(new Segment(v, h, 50))
    })
  }
  startGameLoop() {
    let step = timestamp => {
      Global.animationId = requestAnimationFrame(step)
      Global.time = timestamp
      if (!Global.lastTimeStamp) Global.lastTimeStamp = timestamp
      let elapsed = timestamp - Global.lastTimeStamp
      Global.delta = elapsed / Global.fps / 2

      if (elapsed > Global.fps) {
        this.update(timestamp)
        this.draw(timestamp)
        Global.lastTimeStamp = timestamp
      }
    }
    requestAnimationFrame(step)
  }
}

window.onload = () => {
  window.game = new Game()
  game.init()
  Global.canvas.addEventListener("touchmove", e => {
    e.preventDefault()
    game.lmouseX = game.mouseX
    game.lmouseY = game.mouseY
    game.mouseX = e.touches[0].clientX
    game.mouseY = e.touches[0].clientY
    game.jk = true
    //console.log(game.mouseX, game.mouseY)
  })

  game.startGameLoop()
}