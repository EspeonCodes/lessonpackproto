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
 stopButton: document.querySelector('.stop'),

 optionsButton: document.querySelector('.options'),
 settingsMenu: document.querySelector('.settingsMenu'),
 scaleB: document.getElementById('conScale'),
 themeB: document.getElementById('conTheme'),
 fontSB: document.getElementById('conFont'),
 fontCB: document.getElementById('conFontCon'),
 tipsB: document.getElementById('conTips'),
 announceB: document.getElementById('conAnnounce'),
 submitSettings: document.getElementById('settingSubmit'),
}

const plat = {
 sim: 0, //Is the simulation active or not?
 scale: 30, //scale*2 pixels = 1 meter, used to convert pixels to meters.
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
   this.sim = 2;
   return this.canvasX()-0.5*this.scale;
  }
 },

 positionY: function() {
  if (this.canvasY()-1.5*this.scale-this.height+0.5*(this.grav*this.scale)*this.time*this.time<this.canvasY()-1.5*this.scale) {
   return this.canvasY()-1.5*this.scale-this.height+0.5*(this.grav*this.scale)*this.time*this.time
  } else {
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
  const grad = this.pen.createRadialGradient(plat.positionX()+plat.scale/4, plat.positionY()-plat.scale/4, plat.scale/3, plat.positionX()+plat.scale/4, plat.positionY()-plat.scale/4, plat.scale);
  grad.addColorStop(0, func.highlightColor);
  grad.addColorStop(1, func.gridColor);
  this.pen.strokeStyle = func.highlightColor;
  this.pen.fillStyle = grad;
  this.pen.lineWidth = plat.scale/15;
  this.pen.beginPath();
  this.pen.arc(plat.positionX(), plat.positionY(), plat.scale/1.75, 0, 2*Math.PI);
  this.pen.fill();
  this.pen.stroke();
  this.pen.lineWidth = 1; 
 },

 singleFrame: function () {
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
 updateStats: function() {
  display.heightDisplay.textContent=(plat.height/(2*plat.scale)).toFixed(1)+' m';
  display.velocityDisplay.textContent=(plat.vel/(2*plat.scale)).toFixed(1)+' m/s';
  display.statX.textContent=((plat.positionX()-1.5*plat.scale)/(2*plat.scale)).toFixed(1)+'m'
  display.statY.textContent=(-1*((plat.positionY()-plat.canvasY()+1.5*plat.scale))/(2*plat.scale)).toFixed(1)+'m'
  display.statVX.textContent=(plat.vel/(2*plat.scale)).toFixed(1)+'m/s'
  display.statVY.textContent=(plat.velY()/(2*plat.scale)).toFixed(1)+'m/s'
 },
 inputtingTo: 1,
 gridColor: 'darkslategray',
 highlightColor: 'firebrick',
 bright: 'white',
 scalePick: 0,
 fontSize: 0,
}

const gameClock = setInterval (
 ()=> {  
  render.prime(func.gridColor, 1);
  func.updateStats();
  console.log(plat.sim);
  
  if(plat.sim === 1){
   render.singleFrame();
   plat.time +=plat.timeUnit/1000;

   if (plat.time*plat.vel<plat.canvasX()-2.5*plat.scale) {
    plat.sim = 1;
   } else {
    plat.sim = 2;
   }

   if (plat.canvasY()-1.5*plat.scale-plat.height+0.5*(plat.grav*plat.scale)*plat.time*plat.time<plat.canvasY()-1.5*plat.scale) {
    plat.sim = 1;
   } else {
    plat.sim = 2;
   }

  } else {
   render.singleFrame();
  }
 }
,plat.timeUnit);

display.velocitySlider.oninput =() => {
 if (plat.sim != 2) {
  plat.vel = display.velocitySlider.value;
  plat.sim = 0;
  plat.time =0;
 }
}
display.heightSlider.oninput =() => {
 if (plat.sim != 2) {
  plat.height = ((plat.canvasY()-2*plat.scale)/100)*display.heightSlider.value;
  plat.sim = 0;
  plat.time =0;
 }
}

document.addEventListener ('click', (event)=>{
 //play n pause
 if (event.target===display.playButton){
  if (plat.sim != 1) {
   plat.sim = 1;
   plat.timeUnit = 20;
  } else if (plat.sim === 1) {
    plat.sim = 2;
  }
 }
 
 //play slomo
 else if (event.target === display.slowButton) {
  if (plat.sim != 1) {
   plat.sim = 1;
   plat.timeUnit = 10;
  } else if (plat.sim === 1) {
    plat.sim = 2;
  }
 }

 //step back
 else if (event.target === display.backButton) {
  plat.sim = 2;
  if(plat.time-0.10>0){plat.time -= 0.10};
 }

 //step front
 else if (event.target === display.stepButton) {
  plat.sim = 2;
  plat.time += 0.10;
 }

 //reset
 else if (event.target === display.stopButton) {
  plat.sim = 0;
  plat.time =0;
  plat.timeUnit = 20;
 }

 //input 
 else if (event.target === display.velocityDisplay) {
  if (plat.sim != 2) { 
   display.popInput.value = 0;
   display.popup.classList.toggle('hidden');
   display.shader.classList.toggle('hidden');
   display.request.textContent = 'VELOCITY';
   display.popmin.textContent = '0m/s';
   display.popmax.textContent = ((500/(2*plat.scale)).toFixed(1)+'m/s');
   func.inputtingTo = 'vel';
   plat.sim = 0;
   plat.time =0;
  }
 }

  else if (event.target === display.heightDisplay) {
   if (plat.sim != 2) { 
    display.popInput.value = 0;
    display.popup.classList.toggle('hidden');
    display.shader.classList.toggle('hidden');
    display.request.textContent = 'HEIGHT';
    display.popmin.textContent = '0m';
    display.popmax.textContent = ((plat.canvasY()-2*plat.scale)/(2*plat.scale)).toFixed(1)+'m';
    func.inputtingTo = 'height';
    plat.sim = 0;
    plat.time =0;
   }
  }

 else if (event.target === display.popSubmit) {
  if (func.inputtingTo === 'height') {
   if (display.popInput.value <= ((plat.canvasY()-2*plat.scale)/(2*plat.scale)) && display.popInput.value>=0){ 
   plat.height = display.popInput.value*2*plat.scale;  }
  } else if (func.inputtingTo === 'vel') {
   if (display.popInput.value <= (500/(2*plat.scale)) && display.popInput.value >= 0) {
   plat.vel = display.popInput.value*2*plat.scale;  }
  }
  display.popup.classList.toggle('hidden');
  display.shader.classList.toggle('hidden'); 
 }

 else if (event.target === display.optionsButton) {
  display.settingsMenu.classList.toggle('hidden');
  display.shader.classList.toggle('hidden');
 }

 else if (event.target === display.themeB) {
  display.root.classList.toggle('light');
  if (display.root.classList.contains('light')){
   func.gridColor = 'slategray';
   func.highlightColor = 'red';
   display.themeB.textContent = "LIGHT"
  } else {
   func.gridColor = 'darkslategray';
   func.highlightColor = 'firebrick';
   display.themeB.textContent = "DARK"
  }
 }

 else if (event.target === display.fontSB) {
  switch (func.fontSize) {
   case 0:
    if(display.root.classList.contains("large")){display.root.classList.toggle('large')}
    display.root.classList.toggle('medium');
    func.fontSize =1;
    display.fontSB.textContent = 'MEDIUM';
   break;
    
   case 1:
    if(display.root.classList.contains("medium")){display.root.classList.toggle('medium')}
    display.root.classList.toggle('large');
    func.fontSize =2;
    display.fontSB.textContent = 'LARGE';
   break;

   case 2:
    if(display.root.classList.contains("medium")){display.root.classList.toggle('medium')}
    if(display.root.classList.contains("large")){display.root.classList.toggle('large')}
    func.fontSize =0;
    display.fontSB.textContent = 'SMALL';
   break;
  }
 }

 else if (event.target === display.scaleB) {
  switch (func.scalePick) {
   case 0:
    plat.scale = 45;
    func.scalePick =1;
    display.scaleB.textContent = 'MEDIUM';
   break;
    
   case 1:
    plat.scale = 60;
    func.scalePick =2;
    display.scaleB.textContent = 'LARGE';
   break;

   case 2:
    plat.scale = 30;
    func.scalePick =0;
    display.scaleB.textContent = 'SMALL';
   break;
  }
 }

 else if (event.target === display.submitSettings) {
  display.settingsMenu.classList.toggle('hidden');
  display.shader.classList.toggle('hidden');
 }

 else if (event.target === display.canvas) {
  if (plat.sim === 0) {
   if (event.shiftKey === true)  {
   plat.vel = 0;
  } else if (event.offsetX>1.5*plat.scale){
   plat.vel = (1*event.offsetX-1.5*plat.scale);
  }
  }
 }

})

document.addEventListener ('wheel', (event)=>{
 if (event.target === display.canvas) {
 if (plat.sim === 0) {
  event.deltaMode=0;
 if ((plat.height+event.deltaY/10)<(plat.canvasY()-2*plat.scale) && (plat.height+event.deltaY/10)>(-0.5*plat.scale)) {
   plat.height += event.deltaY/10;
  }
 }
 }
})

document.addEventListener ('keydown', (event)=>{
 console.log(event.key)
 if (plat.sim === 0) { 
 if (event.key === "ArrowUp") {
  if ((plat.height+plat.scale)<(plat.canvasY()-1.5*plat.scale) && (plat.height+plat.scale)>(-0.5*plat.scale)) {
   plat.height += plat.scale;
  }
 } else if (event.key === "ArrowDown") {
  if ((plat.height-plat.scale)<(plat.canvasY()-1.5*plat.scale) && (plat.height-plat.scale)>(-0.5*plat.scale)) {
   plat.height -= plat.scale;
  }
 } else if (event.key === "ArrowRight") {
  if ((plat.vel+plat.scale)<=500 && (plat.vel+plat.scale)>0) {
   plat.vel += plat.scale;
  }
 } else if (event.key === "ArrowLeft") {
  if ((plat.vel-plat.scale)>=0) {
   plat.vel -= plat.scale;
  }
 } }

 if (event.key === "Enter" && event.shiftKey === false && event.ctrlKey === false) {
  if (plat.sim != 1) {
   plat.sim = 1;
   plat.timeUnit = 20;
  } else if (plat.sim === 1) {
    plat.sim = 2;
  }
 } else if (event.key === "Enter" && event.shiftKey === true && event.ctrlKey === false) {
  if (plat.sim != 1) {
   plat.sim = 1;
   plat.timeUnit = 10;
  } else if (plat.sim === 1) {
    plat.sim = 2;
  }
 } else if (event.key === "Enter" && event.shiftKey === false && event.ctrlKey === true) {
  plat.sim = 0;
  plat.time =0;
  plat.timeUnit = 20;
 } else if (event.key === ">" || event.key === ".") {
  plat.sim = 2;
  plat.time += 0.10;
 } else if (event.key === "<" || event.key === ",") {
  plat.sim = 2;
  plat.time -= 0.10;
 }
})