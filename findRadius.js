function threepointcircle (pixels) {
     for (let index = 0, j = 2; index < pixels.length-1; index++, j++) { // goes throught the array 
          
          let threePoints = pixels.slice(index,j) // makes packages of three
          if (calculateSlope(threePoints[0],threePoints[1]) == calculateSlope(threePoints[1],threepoint[2]) ){
               console.log(ape)

          }else {
               console.log(jamadan)
          }
     
          
     }

     
}



function calculateSlope (point1,point2){ // calculates slope 
    
     let x1 = point1.x
     let y1 = point1.y
     let x2 = point2.x
     let y2 = point2.y

     let dx = x1 - x2 // difference x
     let dy = y1 - y2 // difference y

     let m = dy/dx // m = slope
     return m
} 


