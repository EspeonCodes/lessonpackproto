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
 scale: 20, //used to convert pixels to meters.
 vel: display.velocitySlider.getAttribute('value'), //how fast will the object move horizontally? [pixels/second]
 time: 0, //how long has it been since the simulation started? [seconds]
 timeUnit: 20, //the base unit of time for the simulation, [milliseconds]
 grav: 200, //how strong is the object's vertical acceleration? [pixels/second^2]
 fromTop: function () {return display.canvas.offsetHeight-this.scale}, //how far is the ball from the top of the gamebox? [pixels]
 height: display.heightSlider.getAttribute('value'), //how high-up does the object start? [pixels]

 positionX: function() {
  if (this.time*this.vel<display.canvas.getAttribute('width')-2*this.scale) {
   return this.time*this.vel;
  } else {
   this.sim = false;
   return display.canvas.getAttribute('width')-2*this.scale;
  }
 },
 positionY: function() {
  if (this.fromTop()-this.height+0.5*this.grav*this.time*this.time<this.fromTop()) {
   return this.fromTop()-this.height+0.5*this.grav*this.time*this.time
  } else {
   this.sim = false;
   return this.fromTop();
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
  this.pen.strokeRect(plat.scale,plat.scale,display.canvas.getAttribute('width')-2*plat.scale,display.canvas.getAttribute('height')-2*plat.scale);
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
  this.pen.fillStyle = 'slategray';
  let stepsX = Math.floor((display.canvas.getAttribute('width')-2*plat.scale)/plat.scale);
  let stepsY = Math.floor((display.canvas.getAttribute('height')-2*plat.scale)/plat.scale);
  for (let i=0; i<stepsY; i++) {
   this.line(plat.scale, display.canvas.getAttribute('height')-(i+2)*plat.scale, display.canvas.getAttribute('width')-plat.scale, display.canvas.getAttribute('height')-(i+2)*plat.scale);
   repeat+=plat.scale}
  repeat = 0;
  for (let i=0; i<stepsX; i++) {
   this.line(2*plat.scale+repeat, plat.scale, 2*plat.scale+repeat, display.canvas.getAttribute('height')-plat.scale);
   repeat+=plat.scale;}
  this.pen.strokeStyle = 'rgb(47 79 79 / 100%)';

 },

 vector: function(startX, startY, endX, endY, label) {
  this.pen.strokeStyle = 'red';
  this.pen.fillStyle = 'red';
  this.pen.lineWidth = 2;
  this.line(startX, startY, endX, endY)
  this.pen.beginPath();
  this.pen.arc(endX, endY, plat.scale/5, 0, 2*Math.PI);
  this.pen.fill();

  this.pen.lineWidth = 1;
  this.pen.font = '18px monospace'
  this.pen.strokeText(label, endX+plat.scale, endY+plat.scale);
  this.pen.fillText(label, endX+plat.scale, endY+plat.scale);
  this.pen.strokeStyle = 'slategray';
  this.pen.fillStyle = 'slategray';
 },

 ball: function () {
  this.pen.strokeStyle = 'whitesmoke';
  this.pen.fillStyle = 'red';
  this.pen.lineWidth = 3;
  this.pen.beginPath();
  this.pen.arc(plat.positionX()+plat.scale, plat.positionY(), plat.scale/1.5, 0, 2*Math.PI);
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
  this.vector(plat.positionX()+plat.scale,plat.positionY(),plat.positionX()+plat.scale+plat.vel*0.5,plat.positionY(), 'Vx');
  }
  if (plat.time<10*plat.timeUnit/1000){
  this.vector(plat.positionX()+plat.scale,plat.positionY(),plat.positionX()+plat.scale,plat.positionY()+plat.velY()*0.25,'');
  this.vector(plat.positionX()+plat.scale,plat.positionY(),plat.positionX()+plat.scale+plat.vel*0.5,plat.positionY()+plat.velY()*0.25,'');
  }
  else {
  this.vector(plat.positionX()+plat.scale,plat.positionY(),plat.positionX()+plat.scale,plat.positionY()+plat.velY()*0.25,'Vy');
  this.vector(plat.positionX()+plat.scale,plat.positionY(),plat.positionX()+plat.scale+plat.vel*0.5,plat.positionY()+plat.velY()*0.25,'V');
  }
  this.ball();
 }
}

const func = {
 pix: function(num) {return '('+num+'px)';}, //turns numbers to pixel values
 showHeight: function() {display.heightDisplay.textContent=(plat.height/plat.scale).toFixed(1)+' m'},
 showSpeed: function() {display.velocityDisplay.textContent=(plat.vel/plat.scale).toFixed(1)+' m/s'},
 updateStats: function() {
  display.statX.textContent=(plat.positionX()/plat.scale).toFixed(1)+'m'
  display.statY.textContent=(plat.positionY()/plat.scale).toFixed(1)+'m'
  display.statVX.textContent=(plat.vel/plat.scale).toFixed(1)+'m/s'
  display.statVY.textContent=(plat.velY()/plat.scale).toFixed(1)+'m/s'
 },
}

func.showHeight();
func.showSpeed();

display.velocitySlider.oninput =() => {
 plat.vel = display.velocitySlider.value;
 func.showSpeed();
 plat.sim = false;
 plat.time =0;
}
display.heightSlider.oninput =() => {
 plat.height = ((plat.fromTop()-plat.scale)/100)*display.heightSlider.value;
 func.showHeight();
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
  plat.sim = true;
 }
 
 //pause 
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

 //pause 
 else if (event.target === display.pauseButton) {
  plat.sim = false;
 }

 //stop
 else if (event.target === display.stopButton) {
  plat.sim = false;
  plat.time =0;
  plat.timeUnit = 20;
 }
}
)
