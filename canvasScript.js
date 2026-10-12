const gamebox = document.querySelector('.gamebox');
const ball = document.getElementById('ball');
const heightDisplay = document.querySelector('.displayHeight');
const velocityDisplay = document.querySelector('.displayVelocity');


let timer =0;
let activeVelocity=0;
let velocity = 50;
let gravity = 0;
let height = 500;
heightDisplay.textContent=height;
velocityDisplay.textContent=velocity;


const Timer = setInterval (
 ()=>{
   ball.style.transform='translateX('+eakPosition(timer,activeVelocity)+'px) translateY('+frefallPosition(timer,gravity) +'px)';
   if (0.5*timer*timer*gravity<gamebox.offsetHeight-2*ball.offsetHeight){
    timer+=0.1;
  }
 }
,10);

let playButton = document.querySelector('.play');
let stopButton = document.querySelector('.stop');
let mainbox = document.querySelector('main');
mainbox.addEventListener ('click', (event)=>{
 if (event.target===playButton){
  timer=0;
  activeVelocity=velocity;
  gravity=10;
 }
 else if (event.target === stopButton) {
  activeVelocity=0;
  timer=0;
  gravity=0;
 }
}
)

function eakPosition (timer, velocity) {
 return timer*velocity;
}

function frefallPosition (timer, gravity) {
 if (height<gamebox.offsetHeight-ball.offsetHeight){
  return gamebox.offsetHeight-ball.offsetHeight-height+0.5*timer*timer*gravity;
 } else {
  return 0.5*timer*timer*gravity;
 }
}

const heightPlus = document.querySelector('.increaseHeight');
const heightMinus = document.querySelector('.reduceHeight');
mainbox.addEventListener ('click', (event)=>{
 if (event.target===heightPlus){
  activeVelocity=0;
  timer=0;
  gravity=0;

  height +=5;
  heightDisplay.textContent=height;
 }
 else if (event.target === heightMinus) {
  activeVelocity=0;
  timer=0;
  gravity=0;

  height -=5;
  heightDisplay.textContent=height;
 }
}
)

const speedPlus = document.querySelector('.increaseVelocity');
const speedMinus = document.querySelector('.reduceVelocity');
mainbox.addEventListener ('click', (event)=>{
 if (event.target===speedPlus){
  activeVelocity=0;
  timer=0;
  gravity=0;

  velocity +=5;
  velocityDisplay.textContent=velocity;
 }
 else if (event.target === speedMinus) {
  activeVelocity=0;
  timer=0;
  gravity=0;

  velocity -=5;
  velocityDisplay.textContent=velocity;
 }
}
)