// ========================================================================
// .hello.sinclair 2020
// scene - level 3
// djordje gavrilovic
// ========================================================================

import { Scene } from 'phaser';

class Level3 extends Scene {

    constructor() {
        super('level3');
    }

    // ========================================================================
    // Preload
    // ========================================================================
    preload() {
        this.climb = false;
        this.can_shoot = true;
        this.facing = 'right';
        this.cp_x = 100; // 100 - 1800
        this.cp_y = 100; // 100 
        this.checkpoint = false;

        this.load.image('back3', 'assets/images/lvl3_big_back.png');
        this.load.image('platform_b', 'assets/images/dark_platform.png'); // https://opengameart.org/content/sci-fi-platform-tiles
        //this.load.image('platform_s', 'assets/images/dark_platform_small.png');
        this.load.image('laser', 'assets/images/laser.png');

        this.load.atlas('drops', 'assets/images/flares.png', 'assets/images/flares.json');

        this.load.spritesheet('player', // https://opengameart.org/content/platformer-animations
            'assets/images/player_sprites.png',
            { frameWidth: 64, frameHeight: 64 }
        );
    }

    // ========================================================================
    // Create
    // ========================================================================
    create() {
        this.input.keyboard.enabled = true;


        this.createBackground();
        this.createPlatforms();
        this.createPlayer();
        this.createCamera();
        this.createCursor();
        this.createRain();
    }

    createRain() {
        var rain = this.add.particles('drops');

        rain.createEmitter({
            frame: 'blue',
            x: {min: 0, max: 2240},
            y: 0,
            lifespan: 760,
            speedY: 800,
            scaleY: .5,
            scaleX: .01,
            quantity: 40,
            blendMode: 'ADD'
        });
    }

    createCursor() {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    createCamera() {
        this.camera = this.cameras.main;
        this.camera.startFollow(this.player);
    
        this.camera.setBounds(0, 0, 2240, 640);
        this.physics.world.setBounds(0, 0, 2240, 640);
    }

    createBackground() {
        this.back = this.add.image(1120, 320, 'back3');
    }

    createPlatforms() {
        this.platforms = this.physics.add.staticGroup();

        // screen 1 platforms
        this.platforms.create(200, 630, 'platform_b');  // --
        this.platforms.create(600, 630, 'platform_b');  // -- ground platforms
        this.platforms.create(1000, 630, 'platform_b'); // --

        this.platforms.create(200,200, 'platform_b');
    
        // screen 2 platforms
        this.platforms.create(1400, 630, 'platform_b');  // --
        this.platforms.create(1800, 630, 'platform_b');  // -- ground platforms
        this.platforms.create(2200, 630, 'platform_b');  // --

        //this.platforms.create(2100, 500, 'platform_s');
        //this.platforms.create(1800, 500, 'platform_s');

        //this.platforms.create(1400, 300, 'platform_b');
    }

    createPlayer() {
        this.player = this.physics.add.sprite(this.cp_x, this.cp_y, 'player');
        this.player.setBounce(0.2);
        this.player.body.setSize(35, 64);

        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, this.platforms);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { start: 4, end: 11 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            frames: [{ key: 'player', frame: 64 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { start: 4, end: 11 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'air',
            frames: this.anims.generateFrameNumbers('player', { start: 42, end: 47 }),
            frameRate: 5,
            repeat: 1
        });

        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('player', { start: 40, end: 42 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'fall',
            frames: this.anims.generateFrameNumbers('player', { start: 45, end: 47 }),
            frameRate: 5,
            repeat: 1
        });

        this.anims.create({
            key: 'shoot',
            frames: this.anims.generateFrameNumbers('player', { start: 12, end: 15 }),
            frameRate: 10,
            repeat: 1
        });

        this.anims.create({
            key: 'death',
            frames: this.anims.generateFrameNumbers('player', { start: 16, end: 23 }),
            frameRate: 10,
            repeat: 0
        });
    }

    // ========================================================================
    // Update
    // ========================================================================
    update() {

        this.input.keyboard.on('keyup', () => { // idle
            this.player.setVelocity(0);
            this.player.anims.play('idle');
        }, this);

        if (this.cursors.left.isDown && this.player.body.touching.down) { // left - on ground
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
            this.player.setFlipX(true);
            this.facing = 'left';
        }

        if (this.cursors.right.isDown && this.player.body.touching.down) { // right - on ground
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
            this.player.setFlip(false);
            this.facing = 'right';
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) { // up - from ground
            this.player.setVelocityY(-165);
            this.player.anims.play('air');
        }

        if (this.cursors.down.isDown && this.player.body.touching.down) { // down
            this.player.setVelocity(0);
            this.player.anims.play('down');
        }

        if (this.climb && this.cursors.up.isDown) { // portal jump
            this.player.setPosition(this.player.x, this.player.y - 40);
            this.climb = false;
        }

        // if (this.cursors.space.isDown && this.can_shoot) { // shooting
        //     this.player.anims.play('shoot');
        //     this.shoot();
        //     this.can_shoot = false;
        // }
    }

}

export default Level3