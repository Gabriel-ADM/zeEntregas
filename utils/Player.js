export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);

    // Adiciona o jogador na cena com física
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(0.2);
    this.setCollideWorldBounds(true);
    this.body.setSize(100, 150).setOffset(250, 100);
    this.currentFrame = 0;
    this.animationTimer = 0;
  }

  update(cursors) {
    let velocityX = 0;
    let velocityY = 0;
    const speedX = 100;
    const speedY = 75;

    if (cursors.up.isDown) {
    velocityY = -speedY;
    this.setTexture('biker-up');
    this.body.setSize(100, 130).setOffset(250, 100);
  } else if (cursors.down.isDown) {
    velocityY = speedY;
    this.setTexture('biker-down');
    this.body.setSize(100, 130).setOffset(250, 100);
  } else if (cursors.left.isDown) {
    velocityX = -speedX;
    this.setTexture('biker-left');
    this.body.setSize(180, 80).setOffset(200, 200);
  } else if (cursors.right.isDown) {
    velocityX = speedX;
    this.setTexture('biker-right');
    this.body.setSize(180, 80).setOffset(200, 200);
  }
    
    this.setVelocity(velocityX, velocityY);
  }


  reset(x, y) {
    this.setPosition(x, y);
    this.setVelocity(0, 0);
    this.setTexture('biker-down');
  }
}
