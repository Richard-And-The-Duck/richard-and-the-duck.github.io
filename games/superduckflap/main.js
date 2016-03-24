//create new game with a size of 400px by 490px
var game = new Phaser.Game(400, 490, Phaser.AUTO, 'gameDiv');

var scoreDebounce = false;
var score = 0;

var started = false;
var spaceKey;

//the menu state of the game: this is the main menu
var menuState = {
    
    preload: function() {
        game.stage.backgroundColor = '#FFFFFF';
        
        game.load.image('playButton', '../res/images/playButton.png');
    },
    
    create: function() {
        this.titleText = game.add.text(200, 150, 'Super Duck Flap', { font: '48px Arial', fill: '#000' });
        this.titleText.anchor.setTo(0.5, 0.5);
        this.titleText.angle = (2 + Math.random() * 5) * (Math.random() > 0.5 ? 1 : -1);
        this.titleTween = game.add.tween(this.titleText);
        this.titleTween.to({ angle: -this.titleText.angle }, 5000 + Math.random() * 5000, Phaser.Easing.Linear.None, true, 0, 1000, true);
        
        this.playButton = game.add.button(200, 350, 'playButton', this.onPlayPressed, this);
        this.playButton.anchor.setTo(0.5, 0.5);
    },
    
    onPlayPressed: function() {
        game.state.start('preMain');
    }
    
};

//the pre-main state of the game: this is where the user will be prompted to flap to start the game
var preMainState = {
    
    preload: function() {
        game.stage.backgroundColor = '#FFFFFF';
        
        game.load.image('duck', 'res/images/bird.png');
    },
    
    create: function() {
        this.startText = game.add.text(150, 200, 'Flap to Start!', { font: '30px Arial', fill: '#000000' });
        this.startText.anchor.setTo(0.5, 0.5);
        
        spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.start, this);
        
        game.input.onDown.add(this.start, this);
        
        this.bird = game.add.sprite(100, 100, 'duck');
        this.bird.anchor.setTo(-0.2, 0.5);
    },
    
    start: function() {
        started = true;
        
        game.state.start('main');
    }
    
}

//the main state of the game: this is where all of the playing happens
var mainState = {

    preload: function() { 
        game.stage.backgroundColor = '#FFFFFF';

        game.load.image('duck', 'res/images/bird.png');  
        game.load.spritesheet('bird', 'res/images/birdSheet.png', 64, 36);

        //game.load.image('pipe', 'res/images/pipe.png');
        game.load.spritesheet('pipe', 'res/images/pipeSheet.png', 60, 60);
        
        game.load.audio('jump', 'res/sounds/jump.wav');
    },

    create: function() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        this.bird = game.add.sprite(100, 100, 'bird');
        
        this.bird.animations.add('flap');
        
        game.physics.arcade.enable(this.bird);
        this.bird.body.gravity.y = 1000;

        spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);
        spaceKey.onUp.add(this.unJump, this);
        
        game.input.onDown.add(this.jump, this);
        game.input.onUp.add(this.unJump, this);
        
        this.pipes = game.add.group();
        this.pipes.enableBody = true;
        //this.pipes.createMultiple(20, 'pipe');

        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);           

        score = 0;
        this.labelScore = game.add.text(20, 20, '0', { font: '30px Arial', fill: '#000000' });
        
        this.bird.anchor.setTo(-0.2, 0.5);
        
        this.jumpSound = game.add.audio('jump');
        
        this.bird.alive = true;
        
        if (started) {
            started = false;
            
            this.jump();
            this.unJump();
        }
    },

    update: function() {
        if (this.bird.inWorld == false)
            this.restartGame();

        game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);
        
        if (this.bird.alive) {
            this.bird.anchor.setTo(-0.2, 0.5);
        }
        
        if (this.bird.angle < 20 && this.bird.alive) this.bird.angle += 1;
        
        this.pipes.remove(this.pipes.getFirstDead());
    },
    
    jump: function() {
        if (!this.bird.alive)
            return;
        
        if (this.touched)
            return;
        
        this.bird.body.velocity.y = -400; //default: -350
        
        game.add.tween(this.bird).to({ angle: -20 }, 100).start();
        
        this.jumpSound.play();
        
        this.touched = true;
        
        this.bird.animations.play('flap', 15, false);
    },
    
    unJump: function() {
        this.touched = false;
    },

    restartGame: function() {
        this.scoreDebounce = false;
        
        game.state.start('gameOver');
    },

    addOnePipe: function(x, y, pos) {
        var pipe = this.pipes.create(x, y, 'pipe');
        pipe.animations.add('mid', [0], 0);
        pipe.animations.add('endDown', [1], 0);
        pipe.animations.add('endUp', [2], 0)
        
        pipe.reset(x, y);
        
        pipe.body.velocity.x = -300; //default: -200 
               
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
        
        switch (pos) {
            case -1:
                pipe.animations.play('endUp');
                break;
                
            case 0:
                pipe.animations.play('mid');
                break;
                
            case 1:
                pipe.animations.play('endDown');
                break;
        }
    },

    addRowOfPipes: function() {
        var hole = Math.floor(Math.random() * 5) + 1;
        
        for (var i = 0; i < 8; i++) {
            if (i != hole && i != hole + 1) {
                var pos = 0;
                if (i + 1 == hole) pos = 1;
                else if (i - 2 == hole) pos = -1;
                
                this.addOnePipe(400, i * 60 + 5, pos);
            }
        }
    
        if (this.scoreDebounce == true) {
            score += 1;
        }
        
        this.scoreDebounce = true;
        
        this.labelScore.text = score;  
    },
    
    hitPipe: function() {
        if (this.bird.alive == false)
            return;
        
        this.bird.alive = false;
        
        game.time.events.remove(this.timer);
        
        this.pipes.forEachAlive(function(p) {
            p.body.velocity.x = 0;
        }, this);
        
        this.scoreDebounce = false;
        
        this.bird.body.gravity.y = 1600;
        
        game.add.tween(this.bird).to({ angle: 90 }, 1000).start();
    }
    
};

var gameOverState = {
    
    preload: function() {
        game.stage.backgroundColor = '#FFFFFF';
        
        game.load.image('retryButton', '../res/images/retryButton.png');
        game.load.image('exitButton', '../res/images/exitButton.png');
    },
    
    create: function() {
        //this.newAngle = (2 + Math.random() * 5) * (Math.random() > 0.5 ? 1 : -1);
        
        this.duckEmitter = game.add.emitter(game.world.centerX, 0, 0);
        this.duckEmitter.makeParticles('duck');
        this.duckEmitter.minParticleSpeed.set(0, 300);
        this.duckEmitter.maxParticleSpeed.set(0, 400);
        this.duckEmitter.gravity = 1000;
        this.duckEmitter.width = 400;
        this.duckEmitter.setRotation(1000, 1000);
        this.duckEmitter.setAlpha(0.8, 0.8);
        this.duckEmitter.setScale(0.6, 0.8);
        this.duckEmitter.start(false, 5000, 1000);
        
        this.gameOverText = game.add.text(200, 100, 'Game Over!', { font: '48px Arial', fill: '#000' });
        this.gameOverText.anchor.setTo(0.5, 0.5);
        //this.gameOverText.angle = (2 + Math.random() * 5) * (Math.random() > 0.5 ? 1 : -1);
        //this.gameOverTween = game.add.tween(this.gameOverText);
        //this.gameOverTween.to({ angle: -this.scoreText.angle }, 5000 + Math.random() * 5000, Phaser.Easing.Linear.None, true, 0, 1000, true);
        
        this.scoreText = game.add.text(200, 150, '0 Pipes Cleared!', { font: '48px Arial', fill: '#000' });
        this.scoreText.anchor.setTo(0.5, 0.5);
        this.scoreText.text = score + ' Pipes Cleared!';
        //this.scoreText.angle = (2 + Math.random() * 5) * (Math.random() > 0.5 ? 1 : -1);;
        //this.scoreTween = game.add.tween(this.scoreText);
        //this.scoreTween.to({ angle: -this.scoreText.angle }, 5000 + Math.random() * 5000, Phaser.Easing.Linear.None, true, 0, 1000, true);
        
        this.playButton = game.add.button(200, 250, 'retryButton', this.onPlayPressed, this);
        this.playButton.anchor.setTo(0.5, 0.5);
        
        this.exitButton = game.add.button(200, 350, 'exitButton', this.onExitPressed, this);
        this.exitButton.anchor.setTo(0.5, 0.5);
    },
    
    onPlayPressed: function() {
        score = 0;
        
        game.state.start('preMain');
    },
    
    onExitPressed: function() {
        game.state.start('menu');
    }
    
};

game.state.add('menu', menuState);
game.state.add('preMain', preMainState);
game.state.add('main', mainState);
game.state.add('gameOver', gameOverState);
game.state.start('menu');