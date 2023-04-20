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
     let path = `<path d="M ${points[0].x} ${points[0].y} Q` // Adds Cordinates to the L or Bèzier Curve (Q)
     debugger
     for(let p of points.slice(1)) { // slice = creates an new array  
          path += `${p.x} ${p.y}, `
     }
     path += `"></path>`
     element.innerHTML += path 
}

function testdraw() {
     draw(points)
}

// bezier instead of line? (solved with Q for bezier curves) better Visuals including gridmap usw incoming.

// draw points mouse/touch (have to get cordinates from mouseclick to implement better done after grid)

// draw track (width = constant?) (width higly likly done with normals )

// colors