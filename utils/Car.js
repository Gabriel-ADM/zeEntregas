export default class Car extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, direction = 'x', speed) {
    super(scene, x, y, 'car-right');

    this.scene = scene;
    this.direction = direction;
    this.speed = speed;
    this.currentDirection = 1; // 1 = frente, -1 = trás

    scene.add.existing(this);
    scene.physics.add.existing(this);
    // this.setBounce(1); // Torna mudança de direcao mais suave
    
    // Atualiza sprite inicial
    this.updateSprite();
}

updateSprite() {
    if (this.direction === 'x') {
        this.setTexture(this.currentDirection === 1 ? 'car-right' : 'car-left');
        this.body.setSize(90, 20);
    } else {
        this.setTexture(this.currentDirection === 1 ? 'car-down' : 'car-up');
        this.body.setSize(20, 90);
    }
  }

  update() {
    if (this.direction === 'x') {
      this.setVelocityX(this.speed * this.currentDirection);
      this.setVelocityY(0);
    } else {
      this.setVelocityY(this.speed * this.currentDirection);
      this.setVelocityX(0);
    }
  }

  reverseDirection() {
    this.currentDirection *= -1;
    this.updateSprite();
  }
}
