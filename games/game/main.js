var game = new Phaser.Game(640, 480, Phaser.AUTO, 'gameDiv');

GameStates = {};

GameStates.MainState = function () { };
GameStates.MainState.prototype = {
	
	preload: function () {
		
	},
	
	create: function () {
		
	},
	
	update: function () {
		
	}
	
};

game.state.add('main', GameStates.MainState);
game.state.start('main');