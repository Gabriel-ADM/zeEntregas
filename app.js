let config = {
  renderer: Phaser.AUTO,
  width: 840,
  height: 480,
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 300 },
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
let run1;
let hasLanded = false;
let cursors;
let hasBumped = false;
let isGameStarted = false;
let messageToPlayer;
let animationTimer = 0;
let currentFrame = 0;
let frameNames = ['run1', 'run2'];
let faseAtual = 1;
let background;

function preload () {
  this.load.image('background', 'assets/mapOne Style Game Map.png');
  this.load.image('back2', 'assets/back2.png'); //TESTE para mapTwo (em produção)
  this.load.image('back3', 'assets/back2.png'); //TESTE para mapThree (em produção)
  this.load.image('run1', 'assets/run1.png');
  this.load.image('run2', 'assets/run2.png');
}

function create () {
  background = this.add.image(0, 0, 'background').setOrigin(0, 0);
  background.setDisplaySize(840, 480);
  run1 = this.physics.add.sprite(50, 250, 'run1').setScale(0.025);
  run1.setCollideWorldBounds(true);
  cursors = this.input.keyboard.createCursorKeys();
}

function update (time, delta) {
  run1.body.setAllowGravity(false);
  if (cursors.space.isDown && !isGameStarted) {
    isGameStarted = true;
    //messageToPlayer.text = 'Aperte a tecla ↑ para mover Zé para cima.';
  }
  if (!isGameStarted) {
    run1.setVelocityY(0);
  }
  if (cursors.up.isDown && !hasLanded && !hasBumped) {
    if(faseAtual === 1){
      run1.setVelocityY(-50); 
    }else if(faseAtual === 2){
      run1.setVelocityY(-150); 
    }else{
      run1.setVelocityY(-200); 
    }
  }
  if (cursors.down.isDown && !hasLanded && !hasBumped){
    if(faseAtual === 1){
      run1.setVelocityY(50);
    }else if(faseAtual === 2){
      run1.setVelocityY(150);
    }else{
      run1.setVelocityY(200);
    }
  }
  if (isGameStarted && (!hasLanded && !hasBumped)) {
    if(faseAtual === 1){
      run1.body.velocity.x = 30;
    }else if(faseAtual === 2){
      run1.body.velocity.x = 60;
    }else{
      run1.body.velocity.x = 90;
    }
    animationTimer += delta;
    if (animationTimer > 150) {
      currentFrame = (currentFrame + 1) % frameNames.length;
      run1.setTexture(frameNames[currentFrame]);
      animationTimer = 0;
    }
  } else {
    run1.body.velocity.x = 0;
    run1.setTexture('run1');
  }
  if (hasLanded || hasBumped) {
    //messageToPlayer.text = 'Zé entregador bateu!';
  }
  if (faseAtual === 1 && run1.x > 800 && !hasBumped) {
    faseDois(this);
  }
  if (faseAtual === 2 && run1.x > 800 && !hasBumped){
    faseTres(this);
  }
  
}

function faseDois(scene) {
  faseAtual = 2;
  background.setTexture('back2');
  background.setDisplaySize(840, 480);
  hasLanded = false;
  hasBumped = false;
  isGameStarted = true;
  run1.setPosition(0, 250);
  run1.setTexture('run1');

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
  run1.setPosition(0, 250);
  //run1.setVelocity(0, 0);
  run1.setTexture('run1');

  //messageToPlayer.text = 'Fase 3: Parabéns! Você chegou até a última fase. Mantenha o foco!';
  //Phaser.Display.Align.In.BottomCenter(messageToPlayer, background, 150, 300);
}
