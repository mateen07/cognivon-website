let cols, rows;
let scale = 20;
let flowfield;
let particles = [];
let zoff = 0;

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent("p5-container"); // Attach to the background div
    cols = floor(width / scale);
    rows = floor(height / scale);
    flowfield = new Array(cols * rows);
  
    for (let i = 0; i < 2000; i++) {
      particles[i] = new Particle();
    }
  
    background(255); // white background
  }
  

function draw() {
  let xoff = 0;
  for (let x = 0; x < cols; x++) {
    let yoff = 0;
    for (let y = 0; y < rows; y++) {
      let index = x + y * cols;
      let angleNoise = noise(xoff, yoff, zoff) * TWO_PI * 2;
      let angle = lerp(angleNoise, 0, 0.3); // flow biased to right
      let v = p5.Vector.fromAngle(angle);
      v.setMag(1);
      flowfield[index] = v;
      yoff += 0.1;
    }
    xoff += 0.1;
  }

  zoff += 0.003;

  for (let p of particles) {
    p.follow(flowfield);
    p.update();
    p.edges();
    p.show();
  }
}

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.prev = this.pos.copy();
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(2);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  show() {
    stroke(0, 20); // black lines, low opacity
    strokeWeight(1);
    line(this.prev.x, this.prev.y, this.pos.x, this.pos.y);
    this.prev.set(this.pos);
  }

  edges() {
    if (this.pos.x > width) {
      this.pos.x = 0;
      this.prev.x = this.pos.x;
    }
    if (this.pos.x < 0) {
      this.pos.x = width;
      this.prev.x = this.pos.x;
    }
    if (this.pos.y > height) {
      this.pos.y = 0;
      this.prev.y = this.pos.y;
    }
    if (this.pos.y < 0) {
      this.pos.y = height;
      this.prev.y = this.pos.y;
    }
  }

  follow(vectors) {
    let x = floor(this.pos.x / scale);
    let y = floor(this.pos.y / scale);
    let index = x + y * cols;
    if (index < vectors.length && index >= 0) {
      let force = vectors[index];
      this.applyForce(force);
    }
  }
}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    background(255);
  }