
pixelsize = 500 // width and height of viewport in Pixels
metersize = 80 // How many meters fit into the viewport
trackwidth = 8
scale = pixelsize / metersize // pix per meter
function getMeterPos(event) {
     let xPos= event.offsetX; // gets x coordinate of the mouse cursor, relative to the target element
     let yPos= event.offsetY;
     return {x: xPos / scale, y: yPos / scale} //converts the cordinate to meters.
}

// sets the viewbox and rectangle for the Beziercurve etc.
document.querySelector(".track").innerHTML = `     <svg class="svgmouse" viewBox="0 0 ${metersize} ${metersize}
"> <!--Interactable box for drawing Bèzier Curves-->
<rect width=" ${metersize}" height=" ${metersize}" fill="rgb(134, 134, 134)"></rect>
</svg>`



function getAllControlpoints(points,width) { //draws the Bèzier Curve 
     if(points.length <= 1) return {}
     //First point
     let dx = points[1].x - points[0].x
     let dy = points[1].y - points[0].y
     let c1x = points[0].x + 1/3 * dx
     let c1y = points[0].y + 1/3 * dy
     let path = `<path class="smoothpath" style="stroke-width:${width}" d="M ${points[0].x} ${points[0].y} C ${c1x} ${c1y}, ` // Adds the first coordinates to the or Bèzier Curve (C)
     let controlpoints = [points[0], {x: c1x, y: c1y}] // first points of the array
     for(let i = 1; i < points.length - 1; i++) {   
          const p = points[i]
          const prevPoint = points[i-1]
          const nextPoint = points[i+1]
          const dx = nextPoint.x - prevPoint.x
          const dy = nextPoint.y - prevPoint.y
          const c1x = p.x - 1/6 * dx // controlpoint 1 x
          const c1y = p.y - 1/6 * dy 
          const c2x = p.x + 1/6 * dx // controlpoint 2 x
          const c2y = p.y + 1/6 * dy 
          path += `${c1x} ${c1y}, ${p.x} ${p.y}, ${c2x} ${c2y},` // += does an Additon
          controlpoints.push({x: c1x, y: c1y}) // adds the controlpoints always at the end of the Array
          controlpoints.push({x: p.x, y: p.y}) // intermediate points
          controlpoints.push({x: c2x, y: c2y})
     }
     //last point
     const p = points.at(-1)
     const prevPoint = points.at(-2)
     dx = p.x - prevPoint.x
     dy = p.y - prevPoint.y
     c1x = p.x - 1/3 * dx
     c1y = p.y - 1/3 * dy
     controlpoints.push({x: c1x, y: c1y})
     controlpoints.push({x: p.x, y: p.y})
     path += `${c1x} ${c1y}, ${p.x} ${p.y}`
     path += `"></path>`//close path tag
     return {
          controlpoints: controlpoints,
          path: path
      };
  }
  


// display Coordinates (whole document)
document.onmousemove= mouseCoordinates; //applys onmousemove to the whole document
let output= document.getElementById('output') // fetches id 


// get the Coordiantes for whole page 
function mouseCoordinates(event){
     let {x, y} = getMeterPos(event); 
     CordinateOutput.innerHTML= "Coordinate (X) : " + x.toFixed(2) + " " + "m <br>Coordinate (Y) : " + y.toFixed(2)  + " " + "m"; // display the x,y coordinate (whole document )
 }


 // find the distance between the Bèziercurve and a Point. 
function curveDistance(p, controlPoints ){
     let d = Number.MAX_VALUE; 
     let index = 0
     for (let i = 0; i < controlPoints.length; i++ ) {
          let q = Distance(controlPoints[i], p);
          if (q<d) {
               d = q
               index = i

          }
     }
     return controlPoints[index]
}



// find distance between two points
function Distance (point1,point2) { 
     let x1 = point1.x
     let y1 = point1.y
     let x2 = point2.x
     let y2 = point2.y

     let x = x2 - x1
     let y = y2 - y1


     return Math.sqrt(x*x+y*y)
}



let active = false
let mousepoints = [] // mousecoordiantes
let controlpoints = []
let pixels = []
// calculate points and add them
let mousy = document.querySelector(".svgmouse")
mousy.setAttribute("width", pixelsize) // sets width and height of the viewport
mousy.setAttribute("height", pixelsize) 
mousy.addEventListener('click', (event) =>{
     if(active) {
          let {x, y} = getMeterPos(event);
          mousepoints.push({x: x, y: y}) // sends the coordinates to the Array
          Clickcoordinates.innerHTML="Click (X) : " + x.toFixed(2) + " " + "meters <br> Click (Y): " + y.toFixed(2) + " " + "meters"; // // displays the coordinates of the clicks relative to the div
          mousy.insertAdjacentHTML("beforeend", `<circle cx=${x} cy=${y} r="2" fill="red"></circle>`) // makes the red dots 
          const path = getAllControlpoints(mousepoints,trackwidth).path // draws curve
          mousy.querySelector(".smoothpath")?.remove() // ?. returns undefined if an object is undefined or null otherwise removes the curve
          mousy.querySelectorAll(".pixel")?.forEach(p=>p.remove()) // ?. returns undefined if an object is undefined or null otherwise removes the curve
          mousy.insertAdjacentHTML("beforeend", path) // inserts the path Before the element so it gets replaced (old curve gets removed)
          let controlpoints = getAllControlpoints(mousepoints).controlpoints // calculates all the controlpoints
          if(!controlpoints) return
          pixels = []
          for(let i = 4; i <= controlpoints.length; i+=3) {
               let newPoints = calculateCubicBezierPoints(controlpoints.slice(i-4, i), 10) //200 is the amount of pixels
               if(i > 4) {
                    newPoints = newPoints.slice(1) // to prevent doing the first point twice when beziercurves connect
               }
               pixels = pixels.concat(newPoints)         
          }
          for(let p of pixels) { // p = p.x and p.y
               mousy.insertAdjacentHTML("beforeend", `<circle class="pixel" cx=${p.x}  cy=${p.y} r=1></circle>`) // makes the small white points in the middle
               
          }

          let t = totalTime(pixels)
          console.log(pixels);
          //console.log(t);
          localStorage.path = JSON.stringify(path) // stores it into the localstorage so that it can be used for later.
          localStorage.pixels = JSON.stringify(pixels)
          localStorage.time = t
          localStorage.oldPixels =JSON.stringify(pixels)
        //  let distance = Distance(controlpoints,p ); // Calculate the distance
        //  console.log("Distance:", distance);
     }
})
// make movedmixels move
// confine pixels to the path

mousy.addEventListener('pointermove', (event) =>{
     if(active && pixels.length > 0) {
          let {x, y} = getMeterPos(event)
          Coordinatetracker.innerHTML="Cord (X) : " + x.toFixed(2) + " " +"meters <br> Cord (Y): " + y.toFixed(2) + " " + "meters"; // // displays the coordinates of the clicks relative to the div
          mousy.querySelector(".closest")?.remove() // ?. returns undefined if an object is undefined or null otherwise removes the curve
          const projectedPoint = curveDistance({x: x, y: y} ,pixels)
          mousy.insertAdjacentHTML("beforeend",`<line class="closest" x1= ${x} y1=${y} x2 =${projectedPoint.x} y2=${projectedPoint.y}  stroke="black" stroke-width="2"/>` )
          // for later
        //  let distance = Distance(controlpoints,p ); // Calculate the distance
        //  console.log("Distance:", distance);
        
     //    const tolerance = 0.0001; // Tolerance for stopping the binary search
     //    let controlpoints = getAllControlpoints(mousepoints).controlpoints
     //    const closestT = findClosestPointOnBezier({x, y}, pixels , controlpoints, tolerance);
     //    console.log("Parameter (t) for Closest Point:", closestT);
     //    mousy.insertAdjacentHTML("beforeend",`<line class="closest" x1= ${x} y1=${y} x2 =${findClosestPointOnBezier.x} y2=${findClosestPointOnBezier.y}  stroke="black" stroke-width="2"/>` )
     }
})

function Bezierclick(event) {
     active = !active // ! = not
}













// function findClosestPointOnBezier(p, pixels , controlPoints, tolerance) {
//      // Find the initial projectedPoint  index that provides a good initial guess
     
//      let d = Number.MAX_VALUE; 
//      let index = 0
//      for (let i = 0; i < pixels.length; i++ ) {
//           let q = Distance(pixels[i], p);
//           if (q<d) {
//                d = q
//                index = i
//           }
//      }
//      let t1 = index > 0 ? pixels[index - 1].t : 0;
//      let t2 = index < pixels.length - 1 ? pixels[index + 1].t : 1;
//      let interval = t2 - t1;
 
//      while (interval > tolerance) {
//          const t3 = t1 + interval / 3;
//          const t4 = t1 + (2 * interval) / 3;
 
//          const point1 = calculateCubicBezierPoint(controlPoints, t1)
//          const point3 = calculateCubicBezierPoint(controlPoints, t3)
//          const point4 = calculateCubicBezierPoint(controlPoints, t4)
//          const point2 = calculateCubicBezierPoint(controlPoints, t2)
 
//          const dist1 = Distance(p, point1);
//          const dist3 = Distance(p, point3);
//          const dist4 = Distance(p, point4);
//          const dist2 = Distance(p, point2);
//       if (dist1 < dist2 && dist1 < dist3 && dist1 < dist4) {
//              t2 = t3;
//          } else if (dist2 < dist3 && dist2 < dist4) {
//              t1 = t3;
//              t2 = t4;
//          } else if (dist3 < dist4) {
//              t1 = t4;
//          } else {
//              t1 = t3;
//          }
 
//          interval = t2 - t1;
//      }
 
//      // Final t value that gives the closest point
//      return (t1 + t2) / 2;
//  }
 
 
 
 