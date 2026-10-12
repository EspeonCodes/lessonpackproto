const display = {
 gamebox:document.querySelector('.gamebox'),
 ball: document.getElementById('ball'),
 heightDisplay: document.querySelector('.displayHeight'),
 velocityDisplay: document.querySelector('.displayVelocity'),
 playButton: document.querySelector('.play'),
 stopButton: document.querySelector('.stop'),
 mainbox: document.querySelector('main'),
 heightPlus: document.querySelector('.increaseHeight'),
 heightMinus: document.querySelector('.reduceHeight'),
 speedPlus: document.querySelector('.increaseVelocity'),
 speedMinus: document.querySelector('.reduceVelocity'),
}

const plat = {
 sim: false, //Is the simulation active or not?
 scale: 10, //used to convert pixels to meters.
 vel: 50, //how fast will the object move horizontally? [pixels/second]
 time: 0, //how long has it been since the simulation started? [seconds]
 timeUnit: 50, //the base unit of time for the simulation, [milliseconds]
 grav: 10, //how strong is the object's vertical acceleration? [pixels/second^2]
 fromTop:0, //how far is the ball from the top of the gamebox? [pixels]
 tempo: 5, //how much faster is the simulation compared to real time?
 
 height: function() {return display.gamebox.offsetHeight-this.fromTop-display.ball.offsetHeight;}, //how high-up does the object start? [pixels]
 positionX: function() {return this.vel*this.time},
 positionY: function() {return this.fromTop+0.5*this.grav*this.time*this.time},
};

const func = {
 pix: function(num) {return '('+num+'px)';}, //turns numbers to pixel values
 showHeight: function() {display.heightDisplay.textContent=plat.height()/plat.scale+' m'},
 showSpeed: function() {display.velocityDisplay.textContent=plat.vel/plat.scale+' m/s'},
}

console.log(plat.vel);
console.log(plat.height());
func.showHeight();
func.showSpeed();

const gameClock = setInterval (
 ()=> {
  if(plat.sim){
   display.ball.style.transform='translateX'+func.pix(plat.positionX())+'\
                                 translateY'+func.pix(plat.positionY());
   plat.time +=plat.timeUnit/1000;
   console.log('tick');
  } else {
   display.ball.style.transform='translateY'+func.pix(plat.positionY());
   console.log('blank tick');
  }
 }
,plat.timeUnit/plat.tempo);


display.mainbox.addEventListener ('click', (event)=>{
 //play
 if (event.target===display.playButton){
  plat.sim = true;
  console.log(plat.sim);
  plat.time = 0;
 }
 //stop
 else if (event.target === display.stopButton) {
  plat.sim = false;
  plat.time =0;
 }
 //increase height
 else if (event.target=== display.heightPlus){
  plat.sim = false;
  plat.time =0;
  if (plat.fromTop>5) {plat.fromTop -=10} else {plat.fromTop=0};
  func.showHeight();
 }
 //decrease height
 else if (event.target === display.heightMinus) {
  plat.time =0;
  plat.sim = false;
  if (plat.fromTop<display.mainbox.offsetHeight-display.ball.offsetHeight-10) {plat.fromTop +=10} else {plat.fromTop=display.mainbox.offsetHeight-display.ball.offsetHeight-10};
  console.log(plat.fromTop);
  func.showHeight();
 }
//increase velocity
 else if (event.target=== display.speedPlus){
  plat.time =0;
  plat.sim = false;
  plat.vel +=10;
  func.showSpeed();
 }
 //reduce velocity
 else if (event.target === display.speedMinus) {
  plat.time =0;
  plat.sim = false;
  plat.vel -=10;
  func.showSpeed();
 }
}
)