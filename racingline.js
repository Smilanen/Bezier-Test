

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
     for (let p of pixels) {
         p.x = p.x + 0.00001
         let tnewx = totalTime(pixels)
         let dtx = time - tnewx
         p.x = p.x - 0.00001
         p.y = p.y + 0.00001
         let tnewy = totalTime(pixels)
         let dty = time - tnewy
         p.y = p.y - 0.00001
         corrections.push({ x: dtx * 1, y: dty * 1 })
     }
     return corrections
 }
 
 async function visualizeCorrections(pixels, corrections, path, oldpixels, index = 0) {
     if (index >= pixels.length) {
          return;  // All steps visualized, exit the function
     }
     pixels[index].x += corrections[index].x
     pixels[index].y += corrections[index].y
     await sleep(10000)
     updateVisualization (path, pixels, oldpixels) // update visualization here
     await sleep(1000);  // Wait for 1 second
     visualizeCorrections(pixels, corrections, path, oldpixels, index + 1);  // Recurse to the next step
     
 }
 
 async function optimize() {
     let path = JSON.parse(localStorage.path)
     let time = Number(localStorage.time)
     let pixels = JSON.parse(localStorage.pixels)
     let oldpixels = JSON.parse(localStorage.oldpixels)
     // Draw initial state
     drawInitialVisualization(path, pixels)
 
     let corrections = await calculateCorrections(pixels, time)
     visualizeCorrections(pixels, corrections, path, oldpixels)
 
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
          mousy.insertAdjacentHTML("beforeend",`<circle class="newpixel" cx=${p.x}  cy=${p.y} r=1></circle>`)     
     }

     for (let p of oldpixels){
          mousy.insertAdjacentHTML("beforeend",`<circle class="oldpixel" cx=${p.x}  cy=${p.y} r=1></circle>`)     
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