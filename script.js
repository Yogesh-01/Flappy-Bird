console.log("hueheu");

 const bird = document.querySelector('.bird');
 const gameDisplay = document.querySelector('.game-box');
 const ground = document.querySelector(".ground-moving");
 
 let birdLeft =220;
 let birdBottom = 100;
 let gravity = 2;
 let isGameOver = false;
 let gap = 440;
 let score =0;
 var eventt;     // variable to see whether to use click or space 

 var wing = new Audio('sounds/wing.wav');
 var die = new Audio('sounds/die.wav');
 var hit = new Audio('sounds/hit.wav');
 var point = new Audio('sounds/point.wav');


 
 
///***************************  ADDING  CLICK/TOUCH  EVENT FOR  MOBILE  DISPLAY  ************************///
///                                                                                                      ///
///         not robust responsiveness, just a media query to make this                                   ///
///         barely work on mobile, as they don't have space button to press directly                     ///
///                                                                                                      ///
    function myFunction(x) {                                                                             ///
        if (x.matches) { // If media query matches                                                       ///
        eventt='click';  // using click event on mobile display                                          ///
        document.querySelector('.initial-box h5').textContent="Click To Start";                          ///
                                                                                                         ///
        } else {                                                                                         ///
            eventt ='keyup';    //using space for desktop by help of keyup event                         ///
        }                                                                                                ///
     }                                                                                                   ///
                                                                                                         ///
     var x = window.matchMedia("(max-width: 700px)")                                                     ///
     myFunction(x) // Call listener function at run time                                                 ///
     x.addListener(myFunction) // Attach listener function on media query state changes                  ///
///                                                                                                      ///
///                                                                                                      ///
///                                                                                                      ///
///******************************************************************************************************///



 function startGravity(){
     birdBottom -= gravity;
     bird.style.bottom=birdBottom + 'px';
     bird.style.left=birdLeft + 'px';
 }

 let gameTimerId = setInterval(startGravity,20 );    // setInterval repeatedly calls the passed function
            // 'gameTimerId' var stores "timer ID" passed by setInterval. so we can target this time event

 function jump(){
     if(birdBottom<580-45) birdBottom += 50; // to prevent bird fron going out of bounds
     bird.style.bottom = birdBottom + 'px';
     console.log(birdBottom);
     wing.play();
 }
 
 function controll(e){      // function to make bird jump on pressing space
     if(eventt=='keyup' && e.keyCode === 32  || eventt=='click'){  // calling jump only when space is pressed, keyCode for space is '32'
         jump();
     }
     if(e.keyCode == 32 && e.target == document.body){  // to prevent scrolling due to space 
         e.preventDefault();                            // so remove effect of 'space' when target is 'body'
         return !(e.keyCode == 32);                     //  not working yet lol
     }
 }

 document.addEventListener(eventt,controll);  // executes function "controll" on key-up i.e. after pressing key

 function generatePipe(){
     let pipeLeft = 500;
     let pipeBottom = 150;
     
     let randomHeight = Math.random()*60;
     pipeBottom=randomHeight; // to make pipe height vary by shifting its position from bottom

     const pipe = document.createElement('div');
     const topPipe = document.createElement('div');

     if(!isGameOver){
        pipe.classList.add('pipe'); // div will get 'pipe' class only when game not over, so queued pipes won't be created after generate pipe is stopped
        topPipe.classList.add('top-pipe');
     }
     gameDisplay.appendChild(pipe);
     gameDisplay.appendChild(topPipe);
     pipe.style.left = pipeLeft + 'px';
     pipe.style.bottom = pipeBottom + 'px';
     topPipe.style.left = pipeLeft + 'px';
     topPipe.style.bottom = pipeBottom + gap + 'px'; // spawning top pipe with 440px avove bottom pipe 

     function movePipe(){
         if(!isGameOver)pipeLeft-=2;  // prevent untouched pipe's movement if game over 
         pipe.style.left = pipeLeft + 'px';
         topPipe.style.left = pipeLeft + 'px'; // moving top pipe at same rate as bottom

         if(pipeLeft === -60){  // when pipe hits left edge, deleting time event and removing pipe 
             clearInterval(timerId);
             gameDisplay.removeChild(pipe);  // removing the div 'pipe'
             gameDisplay.removeChild(topPipe);
         }
                                                 // 300-150+b=pipeBottom is net height of pipe above ground
         if((pipeLeft > 200 && pipeLeft < 280) &&(birdBottom < 300-150+pipeBottom)  || birdBottom === 0){ // first condition is when bird collide side ways, second for top collision, third for hitting ground
            gameOver();
            clearInterval(timerId);
            hit.play();
         }
         if((pipeLeft > 200 && pipeLeft<280) &&(birdBottom > gap+pipeBottom-(150+45))){           // setting rules for top pipe
            gameOver();                                      // gap+pipeBottom is height at which pipe is
            clearInterval(timerId);                          // 150 for ground, 45 for bird height. as collision works for base of div 
            hit.play();
         }


         // generating score when bird clears whole pipe, while pipe is moving
         if(pipeLeft==birdLeft-60){
             score+=10;
             point.play();
        }
         console.log("score is "+score);
         document.querySelector('#score').textContent=score;
         document.querySelector('#finalscore').textContent="Score : "+score;
     }
     let timerId= setInterval(movePipe,20); // setInterval is moving pipe every 20 ms. And 'timer Id' returned from
                                            // setInterval is stored in "timerId" variable for deleting this time event
     if(isGameOver===false)setTimeout(generatePipe, 3000); // recursively generating new pipe after 3 sec delay
            // new obstacle will not be created when game over. Some in time queue will still generate till 3 seconds
 }
 generatePipe();

   
 function gameOver(){
     isGameOver=true;
     console.log('game over');
     clearInterval(gameTimerId); // stopping bird from falling on game over
     document.removeEventListener(eventt, controll); // removes key event from 'document'. and removes function associated by it
     ground.classList.add('ground')
     ground.classList.remove('ground-moving')
     setTimeout(function(){ 
         die.play(); 
         document.querySelector('.gameover-box').style.display="block";
         document.querySelector('.initial-box').style.display = "block";
     },600);
}





/***** restarting game */

function func(e){      
    // if(e.keyCode === 32 && isGameOver==true){  
    //     window.location.reload();
    // }
    if(isGameOver){
        if(eventt=='click') window.location.reload();

        else if(eventt=='keyup' && e.keyCode === 32) window.location.reload();
    }

}

document.addEventListener(eventt,func);   // calling func to check if we need to restart game 














