var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

// Parameters for the simulation
const G = 6.67430e-11;
const dt = 0.5;
const m1 = 100000000000000;
const m2 = 100000000000000;
const trailLength = 1000;
const trailRes = 0.1;
let r, f;

// Radius of each body
const radius1 = 1;
const radius2 = 10;

// Initial position and velocity of body 1
let position1 = new Vector(0, 0);
let velocity1 = new Vector(2, -0.1);

// Initial position and velocity of body 2
let position2 = new Vector(-400, -200);
let velocity2 = new Vector(-2, 0);

// Keep track of the previous positions of the two bodies
let prevPosition1 = [];
let prevPosition2 = [];

let n = 0;


function simulate() {
    // Calculate the distance between the two bodies
    let distance = new Vector(position2.x - position1.x, position2.y - position1.y);
    r = Math.sqrt(distance.x * distance.x + distance.y * distance.y);

    // Calculate the force of gravity between the two bodies
    f = G * ((m1 * m2) / (r * r));
    let force = new Vector(f * distance.x / r, f * distance.y / r);

    // Update the velocity of body 1 based on the force of gravity from body 2
    velocity1.x += force.x / m1 * dt;
    velocity1.y += force.y / m1 * dt;

    // Update the velocity of body 2 based on the force of gravity from body 1
    velocity2.x -= force.x / m2 * dt;
    velocity2.y -= force.y / m2 * dt;

    // Update the position of body 1 based on its velocity
    position1.x += velocity1.x * dt;
    position1.y += velocity1.y * dt;

    // Update the position of body 2 based on its velocity
    position2.x += velocity2.x * dt;
    position2.y += velocity2.y * dt;

    // Clear the canvas
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate iteration time and record position history
    //console.log(Math.ceil((1/Math.sqrt(velocity1.x * velocity1.x + velocity1.y * velocity1.y))/trailRes))
    if (n % (Math.ceil((1/Math.sqrt(velocity1.x * velocity1.x + velocity1.y * velocity1.y))/trailRes)) == 0) {
        prevPosition1.push([position1.x, position1.y]);
        if (prevPosition1.length > trailLength) prevPosition1.shift();
    }
    if (n % (Math.ceil((1/Math.sqrt(velocity2.x * velocity2.x + velocity2.y * velocity2.y))/trailRes)) == 0) {
        prevPosition2.push([position2.x, position2.y]);
        if (prevPosition2.length > trailLength) prevPosition2.shift();
    }

    // Trail iteration time debugger
    /*
    for (let i = 0; i < prevPosition1.length-1; i++) {
        ctx.beginPath();
        ctx.arc(prevPosition1[i][0]+ canvas.width / 2, prevPosition1[i][1]+ canvas.height / 2, 2, 0, 2 * Math.PI);
        ctx.fillStyle = "RED";
        ctx.fill();
    }
    for (let i = 0; i < prevPosition2.length-1; i++) {
        ctx.beginPath();
        ctx.arc(prevPosition2[i][0]+ canvas.width / 2, prevPosition2[i][1]+ canvas.height / 2, 2, 0, 2 * Math.PI);
        ctx.fillStyle = "RED";
        ctx.fill();
    }
    */


    // Draw trail of body1
    ctx.beginPath();
    ctx.moveTo(prevPosition1[0][0]+ canvas.width / 2, prevPosition1[0][1]+ canvas.height / 2);
        for (let i = 0; i < prevPosition1.length-1; i++) {
        ctx.lineTo(prevPosition1[i][0]+ canvas.width / 2, prevPosition1[i][1]+ canvas.height / 2);
        }
    ctx.lineTo(position1.x+ canvas.width / 2, position1.y+ canvas.height / 2);
    ctx.strokeStyle = "white";
    ctx.stroke();

    // Draw trail of body2
    ctx.beginPath();
    ctx.moveTo(prevPosition2[0][0]+ canvas.width / 2, prevPosition2[0][1]+ canvas.height / 2);
        for (let i = 0; i < prevPosition2.length-1; i++) {
        ctx.lineTo(prevPosition2[i][0]+ canvas.width / 2, prevPosition2[i][1]+ canvas.height / 2);
        }
    ctx.lineTo(position2.x+ canvas.width / 2, position2.y+ canvas.height / 2);
    ctx.strokeStyle = "white";
    ctx.stroke();

    // Draw body1
    ctx.beginPath();
    ctx.arc(position1.x+ canvas.width / 2, position1.y + canvas.height / 2, radius1, 0, 2 * Math.PI);
    ctx.fillStyle = "rgb(231, 200, 96)";
    ctx.fill();

    // Draw body2
    ctx.beginPath();
    ctx.arc(position2.x+ canvas.width / 2, position2.y + canvas.height / 2, radius2, 0, 2 * Math.PI);
    ctx.fillStyle = "rgb(77, 138, 230)";
    ctx.fill();

    // Count the simulation frame
    n += 1;

    // Repeat the simulation
    setTimeout(simulate, dt);
}

simulate();