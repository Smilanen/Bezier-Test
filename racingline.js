


// function for finding the right speed(v[m/s])
function speed(circleCoordinate){
     let μ = document.getElementById("mue").value // static friction (friction between tires and road surface)
     let a_Break = document.getElementById("abrk").value // brake strength (negetive acceleration)
     let a_Acc = document.getElementById("aacc").value // acceleration of Car
     let g = 9.81 // in m/s^2  
     let r = circleCoordinate.r

     let v = Math.sqrt(μ*g*r)
     return v
}

function getPossibleSpeed(vmax, pixels) {
     let a_Acc = Number(document.getElementById("aacc").value) // acceleration of Car
     let a_Break = -Number (document.getElementById("abrk").value) 
     let v = [0]
     for(let i = 1; i < vmax.length; i++)  {
          let dx = pixels[i].x - pixels[i-1].x
          let dy = pixels[i].y - pixels[i-1].y
          let s = Math.sqrt(dx**2 + dy**2)
          let vacc = Math.sqrt(2 * a_Acc *s + v[i-1]**2)
          v.push(Math.min(vmax[i], vacc))
     }
     for(let i = vmax.length-2; i >= 0; i--)  {
          let dx = pixels[i].x - pixels[i+1].x
          let dy = pixels[i].y - pixels[i+1].y
          let s = Math.sqrt(dx**2 + dy**2)
          let vbreak = Math.sqrt(2 * a_Break *s + v[i+1]**2)
          v[i] = Math.min(v[i], vbreak)
     }
     return v
}

function getTime(vs, pixels) {
     let t = 0
     for(let i = 0; i < pixels.length - 1; i++)  {
          let dx = pixels[i].x - pixels[i+1].x
          let dy = pixels[i].y - pixels[i+1].y
          let s = Math.sqrt(dx**2 + dy**2)
          let v = (vs[i] + vs[i+1]) / 2
          t += s / v
     }
     return t
}

function totalTime(pixels) { 
     let circleCoordinates = threepointcircle(pixels)
     let vmax = [0, ...circleCoordinates.map(speed), 999999999]
     let vpossible = getPossibleSpeed(vmax, pixels)
     let t = getTime(vpossible, pixels)
     return t
}

function optimize() {
     let path = JSON.parse(localStorage.path)
     let time = Number(localStorage.time)
     let pixels = JSON.parse(localStorage.pixels)
     console.log(pixels, time);
     for(let n = 0; n < 500; n++) {
          let movedPixels = JSON.parse(JSON.stringify(pixels)) //deep copy array
          let corrections = []
          for(let p of movedPixels) {
               p.x = p.x + 0.00001
               let tnewx = totalTime(movedPixels)
               let dtx = time - tnewx
               p.x = p.x - 0.00001
               p.y = p.y + 0.00001
               let tnewy = totalTime(movedPixels)
               let dty = time - tnewy
               p.y = p.y - 0.00001
               corrections.push({x: dtx * 1, y: dty * 1})
          }
          for(let i = 0; i < pixels.length; i++) {
               pixels[i].x += corrections[i].x
               pixels[i].y += corrections[i].y
          }
          let t = totalTime(pixels)
          console.log(t);
     }

}