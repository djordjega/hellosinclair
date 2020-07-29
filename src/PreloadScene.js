// ========================================================================
// .hello.sinclair 2020
// scene - preload
// djordje gavrilovic
// ========================================================================

import { Scene } from 'phaser';

class PreloadScene extends Scene {

    constructor() {
        super('preload');
    }

    // ========================================================================
    // Preload
    // ========================================================================
    preload() {
    }

    // ========================================================================
    // Create
    // ========================================================================
    create() {
        const txt = this.add.text(400,300,'.hello.sinclair', { fontSize:'50px', fill:'#ff0000' });
        txt.setOrigin(0.5);
        // this.input.on('pointerdown', () => {
        //     this.scene.start('level3');
        // });
        
        const lvl1 = this.add.text(200,400, 'level1', { fontSize: '20px', fill: '#b60000'});
        lvl1.setInteractive();
        lvl1.on('pointerdown', () => { this.scene.start('level1') });
        const lvl2 = this.add.text(200,420, 'level2', { fontSize: '20px', fill: '#b60000'});
        lvl2.setInteractive();
        lvl2.on('pointerdown', () => { this.scene.start('level2') });
        const lvl3 = this.add.text(200,440, 'level3', { fontSize: '20px', fill: '#b60000'});
        lvl3.setInteractive();
        lvl3.on('pointerdown', () => { this.scene.start('level3') });

        const demo_txt = this.add.text(200,600,'platformer demo project', {fontSize: '12px', fill: '#ff0000'});

        const ivoli_link = this.add.text(600,600,'ivoli.net', {fontSize: '12px', fill: '#ff0000'});
        ivoli_link.setInteractive();
        ivoli_link.on('pointerdown', () => { window.location.href='http://ivoli.net' });

    }

    // ========================================================================
    // Update
    // ========================================================================
    //update() {}
}

export default PreloadScene