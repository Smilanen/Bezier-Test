  
// Function to calculate the coordinates of points along the cubic Bezier curve
function calculateCubicBezierPoints(controlPoints, numPoints) {
     const points = [];
     for (let i = 0; i <= numPoints; i++) {
          const t = i / numPoints;
          const point = calculateCubicBezierPoint(controlPoints, t);
          points.push(point);
     }
     return points;
}

// Function to calculate a single point along the cubic Bezier curve
function calculateCubicBezierPoint(controlPoints, t) {
     const x0 = controlPoints[0].x;
     const y0 = controlPoints[0].y;
     const x1 = controlPoints[1].x;
     const y1 = controlPoints[1].y;
     const x2 = controlPoints[2].x;
     const y2 = controlPoints[2].y;
     const x3 = controlPoints[3].x;
     const y3 = controlPoints[3].y;

     const u = 1 - t;
     const tt = t * t;
     const uu = u * u;
     const uuu = uu * u;
     const ttt = tt * t;

     const point = {
          x: uuu * x0 + 3 * uu * t * x1 + 3 * u * tt * x2 + ttt * x3,
          y: uuu * y0 + 3 * uu * t * y1 + 3 * u * tt * y2 + ttt * y3
     };

     return point;
}

   
   
   
   
   
   