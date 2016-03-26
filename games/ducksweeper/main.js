var game = new Phaser.Game(640, 480, Phaser.AUTO, 'gameDiv');

var bootState = {
	
	preload: function() {
		game.stage.backgroundColor = '#212121';
	},
	
	create: function() {
		/*game.physics.startSystem(Phaser.Physics.ARCADE);*/
		
		game.state.start('load');
	}
	
};

var loadState = {
	
	preload: function() {
		game.stage.backgroundColor = '#212121';
		//load resources here
	},
	
	create: function() {
		game.state.start('main');
	},
	
};

var mainState = {
	
	preload: function() { },
	
	create: function() { },
	
	update: function() { }
	
}

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('main', mainState);
game.state.start('boot');