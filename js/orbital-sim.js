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

class OrbitalParam {
    constructor(m, radius, pos, vel, colour) {
        this.m = m;
        this.radius = radius;
        this.pos = pos;
        this.vel = vel;
        this.dirc;
        this.prevPos = [];
        this.colour = colour;
    }
}

// Simulation constants
const G = 6.67430e-11;
const dt = 0.1;
const trailLength = 1000;
const trailRes = 0.1;
let r, f;
let n = 0;

// Simulation parameters
var bodies = [];
bodies[0] = new OrbitalParam(
    100000000000000, //mass
    20, //radius
    new Vector(0, 0), //initial position
    new Vector(0, 0), //initial velocity
    "rgb(231, 200, 96)" //colour
);
bodies[1] = new OrbitalParam(
    1000000000000, //mass
    10, //radius
    new Vector(-400, -200), //initial position
    new Vector(-2, 3), //initial velocity
    "rgb(77, 138, 230)" //colour
);
bodies[2] = new OrbitalParam(
    1000000000000, //mass
    10, //radius
    new Vector(400, 200), //initial position
    new Vector(2, -3), //initial velocity
    "rgb(50, 168, 82)" //colour
);
for (let i = 3; i < 4; i++) {
    bodies[i] = new OrbitalParam(
        Math.random() * 100, //mass
        5, //radius
        new Vector((Math.random() - .5) * 2000, (Math.random() - .5) * 2000), //initial position
        new Vector((Math.random()) * 5, (Math.random()) * 5), //initial velocity
        "rgb(100, 100, 100)" //colour
    );
}


function simulate() {
    // Clear the canvas
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    bodies[3].dirc = Math.atan(bodies[3].vel.y / bodies[3].vel.x);
    console.log(bodies[3].dirc)
    var throttle = (document.getElementById("throttle").value - 50) / 1000;
    bodies[3].vel.x += throttle * Math.cos(bodies[3].dirc);
    bodies[3].vel.y += throttle * Math.sin(bodies[3].dirc);

    for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
            // Calculate the distance between the two bodies
            let distance = new Vector(bodies[j].pos.x - bodies[i].pos.x, bodies[j].pos.y - bodies[i].pos.y);
            r = Math.sqrt(distance.x * distance.x + distance.y * distance.y);

            // Calculate the force of gravity between the two bodies
            f = G * ((bodies[i].m * bodies[j].m) / (r * r));
            let force = new Vector(f * distance.x / r, f * distance.y / r);

            // Update the velocity of body 1 based on the force of gravity from body 2
            bodies[i].vel.x += force.x / bodies[i].m * dt;
            bodies[i].vel.y += force.y / bodies[i].m * dt;

            // Update the velocity of body 2 based on the force of gravity from body 1
            bodies[j].vel.x -= force.x / bodies[j].m * dt;
            bodies[j].vel.y -= force.y / bodies[j].m * dt;
        }
        bodies[i].pos.x += bodies[i].vel.x * dt;
        bodies[i].pos.y += bodies[i].vel.y * dt;

        // Calculate iteration time and record position history
        //console.log(Math.ceil((1/Math.sqrt(bodies[0].vel.x * bodies[0].vel.x + bodies[0].vel.y * bodies[0].vel.y))/(trailRes * dt)))
        if (n % (Math.ceil((1 / Math.sqrt(bodies[i].vel.x * bodies[i].vel.x + bodies[i].vel.y * bodies[i].vel.y)) / (trailRes * dt))) == 0) {
            bodies[i].prevPos.push([bodies[i].pos.x, bodies[i].pos.y]);
            if (bodies[i].prevPos.length > trailLength) bodies[i].prevPos.shift();
        }

        // Trail iteration time debugger
        /*
        for (let k = 0; k < bodies[i].prevPos.length; k++) {
            ctx.beginPath();
            ctx.arc(bodies[i].prevPos[k][0] + canvas.width / 2, bodies[i].prevPos[k][1] + canvas.height / 2, 2, 0, 2 * Math.PI);
            ctx.fillStyle = "RED";
            ctx.fill();
        }
        */

        // Draw trails
        ctx.beginPath();
        ctx.moveTo(bodies[i].prevPos[0][0] + canvas.width / 2, bodies[i].prevPos[0][1] + canvas.height / 2);
        for (let k = 0; k < bodies[i].prevPos.length; k++) {
            ctx.lineTo(bodies[i].prevPos[k][0] + canvas.width / 2, bodies[i].prevPos[k][1] + canvas.height / 2);
        }
        ctx.lineTo(bodies[i].pos.x + canvas.width / 2, bodies[i].pos.y + canvas.height / 2);
        ctx.strokeStyle = "grey";
        ctx.stroke();

        // Draw bodies
        ctx.beginPath();
        ctx.arc(bodies[i].pos.x + canvas.width / 2, bodies[i].pos.y + canvas.height / 2, bodies[i].radius, 0, 2 * Math.PI);
        ctx.fillStyle = bodies[i].colour;
        ctx.fill();
    }

    // Count the simulation frame
    n += 1;

    // Repeat the simulation
    setTimeout(simulate, dt);
}

simulate();