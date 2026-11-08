let Phaser = window.Phaser;
import PreloaderScene from "./preloader-scene.js";

document.getElementById('minigameStartButton').onclick = function() {
    document.getElementById('gameContainer').className = 'gameContainer';
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

document.getElementById('gameContainer').onclick = function(e) {
    if (e.target === e.currentTarget) {
        document.getElementById('gameContainer').className = 'gameContainerInactive';
        window.gameInstance.destroy(true, false);
    }
}
