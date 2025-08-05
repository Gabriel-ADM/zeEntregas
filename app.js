import Car from './utils/Car.js';
import NPC from './utils/NPC.js';
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
let npcs = [];
let cursors;
let isGameStarted = false;
// Game rules
let deliveryAreas = [];
let bagGroups = [];
let collectedBag = false;

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

  for (let index = 1; index <= 3; index++) {
    this.load.image(`npc-up-${index}`, `assets/npc/npc-up-${index}.png`);
    this.load.image(`npc-down-${index}`, `assets/npc/npc-down-${index}.png`);
    this.load.image(`npc-left-${index}`, `assets/npc/npc-left-${index}.png`);
    this.load.image(`npc-right-${index}`, `assets/npc/npc-right-${index}.png`);
  }
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
  npcs = [
    new NPC(this, 90, 200, 'y', 70, 1),
    new NPC(this, 650, 430, 'x', 40, 2),
    new NPC(this, 260, 370, 'x', 20, 3),
    new NPC(this, 620, 80, 'x', 60, 2),
    new NPC(this, 1140, 340, 'y', 50, 3),
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
    { x: 1140, y: 260, width: 50, height: 470 },
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

  const graphics = this.add.graphics();
  graphics.fillStyle(0x00ff00, 0.3);

  const patrolAreas = [
    { x: 80, y: 70, width: 50, height: 230 },
    { x: 500, y: 420, width: 200, height: 20 },
    { x: 230, y: 350, width: 200, height: 40 },
    { x: 490, y: 80, width: 420, height: 30 },
    { x: 1120, y: 20, width: 30, height: 470 },
  ]

  npcs.forEach((npc, index) => {
    const patrolBlockData = patrolAreas[index];

    // Create a Phaser Rectangle geometry object from the block's data
    const patrolArea = new Phaser.Geom.Rectangle(
      patrolBlockData.x,
      patrolBlockData.y,
      patrolBlockData.width,
      patrolBlockData.height,
    );
    graphics.fillRectShape(patrolArea);

    npc.setPatrolArea(patrolArea);
  });

  const deliveryPoints = [
    { x: 300, y: 180, width: 80, height: 60 },
    { x: 765, y: 380, width: 70, height: 50 },
  ]

  const PaperBagsCount1 = Math.floor(Math.random() * (6 - 4 + 1)) + 4;
  const PaperBagsCount2 = 10 - PaperBagsCount1;
  const PaperBagsCounts = [PaperBagsCount1, PaperBagsCount2];

  // The forEach loop gives us the point AND its index (0 for the first, 1 for the second)
  deliveryPoints.forEach((deliveryPoint, index) => {
    const { x, y, width, height } = deliveryPoint;
    deliveryAreas.push(new Phaser.Geom.Rectangle(x, y, width, height));

    // Get the number of bags for THIS specific point using the index
    const countForThisPoint = PaperBagsCounts[index];

    const paperBags = this.add.group();

    // Now, loop only the required number of times for this point
    for (let i = 0; i < countForThisPoint; i++) {
      const bagX = Phaser.Math.Between(x, x + width);
      const bagY = Phaser.Math.Between(y, y + height);

      const bag = this.add.image(bagX, bagY, 'paper-bag')
        .setScale(0.05)
        .setAlpha(0.8)
        .setDepth(5);

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
    bagGroups.push(paperBags);

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

  this.add.text(screenWidth / 2, 15, 'Aperte ESPAÇO para coletar/entregar', {
    font: '20px Arial',
    fill: '#ffffff',
    backgroundColor: 'rgba(0,0,0,1)',
    padding: { x: 10, y: 5 }
  }).setOrigin(0.5);

  cursors = this.input.keyboard.createCursorKeys();
}

function update(delta) {
  isGameStarted = true;

  if (isGameStarted) {
    player.update(cursors, delta);
  }

  cars.forEach(car => car.update());
  npcs.forEach(npc => npc.update());

  if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
    // Check each delivery area
    deliveryAreas.forEach((area, index) => {
      // Find the closest point on the rectangle's edge to the player
      const closestX = Math.max(area.left, Math.min(player.x, area.right));
      const closestY = Math.max(area.top, Math.min(player.y, area.bottom));

      // Calculate the distance from the player to that point
      const distanceToArea = Phaser.Math.Distance.Between(player.x, player.y, closestX, closestY);
      if (distanceToArea < 25 && collectedBag == true) {
        const warningMessage = this.add.text(player.x, player.y - 50, 'Antes de Realizar Outra Entrega \nFinalize a que Está em Andamento', {
          font: '14px Arial',
          fill: '#000000ff',
          backgroundColor: 'rgba(255, 23, 23, 1)',
          padding: { x: 8, y: 4 }
        }).setOrigin(0.5).setDepth(100);; // Center the text on the player's x-axis

        // Set a timer to destroy the message after 2 seconds (2000 milliseconds)
        this.time.delayedCall(3000, () => {
          warningMessage.destroy();
        });
      }
      // 1. PROXIMITY CHECK: Is the player within 50 pixels of the area
      if (distanceToArea < 25 && collectedBag != true) {
        const targetGroup = bagGroups[index];
        const bagsInArea = targetGroup.getChildren();

        // If there are no bags left, do nothing
        if (bagsInArea.length === 0) return;

        let closestBag = null;
        let minDistanceToBag = Infinity;

        // 2. FIND CLOSEST BAG: Find the closest bag
        for (const bag of bagsInArea) {
          const distance = Phaser.Math.Distance.Between(player.x, player.y, bag.x, bag.y);
          if (distance < minDistanceToBag) {
            minDistanceToBag = distance;
            closestBag = bag;
          }
        }

        // 3. COLLECT: If we found a bag, destroy it.
        if (closestBag) {
          closestBag.destroy();
          collectedBag = true;
        }
      }
    });
  }
}
