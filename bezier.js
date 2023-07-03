const points = [
     {x: 20, y: 20}, // x and y Cordinates of the Control Points. 
     {x: 30, y: 20},
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
     const element = document.querySelector(".svgtest")
     const path = drawpoints(points)
     console.log(path)
     element.innerHTML += path 
}

// maybe Containers Elements for ease of use
function drawpoints(points) { //draws the Bèzier Curve
     if(points.length <= 1) return ""
     //First point
     let dx = points[1].x - points[0].x
     let dy = points[1].y - points[0].y
     let c1x = points[0].x + 1/3 * dx
     let c1y = points[0].y + 1/3 * dy
     let path = `<path class="smoothpath" d="M ${points[0].x} ${points[0].y} C ${c1x} ${c1y}, ` // Adds Cordinates to the L or Bèzier Curve (Q)
     // intermediate points
     for(let i = 1; i < points.length - 1; i++) { 
          const p = points[i]
          const prevPoint = points[i-1]
          const nextPoint = points[i+1]
          const dx = nextPoint.x - prevPoint.x
          const dy = nextPoint.y - prevPoint.y
          const c1x = p.x - 1/6 * dx
          const c1y = p.y - 1/6 * dy
          const c2x = p.x + 1/6 * dx
          const c2y = p.y + 1/6 * dy
          path += `${c1x} ${c1y}, ${p.x} ${p.y}, ${c2x} ${c2y},`
     }
     //last point
     const p = points.at(-1)
     const prevPoint = points.at(-2)
     dx = p.x - prevPoint.x
     dy = p.y - prevPoint.y
     c1x = p.x - 1/3 * dx
     c1y = p.y - 1/3 * dy
     path += `${c1x} ${c1y}, ${p.x} ${p.y}`
     //close path tag
     path += `"></path>`
     return path
}

// maybe Containers Elements for ease of use
function getAllControlpoints(points) { //draws the Bèzier Curve
     if(points.length <= 1) return ""
     //First point
     let dx = points[1].x - points[0].x
     let dy = points[1].y - points[0].y
     let c1x = points[0].x + 1/3 * dx
     let c1y = points[0].y + 1/3 * dy
     let controlpoints = [points[0], {x: c1x, y: c1y}]
     for(let i = 1; i < points.length - 1; i++) { 
          const p = points[i]
          const prevPoint = points[i-1]
          const nextPoint = points[i+1]
          const dx = nextPoint.x - prevPoint.x
          const dy = nextPoint.y - prevPoint.y
          controlpoints.push({x: p.x - 1/6 * dx, y: p.y - 1/6 * dy})
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
          var xPos= event.offsetX; // gets x coordinate
          var yPos= event.offsetY; // gts  y coordinate
          mousepoints.push({x: xPos, y: yPos})
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


