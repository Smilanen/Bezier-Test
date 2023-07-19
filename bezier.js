const points = [
     {x: 1, y: 1}, // x and y Cordinates of the Control Points svgtest window. 
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
     let dy = points[1].y - points[0].y // distance between first and second point (y Coordinate)
     let c1x = points[0].x + 1/3 * dx // controlpoints for first point (x Coordiante)
     let c1y = points[0].y + 1/3 * dy // controlpoints for first point (y Coordiante)
     let path = `<path class="smoothpath" d="M ${points[0].x} ${points[0].y} C ${c1x} ${c1y}, ` // Adds the first Cordinates to the L or Bèzier Curve (Q)
     // intermediate points
     for(let i = 1; i < points.length - 1; i++) {  // goes through the function for every point except the first one
          const p = points[i]
          const prevPoint = points[i-1]
          const nextPoint = points[i+1]
          const dx = nextPoint.x - prevPoint.x // distance x
          const dy = nextPoint.y - prevPoint.y // distance y
          const c1x = p.x - 1/6 * dx // controlpoint 1 x
          const c1y = p.y - 1/6 * dy // controlpoint 1 y
          const c2x = p.x + 1/6 * dx // controlpoint 2 x
          const c2y = p.y + 1/6 * dy // controlpoint 2 y
          path += `${c1x} ${c1y}, ${p.x} ${p.y}, ${c2x} ${c2y},` // += does an Additon
     }
     //last point
     const p = points.at(-1)
     const prevPoint = points.at(-2)
     dx = p.x - prevPoint.x // distance x
     dy = p.y - prevPoint.y // distance y
     c1x = p.x - 1/3 * dx // controlpoint 1 x
     c1y = p.y - 1/3 * dy // controlpoint 1 y
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

document.onmousemove= mouseCoordinates; //applys onmousemove to the whole document
var output= document.getElementById('output') // fetches id 

function mouseCoordinates(event){
     var xPos= event.pageX; // gets x coordinate
     var yPos= event.pageY; // gts  y coordinate
     CordinateOutput.innerHTML= "Coordinate (X) : " + xPos + " " + "pixels <br>Coordinate (Y) : " + yPos + " " + "pixels"; // display the x,y coordinate
 }
 
let active = false
let mousepoints = []

let mousy = document.querySelector(".svgmouse")
mousy.addEventListener('click', (event) =>{
     if(active) {
          console.log(event) 
          var xPos= event.offsetX; // gets x coordinate of the mouse cursor, relative to the target element
          var yPos= event.offsetY; // gets  y coordinate of the mouse cursor, relative to the target element
          mousepoints.push({x: xPos, y: yPos}) // displays the cordinates of the clicks relative to the div
          ClickCordinates.innerHTML="Click (X) : " + xPos + " " +"pixels <br> Click (Y): " + yPos + " " + "pixels";
          mousy.insertAdjacentHTML("beforeend", `<circle cx=${xPos} cy=${yPos} r="2" fill="red"></circle>`)
          const path = drawpoints(mousepoints)
          console.log(path)
          mousy.querySelector(".smoothpath")?.remove()
          mousy.insertAdjacentHTML("beforeend", path)

          let controlpoints = getAllControlpoints(mousepoints)
          console.log(controlpoints);
          let pixels = calculateCubicBezierPoints(controlpoints.slice(0,4), 50)
          for(let p of pixels) {
               mousy.insertAdjacentHTML("beforeend", `<circle class="pixel" cx=${p.x}  cy=${p.y} r=1></circle>`)
          }
     }
})

function Bezierclick(event) {
     active = !active 
}










// bezier instead of line? (solved with Q for bezier curves) better Visuals including gridmap usw incoming.

// draw points mouse/touch (have to get cordinates from mouseclick to implement better done after grid)

// draw track (width = constant?) (width higly likly done with normals )

// colors


