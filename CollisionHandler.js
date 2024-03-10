class CollisionHandler {
  static circleToCircle(circle1, circle2){
    let distance = Mathf.dst(circle1.x, circle1.y, circle2.x, circle2.y)
    
    if(distance < circle1.radius + circle2.radius) return true
    return false
  }
  static onSegment(p, q, r) { 
    if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && 
        q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y)) 
    return true; 
    
    return false; 
  }
  static orientation(p, q, r) { 
    // See https://www.geeksforgeeks.org/orientation-3-ordered-points/ 
    // for details of below formula. 
    let val = (q.y - p.y) * (r.x - q.x) - 
            (q.x - p.x) * (r.y - q.y); 
    
    if (val == 0) return 0; // collinear 
    
    return (val > 0)? 1: 2; // clock or counterclock wise 
  } 
  
  // The main function that returns true if line segment 'p1q1' 
  // and 'p2q2' intersect. 
  static doIntersect(p1, q1, p2, q2) { 
    // Find the four orientations needed for general and 
    // special cases 
    let o1 = this.orientation(p1, q1, p2); 
    let o2 = this.orientation(p1, q1, q2); 
    let o3 = this.orientation(p2, q2, p1); 
    let o4 = this.orientation(p2, q2, q1); 
    
    // General case 
    if (o1 != o2 && o3 != o4) return true; 
    
    // Special Cases 
    // p1, q1 and p2 are collinear and p2 lies on segment p1q1 
    if (o1 == 0 && this.onSegment(p1, p2, q1)) return true; 
    // p1, q1 and q2 are collinear and q2 lies on segment p1q1 
    if (o2 == 0 && this.onSegment(p1, q2, q1)) return true; 
    // p2, q2 and p1 are collinear and p1 lies on segment p2q2 
    if (o3 == 0 && this.onSegment(p2, p1, q2)) return true; 
    // p2, q2 and q1 are collinear and q1 lies on segment p2q2 
    if (o4 == 0 && this.onSegment(p2, q1, q2)) return true; 
    
    return false; // Doesn't fall in any of the above cases 
  } 
  static calculateIntersection(p0, p1, p2, p3){
    let A1 = p1.y - p0.y,
			B1 = p0.x - p1.x,
			C1 = A1 * p0.x + B1 * p0.y,
			A2 = p3.y - p2.y,
			B2 = p2.x - p3.x,
			C2 = A2 * p2.x + B2 * p2.y,
			denominator = A1 * B2 - A2 * B1;

		if(denominator == 0) return null

		let intersectX = (B2 * C1 - B1 * C2) / denominator,
			intersectY = (A1 * C2 - A2 * C1) / denominator,
			rx0 = (intersectX - p0.x) / (p1.x - p0.x),
			ry0 = (intersectY - p0.y) / (p1.y - p0.y),
			rx1 = (intersectX - p2.x) / (p3.x - p2.x),
			ry1 = (intersectY - p2.y) / (p3.y - p2.y);

		if(((rx0 >= 0 && rx0 <= 1) || (ry0 >= 0 && ry0 <= 1)) && 
		   ((rx1 >= 0 && rx1 <= 1) || (ry1 >= 0 && ry1 <= 1))) {
			return {
				x: intersectX,
				y: intersectY
			};
		}
			return null
  }
  static update(){
    
  }
}