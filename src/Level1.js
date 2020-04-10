// ========================================================================
// .hello.sinclair 2020
// scene - level 1
// djordje gavrilovic
// ========================================================================

import { Scene } from 'phaser';

class Level1 extends Scene {

    constructor() {
        super('level1');
    }

    // ========================================================================
    // Preload
    // ========================================================================
    preload() {
        this.climb = false;
        this.can_shoot = true;
        this.facing = 'right';

        this.load.audio('music', 'assets/music/BoxCat_Games_-_04_-_B-3.mp3');

        this.load.image('back', 'assets/images/background5.png');
        this.load.image('dark_platform', 'assets/images/dark_platform.png'); // https://opengameart.org/content/sci-fi-platform-tiles
        this.load.image('light_platform', 'assets/images/light_platform.png');
        this.load.image('light_platform_small', 'assets/images/light_platform_small.png');
        //this.load.image('enemy', 'assets/images/enemy.png')
        this.load.image('laser', 'assets/images/laser.png');

        this.load.spritesheet('player', // https://opengameart.org/content/platformer-animations
            'assets/images/player_sprites.png',
            { frameWidth: 64, frameHeight: 64 }
        );
        this.load.spritesheet('clone',
            'assets/images/player_sprites_dark.png',
            { frameWidth: 64, frameHeight: 64 }
        );
        this.load.spritesheet('portal',
            'assets/images/new_portal_sprite.png',
            { frameWidth: 64, frameHeight: 120 }
        );
        this.load.spritesheet('enemy1',
            'assets/images/enemy1a_sprite.png',
            { frameWidth: 30, frameHeight: 30 }
        );
        this.load.spritesheet('bullet',
            'assets/images/bullets.png',
            { frameWidth: 20, frameHeight: 20 }
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

        this.music = this.sound.add('music', { volume: 0.1 });
        this.music.play();

        this.createBackground();
        this.createPlatforms();
        this.createPortals();
        this.createPlayer();
        this.createCursor();
        this.createLasers(470, -400);
        this.createEnemies();
        this.createBullets();
        this.createTarget();
    }

    createBackground() {
        this.back = this.add.image(560, 320, 'back');
    }

    createPlatforms() {
        this.platforms = this.physics.add.staticGroup();

        this.platforms.create(200, 630, 'light_platform');  // --
        this.platforms.create(600, 630, 'light_platform');  // -- ground platforms
        this.platforms.create(1000, 630, 'light_platform'); // --

        this.platforms.create(200, 510, 'light_platform');
        this.platforms.create(690, 400, 'light_platform_small');
        this.platforms.create(600, 100, 'light_platform');
        this.platforms.create(790, 368, 'light_platform_small');
    }

    createPortals() {
        this.anims.create({
            key: 'portal',
            frames: this.anims.generateFrameNumbers('portal', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1
        });

        this.portals = this.physics.add.staticGroup();
        this.portals.create(300, 553, 'portal').play('portal', true).setSize(50, 50);
        this.portals.create(560, 440, 'portal').play('portal', true).setSize(20, 20);
    }

    createPlayer() {
        this.player = this.physics.add.sprite(100, 300, 'player');
        this.player.setBounce(0.2);
        this.player.body.setSize(35, 64);

        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.overlap(this.player, this.portals, () => { this.climb = true; });

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

    createCursor() {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    createLasers(laser_y, laser_vel) {
        this.lasers = this.physics.add.group();
        this.lasers.create(1150, laser_y, 'laser');
        this.lasers.create(1800, laser_y, 'laser');

        this.lasers.children.iterate((child) => {
            child.body.allowGravity = false;
            child.setVelocityX(laser_vel);
        });

        this.physics.add.overlap(this.player, this.lasers, this.death, null, this);
    }

    createEnemies() {
        this.anims.create({
            key: 'enemy',
            frames: this.anims.generateFrameNumbers('enemy1', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });

        this.enemies = this.physics.add.group();
        this.enemies.create(550, 550, 'enemy1').play('enemy', true).setVelocityX(-160);
        this.enemies.create(20, 580, 'enemy1').play('enemy', true).setVelocityX(-130);
        this.enemies.create(500, 300, 'enemy1').play('enemy', true).setVelocityX(-100);
        this.enemies.create(550, 70, 'enemy1').play('enemy', true).setVelocityX(160);

        this.enemies.children.iterate((child) => {
            child.body.allowGravity = false;
            child.setCollideWorldBounds(true);
            child.body.setBounce(1);
        });

        this.physics.add.overlap(this.player, this.enemies, this.death, null, this);
    }

    enemyDeath(bullet, enemy) {
        bullet.destroy();
        enemy.destroy();
        this.can_shoot = true;
    }

    createBullets() {
        this.anims.create({
            key: 'bullet',
            frames: this.anims.generateFrameNumbers('bullet', { start: 0, end: 4 }),
            frameRate: 10,
            repeat: -1
        });

        this.bullets = this.physics.add.group();
        this.physics.add.collider(this.bullets, this.enemies, this.enemyDeath, null, this);
    }

    shoot() {
        this.bullet = this.bullets.create(this.player.x, this.player.y, 'bullet');
        this.bullet.body.allowGravity = false;

        if (this.facing == 'right') {
            this.bullet.setVelocityX(300);
        } else {
            this.bullet.setVelocityX(-300);
        }

        this.bullet.play('bullet', true);
        this.bullet.setCollideWorldBounds(true);
        this.bullet.body.onWorldBounds = true;

        this.physics.world.on('worldbounds', () => {
            this.bullets.clear(true);
            this.can_shoot = true;
        });
    }

    createTarget() {
        this.anims.create({
            key: 'target_blink',
            frames: this.anims.generateFrameNumbers('target', { start: 0, end: 1 }),
            frameRate: 2,
            repeat: -1
        });

        this.target = this.physics.add.sprite(1110, 420, 'target').play('target_blink');
        this.target.body.allowGravity = false;

        this.physics.add.collider(this.target, this.bullets, this.targetHit, null, this);
    }

    targetHit() {
        this.portals.create(850, 290, 'portal').play('portal', true).setSize(50, 50);
        this.portals.create(850, 230, 'portal').play('portal', true).setSize(50, 50);
        this.portals.create(850, 170, 'portal').play('portal', true).setSize(50, 50);
        this.platforms.create(200, 300, 'light_platform_small').setScale(0.5, 1).refreshBody();
        this.createClone();
    }

    createClone() {
        this.anims.create({
            key: 'clone_move',
            frames: this.anims.generateFrameNumbers('player', { start: 24, end: 31 }),
            frameRate: 2,
            repeat: -1
        });

        this.clone = this.physics.add.sprite(60, 220, 'clone').setScale(0.8).play('clone_move');
        this.clone.body.allowGravity = false;

        this.physics.add.collider(this.clone, this.player, () => {
            this.music.stop();
            this.scene.start('level2');
        }, null, this);
    }

    death(player, something) {
        this.physics.pause();
        this.input.keyboard.enabled = false;
        player.anims.play('death');

        this.time.delayedCall(3000, () => {
            this.music.stop();
            this.scene.start('preload');
        }, null, this);
    }

    // ========================================================================
    // Update
    // ========================================================================
    update() {

        //console.log(this.player.body.velocity.x);

        if (this.player.y == 352) {
            this.createLasers(350, -340);
        }

        // if (this.player.body.velocity.y != 0 && !this.player.body.touching.down) {
        //     this.player.anims.play('fall', true);
        // }

        this.input.keyboard.on('keyup', () => { // idle
            this.player.setVelocity(0);
            this.player.anims.play('idle');
        }, this);

        // if (this.player.body.velocity.x == 0 && this.player.body.velocity.y == 0 ) {
        //     this.player.anims.play('idle');
        // }


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

        if (this.cursors.down.isDown) { // down
            this.player.setVelocity(0);
            this.player.anims.play('down');
        }

        if (this.climb && this.cursors.up.isDown) { // portal jump
            this.player.setPosition(this.player.x, this.player.y - 30);
            this.climb = false;
        }

        if (this.cursors.space.isDown && this.can_shoot) { // shooting
            this.player.anims.play('shoot');
            this.shoot();
            this.can_shoot = false;
        }
    }

}

export default Level1