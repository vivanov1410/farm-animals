;(function (Phaser) {
  var GameState = {
    preload: function () {
      this.load.image('background', 'assets/images/background.png')
      this.load.image('arrow', 'assets/images/arrow.png')

      this.load.spritesheet('chicken', 'assets/images/chicken-spritesheet.png', 131, 200, 3)
      this.load.spritesheet('horse', 'assets/images/horse-spritesheet.png', 212, 200, 3)
      this.load.spritesheet('pig', 'assets/images/pig-spritesheet.png', 297, 200, 3)
      this.load.spritesheet('sheep', 'assets/images/sheep-spritesheet.png', 244, 200, 3)

      this.load.audio('chicken-sound', ['assets/audio/chicken.ogg', 'assets/audio/chicken.mp3'])
      this.load.audio('horse-sound', ['assets/audio/horse.ogg', 'assets/audio/horse.mp3'])
      this.load.audio('pig-sound', ['assets/audio/pig.ogg', 'assets/audio/pig.mp3'])
      this.load.audio('sheep-sound', ['assets/audio/sheep.ogg', 'assets/audio/sheep.mp3'])
    },

    create: function () {
      this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL

      // center game
      this.scale.pageAlignHorizontally = true
      this.scale.pageAlignVertically = true

      this.background = this.game.add.sprite(0, 0, 'background')

      // group of animals
      var animalsData = [
        { key: 'chicken', text: 'CHICKEN', audio: 'chicken-sound' },
        { key: 'horse', text: 'HORSE', audio: 'horse-sound' },
        { key: 'pig', text: 'PIG', audio: 'pig-sound' },
        { key: 'sheep', text: 'SHEEP', audio: 'sheep-sound' }
      ]

      this.animals = this.game.add.group()

      var animal
      for (var i = 0; i < animalsData.length; i++) {
        animal = this.animals.create(-9999, this.game.world.centerY, animalsData[i].key, 0)

        animal.params = {
          text: animalsData[i].text,
          sound: this.game.add.audio(animalsData[i].audio)
        }
        animal.anchor.setTo(0.5)

        // create animal animation
        animal.animations.add('animate', [0, 1, 2, 1, 0, 1, 0], 3, false)

        animal.inputEnabled = true
        animal.input.pixelPerfect = true
        animal.events.onInputDown.add(this.animateAnimal, this)
      }

      this.currentAnimal = this.animals.next()
      this.currentAnimal.position.set(this.game.world.centerX, this.game.world.centerY)
      this.showText(this.currentAnimal)

      // left arrow
      this.leftArrow = this.game.add.sprite(60, this.game.world.centerY, 'arrow')
      this.leftArrow.anchor.setTo(0.5)
      this.leftArrow.scale.x = -1
      this.leftArrow.params = { direction: 'left' }

      this.leftArrow.inputEnabled = true
      this.leftArrow.input.pixelPerfect = true
      this.leftArrow .events.onInputDown.add(this.switchAnimal, this)

      // right arrow
      this.rightArrow = this.game.add.sprite(580, this.game.world.centerY, 'arrow')
      this.rightArrow.anchor.setTo(0.5)
      this.rightArrow.params = { direction: 'right' }

      this.rightArrow.inputEnabled = true
      this.rightArrow.input.pixelPerfect = true
      this.rightArrow .events.onInputDown.add(this.switchAnimal, this)
    },

    update: function () {},

    switchAnimal: function (sprite, event) {
      if (this.isMoving) {
        return false
      }

      this.isMoving = true
      this.animalText.visible = false

      var newAnimal, endX

      if (sprite.params.direction === 'left') {
        newAnimal = this.animals.previous()
        newAnimal.x = -newAnimal.width / 2
        endX = 640 + this.currentAnimal.width / 2
      } else {
        newAnimal = this.animals.next()
        newAnimal.x = 640 + newAnimal.width / 2
        endX = -this.currentAnimal.width / 2
      }

      var newAnimalMovement = this.game.add.tween(newAnimal)
      newAnimalMovement.to({ x: this.game.world.centerX }, 1000)
      newAnimalMovement.onComplete.add(function () {
        this.isMoving = false
        this.showText(newAnimal)
      }, this)
      newAnimalMovement.start()

      var currentAnimalMovement = this.game.add.tween(this.currentAnimal)
      currentAnimalMovement.to({ x: endX }, 1000)
      currentAnimalMovement.start()

      this.currentAnimal = newAnimal
    },

    animateAnimal: function (sprite, event) {
      sprite.play('animate')
      sprite.params.sound.play()
    },

    showText: function (animal) {
      if (!this.animalText) {
        var style = {
          font: 'bold 30pt Arial',
          fill: '#d0171b',
          align: 'center'
        }
        this.animalText = this.game.add.text(this.game.width / 2, this.game.height * 0.85, '', style)
        this.animalText.anchor.setTo(0.5)
      }

      this.animalText.setText(animal.params.text)
      this.animalText.visible = true
    }
  }

  // initialize Phaser framework
  var game = new Phaser.Game(640, 360, Phaser.AUTO)

  game.state.add('GameState', GameState)
  game.state.start('GameState')
})(window.Phaser)
