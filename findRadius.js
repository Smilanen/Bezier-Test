


function threepointcircle(pixels) {
	
	let circleCoordinates = [] 

     for (let index = 0, j = 3; index < pixels.length - 2; index++, j++) { // goes throught the array 
          
          let threePoints = pixels.slice(index, j) // makes packages of three

          if (calculateSlope(threePoints[0], threePoints[1]) == calculateSlope(threePoints[1], threePoints[2])){//if the threepoints are on one line it ignores it.
               // do nothing 
			
          }else {// if the three points are not on one line it calculates the circle.
			let {x, y, r} = findCircle(threePoints[0], threePoints[1], threePoints[2]) 
			circleCoordinates.push({x: x, y: y, r: r}) // send it to the Array
			//console.log(circleCoordinates)
			

          }
          
     }
	return circleCoordinates


     
}


function calculateSlope (point1,point2){ // calculates slope 
    
     let x1 = point1.x
     let y1 = point1.y
     let x2 = point2.x
     let y2 = point2.y

     let dx = x2 - x1 // difference x
     let dy = y2 - y1 // difference y

     let m = dy/dx // m = slope
     return m
} 


// link to original code: https://www.geeksforgeeks.org/equation-of-circle-when-three-points-on-the-circle-are-given/
// Function to find the circle on which the given three points lie
function findCircle(point1, point2, point3){

	let x1 = point1.x
     let y1 = point1.y
     let x2 = point2.x
     let y2 = point2.y
	let x3 = point3.x
	let y3 = point3.y

	let x12 = (x1 - x2);
	let x13 = (x1 - x3);

	let y12 =( y1 - y2);
	let y13 = (y1 - y3);

	let y31 = (y3 - y1);
	let y21 = (y2 - y1);

	let x31 = (x3 - x1);
	let x21 = (x2 - x1);

	//x1^2 - x3^2
	let sx13 = Math.pow(x1, 2) - Math.pow(x3, 2);

	// y1^2 - y3^2
	let sy13 = Math.pow(y1, 2) - Math.pow(y3, 2);

	let sx21 = Math.pow(x2, 2) - Math.pow(x1, 2);
	let sy21 = Math.pow(y2, 2) - Math.pow(y1, 2);

	let f = ((sx13) * (x12)
			+ (sy13) * (x12)
			+ (sx21) * (x13)
			+ (sy21) * (x13))
			/ (2 * ((y31) * (x12) - (y21) * (x13)));
	let g = ((sx13) * (y12)
			+ (sy13) * (y12)
			+ (sx21) * (y13)
			+ (sy21) * (y13))
			/ (2 * ((x31) * (y12) - (x21) * (y13)));

	let c = -(Math.pow(x1, 2)) - 
	Math.pow(y1, 2) - 2 * g * x1 - 2 * f * y1;

	// equation of circle in general Form is: x^2 + y^2 + 2*g*x + 2*f*y + c = 0
	// where centre is (h = -g, k = -f) 
	// and radius r as r^2 = h^2 + k^2 - c
	let h = -g;
	let k = -f;
	let sqr_of_r = h * h + k * k - c;

	// r is the radius
	let r = Math.sqrt(sqr_of_r);

	// console.log(r.toFixed(3))
	// console.log(h)
	// console.log(k)
	
	return {x: h, y: k, r: r}
     
	// document.write("Centre = (" + h + ", "+ k +")" + "<br>");
	// document.write( "Radius = " + r.toFixed(5));

}






