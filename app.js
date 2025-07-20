import Car from './utils/Car.js';
import Player from './utils/player.js';

const screenWidth = 1150;
const screenHeight = 650;

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
let background;
let player;
let cars = [];
let cursors;
let isGameStarted = false;

function preload() {
  this.load.image('city', 'assets/city.png');

  this.load.image('biker-right', 'assets/biker/biker-right.png');
  this.load.image('biker-left', 'assets/biker/biker-left.png');
  this.load.image('biker-up', 'assets/biker/biker-up.png');
  this.load.image('biker-down', 'assets/biker/biker-down.png');

  this.load.image('car-right', 'assets/car/car-right.png');
  this.load.image('car-left', 'assets/car/car-left.png');
  this.load.image('car-up', 'assets/car/car-up.png');
  this.load.image('car-down', 'assets/car/car-down.png');
}

function create() {
  background = this.add.image(0, 0, 'city').setOrigin(0, 0);
  background.setScale(0.6)
  player = new Player(this, 50, 250, 'biker-down');

  cars = [
    new Car(this, 100, 410, 'x', 70),
    new Car(this, 300, 60, 'x', 45),
    new Car(this, 750, 400, 'y', 70),
    new Car(this, 460, 310, 'y', 50),
    new Car(this, 1100, 100, 'y', 110),
  ]

  const mapBlocks = [
    { x: 0, y: 0, width: 1840, height: 80 },
    { x: 0, y: 400, width: 70, height: 650 },
    { x: 150, y: 237, width: 150, height: 320 },
    { x: 270, y: 340, width: 350, height: 110 },
    { x: 45, y: 650, width: 800, height: 430 },
    { x: 350, y: 165, width: 180, height: 170 },
    { x: 700, y: 105, width: 445, height: 55 },
    { x: 600, y: 230, width: 250, height: 110 },
    { x: 600, y: 385, width: 250, height: 120 },
    { x: 840, y: 200, width: 150, height: 170 },
    { x: 840, y: 385, width: 150, height: 120 },
    { x: 600, y: 565, width: 650, height: 160 },
    { x: 1080, y: 565, width: 250, height: 160 },
    { x: 1020, y: 260, width: 120, height: 370 },
    { x: 1020, y: 20, width: 120, height: 40 },
    { x: 1140, y: 260, width: 50, height: 500 },
    { x: 1140, y: 10, width: 150, height: 20 },
  ];

  mapBlocks.forEach(mapBlock => {
    const hitbox = this.add.rectangle(mapBlock.x, mapBlock.y, mapBlock.width, mapBlock.height);
    this.physics.add.existing(hitbox, true);
    this.physics.add.collider(player, hitbox);
    // Redireciona carros
    cars.forEach(car => {
      this.physics.add.collider(player, car);
      this.physics.add.collider(car, hitbox, () => {
        car.reverseDirection();
      });
    });
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

  cars.forEach(car => {
    car.update();
  });
}
