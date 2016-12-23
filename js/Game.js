var Game = function (game) {
	//  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

	var add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
	var camera;    //  a reference to the game camera (Phaser.Camera)
	var cache;     //  the game cache (Phaser.Cache)
	var input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
	var load;      //  for preloading assets (Phaser.Loader)
	var math;      //  lots of useful common math operations (Phaser.Math)
	var sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
	var stage;     //  the game stage (Phaser.Stage)
	var time;      //  the clock (Phaser.Time)
	var tweens;    //  the tween manager (Phaser.TweenManager)
	var state;     //  the state manager (Phaser.StateManager)
	var world;     //  the game world (Phaser.World)
	var particles; //  the particle manager (Phaser.Particles)
	var physics;   //  the physics manager (Phaser.Physics)
	var rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)

	var world;
	var player;
	var cursors;
	var speed = 1.5;
	var jumpCount = 0;
	var hasLiftedMouse = true;
	var bg1;
	var bg2;
	var bg3;
	var ground1;
	var ground2;
	var ground3;
	var ground4;
	var canJump;
	var groundBody;
	var groundBody2;
	var groundBody3;
	var music;
	var crash;
	var jump;
	var eat;
	var achievement;
	var obstacles = [];
	var kiwis = [];
	var level = 1;
	var objectGroup;
	var kiwiGroup;
	var dead = false;
	var wifi;
	var mask;
	var score;
	var bonus = 0;

	this.create = function () {
		world = game.add.group();
		groundGroup = game.add.group();
		music = game.add.audio('music');
		crash = game.add.audio('crash');
		jump = game.add.audio('jump');
		eat = game.add.audio('eat');
		achievement = game.add.audio('achievement');
		music.play();
		music.loopFull();

		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.physics.arcade.gravity.y = 400;

		bg1 = game.make.sprite(0, 0, 'background');
		world.add(bg1);
		var ratio = game.height / bg1.height;
		bg1.height = game.height;
		bg1.width *= ratio;
		bg2 = game.make.sprite(bg1.width, 0, 'background');
		world.add(bg2);
		bg2.height = game.height;
		bg2.width *= ratio;
		bg3 = game.make.sprite(bg1.width * 2, 0, 'background');
		world.add(bg3);
		bg3.height = game.height;
		bg3.width *= ratio;

		groundBody = game.add.sprite(0, 330, 'ground');
		groundBody.height = 90;
		groundBody.width = game.width + 400;
		groundBody.visible = false;
		game.physics.enable(groundBody, Phaser.Physics.ARCADE);
		groundBody.body.immovable = true;
		groundBody.body.moves = false;

		groundBody2 = game.add.sprite(0, 330, 'ground');
		groundBody2.height = 90;
		groundBody2.width = game.width + 400;
		groundBody2.visible = false;
		game.physics.enable(groundBody2, Phaser.Physics.ARCADE);
		groundBody2.body.immovable = true;
		groundBody2.body.moves = false;

		groundBody3 = game.add.sprite(0, 330, 'ground');
		groundBody3.height = 90;
		groundBody3.width = game.width + 400;
		groundBody3.visible = false;
		game.physics.enable(groundBody3, Phaser.Physics.ARCADE);
		groundBody3.body.immovable = true;
		groundBody3.body.moves = false;

		ground1 = game.add.sprite(0, 330, 'ground');
		var tree1 = game.make.sprite(167, -350, 'tree1');
		ground1.addChild(tree1);
		ground2 = game.add.sprite(594, 330, 'ground');
		var tree2 = game.make.sprite(330, -270, 'tree2');
		ground2.addChild(tree2);
		ground3 = game.add.sprite(594 * 2, 330, 'ground');
		ground4 = game.add.sprite(594 * 3, 330, 'ground');

		objectGroup = game.add.group();
		kiwiGroup = game.add.group();

		game.add.sprite(game.width - 80, 10, 'wifibg');
		wifi = game.add.sprite(game.width - 80, 10, 'wifi');
		mask = game.add.graphics(0, 0);
    	mask.beginFill(0xffffff);
		mask = mask.drawRect(game.width - 80, 10, 70, 50);
		wifi.mask = mask;
		mask.y += 48

		player = game.add.sprite(150, 100, 'player');
		game.physics.enable(player, Phaser.Physics.ARCADE);
		player.body.setSize(55, 75, 22, 34);
		player.body.bounce.y = 0.2;
		player.body.gravity.y = 900;
    	player.body.maxVelocity.y = 500;

		player.animations.add('run', [0, 1, 2, 3], 10, true);
		player.animations.add('jump', [4, 5, 6], 10, false);
		player.animations.add('death', [7], 10, false);
		cursors = game.input.keyboard.createCursorKeys();

		var objectTimer = game.time.events.loop(1000, function() {
			objectTimer.delay = this.difficultly() * 1000;
			this.randomObstacle();
		}, this);


		game.time.events.loop(15000, function() {
			if (!dead) {
				this.level++;
				achievement.play();
				mask.y -= 2;
			}
		}, this);

		game.time.events.loop(1000, function() {
			this.makeKiwi();
		}, this);

		game.time.events.loop(30000, function() {
			this.speed += 0.5;
		}, this);

		var objectTimer2 = game.time.events.loop(3000, function() {
			objectTimer2.delay = this.difficultly() * 1500;

			var probability = 10 - level;
			if (this.rnd.integerInRange(1, probability) == 1) {
				if (level > 3) {
					this.randomObstacle();
				}
			}
		}, this);

		score = game.add.bitmapText(15, 15, 'carrier_command','1',34);
	};

	this.update = function () {
		player.body.velocity.x = 0;
		canJump = false;
		if (!dead) {
			game.physics.arcade.collide(player, groundBody, function() {
				jumpCount = 0;
				canJump = true;
				player.animations.play('run');
			});
		}

		if (!dead) {
			game.physics.arcade.collide(player, objectGroup, function() {
				crash.play();
				dead = true;
				game.add.tween(player).to( { angle: 360 }, 1000, Phaser.Easing.Linear.None, true, 0, 1000, true);
				player.body.velocity.y -= 600;
				player.animations.play('death');
				ID.GameAPI.Leaderboards.save({ table: 'Distance Leaderboard', points: Math.abs(Math.floor(world.x)) + bonus }, function(data) {
					ID.GameAPI.Leaderboards.list({ table: 'Distance Leaderboard' })
				});
			});
		}

		game.physics.arcade.collide(groundBody3, kiwiGroup);
		if (!dead) {
			game.physics.arcade.collide(player, kiwiGroup, function(sprite, sprite2) {
				sprite2.visible = false;
				sprite2.x -= 100;
				bonus += 100;
				eat.play();
			});
		}

		game.physics.arcade.collide(groundBody2, objectGroup);

		var worldThird = this.world.width / 3;
		
		var space = Phaser.Keyboard.SPACEBAR;
		if (game.input.activePointer.isDown) {
			this.tryJump();
		}

		if (game.input.activePointer.isUp) {
			hasLiftedMouse = true;
		}

		if (!dead) {
			world.x -= speed;
			ground1.x -= speed * 3;
			ground2.x -= speed * 3;
			ground3.x -= speed * 3;
			ground4.x -= speed * 3;
		}

		if (bg1.world.x < bg1.width * -1) {
			bg1.x += bg1.width * 3;
		}

		if (bg2.world.x < bg2.width * -1) {
			bg2.x += bg2.width * 3;
		}

		if (bg3.world.x < bg3.width * -1) {
			bg3.x += bg3.width * 3;
		}

		if (ground1.world.x < ground1.width * -1) {
			ground1.x += ground1.width * 4;
		}

		if (ground2.world.x < ground2.width * -1) {
			ground2.x += ground2.width * 4;
		}

		if (ground3.world.x < ground3.width * -1) {
			ground3.x += ground3.width * 4;
		}

		if (ground4.world.x < ground4.width * -1) {
			ground4.x += ground4.width * 4;
		}

		for (var i = 0; i < obstacles.length; i++) {
			obstacles[i].x -= speed * 3;
			if (obstacles[i].x < -200) {
				obstacles[i].destroy();
				obstacles.splice(i, 1 );
			}
		}

		for (var i = 0; i < kiwis.length; i++) {
			kiwis[i].x -= speed * 3;
			if (kiwis[i].x < -200) {
				kiwis[i].destroy();
				kiwis.splice(i, 1 );
			}
		}

		score.setText(Math.abs(Math.floor(world.x)) + bonus);
	};

	this.difficultly = function() {
		return 3 / Math.sqrt(level);
	};

	this.randomObstacle = function() {
		if (dead) {
			return;
		}
		var rand = this.rnd.integerInRange(1, 3);
		if (rand == 3 && level < 2) {
			rand = 2;
		}
		var spacing = this.rnd.integerInRange(1, 4) * 50;
		var obstacle = game.make.sprite(game.width - 200 + spacing, 260, 'obstacle' + rand);
		game.physics.enable(obstacle, Phaser.Physics.ARCADE);
		obstacle.body.bounce.y = 0;
		objectGroup.add(obstacle);
		obstacles.push(obstacle);
	};

	this.makeKiwi = function() {
		if (dead) {
			return;
		}

		var kiwi = game.make.sprite(game.width - 200, 260, 'kiwi');
		game.physics.enable(kiwi, Phaser.Physics.ARCADE);
		kiwi.body.bounce.y = 0;
		kiwiGroup.add(kiwi);
		kiwis.push(kiwi);
	};

	this.tryJump = function() {
		if (!hasLiftedMouse) {
			return;
		}

		if (canJump || jumpCount < 2 && hasLiftedMouse) {
			this.jump();
			jumpCount++;
		}

		hasLiftedMouse = false;
	}

	this.jump = function() {
		player.body.velocity.y -= 600;
		jump.play();
		player.animations.play('jump');
	};

	this.quitGame = function (pointer) {
		this.state.start('MainMenu');
	};

	this.render = function() {
		//game.debug.body(player);
		//game.debug.body(groundBody);
	}

};