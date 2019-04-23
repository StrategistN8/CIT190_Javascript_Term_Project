var myGamePiece;
var myObstacles = [];
var myEnemies = [];
var myPhaseOrb = [];
var crashSound;
var crashWhilePhasedSound;
var projectileSound;
var phaseSound;
var myScore;
var myLevel;
var myPowerupMessage;
var gameOver;
var myGameArea = {
    canvas : document.getElementById("game"),
    start : function() {
        this.canvas.width = 900;
        this.canvas.height = 350;
        this.canvas.style.cursor = "none";
        this.context = this.canvas.getContext("2d");
        //document.body.insertBefore(this.canvas, document.body.childNodes[7]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 10);
        window.addEventListener("mousemove", function (e){
            myGameArea.x = e.pageX;
            myGameArea.y = e.pageY;
        })
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
}

// Initializes the game components.
function startGame() {
    myGamePiece = new component(60, 70, "media/scanBot.png", 10, 120, "image");
    crashSound = new sound("media/Blast-SoundBible.com.wav");
    projectileSound = new sound("media/Backwards Souls-SoundBible.com.wav"); 
    phaseSound = new sound("media/Power_Up_Ray-Mike_Koenig.wav");
    crashWhilePhasedSound = new sound("media/Laser-SoundBible.com.wav");
    myScore = new component("30px", "Industrial", "White", 280, 40, "text");
    myLevel = new component("30px", "Industrial", "White", 80, 40, "text");
    myPowerupMessage = new component ("25px", "Industrial", "orchid", 650, 40, "text" );
    myBackground = new component(900, 350, "media/Light_Into_The_Cavern_Free_Vector/LightIntoTheCavernFreeVector.jpg", 0,0,"background");
    gameOver = new component ("30px", "Industrial", "White", 350, 90, "text" );
    gameOver.text = "GAME OVER"
    myGameArea.start();    
}

// Constructor for game components:
function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image" || type == "background") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y; 
    this.isPhased = false;   
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        }
        else if (type == "image" || type == "background") {
            ctx.drawImage(this.image, 
                this.x, 
                this.y,
                this.width, this.height);
            if (type == "background"){
                ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height)
            }
            }  

        else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
         this.x += this.speedX;
         this.y += this.speedY; 
         if (this.type == "background"){
             if (this.x == -(this.width)){
                 this.x = 0;
             }
         }       
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y + 15;
        var mybottom = this.y + (this.height) - 19;
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

// Constructor for sound components:
function sound(src){
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display="none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
    
}

// Function that updates the game area: 
function updateGameArea() {    
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;

    myGameArea.clear();
    // Update Background:
    myBackground.speedX = -1; 
    myBackground.newPos();
    myBackground.update();  
      
     // Update game object: 
     myGamePiece.newPos();    
     myGamePiece.update();
     if (myGameArea.x && myGameArea.y)
    {
        myGamePiece.x = (myGameArea.x - 250);
        myGamePiece.y = (myGameArea.y - 250);
    }
    myGameArea.frameNo += 1;
     // Update Obstacles: 
    if (myGameArea.frameNo == 1 || everyinterval(250)) {
        x = myGameArea.canvas.width;
        minHeight = 75;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 105; // Old Value 100
        maxGap = 350; // Old Value 250
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new component(30, height, "media/obstruction.png", x, 0, "image"));
		myObstacles.push(new component(45, x-height-gap, "media/obstructionNarrowBottom.png", x, height+gap, "image"));
 		
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].speedX = -1;
        myObstacles[i].newPos();
        myObstacles[i].update();
    }
    
    //Robots: todo -> Adds obstructions that move on the Y axis as well. 
    if (myGameArea.frameNo == 7700 || everyinterval(770)) {
        x = myGameArea.canvas.width;
        myEnemies.push(new component(150, 150, "media/MX-56E.png", x, 0, "image"));
 		
    }
    for (i = 0; i < myEnemies.length; i += 1) {
        
        if (myEnemies[i].y == 250)
        { 
            myEnemies[i].speedY = -1;
            myEnemies[i].speedX = -1;
            myEnemies[i].newPos();
            myEnemies[i].update();
        }
        if (myEnemies[i].y == 0)
        { 
            myEnemies[i].speedY = +1;
            myEnemies[i].speedX = -1;
            myEnemies[i].newPos();
            myEnemies[i].update();
        }
        else
        {
            myEnemies[i].speedX = -1;
            myEnemies[i].newPos();
            myEnemies[i].update();
        } 
        
        
    }
    
    // PowerUps: Powerup objects that allow the robot to teleport away obstructions.
    if (myGameArea.frameNo == 6 || everyinterval(5000)) {
        x = myGameArea.canvas.width;
        minHeight = 75;
        maxHeight = 250;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        myPhaseOrb.push(new component(50, 50, "media/power_up_orb.png", x, height, "image"));
 		
    }
    for (i = 0; i < myPhaseOrb.length; i += 1) {
        
        if(myGamePiece.crashWith(myPhaseOrb[i]) && myGamePiece.isPhased == false)
        {
            phaseSound.play();
            myGamePiece.isPhased = true;            
        }
        
        myPhaseOrb[i].speedX = -1;
        myPhaseOrb[i].newPos();
        myPhaseOrb[i].update();
        
        


    }

    // Update Score: 
    myScore.text="SCORE: " + Math.round(myGameArea.frameNo/30);
    myScore.update();
    
    // Update Level: 
    myLevel.text="LEVEL: " + (Math.round(myGameArea.frameNo/2500) + 1);
    myLevel.update();
    
    // Update Powerup Status: 
    if (myGamePiece.isPhased == true)
    {
        myPowerupMessage.text="[PHASED]";
        myPowerupMessage.update();
    }
    else
    {
        myPowerupMessage.text="[NO POWERUP]";
        myPowerupMessage.update();
    }
    
    // collision checks: 
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i]) && myGamePiece.isPhased == false) {
            crashSound.play();
            myGameArea.stop();
            myGameArea.clear();
            myBackground.update();
            myScore.x = 360;
            myScore.y = 180;
            myScore.newPos();
            myScore.text="SCORE: " + Math.round(myGameArea.frameNo/60);
            myScore.update();
            gameOver.newPos();
            gameOver.update();
            document.getElementById("restart").style.visibility = "visibile";
        } 
        else if (myGamePiece.crashWith(myObstacles[i]) && myGamePiece.isPhased == true)
        {
            crashWhilePhasedSound.play();
            myObstacles[i].y = -1000;
            myGamePiece.isPhased = false;
        
        }
    }

     // collision checks: 
     for (i = 0; i < myEnemies.length; i += 1) {
        if (myGamePiece.crashWith(myEnemies[i]) && myGamePiece.isPhased == false) {
            crashSound.play();
            myGameArea.stop();
            myGameArea.clear();
            myBackground.update();
            myScore.x = 360;
            myScore.y = 180;
            myScore.newPos();
            myScore.text="SCORE: " + Math.round(myGameArea.frameNo/60);
            myScore.update();
            gameOver.newPos();
            gameOver.update();
            document.getElementById("restart").style.visibility = "visibile";
        } 
        else if (myGamePiece.crashWith(myEnemies[i]) && myGamePiece.isPhased == true)
        {
            crashWhilePhasedSound.play();
            myEnemies[i].y = -1000;
            myGamePiece.isPhased = false;
        
        }
    }
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

