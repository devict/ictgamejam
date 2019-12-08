let Phaser = window.Phaser;
import PreloaderScene from "./preloader-scene.js";

window.onload = function() {
    var config = {
        type: Phaser.AUTO,
        width: 208*2,
        height: 124*2,
        pixelArt: true,
        zoom: 1,
        parent: 'gameContainer',
        scene: PreloaderScene,
        input: {
            gamepad: true,
        },
    };
    window.gameInstance = new Phaser.Game(config);
};
