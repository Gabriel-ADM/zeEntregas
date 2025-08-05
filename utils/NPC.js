export default class NPC extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, direction = 'x', speed, sprite) {
    super(scene, x, y, `npc-down-${sprite}`);

    this.scene = scene;
    this.direction = direction;
    this.speed = speed;
    this.spriteName = sprite;
    this.currentDirection = 1;
    this.patrolArea = null; // This will store the NPC's boundaries

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(0.29);
    this.body.setSize(95, 95).setOffset(200, 200);

    this.body.setCollideWorldBounds(true);
    this.updateVelocity();
  }

  /**
   * Sets the rectangular patrol area for this NPC.
   * @param {Phaser.Geom.Rectangle} area The rectangle defining the patrol boundaries.
   */
  setPatrolArea(area) {
    this.patrolArea = area;
  }

  updateSprite() {
    if (this.direction === 'x') {
      this.setTexture(this.currentDirection === 1 ? `npc-right-${this.spriteName}` : `npc-left-${this.spriteName}`);
    } else {
      this.setTexture(this.currentDirection === 1 ? `npc-down-${this.spriteName}` : `npc-up-${this.spriteName}`);
    }
  }

  updateVelocity() {
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
    this.updateVelocity();
  }

  /**
   * The preUpdate method is called automatically by Phaser on every frame.
   * We use it here to check if the NPC has moved outside its patrol area.
   */
  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    // If a patrol area hasn't been set, do nothing.
    if (!this.patrolArea) {
      return;
    }

    const body = this.body;

    if (this.direction === 'x') {
      if (body.velocity.x > 0 && body.right > this.patrolArea.right) {
        this.reverseDirection();
      } else if (body.velocity.x < 0 && body.left < this.patrolArea.left) {
        this.reverseDirection();
      }
    } else {
      if (body.velocity.y > 0 && body.bottom > this.patrolArea.bottom) {
        this.reverseDirection();
      } else if (body.velocity.y < 0 && body.top < this.patrolArea.top) {
        this.reverseDirection();
      }
    }
  }
}