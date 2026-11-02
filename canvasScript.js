const display = {
 canvas:document.querySelector('.render'),
 gamebox:document.querySelector('.gamebox'),
 mainbox: document.querySelector('main'),

 heightDisplay: document.querySelector('.displayHeight'),
 velocityDisplay: document.querySelector('.displayVelocity'),
 heightSlider: document.querySelector('.heightSlider'),
 velocitySlider: document.querySelector('.velocitySlider'),
 statX: document.querySelector('.positionX'),
 statY: document.querySelector('.positionY'),
 statVX: document.querySelector('.velX'),
 statVY: document.querySelector('.velY'),

 playButton: document.querySelector('.play'),
 slowButton: document.querySelector('.slomo'),
 backButton: document.querySelector('.back'),
 stepButton: document.querySelector('.forward'),
 pauseButton: document.querySelector('.pause'),
 stopButton: document.querySelector('.stop'),

 heightPlus: document.querySelector('.increaseHeight'),
 heightMinus: document.querySelector('.reduceHeight'),
 speedPlus: document.querySelector('.increaseVelocity'),
 speedMinus: document.querySelector('.reduceVelocity'),
}

const plat = {
 sim: false, //Is the simulation active or not?
 scale: 30, //scale*2 pixels = 1 meter, used to convert pixels to meters.
 vel: display.velocitySlider.getAttribute('value'), //how fast will the object move horizontally? [pixels/second]
 time: 0, //how long has it been since the simulation started? [seconds]
 timeUnit: 20, //the base unit of time for the simulation, [milliseconds]
 grav: 10, //how strong is the object's vertical acceleration? [pixels/second^2]
 fromTop: display.canvas.offsetHeight, //how far is the ball from the top of the gamebox? [pixels]
 height: display.heightSlider.getAttribute('value'), //how high-up does the object start? [pixels]

 positionX: function() {
  if (this.time*this.vel<display.canvas.getAttribute('width')-2.5*this.scale) {
   return this.time*this.vel+1.5*this.scale;
  } else {
   this.sim = false;
   return display.canvas.getAttribute('width')-0.5*this.scale;
  }
 },

 positionY: function() {
  if (this.fromTop-1.5*this.scale-this.height+0.5*(this.grav*this.scale)*this.time*this.time<this.fromTop-1.5*this.scale) {
   return this.fromTop-1.5*this.scale-this.height+0.5*(this.grav*this.scale)*this.time*this.time
  } else {
   this.sim = false;
   return this.fromTop-1.5*this.scale;
  }
 },

 velY: function() {
  return this.grav*this.time;
 }
};

const render = {
 pen:display.canvas.getContext('2d'),
 
 prime: function (color, width) {
  this.pen.clearRect(0,0,display.canvas.getAttribute('width'), display.canvas.getAttribute('height'));
  this.pen.fillStyle = color;
  this.pen.strokestyle = color;
  this.pen.lineWidth = width; 
  display.canvas.setAttribute('width', display.canvas.offsetWidth);
  display.canvas.setAttribute('height', display.canvas.offsetHeight);
 },
 
 frame: function () {
  this.pen.strokeStyle = 'rgb(47 79 79 / 50%)';
  this.pen.lineWidth =1
  this.pen.strokeRect(1.5*plat.scale,0.5*plat.scale,display.canvas.getAttribute('width')-2*plat.scale,display.canvas.getAttribute('height')-2*plat.scale);
  this.pen.strokeStyle = 'rgb(47 79 79 / 100%)';
 },

 line: function (startX, startY, endX, endY) {
  this.pen.beginPath();
  this.pen.moveTo(startX,startY);
  this.pen.lineTo(endX, endY);
  this.pen.stroke();
 },

 grid: function () {
  let repeat = 0;
  this.pen.strokeStyle = 'rgb(47 79 79 / 50%)';
  this.pen.fillStyle = 'rgb(47 79 79 / 50%)';
  let stepsX = Math.floor((display.canvas.getAttribute('width')-2*plat.scale)/plat.scale);
  let stepsY = Math.floor((display.canvas.getAttribute('height')-2*plat.scale)/plat.scale);
  this.pen.font = plat.scale/2+'px monospace'

  this.pen.fillText(0, plat.scale/1.5, display.canvas.getAttribute('height')-plat.scale);
  for (let i=0; i<stepsY; i++) {
   this.line(1.5*plat.scale, display.canvas.getAttribute('height')-(i+2.5)*plat.scale, display.canvas.getAttribute('width')-0.5*plat.scale, display.canvas.getAttribute('height')-(i+2.5)*plat.scale);
   if (i%2===1){   
   this.pen.fillText(i/2+0.5, plat.scale/1.5, display.canvas.getAttribute('height')-(i+2.35)*plat.scale);}
   repeat+=plat.scale}
  
  repeat = 0;
  this.pen.fillText(0, 1.5*plat.scale+repeat, display.canvas.getAttribute('height')-plat.scale/2);
  for (let i=0; i<stepsX; i++) {
   this.line(2.5*plat.scale+repeat, 0.5*plat.scale, 2.5*plat.scale+repeat, display.canvas.getAttribute('height')-1.5*plat.scale);
   if (i%2===1){
   this.pen.fillText(i/2+0.5, 2.4*plat.scale+repeat, display.canvas.getAttribute('height')-plat.scale/2);}
   repeat+=plat.scale;}

  this.pen.strokeStyle = 'rgb(47 79 79 / 100%)';
 },

 vector: function(startX, startY, endX, endY, label) {
  this.pen.strokeStyle = 'red';
  this.pen.fillStyle = 'red';
  this.pen.lineWidth = plat.scale/15;
  this.line(startX, startY, endX, endY)
  this.pen.beginPath();
  this.pen.arc(endX, endY, plat.scale/6.5, 0, 2*Math.PI);
  this.pen.fill();

  this.pen.lineWidth = 1;
  this.pen.font = plat.scale/1.5+'px monospace'
  this.pen.strokeText(label, endX+plat.scale/1.5, endY+plat.scale/1.5);
  this.pen.fillText(label, endX+plat.scale/1.5, endY+plat.scale/1.5);
  this.pen.strokeStyle = 'slategray';
  this.pen.fillStyle = 'slategray';
 },

 ball: function () {
  this.pen.strokeStyle = 'whitesmoke';
  this.pen.fillStyle = 'red';
  this.pen.lineWidth = plat.scale/10;
  this.pen.beginPath();
  this.pen.arc(plat.positionX(), plat.positionY(), plat.scale/1.75, 0, 2*Math.PI);
  this.pen.fill();
  this.pen.stroke();
  this.pen.strokeStyle = 'slategray';
  this.pen.fillStyle = 'slategray';
  this.pen.lineWidth = 1; 
 },

 singleFrame: function () {
  this.prime('slategray', 1);
  this.frame();
  this.grid();
  if (plat.vel>10){
  this.vector(plat.positionX(), plat.positionY(), plat.positionX()+plat.vel*0.5, plat.positionY(), 'Vx');
  }
  if (plat.time<10*plat.timeUnit/1000){
  this.vector(plat.positionX(), plat.positionY(), plat.positionX(), plat.positionY()+(plat.grav*plat.scale)*plat.time*0.35,'');
  this.vector(plat.positionX(), plat.positionY(), plat.positionX()+plat.vel*0.5, plat.positionY()+(plat.grav*plat.scale)*plat.time*0.35,'');
  }
  else {
  this.vector(plat.positionX(), plat.positionY(), plat.positionX(), plat.positionY()+(plat.grav*plat.scale)*plat.time*0.35,'Vy');
  this.vector(plat.positionX(), plat.positionY(), plat.positionX()+plat.vel*0.5, plat.positionY()+(plat.grav*plat.scale)*plat.time*0.35,'V');
  }
  this.ball();
 }
}

const func = {
 pix: function(num) {return '('+num+'px)';}, //turns numbers to pixel values
 showHeight: function() {display.heightDisplay.textContent=(plat.height/(2*plat.scale)).toFixed(1)+' m'},
 showSpeed: function() {display.velocityDisplay.textContent=(plat.vel/(2*plat.scale)).toFixed(1)+' m/s'},
 updateStats: function() {
  display.statX.textContent=((plat.positionX()-1.5*plat.scale)/(2*plat.scale)).toFixed(1)+'m'
  display.statY.textContent=(-1*((plat.positionY()-plat.fromTop+1.5*plat.scale))/(2*plat.scale)).toFixed(1)+'m'
  display.statVX.textContent=(plat.vel/(2*plat.scale)).toFixed(1)+'m/s'
  display.statVY.textContent=(plat.velY()/(2*plat.scale)).toFixed(1)+'m/s'
 },
}

func.showHeight();
func.showSpeed();

display.velocitySlider.oninput =() => {
 plat.vel = display.velocitySlider.value;
 func.showSpeed();
 func.updateStats();
 plat.sim = false;
 plat.time =0;
}
display.heightSlider.oninput =() => {
 plat.height = ((plat.fromTop-2*plat.scale)/100)*display.heightSlider.value;
 func.showHeight();
 func.updateStats();
 plat.sim = false;
 plat.time =0;
}

const gameClock = setInterval (
 ()=> {  
  if(plat.sim){
   render.singleFrame();
   func.updateStats();
   plat.time +=plat.timeUnit/1000;
  } else {
   render.singleFrame();
  }
 }
,plat.timeUnit);

display.mainbox.addEventListener ('click', (event)=>{
 //play
 if (event.target===display.playButton){
  if (plat.sim === false) {
   plat.sim = true;
  } else {
    plat.sim = false;
  }
 }
 
 else if (event.target === display.slowButton) {
  plat.timeUnit = 10;
  plat.sim = true;
 }

 else if (event.target === display.backButton) {
  plat.sim = false;
  func.updateStats();
  if(plat.time-0.10>0){plat.time -= 0.10};
 }

 else if (event.target === display.stepButton) {
  plat.sim = false;
  func.updateStats();
  plat.time += 0.10;
 }

 //stop
 else if (event.target === display.stopButton) {
  plat.sim = false;
  plat.time =0;
  plat.timeUnit = 20;
 }
}
)
