const display = {
 canvas:document.querySelector('.render'),
 gamebox:document.querySelector('.gamebox'),
 mainbox: document.querySelector('main'),

 heightDisplay: document.querySelector('.displayHeight'),
 velocityDisplay: document.querySelector('.displayVelocity'),
 heightSlider: document.querySelector('.heightSlider'),
 velocitySlider: document.querySelector('.velocitySlider'),

 playButton: document.querySelector('.play'),
 pauseButton: document.querySelector('.pause'),
 stopButton: document.querySelector('.stop'),

 heightPlus: document.querySelector('.increaseHeight'),
 heightMinus: document.querySelector('.reduceHeight'),
 speedPlus: document.querySelector('.increaseVelocity'),
 speedMinus: document.querySelector('.reduceVelocity'),
}

const plat = {
 sim: false, //Is the simulation active or not?
 scale: 40, //used to convert pixels to meters.
 vel: display.velocitySlider.getAttribute('value'), //how fast will the object move horizontally? [pixels/second]
 time: 0, //how long has it been since the simulation started? [seconds]
 timeUnit: 50, //the base unit of time for the simulation, [milliseconds]
 grav: 10, //how strong is the object's vertical acceleration? [pixels/second^2]
 fromTop: function () {return display.canvas.offsetHeight-this.scale}, //how far is the ball from the top of the gamebox? [pixels]
 tempo: 5, //how much faster is the simulation compared to real time?
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
  this.pen.strokeStyle = 'slategray'
  this.pen.lineWidth =1
  this.pen.strokeRect(plat.scale,plat.scale,display.canvas.getAttribute('width')-2*plat.scale,display.canvas.getAttribute('height')-2*plat.scale);
 },

 line: function (startX, startY, endX, endY) {
  this.pen.beginPath();
  this.pen.moveTo(startX,startY);
  this.pen.lineTo(endX, endY);
  this.pen.stroke();
 },

 grid: function () {
  let repeat = 0;
  let steps = Math.floor((display.canvas.getAttribute('width')-2*plat.scale)/plat.scale);
  //horizontal lines
  for (let i=0; i<steps; i++) {
   //horizontal
   this.line(plat.scale, 2*plat.scale+repeat, display.canvas.getAttribute('width')-plat.scale, 2*plat.scale+repeat);
   //vertical
   this.line(2*plat.scale+repeat, plat.scale, 2*plat.scale+repeat, display.canvas.getAttribute('height')-plat.scale);
   repeat+=plat.scale;}
 },

 ball: function () {
  this.pen.strokeStyle = 'darkslategray';
  this.pen.fillStyle = 'slategray';
  this.pen.beginPath();
  this.pen.arc(plat.positionX()+plat.scale, plat.positionY(), plat.scale/2, 0, 2*Math.PI);
  this.pen.fill();
  this.pen.stroke();
 },

 singleFrame: function () {
  this.prime('slategray', 1);
  this.frame();
  this.grid();
  this.ball();
 }
}

const func = {
 pix: function(num) {return '('+num+'px)';}, //turns numbers to pixel values
 showHeight: function() {display.heightDisplay.textContent=(plat.height/plat.scale).toFixed(1)+' m'},
 showSpeed: function() {display.velocityDisplay.textContent=(plat.vel/plat.scale).toFixed(1)+' m/s'},
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
   plat.time +=plat.timeUnit/1000;
   console.log('tick');
  } else {
   render.singleFrame();
   console.log('blank tick');
  }
 }
,plat.timeUnit/plat.tempo);

display.mainbox.addEventListener ('click', (event)=>{
 //play
 if (event.target===display.playButton){
  plat.sim = true;
 }
 
 //pause 
 else if (event.target === display.pauseButton) {
  plat.sim = false;
 }

 //stop
 else if (event.target === display.stopButton) {
  plat.sim = false;
  plat.time =0;
 }
}
)
