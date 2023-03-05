const points = [
     [20, 20],
     [40, 20],
     [50, 30],
     [20, 20],
     [20, 20],
     [20, 20],
     [20, 20],
     [20, 20],
     [20, 20]
]

function draw(points) {
     const element = document.querySelector(".svgtest")
     let path = `<path d="M ${points[0][0]} ${points[0][1]} L`
     debugger
     for(let p of points.slice(1)) {
          path += `${p[0]} ${p[1]}, `
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