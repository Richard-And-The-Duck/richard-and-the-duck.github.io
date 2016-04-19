var Splash = function() { };
Splash.prototype = {
	
	init: function() {
		this.loadingBar = game.make.sprite(game.world.centerX, game.world.centerY + (gameProperties.screenHeight / 2), 'loadingBar');
		this.logo = game.make.sprite(game.world.centerX, game.world.centerY, 'logo');
		this.status = game.make.text(game.world.centerX, gameProperties.screenHeight / 4, 'LOADING...', { fill: '#FFF' });
		utils.centerGameObjects([this.logo, this.loadingBar, this.status]);
	},
	
	preload: function() {
		//background
		
		game.add.existing(this.logo);
		game.add.existing(this.loadingBar);
		game.add.existing(this.status);
		this.load.setPreloadSprite(this.loadingBar);
		
		//load ALL OTHER resources
	}
	
};