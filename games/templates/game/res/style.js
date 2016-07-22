var style = {
	
	navItem: {
		
		base: {
			
		},
		
		default: {
			fill: '#FFF',
			stroke: 'rgba(0, 0, 0, 0)',
			font: '30pt Arial',
			align: 'left',
			strokeThickness: 4
		},
		
		hover: {
			fill: '#999',
			stroke: 'rgba(200, 200, 200, 0.5)'
		}
	}
	
};

var style;
(function() {
	
	var defaultColor = '#FFF',
		highlightColor = '#999';
	
	style = {
		
		header: {
			font: 'bold 60pt Arial',
			fill: '#000',
			align: 'center'
		},
		
		navItem: {
			
			base: {
				font: '30pt Arial',
				align: 'left',
				strokeThickness: 4
			},
			
			default: {
				fill: defaultColor,
				stroke: 'rgba(0, 0, 0, 0)'
			},
			
			hover: {
				fill: highlightColor,
				stroke: 'rgba(200, 200, 200, 0.5)'
			}
			
		}
		
	};
	
	Object.assign(style.navItem.default, style.navItem.base);
	Object.assign(style.navItem.hover, style.navItem.base);
	
})();