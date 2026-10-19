const display = {
 gamebox:document.querySelector('.gamebox'),
 ball: document.getElementById('ball'),
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
 scale: 10, //used to convert pixels to meters.
 vel: display.velocitySlider.getAttribute('value'), //how fast will the object move horizontally? [pixels/second]
 time: 0, //how long has it been since the simulation started? [seconds]
 timeUnit: 50, //the base unit of time for the simulation, [milliseconds]
 grav: 10, //how strong is the object's vertical acceleration? [pixels/second^2]
 fromTop: display.gamebox.offsetHeight-display.ball.offsetHeight, //how far is the ball from the top of the gamebox? [pixels]
 tempo: 5, //how much faster is the simulation compared to real time?
 height: display.heightSlider.getAttribute('value'), //how high-up does the object start? [pixels]

 positionX: function() {return this.vel*this.time},
 positionY: function() {
  if (this.fromTop-this.height+0.5*this.grav*this.time*this.time<this.fromTop) {
   return this.fromTop-this.height+0.5*this.grav*this.time*this.time
  } else {
   this.sim = false;
   return this.fromTop;
  }
 },
};

const func = {
 pix: function(num) {return '('+num+'px)';}, //turns numbers to pixel values
 showHeight: function() {display.heightDisplay.textContent=plat.height/plat.scale+' m'},
 showSpeed: function() {display.velocityDisplay.textContent=plat.vel/plat.scale+' m/s'},
}

console.log(plat.vel);
console.log(plat.height);
display.heightSlider.setAttribute('max', plat.fromTop);
func.showHeight();
func.showSpeed();


display.velocitySlider.oninput =() => {
 plat.vel = display.velocitySlider.value;
 func.showSpeed();
}
display.heightSlider.oninput =() => {
 plat.height = display.heightSlider.value;
 func.showHeight();
}

const gameClock = setInterval (
 ()=> {
  if(plat.height=0){
   plat.sim = false;
   console.log('blank tick');
  }
  if(plat.sim){
   display.ball.style.transform='translateX'+func.pix(plat.positionX())+'\
                                 translateY'+func.pix(plat.positionY());
   plat.time +=plat.timeUnit/1000;
   console.log('tick');
  } else {
   display.ball.style.transform='translateX'+func.pix(plat.positionX())+'\
                                 translateY'+func.pix(plat.positionY());
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
