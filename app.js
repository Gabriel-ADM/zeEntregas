import Car from './utils/Car.js';
import Player from './utils/Player.js';

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

  this.load.image('paper-bag', 'assets/paper-bag.png');
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

  const deliveryPoints = [
    { x: 300, y: 180, width: 80, height: 60 },
    { x: 765, y: 380, width: 70, height: 50 },
  ]


  const PaperBagsCount1 = Math.floor(Math.random() * (6 - 4 + 1)) + 3;
  const PaperBagsCount2 = 10 - PaperBagsCount1;
  const PaperBagsCounts = [];
  PaperBagsCounts.push(PaperBagsCount1, PaperBagsCount2);


  deliveryPoints.forEach(deliveryPoint => {
    const { x, y, width, height } = deliveryPoint;

    const paperBagArea = (deliveryPoint.width * deliveryPoint.height) / 2;
    // Group to hold all bags
    const paperBags = this.add.group();

    for (let i = 0; i < PaperBagsCounts[1]; i++) {
      const bagX = Phaser.Math.Between(x, x + width);
      const bagY = Phaser.Math.Between(y, y + height);

      const bag = this.add.image(bagX, bagY, 'paper-bag')
        .setScale(0.05)
        .setAlpha(0.8)
        .setDepth(5); // anything higher than background or hitbox graphics

      paperBags.add(bag);

      this.tweens.add({
        targets: bag,
        y: bagY - 10,
        x: bagX - 5,
        duration: Phaser.Math.Between(1000, 2000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: Phaser.Math.Between(0, 500)
      });
    }


    // Desenha a área visível (posição: canto superior esquerdo)
    const graphics = this.add.graphics();
    graphics.fillStyle(0x00ff00, 0.3); // verde com opacidade
    graphics.fillRect(x, y, width, height); // aqui continua igual

    // Calcula centro para a hitbox (posição centralizada)
    const centerX = x + width / 2;
    const centerY = y + height / 2;

    const hitbox = this.add.rectangle(centerX, centerY, width, height);
    this.physics.add.existing(hitbox, true);
    this.physics.add.collider(player, hitbox);

    cars.forEach(car => {
      this.physics.add.collider(car, hitbox, () => {
        car.reverseDirection();
      });
    });
  });


  cursors = this.input.keyboard.createCursorKeys();
}



cursors = this.input.keyboard.createCursorKeys();


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
