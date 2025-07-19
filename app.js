import Player from './utils/player.js';

let config = {
  renderer: Phaser.AUTO,
  width: 840,
  height: 500,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
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
let hasLanded = false;
let cursors;
let hasBumped = false;
let isGameStarted = false;
let messageToPlayer;
let animationTimer = 0;
let currentFrame = 0;
let faseAtual = 1;
let background;

function preload() {
  this.load.image('city', 'assets/city.png');
  this.load.image('biker-right', 'assets/biker/biker-right.png'); 
  this.load.image('biker-left', 'assets/biker/biker-left.png'); 
  this.load.image('biker-up', 'assets/biker/biker-up.png'); 
  this.load.image('biker-down', 'assets/biker/biker-down.png'); 
  this.load.image('back2', 'assets/back2.png'); //TESTE para mapTwo (em produção)
  this.load.image('back3', 'assets/back2.png'); //TESTE para mapThree (em produção)
}

function create() {
  background = this.add.image(20, 0, 'city').setOrigin(0, 0);
  background.setDisplaySize(840, 480);
  player = new Player(this, 50, 250, 'biker-right');

  cursors = this.input.keyboard.createCursorKeys();
}

function update(time, delta) {
  player.body.setAllowGravity(false);
  if (cursors.space.isDown && !isGameStarted) {
    isGameStarted = true;
    // messageToPlayer.text = 'Aperte a tecla ↑ para mover Zé para cima.';
  }

  if (isGameStarted && !hasLanded && !hasBumped) {
    player.update(cursors, delta, faseAtual);
  } else {
    player.setVelocity(0, 0);
    player.setTexture('biker-down');
  }

  if (faseAtual === 1 && player.x > 800 && !hasBumped) {
    faseDois(this);
  }
  if (faseAtual === 2 && player.x > 800 && !hasBumped) {
    faseTres(this);
  }

}

function faseDois(scene) {
  faseAtual = 2;
  background.setTexture('biker-right');
  background.setDisplaySize(840, 480);
  hasLanded = false;
  hasBumped = false;
  isGameStarted = true;
  player.setPosition(0, 250);
  player.setTexture('biker-right');

  //messageToPlayer.text = 'Fase 2: Continue entregando!';
  //Phaser.Display.Align.In.BottomCenter(messageToPlayer, background, 150, 300);
}

function faseTres(scene) {
  faseAtual = 3;
  background.setTexture('back3');
  background.setDisplaySize(840, 480);
  hasLanded = false;
  hasBumped = false;
  isGameStarted = true;
  player.setPosition(0, 250);
  //run1.setVelocity(0, 0);
  player.setTexture('biker-right');

  //messageToPlayer.text = 'Fase 3: Parabéns! Você chegou até a última fase. Mantenha o foco!';
  //Phaser.Display.Align.In.BottomCenter(messageToPlayer, background, 150, 300);
}
