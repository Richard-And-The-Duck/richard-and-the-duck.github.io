var Menu = function() { };
Menu.prototype = {
	
	init: function() {
		this.titleText = game.make.text(game.world.centerX, 100, 'Game Title', style.header);
		this.titleText.anchor.setTo(0.5, 0.5);
	},
	
	preload: function() {
		this.optionCount = 1;
	},
	
	create: function() {
		game.stage.disableVisibilityChange = true;
		
		//background
		game.stage.backgroundColor = '#FFFFFF';
		
		game.add.existing(this.titleText);
		
		this.addMenuOption('Start', function() {
			console.log('You clicked start!');
		});
		this.addMenuOption('Options', function() {
			game.state.start('options');
		});
		this.addMenuOption('Credits', function() {
			console.log('You clicked credits!');
		});
	},
	
	addMenuOption: function(text, action) {
		var txt = game.add.text(game.world.centerX, (this.optionCount * 80) + 200, text, style.navItem.default);
		txt.inputEnabled = true;
		txt.events.onInputOver.add(function(target) {
			target.setStyle(style.navItem.hover);
		});
		txt.events.onInputOut.add(function(target) {
			target.setStyle(style.navItem.default);
		});
		txt.events.onInputUp.add(callback);
		this.optionCount++;
	}
	
};