// ========================================================================
// .hello.sinclair 2020
// scene - level 2
// djordje gavrilovic
// ========================================================================

import { Scene } from 'phaser';

class Level2 extends Scene {

    constructor() {
        super('level2');
    }

    // ========================================================================
    // Preload
    // ========================================================================
    preload() {
        this.climb = false;
        this.can_shoot = true;
        this.facing = 'right';
        this.cp_x = 100; // 100 - 1800
        this.cp_y = 300; // 300 
        this.checkpoint = false;

        this.load.audio('music2', 'assets/music/BoxCat_Games_-_19_-_Mission.mp3');

        this.load.image('back2', 'assets/images/lvl2_big_back.png');
        this.load.image('platform_b', 'assets/images/light_platform.png'); // https://opengameart.org/content/sci-fi-platform-tiles
        this.load.image('platform_s', 'assets/images/light_platform_small.png');
        this.load.image('laser', 'assets/images/laser.png');

        this.load.spritesheet('player', // https://opengameart.org/content/platformer-animations
            'assets/images/player_sprites.png',
            { frameWidth: 64, frameHeight: 64 }
        );
        this.load.spritesheet('enemy',
            'assets/images/enemy1a_sprite.png',
            { frameWidth: 30, frameHeight: 30 }
        );
        this.load.spritesheet('portal',
            'assets/images/new_portal_sprite.png',
            { frameWidth: 64, frameHeight: 120 }
        );
        this.load.spritesheet('target',
            'assets/images/target.png',
            { frameWidth: 20, frameHeight: 40 }
        );
    }

    // ========================================================================
    // Create
    // ========================================================================
    create() {
        this.input.keyboard.enabled = true;

        this.music = this.sound.add('music2', { volume: 0.2 });
        this.music.play();

        this.createBackground();
        this.createPlatforms();
        this.createPlayer();
        this.createCursor();
        this.createCamera();
        this.createEnemy();
        this.createPortals();
        this.createTarget();
        this.createLasers(2240, 150, "X", -180);
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
        this.back = this.add.image(1120, 320, 'back2');
    }

    createPlatforms() {
        this.platforms = this.physics.add.staticGroup();

        // screen 1 platforms
        this.platforms.create(200, 630, 'platform_b');  // --
        this.platforms.create(600, 630, 'platform_b');  // -- ground platforms
        this.platforms.create(1000, 630, 'platform_b'); // --
    
        // screen 2 platforms
        this.platforms.create(1400, 630, 'platform_b');  // --
        this.platforms.create(1800, 630, 'platform_b');  // -- ground platforms
        this.platforms.create(2200, 630, 'platform_b');  // --

        this.platforms.create(2100, 500, 'platform_s');
        this.platforms.create(1800, 500, 'platform_s');

        this.platforms.create(1400, 300, 'platform_b');
    }

    createPortals() {
        this.anims.create({
            key: 'portal',
            frames: this.anims.generateFrameNumbers('portal', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1
        });

        this.portalz = this.physics.add.staticGroup();
        this.portalz.create(2200, 555, 'portal').play('portal', true).setSize(50, 50);
        this.portalz.create(1200, 200, 'portal').play('portal', true).setSize(50, 50);
        this.physics.add.overlap(this.player, this.portalz, () => { this.climb = true; });
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

    createEnemy() {
        this.anims.create({
            key: 'enemy',
            frames: this.anims.generateFrameNumbers('enemy', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });

        this.enemies = this.physics.add.group();
        // ground enemies
        this.enemies.create(700, 600, 'enemy').play('enemy', true).setVelocityX(-160);
        this.enemies.create(600, 600, 'enemy').play('enemy', true).setVelocityX(-130);
        this.enemies.create(1000, 600, 'enemy').play('enemy', true).setVelocityX(140);
        this.enemies.create(1300, 600, 'enemy').play('enemy', true).setVelocityX(-100);
        this.enemies.create(1600, 600, 'enemy').play('enemy', true).setVelocityX(140);
        // vertical enemies
        this.enemies.create(500, 70, 'enemy').play('enemy', true).setVelocityY(200);
        this.enemies.create(900, 500, 'enemy').play('enemy', true).setVelocityY(250);
        this.enemies.create(1200, 300, 'enemy').play('enemy', true).setVelocityY(-100);
        this.enemies.create(1200, 300, 'enemy').play('enemy', true).setVelocityY(100);
        this.enemies.create(1700, 250, 'enemy').play('enemy', true).setVelocityY(250);
        this.enemies.create(2000, 250, 'enemy').play('enemy', true).setVelocityY(230);

        this.enemies.children.iterate((child) => {
            child.body.allowGravity = false;
            child.setCollideWorldBounds(true);
            child.body.setBounce(1);
        });

        this.physics.add.overlap(this.player, this.enemies, this.death, null, this);
    }

    createLasers(laser_x, laser_y, laser_dir, laser_vel) {
        this.lasers = this.physics.add.group();
        this.lasers.create(laser_x, laser_y, 'laser');

        this.lasers.children.iterate((child) => {
            child.body.allowGravity = false;
            if (laser_dir == "Y") {
                child.setVelocityY(laser_vel);
            } else {
                child.setVelocityX(laser_vel);
            }
            child.setCollideWorldBounds(true);
            child.body.setBounce(1);
        });

        this.physics.add.overlap(this.player, this.lasers, this.death, null, this);
    }

    createTarget() {
        this.anims.create({
            key: 'target_blink',
            frames: this.anims.generateFrameNumbers('target', { start: 0, end: 1 }),
            frameRate: 2,
            repeat: -1
        });

        this.target = this.physics.add.sprite(1550, 420, 'target').play('target_blink');
        this.target.setFlipX(true);
        this.target.body.allowGravity = false;

        this.physics.add.collider(this.target, this.player, this.targetHit, null, this);
    }

    targetHit() {
        this.target.destroy();

        this.platforms.create(1560, 520, 'platform_s');
        this.platforms.create(800, 520, 'platform_s');
        this.platforms.create(700, 500, 'platform_s');
        this.platforms.create(600, 480, 'platform_s');
        this.platforms.create(500, 460, 'platform_s');
        this.platforms.create(200, 460, 'platform_s');
        this.platforms.create(200, 200, 'platform_s');
        this.platforms.create(500, 200, 'platform_s');
        this.platforms.create(800, 200, 'platform_s');


        this.createLasers(1505, 660, "Y", -260);
        this.createLasers(1605, 660, "Y" , -260);

        this.portalz.create(1800, 430, 'portal').play('portal', true).setSize(50, 50);
        this.portalz.create(1800, 330, 'portal').play('portal', true).setSize(50, 50);
        this.portalz.create(1800, 230, 'portal').play('portal', true).setSize(50, 50);
        this.portalz.create(100, 400, 'portal').play('portal', true).setSize(50, 50);
        this.portalz.create(100, 300, 'portal').play('portal', true).setSize(50, 50);
        this.portalz.create(100, 200, 'portal').play('portal', true).setSize(50, 50);

        this.createClone();

        this.checkpoint = true;
    }

    createClone() {
        this.anims.create({
            key: 'clone_move',
            frames: this.anims.generateFrameNumbers('player', { start: 24, end: 31 }),
            frameRate: 2,
            repeat: -1
        });

        this.clone = this.physics.add.sprite(800, 100, 'clone').setScale(0.8).play('clone_move');
        this.clone.body.allowGravity = false;

        this.physics.add.collider(this.clone, this.player, () => {
            this.music.stop();
            this.scene.start('level3');
        }, null, this);
    }

    death(player, something) {
        player.setVelocity(0);
        //this.input.keyboard.enabled = false;  // TODO ISSUE - keyboard / physics madness
        player.anims.play('death');
        this.physics.pause();

        this.time.delayedCall(3000, () => {
            if (!this.checkpoint) {
                this.music.stop();
                this.scene.start('level2');
            } else { // checkpoint
                this.physics.resume();
                player.setPosition(1550,300);
                player.setVelocity(0);
                //this.input.keyboard.enabled = true;
                player.anims.play('idle');
            }   
        }, null, this);
        
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

export default Level2