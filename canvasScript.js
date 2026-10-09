const gamebox = document.getElementById('.gamebox');
const ball = document.getElementById('ball');
let timer =0;
let velocity=0;
let gravity = 0;
const Timer = setInterval ( 
 ()=>{
   ball.style.transform='translateX('+timer*velocity+'px) translateY('+0.5*gravity*timer*timer+'px)';
   timer+=0.1;
  }
,100);

let playButton = document.querySelector('.play');
let stopButton = document.querySelector('.stop');
let mainbox = document.querySelector('main');
mainbox.addEventListener ('click', (event)=>{
 if (event.target===playButton){
  timer=0;
  velocity=50;
  gravity=20;
 }
 else if (event.target === stopButton) {
  velocity=0;
  timer=0;
  gravity=0;
 }
}
)