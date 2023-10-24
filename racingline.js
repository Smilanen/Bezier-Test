

const sleep = ms => new Promise(res => setTimeout(res, ms)); // for slowdown 



// function for finding the right speed(v[m/s])
function speed(circleCoordinate){
     let μ = document.getElementById("mue").value // static friction (friction between tires and road surface)
     let g = 9.81 // in m/s^2  
     let r = circleCoordinate.r // radius of the circle
     let v = Math.sqrt(μ*g*r) // speed which is possibe according to the laws of phyics on the circle.
     return v 
}

function getPossibleSpeed(vmax, pixels) { // find the speed which is possible according to the cars Performance
     let a_Acc = Number(document.getElementById("aacc").value) // acceleration of car
     let a_Break = -Number (document.getElementById("abrk").value) // brakes of the car 
     let v = [0] // makes an array with the speed
     for(let i = 1; i < vmax.length; i++)  { // goes forward through this array 
          let dx = pixels[i].x - pixels[i-1].x // the x coordinate difference between each pixels 
          let dy = pixels[i].y - pixels[i-1].y
          let s = Math.sqrt(dx**2 + dy**2)  // the route between each pixel
          let vacc = Math.sqrt(2 * a_Acc *s + v[i-1]**2) // let the speed of the acceleration be 
          v.push(Math.min(vmax[i], vacc)) // return only the smaller of the two values
     }
     for(let i = vmax.length-2; i >= 0; i--)  { // goes backwards through this array
          let dx = pixels[i].x - pixels[i+1].x
          let dy = pixels[i].y - pixels[i+1].y
          let s = Math.sqrt(dx**2 + dy**2)
          let vbreak = Math.sqrt(2 * a_Break *s + v[i+1]**2)
          v[i] = Math.min(v[i], vbreak) // return only the smaller of the two values
     }
     return v
}

function getTime(vs, pixels) {
     let t = 0
     for(let i = 0; i < pixels.length - 1; i++)  {
          let dx = pixels[i].x - pixels[i+1].x // x distance between pixels
          let dy = pixels[i].y - pixels[i+1].y
          let s = Math.sqrt(dx**2 + dy**2) // distance between pixels
          let v = (vs[i] + vs[i+1]) / 2 // average speed between two pixels
          t += s / v // time from from this formula restructured  s/t = v
          //Calculates the total time taken to traverse the path based on the speeds at each segment. It calculates the time for each segment and sums them up.
     }
     return t
}

function totalTime(pixels) { 
     let circleCoordinates = threepointcircle(pixels) // cordinates of the circle with radius
     let vmax = [0, ...circleCoordinates.map(speed), Infinity] //The ... operator can be used to expand an iterable into more arguments for function calls. 
     // vmax starts with zero and has end of infinity because thats the maxium speed the car is allowed to go without falling of the track.
     let vpossible = getPossibleSpeed(vmax, pixels) // the speed that is possible with the power of the car
     let t = getTime(vpossible, pixels) // get the time between two pixels
     return t
}


async function calculateCorrections(pixels, time) {
     let corrections = []
     const d = 0.000000001
     for (let i = 0; i < pixels.length; i++) {
          if(i == 0 || i == pixels.length - 1) {
               corrections.push({ x: 0, y: 0 })
               continue
          }
          const p = pixels[i]
          p.x = p.x - d
          let tleft = totalTime(pixels)
          p.x = p.x + 2 * d
          let tright = totalTime(pixels)
          p.x = p.x - d
          let dtx = tleft - tright
          p.y = p.y - d
          let tup = totalTime(pixels)
          p.y = p.y + 2 * d
          let tdown = totalTime(pixels)
          p.y = p.y - d
          let dty = tup - tdown
          //equal spread
          dx = (pixels[i+1].x - p.x) - (p.x - pixels[i-1].x)
          dy = (pixels[i+1].y - p.y) - (p.y - pixels[i-1].y)

          corrections.push({ x: dtx * 10000000 + 0.001* dx, y: dty * 10000000 + 0.001* dy })
          //console.log(dtx, dty);
     }
     return corrections
 }
 
function applyCorrections(pixels, corrections, path, oldpixels, index = 0) {
     if (index >= pixels.length) {
          return;  // All steps visualized, exit the function
     }
     pixels[index].x += corrections[index].x
     pixels[index].y += corrections[index].y
     //await sleep(1000)
     applyCorrections(pixels, corrections, path, oldpixels, index + 1);  // Recurse to the next step
     
 }
 
 async function optimize() {
     let path = JSON.parse(localStorage.path)
     let time = Number(localStorage.time)
     let pixels = JSON.parse(localStorage.pixels)
     let oldPixels = JSON.parse(localStorage.oldPixels)
     // Draw initial state
     drawInitialVisualization(path, pixels)
 
     for(let step = 0; step < 1000000; step++) {
          let corrections = await calculateCorrections(pixels, time)
          applyCorrections(pixels, corrections, path, oldPixels)
          if(step % 100 == 0) {
               await sleep(0.1)
               console.log(totalTime(pixels));
               updateVisualization(path, pixels, oldPixels)
          }
     }

 
     // Continue with the rest of your optimization logic or visualization if needed
 }
 
 function drawInitialVisualization(path, pixels) {
     // Draw the initial state of the curve and pixels
     mousy.insertAdjacentHTML("beforeend", path)
     localStorage.oldpixels = JSON.stringify(pixels)
     for (let p of pixels) {
         mousy.insertAdjacentHTML("beforeend", `<circle class="pixel" cx=${p.x}  cy=${p.y} r=1></circle>`)
     }
     
 }
 
 function updateVisualization (path, pixels, oldpixels) {
     
     mousy.innerHTML = ""
     mousy.insertAdjacentHTML("beforeend", path)

     
     for (let p of pixels){
          mousy.insertAdjacentHTML("beforeend",`<circle class="newpixel" cx=${p.x}  cy=${p.y} r=0.3></circle>`)     
     }

     for (let p of oldpixels){
          mousy.insertAdjacentHTML("beforeend",`<circle class="oldpixel" cx=${p.x}  cy=${p.y} r=0.3></circle>`)     
     }
     
     // Update the visualization with the new positions of pixels
     // This function should redraw the entire SVG with the updated pixel positions
 }
 


















//  async function optimize() {
//      let path = JSON.parse(localStorage.path) // takes it out of the local storage
//      let time = Number(localStorage.time)
//      let pixels = JSON.parse(localStorage.pixels)
//      let mousy = document.querySelector(".svgmouse")


//      const sleep = (milliseconds) => {
//           return new Promise(resolve => setTimeout(resolve, milliseconds))
//         }


//      mousy.insertAdjacentHTML("beforeend", path)// draws the curve
//      for(let p of pixels) { // p = p.x and p.y
//           mousy.insertAdjacentHTML("beforeend", `<circle class="pixel" cx=${p.x}  cy=${p.y} r=1></circle>`) // makes the small white points in the middle
          
//      }

//      //console.log(pixels, time);
//      for(let n = 0; n < 500; n++) { // 500 steps
//           let movedPixels = JSON.parse(JSON.stringify(pixels)) //deep copy array
//           let corrections = [] // corrected path
//           for(let p of movedPixels) { // for every pixels
//                p.x = p.x + 0.00001 // moves it by 0.0001
//                let tnewx = totalTime(movedPixels) // new time with correction
//                let dtx = time - tnewx // time difference between old and moved
//                p.x = p.x - 0.00001 // reverts the change
//                p.y = p.y + 0.00001 // same for y coordinates
//                let tnewy = totalTime(movedPixels)
//                let dty = time - tnewy
//                p.y = p.y - 0.00001
//                corrections.push({x: dtx * 1, y: dty * 1}) // shows how much it improved for x and y
//           }

          
//           for(let i = 0; i < pixels.length; i++) {
//                pixels[i].x += corrections[i].x // 
//                pixels[i].y += corrections[i].y
//                await sleep(1000)
//                for(let p of pixels) { // p = p.x and p.y
//                     mousy.insertAdjacentHTML("beforeend", `<circle class="pixel" cx=${p.x}  cy=${p.y} r=1></circle>`) // makes the small white points in the middle
//                }
//           }
          
          


//           let t = totalTime(pixels)
//           console.log(t);
//      }

// }

// function sleep(ms){
//      return new Promise(resolve => setTimeout(resolve, ms))

// }