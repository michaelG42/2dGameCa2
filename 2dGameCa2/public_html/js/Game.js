
var screen, input, frames, spFrame, lvFrame, exFrame, fps;
var enSprite, shSprite, exSprite;
var enemys, dir, ship, bullets, eBullets, fpsWarningDisplayed, shipExploding, windowHasFocus, countDownInProgress;
var gameTimeElapsed, gameTimer, gameTime, roundTimer, exTimer, lastCalledTime, pauseStartTime, timer, time;
var health, paused, score, gameOver, gameStarted, highScore, explosion;

var highScoreElement = document.getElementById('highScore');
var fpsElement = document.getElementById('fps');
var scoreElement = document.getElementById('score');
var healthElement = document.getElementById('health');
var gameTimeElapsedElement = document.getElementById('gameTimeElapsed');
var roundElement = document.getElementById('round');
var soundAndMusicElement = document.getElementById('sound-and-music');
var instructionElement = document.getElementById('instructions');
var copyrightElement = document.getElementById('copyright');
var toastElement = document.getElementById('toast');

var LOWEST_FPS = 60;
var FPS_WARNING_ON_TIME = 5;//seconds
var FPS_WARNING_OFF_TIME = 15;

var MIN_COLISION_RANGE = 30;
var MAX_ENEMY_SHOOT_FREQUENCY = 50;
var ENEMY_SHOOT_FREQUENCY = 0.5;
var NUM_ENEMYS = 5;

var SHORT_DELAY = 50;
var OPAQUE = 1.0;
var TRANSPARENT = 0;

var ENEMY_MOVE_SPEED = 20;
var BULLET_MOVE_SPEED =8;

var SCREEN_FADED = false;
var ROUND_1_BACKGROUND ="url(images/Background1.jpg)";
var ROUND_2_BACKGROUND ="url(images/Background2.jpg)";
var ROUND_3_BACKGROUND ="url(images/Background3.jpg)";

function main()
{
    revealGame();//reveals game elements

    screen = new Screen(800, 510);// initalize canvas
    input = new InputHandeler();// create input handeler

    

    gameTimer = new Stopwatch();//timer for game
    roundTimer = new Stopwatch();//timer for rounds
    exTimer = new Stopwatch();//timer for ship explosion animation
    warningTimer = new Stopwatch();//timer for fps warning
     fadeTimer = new Stopwatch();//timer for fading rounds
    
    var img = new Image();// spritesheet image
    img.addEventListener("load", function ()
    {
        enSprite = [//enemy sprite array
            [new Sprite(this, 0, 0, 105, 80), new Sprite(this, 0, 80, 105, 80)],
            [new Sprite(this, 105, 0, 100, 80), new Sprite(this, 105, 80, 100, 80)],
            [new Sprite(this, 220, 0, 118, 80), new Sprite(this, 220, 80, 118, 80)]
        ];
        exSprite = [// ship explosion sprite array
            new Sprite(this, 0, 160, 80, 160), new Sprite(this, 80, 160, 80, 160),
            new Sprite(this, 160, 160, 80, 160), new Sprite(this, 240, 160, 80, 160),
            new Sprite(this, 320, 160, 80, 160), new Sprite(this, 400, 160, 80, 160),
            new Sprite(this, 400, 160, 80, 160), new Sprite(this, 480, 160, 80, 160)
        ];
        shSprite = new Sprite(this, 365, 0, 65, 160);//ship sprite

        init();// initalize game

    });
    img.src = "Images/spriteSheet2.png";
}
;

function init()
{
    document.getElementById('startGame').style.display = 'block';//displays start message
    
    highScore = localStorage.getItem("HighScore");//gets high score from local storage
    if (highScore === null)
    {
        highScore = 0;
    }

    round = 1;
    score = 0;
    health = 100;


    time = 20;
    gameTimeElapsed = 0;
    pauseStartTime = 0;
    frames = 0;
    spFrame = 0;
    exFrame = 0;
    lvFrame = 20;

    paused = true;
    gameOver = false;
    windowHasFocus = true;
    countDownInProgress = false;
    gameStarted = false;
    fpsWarningDisplayed = false;
    shipExploding = false;

    ship = {
        sprite: shSprite,
        x: (-10 + shSprite.w),
        y: (screen.height- shSprite.h) / 2
    };
    bullets = [];//your bullets
    eBullets = [];// enemy bullets
    enemys = [];

    
    generateEnemys();
}
;
function startGame()
{
    
   
    document.getElementById('startGame').style.display = 'none'; //hides start message
    revealInitialToast();
    paused = false;
    gameStarted = true;
    gameTimer.start();
    roundTimer.start();
    run();
}
function run()
{
    var loop = function ()
    {
        update();
        render();
        window.requestAnimationFrame(loop, screen.canvas);
    };
    window.requestAnimationFrame(loop, screen.canvas);
}
;

function generateEnemys()
{
    var rows = [0, 1, 2];// index of enemys generated
    for (var i = 0; i < NUM_ENEMYS; i++)
    {
        for (var j = 0; j < 2; j++)
        {
            var a = rows[Math.round(Math.random() * 2)];

            enemys.push({
                sprite: enSprite[a],
                x: Math.floor(Math.random() * ((screen.width*10) - screen.width + 1)) + screen.width, // gives the sprite a random x position
                y: (Math.floor(Math.random() * 150) + 10) + j * (Math.floor(Math.random() * 70) + 180) + [0, 0, 0][a], // gives the sprite a random y position inside the canvas
                w: enSprite[a][0].w,
                h: enSprite[a][0].h
            });
        }
    }
    checkEnemyPos();//removes enemys that are too close to each other
}

function checkEnemyPos()
{

//this function compares enemy x and y positions
// it takes away the x and y positions from each other
// if the absolute value is less than 50px they are too close and will be removed
    for (var i = 0; i < enemys.length - 1; i++)
    {
        for (var j = i + 1; j < enemys.length; j++)
        {
            var xRange = Math.abs(enemys[j].x - enemys[i].x);
            var yRange = Math.abs(enemys[j].y - enemys[i].y);

            if (xRange < 50 && yRange < 50)
            {
                enemys.splice(j, 1);
                j--;
            }
        }

    }
}
;
function raiseDifficulty()
{
// raises the difficulty happens every 20 seconds
// number of enemys increases, movment gets faster, shoot frequency increases.
    NUM_ENEMYS += 5;
    if (lvFrame > 10)
    {
        lvFrame -= 1;
    }
    if (ENEMY_SHOOT_FREQUENCY < MAX_ENEMY_SHOOT_FREQUENCY)
    {
        ENEMY_SHOOT_FREQUENCY += 0.001;
    }
    
    if(round > 1)
    {
        fadeIn();
    }
    

}
function changeRound()
{
    fadeTimer.start();
    fadeRound();
}

function fadeOut() {
    var element = document.getElementById('fadeBlack');
    var op = 1;  // initial opacity
    element.style.display = 'block';
    var timer = setInterval(function () {
        if (op <= 0){
            clearInterval(timer);
            
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -=  0.05;
    }, 100);
}
function fadeIn() {
    var element = document.getElementById('fadeBlack');
    var op = 0;  // initial opacity
    element.style.display = 'block';
    var timer = setInterval(function () {
        if (op >= 1){
            clearInterval(timer);
            changeBackground();
            fadeOut();
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op +=  0.05;
    }, 100);
}

function checkLowFps()
{
//pauses game and displays warning if frame rate gets to low   


    if (fps < LOWEST_FPS)
    {
        

        if(!fpsWarningDisplayed)
        {
            document.getElementById('warning').style.display = 'block';
            warningTimer.start();
            fpsWarningDisplayed = true;
        }
        else 
        {
            if((warningTimer.getElapsedTime()/1000) > FPS_WARNING_ON_TIME && (warningTimer.getElapsedTime()/1000) < FPS_WARNING_OFF_TIME)
            {
              document.getElementById('warning').style.display = 'none';  

            }
            if((warningTimer.getElapsedTime()/1000) > FPS_WARNING_OFF_TIME)
            {

              document.getElementById('warning').style.display = 'block';  
              warningTimer.stop();
              fpsWarningDisplayed = false;
            }
            
        }
          
    }
}

function update()
{
    getFps();
    checkLowFps();
    if (!(paused) && !(gameOver))//if the game isnt paused or over
    {

        roundTimeElapsed = parseInt((roundTimer.getElapsedTime() / 1000) % 60);// gets round time in seconds
        if (roundTimeElapsed > 20)// new round every 40 seconds difficulty rises every 20 seconds
        {
            roundTimer.reset();
            roundTimer.start();
            round += 0.5;
            raiseDifficulty();
            generateEnemys();
        }

        gameTimeElapsed = gameTimer.getElapsedTime();
        moveShip();
        shoot();
        enemyShoot();
        checkColision();
        frames++;

        if (frames % lvFrame === 0)
        {
            spFrame = (spFrame + 1) % 2;//enemy sprite cycle between frames
            }
            for (var i = 0; i < enemys.length; i++)
            {
                var a = enemys[i];
                a.x -= calcPps(ENEMY_MOVE_SPEED);
            }
        
        if (health <= 0)
        {
            shipExplode();
        }
    }
}
;


function render()//renders everything to screen
{
    screen.clear();//removes everything from previous frame
    if (frames % lvFrame === 0 && !gameOver)
    {
        document.getElementById("fps").innerHTML = "frame rate : " + Math.round(fps) + " fps ";
    }

    var seconds = parseInt((gameTimeElapsed / 1000) % 60);
    var min = parseInt((gameTimeElapsed / (1000 * 60)) % 60);

    document.getElementById("highScore").innerHTML = "High Score: " + highScore;
    document.getElementById("score").innerHTML = "Score: " + score;
    document.getElementById("health").innerHTML = "health: " + health;
    document.getElementById("round").innerHTML = "Round: " + Math.floor(round);
    document.getElementById("gameTimeElapsed").innerHTML = "Time Elapsed: " + min + "." + seconds;

    for (var i = 0; i < enemys.length; i++)//draws enemys
    {
        var a = enemys[i];
        screen.drawSprite(a.sprite[spFrame], a.x, a.y);
    }
    screen.ctx.save();

    for (var i = 0; i < bullets.length; i++)//draws bullets
    {
        screen.drawBullet(bullets[i]);
    }

    for (var i = 0; i < eBullets.length; i++)// draws enemy bullets
    {
        screen.drawBullet(eBullets[i]);
    }
    screen.ctx.restore();
    screen.drawSprite(ship.sprite, ship.x, ship.y);// draws ship

}
;

function moveShip()
{
    if (input.isDown(40))
    {
        ship.y += 4;
    }
    if (input.isDown(38))
    {
        ship.y -= 4;

    }
    ship.y = Math.max(Math.min(ship.y, screen.height - (10 + shSprite.h)), 10);
}
;

function shoot()
{
    
    if (input.isPressed(32))
    {
        
        bullets.push(new Bullet(ship.x+10, ship.y + 65, -8, 12, 4, "#FFFF00"));
    }
    for (var i = 0, len = bullets.length; i < len; i++)
    {
        if (bullets[i] !== undefined)
        {
            var b = bullets[i];

            b.update(calcPps(-BULLET_MOVE_SPEED));//updates bullet pos

            if ( b.x > (screen.width - 100))//if the bullet is 100px from top of screen remove it
            {
                bullets.splice(i, 1);//remove 1 bullet
                i--;
                len--;
                continue;
            }

            for (var j = 0, len2 = enemys.length; j < len2; j++)
            {
                var a = enemys[j];
                if (HitEnemy(b.x, b.y, b.width, b.height, a.x, a.y, a.w, a.h))// if bullet hits enemy, remove bullet and enemy
                {
                    enemys.splice(j, 1);
                    j--;
                    len2--;
                    bullets.splice(i, 1);
                    i--;
                    len--;
                    score++;
                    saveHighscore();
                }
            }
        }
    }
}
;
function gameLost()
{

    gameOver = true;
    gameStarted = false;
    document.getElementById('gameOver').style.display = 'block';


}
;
function shipExplode()
{
    if (!shipExploding)
    {
        exTimer.start();
        shipExploding = true;
    }
    if (exTimer.getElapsedTime() > 200)//updates ship frame every .2 of a second
    {
        exFrame++;
        if (exFrame === 7)
        {
            gameLost();
        }
        ship.sprite = exSprite[exFrame];
        exTimer.reset();
        shipExploding = false;
    }
}
function enemyShoot()
{
    if (Math.random() < ENEMY_SHOOT_FREQUENCY && enemys.length > 0)//makes enemys randomly shoot
    {
        var a = enemys[Math.round(Math.random() * (enemys.length - 1))];

        for (var i = 0; i < enemys.length; i++)
        {
            var b = enemys[i];

            if (HitEnemy(a.x, a.y, a.w, 100, b.x, b.y, b.w, b.h))
            {
                a = b;
            }

        }
        eBullets.push(new Bullet(a.x + a.w * 0.5, a.y + a.h, 8, 4, 4, "#B22222"));
    }
    for (var i = 0, len = eBullets.length; i < len; i++)
    {
        var b = eBullets[i];
        b.update(calcPps(BULLET_MOVE_SPEED));

        if (b.x < 0 || b.x >screen.width+100 )
        {
            eBullets.splice(i, 1);//remove 1 bullet
            i--;
            len--;
            continue;
        }

        if (HitShip(b.x, b.y, b.width, b.height, ship.x - 60, ship.y, ship.sprite.h, ship.sprite.w))// if bullet hits ship
        {
            health -= 25;
            eBullets.splice(i, 1);
            i--;
            len--;
        }
    }
}
;

function checkColision()// if enemy colides with ship
{
    for (var i = 0; i < enemys.length; i++)
    {
        var xRange = Math.abs(ship.x - enemys[i].x);
        var yRange = Math.abs(ship.y - enemys[i].y);

        if (xRange < MIN_COLISION_RANGE && yRange < MIN_COLISION_RANGE)
        {
            enemys.splice(i, 1);
            i--;
            health -= 25;
        }
    }
}

function getFps()//gets fps by comparing with last called time
{

    if (!lastCalledTime) {
        lastCalledTime = Date.now();
        fps = 60;
        return;
    }
    var delta = (Date.now() - lastCalledTime) / 1000;
    lastCalledTime = Date.now();
    fps = 1 / delta;


}
;


function calcPps(speed)
{
   
    return fps/speed;
}

window.addEventListener('keydown', function (e) {
    var key = e.keyCode;
    if (key === 80)// p key
    {
        togglePause();
    }
    if (key === 83 && !gameStarted)
    {
        startGame();// s key
    }
    if (key === 88 && gameOver)// x key
    {
        location.reload();
    }

});

function saveHighscore()
{
    if (score > highScore || highScore === null)
    {
        highScore = score;
        localStorage.setItem("HighScore", score);
    }
}

function togglePause(e)
{
    if (!paused)
    {
        document.getElementById('paused').style.display = 'block';
        pause();
    } else if (paused)
    {
        document.getElementById('paused').style.display = 'none';
        document.getElementById('warning').style.display = 'none';
        resume();
    }
}
;

function pause()
{
    paused = true;
    pauseTime = Date.now();
}

function resume()
{
    revealToast("Welcome Back", 3000);
    var wasPaused = paused;
    paused = false;
    time += Date.now() - pauseTime;
    if (wasPaused)
    {
        timeLastFrame = Date.now();
    }
}

function revealGame()
{
    var DIM_CONTROLS_DELAY = 5000;
    revealTopChromeDimmed();
    revealBottomChrome();

    setTimeout(function () {
        dimControls();
        revealTopChrome();
    }, DIM_CONTROLS_DELAY);
}
;

function revealTopChromeDimmed()
{
    var DIM = 0.25;
    highScoreElement.style.display = 'block';
    scoreElement.style.display = 'block';
    healthElement.style.display = 'block';
    fpsElement.style.display = 'block';
    roundElement.style.display = 'block';
    gameTimeElapsedElement.style.display = 'block';
    setTimeout(function () {
        highScoreElement.style.opacity = 'block';
        scoreElement.style.opacity = 'block';
        healthElement.style.opacity = 'block';
        fpsElement.style.opacity = 'block';
        roundElement.style.opacity = 'block';
        gameTimeElapsedElement.style.opacity = 'block';
    }, this.SHORT_DELAY);
}
;

function revealBottomChrome()
{
    fadeInElements(soundAndMusicElement, instructionElement, copyrightElement);
}
;

function dimControls()
{
    var FINAL_OPACITY = 0.5;
    instructionElement.style.opacity = FINAL_OPACITY;
    soundAndMusicElement.style.opacity = FINAL_OPACITY;
}
;


function revealTopChrome()
{
    fadeInElements(fpsElement, scoreElement, roundElement, gameTimeElapsedElement, healthElement, highScoreElement);
}
;

function revealInitialToast()
{
    var INITIAL_TOAST_DELAY = 1500,
            INITIAL_TOAST_DURATION = 3000;
    setTimeout(function () {
        revealToast('Shoot enemys.<br>Avoid enemys and bullets.', INITIAL_TOAST_DURATION);
    }, INITIAL_TOAST_DELAY);
}
;


function fadeInElements() {
    var args = arguments;
    for (var i = 0; i < args.length; ++i) {
        args[i].style.display = "block";
    }
    setTimeout(function () {
        for (var i = 0; i < args.length; ++i) {
            args[i].style.opacity = OPAQUE;
        }
    }, SHORT_DELAY);
}
;

function revealToast(text, duration)
{
    var DEFAULT_TOAST_DURATION = 1000;
    duration = duration || DEFAULT_TOAST_DURATION;
    startToastTransition(text, duration);
    setTimeout(function (e) {
        hideToast();
    }, duration);
}
;

function startToastTransition(text, duration)
{
    toastElement.innerHTML = text;
    fadeInElements(toastElement);
}
;

function hideToast()
{
    var TOAST_TRANSITION_DURATION = 500;
    fadeOutElements(toastElement, TOAST_TRANSITION_DURATION);
}
;


function fadeOutElements()
{
    var args = arguments,
            fadeDuration = args[args.length - 1];

    for (var i = 0; i < args.length - 1; ++i)
    {
        args[i].style.opacity = 0;
    }
    setTimeout(function (e) {
        for (var i = 0; i < args.length - 1; ++i)
        {
            args[i].style.display = 'none';
        }
    }, fadeDuration);
}
;



window.addEventListener('blur', function (e)
{
    windowHasFocus = false;

    if (!paused)
    {
        togglePause(); //Pause the game
    }
});

window.addEventListener('focus', function (e)
{
    DIGIT_DISPLAY_DURATION = 1000;
    windowHasFocus = true;
    countDownInProgress = true;

    if (paused && gameStarted)
    {
        if (windowHasFocus && countDownInProgress)
        {
            revealToast('3', DIGIT_DISPLAY_DURATION);
        }
        setTimeout(function (e) {
            if (windowHasFocus && countDownInProgress)
            {
                revealToast('2', DIGIT_DISPLAY_DURATION);
            }
            setTimeout(function (e) {
                if (windowHasFocus && countDownInProgress)
                {
                    revealToast('1', DIGIT_DISPLAY_DURATION);
                }
                setTimeout(function (e) {
                    if (windowHasFocus && countDownInProgress)
                    {
                        togglePause();
                    }
                    countdownInProgress = false;
                }, DIGIT_DISPLAY_DURATION);
            }, DIGIT_DISPLAY_DURATION);
        }, DIGIT_DISPLAY_DURATION);
    }
});


function changeBackground() 
{
    if(round > 1 && round < 2)
    {
         screen.canvas.style.backgroundImage= ROUND_3_BACKGROUND; 
    }
    else
    {
        screen.canvas.style.backgroundImage= ROUND_3_BACKGROUND; 
    }
  
}

main();
