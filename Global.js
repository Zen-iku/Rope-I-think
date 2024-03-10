window.Global = {
  init() {
    this.gObjIndex = ["points", "segment"]
    for (let gObj of this.gObjIndex) {
      this[gObj] = []
    }
    this.container = document.querySelector(".game-container")
    this.canvas = this.container.querySelector(".game-canvas")
    this.ctx = this.canvas.getContext("2d")
    this.height = this.canvas.height = window.innerHeight 
    this.width = this.canvas.width = window.innerWidth
    this.delta = this.time = 0
    this.fps = 1000 / 60
    this.lastTimeStamp = this.animationId = null
    this.drawDebug = this.disableEntDraw = this.paused = false
  },
}
Global.init()