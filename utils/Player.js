export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);

    // Adiciona o jogador na cena com física
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(0.2);
    this.setCollideWorldBounds(true);

    this.currentFrame = 0;
    this.animationTimer = 0;
  }

  update(cursors, delta, faseAtual) {
    let speedX = 0;
    let speedY = 0;

    // Define velocidade baseada na fase
    if (faseAtual === 1) {
      speedX = 100;
      speedY = 75;
    } else if (faseAtual === 2) {
      speedX = 150;
      speedY = 100;
    } else {
      speedX = 200;
      speedY = 150;
    }

    this.setVelocity(0, 0);

    // Movimento vertical
    if (cursors.up.isDown) {
      this.setVelocityY(-speedY);
      this.setTexture('biker-up')
    } else if (cursors.down.isDown) {
      this.setTexture('biker-down')
      this.setVelocityY(speedY);
    }
    // Movimento horizontal
    if (cursors.left.isDown) {
      this.setVelocityX(-speedX);
      this.setTexture('biker-left')
    } else if (cursors.right.isDown) {
      this.setTexture('biker-right')
      this.setVelocityX(speedX);
    }

  }

  reset(x, y) {
    this.setPosition(x, y);
    this.setVelocity(0, 0);
    this.setTexture('biker-down');
  }
}
