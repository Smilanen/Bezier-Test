


// function for finding the right speed(v[m/s])
function speed(circleCoordinates){
     debugger
     let μ = document.getElementById("mue").value // static friction (friction between tires and road surface)
     let a_Break = document.getElementById("abrk").value // brake strength (negetive acceleration)
     let a_Acc = document.getElementById("aacc").value // acceleration of Car
     let g = 9.81 // in m/s^2  
     let r = circleCoordinates[1].r

     let v = Math.sqrt(μ*g*r)
     console.log(v)
     return v
      




}

console.log(speed(circleCoordinates))