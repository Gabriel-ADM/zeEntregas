export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);

    // Adiciona o jogador na cena com física
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(0.2);
    this.setCollideWorldBounds(true);
    this.body.setSize(250, 80).setOffset(200, 200);
    this.currentFrame = 0;
    this.animationTimer = 0;
  }

  update(cursors) {
    let velocityX = 0;
    let velocityY = 0;
    const speedX = 100;
    const speedY = 75;

    let direction = null;

    if (cursors.up.isDown) {
      velocityY = -speedY;
      direction = 'up';
    } else if (cursors.down.isDown) {
      velocityY = speedY;
      direction = 'down';
    }
    if (cursors.left.isDown) {
      velocityX = -speedX;
      direction = direction || 'left';
    } else if (cursors.right.isDown) {
      velocityX = speedX;
      direction = direction || 'right';
    }

    // Normalizacao de velocidade diagonal
    if (velocityX !== 0 && velocityY !== 0) {
      const norm = Math.SQRT1_2;
      velocityX *= norm;
      velocityY *= norm;
    }

    this.setVelocity(velocityX, velocityY);

    // Textura e hitbox
    if (direction === 'up') {
      this.setTexture('biker-up');
      this.body.setSize(100, 150).setOffset(250, 100);
    } else if (direction === 'down') {
      this.setTexture('biker-down');
      this.body.setSize(100, 150).setOffset(250, 100);
    } else if (direction === 'left') {
      this.setTexture('biker-left');
      this.body.setSize(250, 80).setOffset(200, 200);
    } else if (direction === 'right') {
      this.setTexture('biker-right');
      this.body.setSize(250, 80).setOffset(200, 200);
    }
  }


  reset(x, y) {
    this.setPosition(x, y);
    this.setVelocity(0, 0);
    this.setTexture('biker-down');
  }
}
