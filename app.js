import Player from './utils/player.js';

const screenWidth = 1000;
const screenHeight = 800;

let config = {
  renderer: Phaser.AUTO,
  width: screenWidth,
  height: screenHeight,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: true
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

let game = new Phaser.Game(config);
let player;
let cursors;
let isGameStarted = false;
let background;

function preload() {
  this.load.image('city', 'assets/city.png');
  this.load.image('ground', 'assets/city/ground.png');
  this.load.image('street-h', 'assets/city/street-h.png');
  this.load.image('street-v', 'assets/city/street-v.png');

  this.load.image('biker-right', 'assets/biker/biker-right.png');
  this.load.image('biker-left', 'assets/biker/biker-left.png');
  this.load.image('biker-up', 'assets/biker/biker-up.png');
  this.load.image('biker-down', 'assets/biker/biker-down.png');

  this.load.image('store', 'assets/city/store.png');
}

function create() {
  background = this.add.tileSprite(0, 0, screenWidth, screenHeight, 'ground').setOrigin(0, 0);
  player = new Player(this, 50, 250, 'biker-right');
  
  const lojas = [
    { x: 0, y: 0, width: 1200, height: 50 },
    { x: 0, y: 350, width: 400, height: 150 },
    { x: 610, y: 150, width: 50, height: 50 },
    { x: 500, y: 150, width: 50, height: 50 },
    { x: 500, y: 150, width: 50, height: 50 }
  ];

  lojas.forEach(loja => {
    const hitbox = this.add.rectangle(loja.x, loja.y, loja.width, loja.height);
    this.physics.add.existing(hitbox, true);
    this.physics.add.collider(player, hitbox);
  });

  cursors = this.input.keyboard.createCursorKeys();
}

function update(delta) {
  if (cursors.space.isDown && !isGameStarted) {
    isGameStarted = true;
  }

  if (isGameStarted) {
    player.update(cursors, delta);
  }
}
