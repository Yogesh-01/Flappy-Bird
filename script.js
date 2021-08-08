console.log("hueheu");

 const bird = document.querySelector('.bird');
 const gameDisplay = document.querySelector('.game-box');
 const ground = document.querySelector('.ground');
 
 let birdLeft =220;
 let birdBottom = 100;
 let gravity = 2;
 let isGameOver = false;
 let gap = 440;
 let score =0;
 
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
 }
 
 function controll(e){      // function to make bird jump on pressing space
     if(e.keyCode === 32){  // calling jump only when space is pressed, keyCode for space is '32'
         jump();
     }
     if(e.keyCode == 32 && e.target == document.body){  // to prevent scrolling due to space 
         e.preventDefault();                            // so remove effect of 'space' when target is 'body'
         return !(e.keyCode == 32);                     //  not working yet lol
     }
 }

 document.addEventListener('keyup',controll);  // executes function "controll" on key-up i.e. after pressing key

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
         }
         if((pipeLeft > 200 && pipeLeft<280) &&(birdBottom > gap+pipeBottom-(150+45))){           // setting rules for top pipe
            gameOver();                                      // gap+pipeBottom is height at which pipe is
            clearInterval(timerId);                          // 150 for ground, 45 for bird height. as collision works for base of div 
         }


         // generating score when bird clears whole pipe, while pipe is moving
         if(pipeLeft==birdLeft-60)score+=10;
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
     document.removeEventListener('keyup', controll); // removes key event from 'document'. and removes function associated by it
     document.querySelector('.gameover-box').style.display="block";
}