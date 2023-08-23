const points = [
     {x: 1, y: 1}, // x and y coordinates of the Control Points svgtest window. 
     {x: 10, y: 5},
     {x: 30, y: 30},
     {x: 40, y: 30},
     {x: 40, y: 40},
     {x: 50, y: 40},
     {x: 50, y: 50},
     {x: 60, y: 50},
     {x: 60, y: 60},
     {x: 70, y: 60},
     {x: 70, y: 70},
     {x: 80, y: 70},
     {x: 80, y: 80},
]


function draw(points) {
     const element = document.querySelector(".svgtest") //returns the first Element(.svgtest) within the document that matches the specified selector, or group of selectors.
     const path = drawpoints(points)
     console.log(path)
     element.innerHTML += path // inserts Bezierpoints into path (HTML)
}

function drawpoints(points) { //draws the Bèzier Curve
     if(points.length <= 1) return "" // .length checks the length of the array. return nothing
     //First point
     let dx = points[1].x - points[0].x // distance between first and second point (x Coordinate)
     let dy = points[1].y - points[0].y 
     let c1x = points[0].x + 1/3 * dx // controlpoints for first point (x Coordiante)
     let c1y = points[0].y + 1/3 * dy 
     let path = `<path class="smoothpath" d="M ${points[0].x} ${points[0].y} C ${c1x} ${c1y}, ` // Adds the first coordinates to the L or Bèzier Curve (Q)
     // intermediate points
     for(let i = 1; i < points.length - 1; i++) {  // goes through the function for every point except the first one
          const p = points[i]
          const prevPoint = points[i-1]
          const nextPoint = points[i+1]
          const dx = nextPoint.x - prevPoint.x // distance x
          const dy = nextPoint.y - prevPoint.y 
          const c1x = p.x - 1/6 * dx // controlpoint 1 x
          const c1y = p.y - 1/6 * dy 
          const c2x = p.x + 1/6 * dx // controlpoint 2 x
          const c2y = p.y + 1/6 * dy 
          path += `${c1x} ${c1y}, ${p.x} ${p.y}, ${c2x} ${c2y},` // += does an Additon
     }
     //last point
     const p = points.at(-1)
     const prevPoint = points.at(-2)
     dx = p.x - prevPoint.x // distance x
     dy = p.y - prevPoint.y 
     c1x = p.x - 1/3 * dx // controlpoint 1 x
     c1y = p.y - 1/3 * dy 
     path += `${c1x} ${c1y}, ${p.x} ${p.y}`
     //close path tag
     path += `"></path>`
     return path
}


function getAllControlpoints(points) { //draws the Bèzier Curve 
     if(points.length <= 1) return ""
     //First point
     let dx = points[1].x - points[0].x
     let dy = points[1].y - points[0].y
     let c1x = points[0].x + 1/3 * dx
     let c1y = points[0].y + 1/3 * dy
     let controlpoints = [points[0], {x: c1x, y: c1y}] // first points of the array
     for(let i = 1; i < points.length - 1; i++) { 
          const p = points[i]
          const prevPoint = points[i-1]
          const nextPoint = points[i+1]
          const dx = nextPoint.x - prevPoint.x
          const dy = nextPoint.y - prevPoint.y
          controlpoints.push({x: p.x - 1/6 * dx, y: p.y - 1/6 * dy}) // adds the controlpoints always at the end of the Array
          controlpoints.push({x: p.x, y: p.y}) 
          controlpoints.push({x: p.x + 1/6 * dx, y: p.y + 1/6 * dy})
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
     return controlpoints
}

function testdraw() { //testdraw Button (draw) in html file.
     draw(points)
}

// display Coordinates (whole document)
document.onmousemove= mouseCoordinates; //applys onmousemove to the whole document
let output= document.getElementById('output') // fetches id 


// get the Coordiantes for whole page
function mouseCoordinates(event){
     let xPos= event.pageX; // gets x coordinate
     let yPos= event.pageY; 
     CordinateOutput.innerHTML= "Coordinate (X) : " + xPos + " " + "pixels <br>Coordinate (Y) : " + yPos + " " + "pixels"; // display the x,y coordinate (whole document )
 }
 
function curveDistance(p,controlPoints ){
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

function Distance () { // find distance between two points
     let x1 = mousepoints[0].x
     let y1 = mousepoints[0].y
     let x2 = coordinates[0].x
     let y2 = coordinates[0].y

     let x = x2 - x1
     let y = y2 - y1


     return Math.sqrt(x*x+y*y)
}



let active = false
let mousepoints = []
let coordinates = [{x: 231 , y: 100}]
// calculate points and add them
let mousy = document.querySelector(".svgmouse")
mousy.addEventListener('click', (event) =>{
     if(active) {
          console.log(event) 
          let xPos= event.offsetX; // gets x coordinate of the mouse cursor, relative to the target element
          let yPos= event.offsetY; 
          mousepoints.push({x: xPos, y: yPos}) // sends the coordinates to the Array
          Clickcoordinates.innerHTML="Click (X) : " + xPos + " " +"pixels <br> Click (Y): " + yPos + " " + "pixels"; // // displays the coordinates of the clicks relative to the div
          mousy.insertAdjacentHTML("beforeend", `<circle cx=${xPos} cy=${yPos} r="2" fill="red"></circle>`) // makes the red dots 
          const path = drawpoints(mousepoints) // draws curve
          console.log(path)
          mousy.querySelector(".smoothpath")?.remove() // ?. returns undefined if an object is undefined or null otherwise removes the curve
          mousy.insertAdjacentHTML("beforeend", path) // inserts the path Before the element so it gets replaced (old curve gets removed)

          let controlpoints = getAllControlpoints(mousepoints) // calculates all the controlpoints
          console.log(controlpoints);
          let pixels = calculateCubicBezierPoints(controlpoints.slice(0,4), 4) // creates an new sliced array 50 times (for the points)
          mousy.querySelector(".pixel")?.remove() // does the same thing as path
          const projectedPoint = curveDistance(mousepoints[0],controlpoints)
          console.log ("projected Point", projectedPoint)
          for(let p of pixels) { // p = p.x and p.y
               mousy.insertAdjacentHTML("beforeend", `<circle class="pixel" cx=${p.x}  cy=${p.y} r=1></circle>`) // makes the small white points in the middle
               
          }

          let distance = Distance(mousepoints, coordinates); // Calculate the distance
          console.log("Distance:", distance);
     }
})

function Bezierclick(event) {
     active = !active // ! = not
}









// colors


