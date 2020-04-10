// ========================================================================
// .hello.sinclair 2020
// phaser 3 config
// djordje gavrilovic
// ========================================================================
import Phaser from 'phaser'
import PreloadScene from './PreloadScene'
import Level1 from './Level1'
import Level2 from './Level2'
import Level3 from './Level3'

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 1120, // 560 // 280
    height: 640, // 320 // 160
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [PreloadScene,Level1,Level2,Level3]
};

export { config }