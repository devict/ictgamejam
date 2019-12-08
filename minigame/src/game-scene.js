import Phaser from "./phaser-module.js";
import constants from "./constants.js";


export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create(data) {
        this.sceneWidth = 208;
        this.sceneHeight = 124;
        this.cameras.main.setBackgroundColor('#FFFFFF');
        this.cameras.main.centerOn(this.sceneWidth/2, this.sceneHeight/2);
        this.cameras.main.zoom = 2;

        if (!this.data.has('mapId')) {
            this.data.set('mapId', 1);
        }

        if (!this.registry.has('muted')) {
            this.registry.set('muted', false);
        }
        this.sound.mute = this.registry.get('muted');

        this.gamePause = true;
        this.started = false;

        this.ground = this.add.sprite(this.sceneWidth, 0, 'ground');
        this.ground.setOrigin(0, 0);

        this.gameTime = 0;

        this.player = this.add.sprite(20, 40, 'player');
        this.player.y = this.getPlayerY();
        this.player.setDepth(9);

        this.player.alpha = 0.07;

        this.playerFall = false;
        this.playerYV = 0;

        this.currentlyFalling = false;

        this.scrollSpeed = 1.45
        this.totalScrolled = 0;
        this.holesMade = 0;
        this.scrollables = [];
        this.addHole();
        this.nextHole = this.sceneWidth;
        this.holeSpacingFactor = 140;

        this.nextScenery = this.sceneWidth;
        this.sceneryMinSpacing = this.sceneWidth/2;
        this.scenerySpacing = this.sceneWidth * 7;
        this.sceneryY = 33;

        this.scenerySelector = [1, 1, 1, 1, 1, 2, 2, 2, 3];

        this.input.once('pointerdown', () => this.start());
        
        this.input.keyboard.on('keydown_R', () => this.scene.restart());
    }

    start() {
        this.player.alpha = 1;
        this.gamePause = false;
        this.started = true;
    }

    addHole() {
        let holeX = 52 + this.sceneWidth;
        let h = this.add.sprite(holeX, this.sceneHeight, 'hole');
        h.setOrigin(0.5, 1);
        h.setDepth(3);
        h.type = 'hole';
        this.scrollables.push(h);

        let hg = this.add.sprite(holeX, this.sceneHeight, 'hole-ground');
        hg.setOrigin(0.5, 1);
        hg.setDepth(5);
        this.scrollables.push(hg);

        this.holesMade += 1;
    }

    addScenery() {
        console.log('scnarfe');
        let scenery = this.add.sprite(this.sceneWidth + 18, this.sceneHeight - this.sceneryY, 'scenery');
        scenery.setDepth(1);
        let scnFr = this.scenerySelector[Math.floor(Math.random() * this.scenerySelector.length)];
        scenery.setFrame(scnFr);
        if (scnFr == 1) {
            scenery.scrollFactor = 0.3;
        } else {
            scenery.scrollFactor = 0.9;
        }
        this.scrollables.push(scenery);
    }

    gameOver() {
        this.gamePause = true;

        let score = Math.round(this.totalScrolled);
        score += this.holesMade * 20;

        let tx = this.add.bitmapText(this.sceneWidth/2, this.sceneHeight/2 - 24, 'basic-font', score);
        tx.setLetterSpacing(1);
        tx.setOrigin(0.5, 0.5);
        //this.add.text(this.sceneWidth/2, this.sceneHeight/2 - 10, 'Game Over', {color: '#000000'});

        this.input.once('pointerdown', () => this.scene.restart());
    }

    makePlayerFall(velocity) {
        this.playerFall = true;
        this.playerYV = velocity;

        this.player.setDepth(4);
    }

    getPlayerY() {
        let groundY = 110;
        let maxHeight = 22;

        let stickFactor = 14;
        let slowFactor = 260;

        let groundStick = groundY + stickFactor;

        return Math.min(groundY, groundStick - Math.abs(Math.sin(this.gameTime/slowFactor) * (groundStick - maxHeight)));
    }

    isInHole() {
        var inHole = false;
        var px = this.player.x;
        this.scrollables.forEach(function (spr) {
            if (spr.type !== 'hole') {
                return;
            }
            let xDiff = Math.abs(spr.x - px);
            if (xDiff < 17) {
                inHole = true;
            }
        });

        return inHole;
    }

    update(time, delta) {
        if (this.gamePause) {
            return;
        }

        this.gameTime += delta;

        let groundY = 110;

        let oldY = this.player.y;
        if (!this.playerFall) {
            this.player.y = this.getPlayerY();
        } else {
            this.player.y += this.playerYV;
        }

        if (this.playerFall && this.player.y > this.sceneHeight + 50) {
            this.gameOver();
        }

        if (oldY < this.player.y) {
            this.currentlyFalling = true;
        } else {
            this.currentlyFalling = false;
        }

        this.player.frame = 0;
        if (groundY - this.player.y < 20) {
            if (groundY - this.player.y < 5 && this.currentlyFalling && this.isInHole()) {
                this.player.setFrame(0);
                this.makePlayerFall(this.player.y - oldY);
            } else {
                this.player.setFrame(1);
            }
        } else {
            this.player.setFrame(0);
        }

        if (!this.playerFall && !this.input.activePointer.isDown) {
            this.totalScrolled += this.scrollSpeed;

            if (this.totalScrolled > this.nextHole) {
                this.addHole();
                this.nextHole += 50;
                this.nextHole += Math.random() * this.holeSpacingFactor;
            }

            if (this.totalScrolled > this.nextScenery) {
                this.addScenery();
                this.nextScenery += this.sceneryMinSpacing;
                this.nextScenery += Math.random() * (this.scenerySpacing - this.sceneryMinSpacing);
            }

            if (this.ground.x > 0) {
                this.ground.x -= this.scrollSpeed;
            } else if (this.ground.x < 0) {
                this.ground.x = 0;
            }

            let cull = false;

            this.scrollables.forEach(function (spr) {
                let scroll = this.scrollSpeed
                if (spr.hasOwnProperty('scrollFactor')) {
                    scroll *= spr.scrollFactor;
                }
                spr.x -= scroll;
                if (spr.x < -50) {
                    cull = true;
                    spr.cullMe = true;
                    spr.destroy();
                }
            }, this);

            if (cull) {
                this.scrollables = this.scrollables.filter(spr => !spr.hasOwnProperty('cullMe'));
            }
        }
    }

}
