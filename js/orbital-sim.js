class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

// Parameters for the simulation
const G = 6.67430e-11;
const dt = 0.1;
const m1 = 100000000000000;
const m2 = 1000000;
let r, f;

// Radius of each body
const radius1 = 100;
const radius2 = 10;

document.getElementById("object1").style.width = radius1;
document.getElementById("object1").style.height = radius1;
document.getElementById("object2").style.width = radius2;
document.getElementById("object2").style.height = radius2;

// Initial position and velocity of body 1
let position1 = new Vector(500, 500);
let velocity1 = new Vector(0, 0);
let trail1 = [];

// Initial position and velocity of body 2
let position2 = new Vector(400, 400);
let velocity2 = new Vector(-5, 5);
let trail2 = [];

// Keep track of the previous positions of the two bodies
let prevPosition1 = [];
let prevPosition2 = [];

let n = 0;


function simulate() {
    n += 1;
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
    document.getElementById("object1").style.left = position1.x;
    document.getElementById("object1").style.top = position1.y;

    // Update the position of body 2 based on its velocity
    position2.x += velocity2.x * dt;
    position2.y += velocity2.y * dt;
    document.getElementById("object2").style.left = position2.x;
    document.getElementById("object2").style.top = position2.y;

    if (n % 10 == 0) {
        prevPosition1.push([position1.x, position1.y]);
        prevPosition2.push([position2.x, position2.y]);
        console.log(prevPosition1.length);
    }

    // Repeat the simulation
    setTimeout(simulate, dt);
}

simulate();