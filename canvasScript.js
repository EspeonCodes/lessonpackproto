const display = {
 root: document.documentElement,
 
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

 popInput: document.getElementById('popinput'),
 popSubmit: document.querySelector('.submit'),
 popup: document.querySelector('.popup'),
 shader: document.querySelector('.shader'),
 popmin: document.querySelector('.popmin'),
 popmax: document.querySelector('.popmax'),
 request: document.querySelector('.request'),

 playButton: document.querySelector('.play'),
 slowButton: document.querySelector('.slomo'),
 backButton: document.querySelector('.back'),
 stepButton: document.querySelector('.forward'),
 pauseButton: document.querySelector('.pause'),
 stopButton: document.querySelector('.stop'),
 customizeButton: document.querySelector('.customize'),

 heightPlus: document.querySelector('.increaseHeight'),
 heightMinus: document.querySelector('.reduceHeight'),
 speedPlus: document.querySelector('.increaseVelocity'),
 speedMinus: document.querySelector('.reduceVelocity'),
}

const plat = {
 sim: false, //Is the simulation active or not?
 scale: 25, //scale*2 pixels = 1 meter, used to convert pixels to meters.
 vel: 0, //how fast will the object move horizontally? [pixels/second]
 time: 0, //how long has it been since the simulation started? [seconds]
 timeUnit: 20, //the base unit of time for the simulation, [milliseconds]
 grav: 10, //how strong is the object's vertical acceleration? [pixels/second^2]
 height: 0, //how high-up does the object start? [pixels]

 canvasX: function() {return display.canvas.getAttribute('width')},
 canvasY: function() {return display.canvas.getAttribute('height')},

 positionX: function() {
  if (this.time*this.vel<this.canvasX()-2.5*this.scale) {
   return this.time*this.vel+1.5*this.scale;
  } else {
   this.sim = false;
   return this.canvasY()-0.5*this.scale;
  }
 },

 positionY: function() {
  if (this.canvasY()-1.5*this.scale-this.height+0.5*(this.grav*this.scale)*this.time*this.time<this.canvasY()-1.5*this.scale) {
   return this.canvasY()-1.5*this.scale-this.height+0.5*(this.grav*this.scale)*this.time*this.time
  } else {
   this.sim = false;
   return this.canvasY()-1.5*this.scale;
  }
 },

 velY: function() {
  return this.grav*this.time;
 }
};

const render = {
 pen:display.canvas.getContext('2d'),
 
 prime: function (color, width) {
  this.pen.clearRect(0,0,plat.canvasX(),plat.canvasY());
  this.pen.fillStyle = color;
  this.pen.strokestyle = color;
  this.pen.lineWidth = width; 
  display.canvas.setAttribute('width', display.canvas.offsetWidth);
  display.canvas.setAttribute('height', display.canvas.offsetHeight);
 },
 
 frame: function () {
  this.pen.strokeStyle = func.gridColor;
  this.pen.lineWidth =1
  this.pen.strokeRect(1.5*plat.scale,0.5*plat.scale,plat.canvasX()-2*plat.scale,plat.canvasY()-2*plat.scale);
  this.pen.strokeStyle = func.gridColor;
 },

 line: function (startX, startY, endX, endY) {
  this.pen.beginPath();
  this.pen.moveTo(startX,startY);
  this.pen.lineTo(endX, endY);
  this.pen.stroke();
 },

 grid: function () {
  let repeat = 0;
  this.pen.strokeStyle = func.gridColor;
  this.pen.fillStyle = func.gridColor;
  let stepsX = Math.floor((plat.canvasX()-2*plat.scale)/plat.scale);
  let stepsY = Math.floor((plat.canvasY()-2*plat.scale)/plat.scale);
  this.pen.font = plat.scale/2+'px monospace'

  this.pen.fillText(0, plat.scale/1.35, plat.canvasY()-0.55*plat.scale);
  for (let i=0; i<stepsY; i++) {
   this.line(1.5*plat.scale, plat.canvasY()-(i+2.5)*plat.scale, plat.canvasX()-0.5*plat.scale, plat.canvasY()-(i+2.5)*plat.scale);
   if (i%2===1){   
   this.pen.fillText(i/2+0.5, plat.scale/1.5, plat.canvasY()-(i+2.35)*plat.scale);}
   repeat+=plat.scale}
  
  repeat = 0;
  for (let i=0; i<stepsX; i++) {
   this.line(2.5*plat.scale+repeat, 0.5*plat.scale, 2.5*plat.scale+repeat, plat.canvasY()-1.5*plat.scale);
   if (i%2===1){
   this.pen.fillText(i/2+0.5, 2.4*plat.scale+repeat, plat.canvasY()-plat.scale/2);}
   repeat+=plat.scale;}
 },

 vector: function(startX, startY, endX, endY, label) {
  this.pen.strokeStyle = func.highlightColor;
  this.pen.fillStyle = func.highlightColor;
  this.pen.lineWidth = plat.scale/15;
  this.line(startX, startY, endX, endY)
  this.pen.beginPath();
  this.pen.arc(endX, endY, plat.scale/6.5, 0, 2*Math.PI);
  this.pen.fill();

  this.pen.lineWidth = 1;
  this.pen.font = plat.scale/1.5+'px monospace'
  this.pen.strokeText(label, endX+plat.scale/1.5, endY+plat.scale/1.5);
  this.pen.fillText(label, endX+plat.scale/1.5, endY+plat.scale/1.5);
  this.pen.strokeStyle = func.gridColor;
  this.pen.fillStyle = func.gridColor;
 },

 ball: function () {
  this.pen.strokeStyle = func.highlightColor;
  this.pen.fillStyle = func.highlightColor;
  this.pen.lineWidth = plat.scale/10;
  this.pen.beginPath();
  this.pen.arc(plat.positionX(), plat.positionY(), plat.scale/1.75, 0, 2*Math.PI);
  this.pen.fill();
  this.pen.stroke();
  this.pen.lineWidth = 1; 
 },

 singleFrame: function () {
  this.prime(func.gridColor, 1);
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
  display.statY.textContent=(-1*((plat.positionY()-plat.canvasY()+1.5*plat.scale))/(2*plat.scale)).toFixed(1)+'m'
  display.statVX.textContent=(plat.vel/(2*plat.scale)).toFixed(1)+'m/s'
  display.statVY.textContent=(plat.velY()/(2*plat.scale)).toFixed(1)+'m/s'
 },
 inputtingTo: 1,
 gridColor: 'darkslategray',
 highlightColor: 'firebrick',
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
 plat.height = ((plat.canvasY()-2*plat.scale)/100)*display.heightSlider.value;
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
   console.log(display.popInput.value);
  }
 }
,plat.timeUnit);

display.mainbox.addEventListener ('click', (event)=>{
 //play n pause
 if (event.target===display.playButton){
  if (plat.sim === false) {
   plat.sim = true;
  } else {
    plat.sim = false;
  }
 }
 
 //play slomo
 else if (event.target === display.slowButton) {
  plat.timeUnit = 10;
  plat.sim = true;
 }

 //step back
 else if (event.target === display.backButton) {
  plat.sim = false;
  func.updateStats();
  if(plat.time-0.10>0){plat.time -= 0.10};
 }

 //step front
 else if (event.target === display.stepButton) {
  plat.sim = false;
  func.updateStats();
  plat.time += 0.10;
 }

 //reset
 else if (event.target === display.stopButton) {
  plat.sim = false;
  plat.time =0;
  plat.timeUnit = 20;
 }

 //input 
 else if (event.target === display.velocityDisplay) {
  display.popInput.setAttribute('value', 0);
  display.popup.classList.toggle('hidden');
  display.shader.classList.toggle('hidden');
  display.request.textContent = 'VELOCITY';
  display.popmin.textContent = '0m/s';
  display.popmax.textContent = ((500/(2*plat.scale)).toFixed(1)+'m/s');
  func.inputtingTo = 'vel';
  plat.sim = false;
  plat.time =0;
 }

  else if (event.target === display.heightDisplay) {
  display.popInput.setAttribute('value', 0);
  display.popup.classList.toggle('hidden');
  display.shader.classList.toggle('hidden');
  display.request.textContent = 'HEIGHT';
  display.popmin.textContent = '0m';
  display.popmax.textContent = ((plat.canvasY()-2*plat.scale)/(2*plat.scale)).toFixed(1)+'m';
  func.inputtingTo = 'height';
  plat.sim = false;
  plat.time =0;
 }

 else if (event.target === display.popSubmit) {
  if (func.inputtingTo === 'height') {
   if (display.popInput.value <= ((plat.canvasY()-2*plat.scale)/(2*plat.scale)) && display.popInput.value>=0){ 
   plat.height = display.popInput.value*2*plat.scale;  }
  } else if (func.inputtingTo === 'vel') {
   if (display.popInput.value <= (500/(2*plat.scale)) && display.popInput.value >= 0) {
   plat.vel = display.popInput.value*2*plat.scale;  }
  }
  func.showHeight();
  func.showSpeed();
  func.updateStats();
  display.popup.classList.toggle('hidden');
  display.shader.classList.toggle('hidden'); 
 }

 else if (event.target === display.customizeButton) {
  display.root.classList.toggle('light');
  if (display.root.classList.contains('light')){
   func.gridColor = 'slategray';
   func.highlightColor = 'red';
  } else {
   func.gridColor = 'darkslategray';
   func.highlightColor = 'firebrick';
  }
 }

 else if (event.target === display.canvas) {
  if (event.shiftKey === true)  {
   plat.vel = 0;
   func.showSpeed();
   func.showHeight();
  } else if (event.offsetX>1.5*plat.scale){
   plat.vel = (1*event.offsetX-1.5*plat.scale);
   func.updateStats();
   func.showSpeed();
  }
 }
})

display.mainbox.addEventListener ('wheel', (event)=>{
 if (event.target === display.canvas) {
  event.deltaMode=0;
 if ((plat.height+event.deltaY/10)<(plat.canvasY()-2*plat.scale) && (plat.height+event.deltaY/10)>(-0.5*plat.scale)) {
   plat.height += event.deltaY/10;
   func.showHeight();
   func.updateStats();
  }
 }

})
