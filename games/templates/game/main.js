var gameProperties = {
	screenWidth: 640,
	screenHeight: 480
}

var game = new Phaser.Game(gameProperties.screenWidth, gameProperties.screenHeight, Phaser.AUTO, 'gameDiv');

var Main = function() { };
Main.prototype = {
	
	preload: function() {
		game.load.script('utils', 'res/scripts/utils.js');
		game.load.script('splash', 'res/scripts/splash.js');
		
		game.load.image('logo', 'res/images/logo.png');
		game.load.image('loadingBar', 'res/images/loadingBar.png');
		//load splash screen background image
	},
	
	create: function() {
		game.state.add('splash', Splash);
		game.state.start('splash');
	}
	
};

game.state.add('main', Main);
game.state.start('main');