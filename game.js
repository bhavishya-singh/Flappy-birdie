var mainState = {
    preload: function() { 
        
        game.load.image("background", "assets/background2.png");
        game.load.image('bird', 'assets/bird.png'); 
        game.load.image('pipe', 'assets/pipe.png');
        game.load.audio('jumpsound', 'assets/jump.wav'); 


    },

    create: function() { 
        
        game.stage.backgroundColor = '#71c5cf';

        this.bg= game.add.tileSprite(0, 0, game.width, game.height, 'background');

        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.jumpSound = game.add.audio('jumpsound'); 

        this.bird = game.add.sprite(100, 245, 'bird');

        this.pipes = game.add.group(); 

        game.physics.arcade.enable(this.bird);

        this.bird.body.gravity.y = 1000;  

        this.bird.anchor.setTo(-0.2, 0.5); 

        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this); 

        var spaceKey = game.input.keyboard.addKey(
                        Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);   
        this.score = 0;
        game.input.onDown.add(this.doSomething, this);
        this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });     
    },

    update: function() {
        
        if (this.bird.y < 0 || this.bird.y > 490){
           this.restartGame();   
        }

        if (this.bird.angle < 20){
            this.bird.angle += 1; 
        }

        game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);
    },

    doSomething: function(pointer){
        this.jump();
    },

    jump: function() {

        if (this.bird.alive == false){
            return;  
        }

        this.jumpSound.play(); 
        
        this.bird.body.velocity.y = -350;

        var animation = game.add.tween(this.bird);

        animation.to({angle: -20}, 100);

        animation.start(); 

    },

    restartGame: function() {

        game.state.start('main');
    },

    addPipeGame: function(x, y) {

        var pipe = game.add.sprite(x, y, 'pipe');

        this.pipes.add(pipe);

        game.physics.arcade.enable(pipe);

        pipe.body.velocity.x = -200; 

        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },

    addRowOfPipes: function() {
        
        this.score += 1;

        this.labelScore.text = this.score; 

        var hole = Math.floor(Math.random() * 5) + 1;

        for (var i = 0; i < 8; i++){
            if (i != hole && i != hole + 1){ 
                this.addPipeGame(400, i * 60 + 10); 
            }  
        }

    },

    hitPipe: function() {
        // If the bird has already hit a pipe, do nothing
        // It means the bird is already falling off the screen
        if (this.bird.alive == false)
            return;

        // Set the alive property of the bird to false
        this.bird.alive = false;

        // Prevent new pipes from appearing
        game.time.events.remove(this.timer);

        // Go through all the pipes, and stop their movement
        this.pipes.forEach(function(p){
            p.body.velocity.x = 0;
        }, this);
    }, 
};


var game = new Phaser.Game(400, 490 , Phaser.AUTO, "game-area");

game.state.add('main', mainState); 


$(document).ready(function(){
    var play_button = document.getElementById("play_button");
    if(play_button){
    play_button.addEventListener('click',function(event){
        $('.container').slideUp();
        game.state.start('main');
  });
}
});