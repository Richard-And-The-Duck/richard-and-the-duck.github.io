var game = new Phaser.Game(640, 1280, Phaser.AUTO, 'gameDiv');

GameStates = {};

GameStates.MainState = function () { };
GameStates.MainState.prototype = {
	
	preload: function () {
		this.game.stage.backgroundColor = '#16A085';
	},
	
	create: function () {
		this.score = 0;
		this.scoreBuffer = 0;
		
		this.createScore();
		
		var seed = Date.now();
		this.random = new Phaser.RandomDataGenerator([seed]);
		
		this.game.input.onUp.add(function (pointer) {
			var newScore = this.random.integerInRange(1, 30);
			this.createScoreAnimation(pointer.x, pointer.y, '+' + newScore, newScore);
		}, this);
	},
	
	update: function () {
		if (this.scoreBuffer > 0) {
			this.incrementScore();
			this.scoreBuffer--;
		}
	},
	
	createScore: function () {
		var scoreFont = '100px Arial';
		
		this.scoreLabel = this.game.add.text(this.game.world.centerX, 50, '0', { font: scoreFont, fill: '#FFFFFF', stroke: '#535353', strokeThickness: 15 } );
		this.scoreLabel.anchor.setTo(0.5, 0);
		this.scoreLabel.align = 'center';
		
		this.scoreLabelTween = this.game.add.tween(this.scoreLabel.scale).to( { x: 1.5, y: 1.5 }, 200, Phaser.Easing.Linear.In).to( { x: 1.0, y: 1.0 }, 200, Phaser.Easing.Linear.In);
	},
	
	incrementScore: function () {
		this.score += 1;
		this.scoreLabel.text = this.score;
	},
	
	createScoreAnimation: function (x, y, message, score) {
		var scoreFont = '90px Arial';
		
		var scoreAnimation = this.game.add.text(x, y, message, { font: scoreFont, fill: '#39D179', stroke: '#FFFFFF', strokeThickness: 15 } );
		scoreAnimation.anchor.setTo(0.5, 0);
		scoreAnimation.align = 'center';
		
		var scoreTween = this.game.add.tween(scoreAnimation).to( { x: this.game.world.centerX, y: 50 }, 800, Phaser.Easing.Exponential.In, true);
		scoreTween.onComplete.add(function () {
			scoreAnimation.destroy();
			this.scoreLabelTween.start();
			this.scoreBuffer += score;
		}, this);
	}
	
};

game.state.add('main', GameStates.MainState);
game.state.start('main');