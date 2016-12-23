var Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;
	var ready = false;

	this.preload = function() {
		this.load.spritesheet('player', 'img/player.png', 91, 110, 8);
		this.load.image('ground', 'img/ground.png');
		this.load.image('background', 'img/background.png');
		this.load.image('ground', 'img/ground.png');
		this.load.image('kiwi', 'img/kiwi.png');
		this.load.image('mask', 'img/mask.png');
		this.load.image('obstacle1', 'img/obstacle1.png');
		this.load.image('obstacle2', 'img/obstacle2.png');
		this.load.image('obstacle3', 'img/obstacle3.png');
		this.load.image('tree1', 'img/tree1.png');
		this.load.image('tree2', 'img/tree2.png');
		this.load.image('wifi', 'img/wifi.png');
		this.load.image('wifibg', 'img/wifibg.png');
		this.load.audio('music', 'audio/musicLoop.mp3');
		this.load.audio('crash', 'audio/Crash.mp3');
		this.load.audio('eat', 'audio/Eat.mp3');
		this.load.audio('jump', 'audio/Jump.mp3');
		//this.load.audio('pass', 'audio/PassObstacle.mp3');
		this.load.audio('shield', 'audio/Shield.mp3');
		//this.load.audio('steps', 'audio/Steps.mp3');
		this.load.audio('achievement', 'audio/Achievement.mp3');
		this.load.audio('eat', 'audio/Eat.mp3');
		this.load.bitmapFont('carrier_command', 'font/carrier_command.png', 'font/carrier_command.xml');
	};

	this.create = function() {

		// Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
		//this.preloadBar.cropEnabled = false;

		this.state.start('MainMenu');
	};

};