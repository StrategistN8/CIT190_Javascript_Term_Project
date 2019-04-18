var myGamePiece;
var myGrapples = [];
var TNTGrapples = [];
var myBolders = [];
var myTanBolders = [];
var myBlueBolders = [];
var myGrayBolders = [];
var myTNT = [];
var crashSound;
var releaseSound;
var myScore;
var furnaceChute;
var gameOver;
var tanRubble;
var blueRubble;
var grayRubble;
var myCursor;
var currentScore = 0; 
var gameOverGrapple1 = new component(50, 100, "media/Grapple.png", 100, 0, "image");
var gameOverGrapple2 = new component(50, 120, "media/Grapple.png", 580, 0, "image");
         
var myGameArea = {
    canvas : document.getElementById("game"),
    start : function() {
        this.canvas.width = 900;
        this.canvas.height = 350;
        this.canvas.style.cursor = "none";
        this.context = this.canvas.getContext("2d");
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
    crashSound = new sound("media/Smashing-Yuri_Santana.wav");
    releaseSound = new sound("media/Metal_Reflect.wav");
    projectileSound = new sound("media/Backwards Souls-SoundBible.com.wav");
    myScore = new component("20px", "Industrial", "white", 350, 200, "text");
    tanRubble = new component(229, 79, "media/rubble.png", 350, 299, "image");
    blueRubble = new component(229, 79, "media/rubbleBlue.png", 65, 299, "image");
    grayRubble = new component(229, 79, "media/rubbleGray.png", 650, 299, "image");
    myCursor = new component(20, 20, "media/cursor.png", 0, 0, "image");
    myCursor.text = "[  ]";
    myBackground = new component(900, 350, "media/industrial_background.jpg", 0,0,"background");
    gameOver = new component ("40px", "Industrial", "White", 280, 150, "text" );
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

        else if (type == "shape") {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.gravitySpeed;
        this.x += this.speedX;
        this.y += this.speedY; 
         if (this.type == "background"){
             if (this.x == -(this.width)){
                 this.x = 0;
             }
         }       
    }
}

// Constructor for the droppable objects:
function droppableComponent (width, height, color, x, y, type, id) {
    this.id = id;
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
    this.gravity = 0;
    this.gravitySpeed = 0;
    
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        }
        else if (type == "image") {
            ctx.drawImage(this.image, 
                this.x, 
                this.y,
                this.width, this.height);
            }  

        else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;  
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
    var x, height;  
      
    myGameArea.clear();

    myGameArea.frameNo += 1;
    

    // Update Background:
    myBackground.speedX = 0; 
    myBackground.newPos();
    myBackground.update();  
   
    // Update targeting cursor: 
        
    if (myGameArea.x && myGameArea.y)
    {
        myCursor.x = (myGameArea.x - 250);
        myCursor.y = (myGameArea.y - 250);
    }
    myCursor.newPos();
    myCursor.update();

    // Update Boulders: There are 5 kinds of objects generated, each with their own heap and score value. 
    // Generic Boulders: -19 points in any heap (they don't go here!) 
    if (myGameArea.frameNo == 1000 || everyinterval(1750)) {
        x = myGameArea.canvas.width;
        y = 80;
        height = 50;
        id = 0;
        myBolders.push(new droppableComponent(50, height, "media/bolder.png", x, y, "image", id)); 	
        id++;	
    }
  
    for (i = 0; i < myBolders.length; i += 1) {
        myBolders[i].speedX = -1;
        myBolders[i].newPos();
        myBolders[i].update();
        if(myBolders[i].crashWith(myCursor))
        {
            //releaseSound.play();
            myBolders[i].gravitySpeed = 5;
            
        }
        if(myBolders[i].crashWith(tanRubble))
        {
            currentScore -= 1;           
        }
        if(myBolders[i].crashWith(blueRubble))
        {
            currentScore -= 1;           
        }
        if(myBolders[i].crashWith(grayRubble))
        {
            currentScore -= 1;           
        }
    }

    // Blue Boulders: +38 points in the blue heap, -19 in the other heaps.
    if (myGameArea.frameNo == 250 || everyinterval(1500)) {
        x = myGameArea.canvas.width;
        y = 70;
        height = 50;
        id = 0;
        myBlueBolders.push(new droppableComponent(65, height, "media/bolderBlue.png", x, y, "image", id)); 	
        id++;	
    }
  
    for (i = 0; i < myBlueBolders.length; i += 1) {
        myBlueBolders[i].speedX = -1;
        myBlueBolders[i].newPos();
        myBlueBolders[i].update();
        if(myBlueBolders[i].crashWith(myCursor))
        {
            //releaseSound.play();
            myBlueBolders[i].gravitySpeed = 5;
            
        }
        if(myBlueBolders[i].crashWith(tanRubble))
        {
            currentScore -= 1;           
        }
        if(myBlueBolders[i].crashWith(blueRubble))
        {
            currentScore += 2;           
        }
        if(myBlueBolders[i].crashWith(grayRubble))
        {
            currentScore -= 1;           
        }
    }

    // Tan Boulders: +38 points in the tan heap, -19 in the other heaps.
    if (myGameArea.frameNo == 1 || everyinterval(1250)) {
        x = myGameArea.canvas.width;
        y = 80;
        height = 50;
        id = 0;
        myTanBolders.push(new droppableComponent(55, height, "media/bolderTan.png", x, y, "image", id)); 	
        id++;	
    }
  
    for (i = 0; i < myTanBolders.length; i += 1) {
        myTanBolders[i].speedX = -1;
        myTanBolders[i].newPos();
        myTanBolders[i].update();
        if(myTanBolders[i].crashWith(myCursor))
        {
            //releaseSound.play();
            myTanBolders[i].gravitySpeed = 5;
            
        }
        if(myTanBolders[i].crashWith(tanRubble))
        {
            currentScore += 3;           
        }
        if(myTanBolders[i].crashWith(blueRubble))
        {
            currentScore -= 1;           
        }
        if(myTanBolders[i].crashWith(grayRubble))
        {
            currentScore -= 1;           
        }
    }

    // Gray Boulders: +38 points in the Gray heap, -19 in the other heaps.
    if (myGameArea.frameNo == 500 || everyinterval(2000)) {
        x = myGameArea.canvas.width;
        y = 80;
        height = 50;
        id = 0;
        myGrayBolders.push(new droppableComponent(75, height, "media/bolderGray.png", x, y, "image", id)); 	
        id++;	
    }
  
    for (i = 0; i < myGrayBolders.length; i += 1) {
        myGrayBolders[i].speedX = -1;
        myGrayBolders[i].newPos();
        myGrayBolders[i].update();
        if(myGrayBolders[i].crashWith(myCursor))
        {
            //releaseSound.play();
            myGrayBolders[i].gravitySpeed = 5;
            
        }
        if(myGrayBolders[i].crashWith(tanRubble))
        {
            currentScore -= 1;           
        }
        if(myGrayBolders[i].crashWith(blueRubble))
        {
            currentScore -= 1;           
        }
        if(myGrayBolders[i].crashWith(grayRubble))
        {
            currentScore += 4;           
        }
    }

    // Update Grapples carrying game objects: 
    if (myGameArea.frameNo == 1 || everyinterval(250)) {
        x = myGameArea.canvas.width;
        height = 100;
        myGrapples.push(new component(50, height, "media/Grapple.png", x, 0, "image")); 		
    }
    for (i = 0; i < myGrapples.length; i += 1) {
        myGrapples[i].speedX = -1;
        myGrapples[i].newPos();
        myGrapples[i].update();
    }   

    
    //Update Score: 
    myScore.text="SCORE: " + currentScore;
    myScore.update();
    
    // Update rubble piles
    tanRubble.newPos();
    tanRubble.update();
    blueRubble.newPos();
    blueRubble.update();
    grayRubble.newPos();
    grayRubble.update();

    checkGameOver();
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function checkGameOver(){
    if (currentScore < 0)
    {   
        myGameArea.clear();
        
        myBackground.speedX = 0; 
        myBackground.newPos();
        myBackground.update(); 

        gameOverGrapple1.newPos();
        gameOverGrapple1.update();
        gameOverGrapple2.newPos();
        gameOverGrapple2.update();

        gameOver.newPos();
        gameOver.update();
        myGameArea.stop();
    }
    if (currentScore >= 2000 || myGameArea.frameNo == 1000000)
    {   
        myGameArea.clear();
        
        myBackground.speedX = 0; 
        myBackground.newPos();
        myBackground.update(); 

        gameOverGrapple1.newPos();
        gameOverGrapple1.update();
        gameOverGrapple2.newPos();
        gameOverGrapple2.update();

        gameOver.text = "YOU WIN!";
        gameOver.newPos();
        gameOver.update();
        myScore.text = "FINAL SCORE: " + currentScore;
        myScore.newPos();
        myScore.update();
        myGameArea.stop();
    }
}
