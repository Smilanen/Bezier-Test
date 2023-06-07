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

function draw(points) { //draws the Bèzier Curve
     const element = document.querySelector(".svgtest")
     //First point
     let dx = points[1].x - points[0].x
     let dy = points[1].y - points[0].y
     let c1x = points[0].x + 1/3 * dx
     let c1y = points[0].y + 1/3 * dy
     let path = `<path class="demo" d="M ${points[0].x} ${points[0].y} C ${c1x} ${c1y}, ` // Adds Cordinates to the L or Bèzier Curve (Q)
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
     console.log(path)
     element.innerHTML += path 
}

function testdraw() { //testdraw Button (draw) in html file.
     draw(points)
}

document.onmousemove= mouseCoordinates; //applys onmousemove to the whole document
var output= document.getElementById('output') // fetches id 

function mouseCoordinates(event){
     var xPos= event.pageX; // gets x coordinate
     var yPos= event.pageY; // gts  y coordinate
     cordinateoutput.innerHTML= "Coordinate (X) : " + xPos + " " + "pixels <br>Coordinate (Y) : " + yPos + " " + "pixels"; // display the x,y coordinate
     return xPos
 }
 



function Bezierclick(event) {
     if (x=0, ++x) {
          window.addEventListener('click', (event) =>{
               console.log(event.button) })
               Jange.innerHTML="bing" +xPos+ "" +"hello" + yPo;
               return x=+1
          }else{
               
          }    
         

}










// bezier instead of line? (solved with Q for bezier curves) better Visuals including gridmap usw incoming.

// draw points mouse/touch (have to get cordinates from mouseclick to implement better done after grid)

// draw track (width = constant?) (width higly likly done with normals )

// colors