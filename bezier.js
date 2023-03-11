const points = [
     {x: 20, y: 20}, // x and y Cordinates
     {x: 40, y: 20},
     {x: 50, y: 30},
     {x: 20, y: 50},
     {x: 60, y: 20},
     {x: 20, y: 40},
     {x: 20, y: 20},
     {x: 20, y: 20},
     {x: 20, y: 20}
]

function draw(points) {
     const element = document.querySelector(".svgtest")
     let path = `<path d="M ${points[0].x} ${points[0].y} L` // Adds Cordinates to the L or Bèzier Curve
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

// bezier instead of line?
// draw points mouse/touch
// draw track (width = constant?)
// colors