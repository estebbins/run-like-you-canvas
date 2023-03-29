// A simple square (player) runs and tries to jump over obstacles (other squares)
// That are coming at the player from the right side of the screen. 
// The player can speed up (d or right arrow) or slow down using (a or left arrow)
// The player can jump (w or up arrow)
// When the player speeds up, the speed at which the obstacles come at the player increases
// When the player slows down, the speed at which the obstacles come at the player decreases
// Version 1 will have 3 speeds (slow, medium(start speed), fast)
// The player will have 3 lives. The player will lose a life each time they hit an obstacle
// After the 3rd life is lost, the next one, the game ends
// The score will be based off of the distance the player "ran" and the speed at which they ran the course (higher score if same distance but achieved faster)

//! This branch is the initial version of the game as preferred by Noah


//////////////////////////////////Set Up///////////////////////////////////////
// Set HTML elements to variables
const game = document.getElementById('canvas')
const message = document.getElementById('message')
const score = document.getElementById('score')
const startButton = document.getElementById('start')
const upButton = document.getElementById('up')
const downButton = document.getElementById('down')
const jumpButton = document.getElementById('jump')
// Set game context to 2d
const ctx = game.getContext('2d')

// Set width & height of the game area based on the browser's size
game.setAttribute('width', getComputedStyle(game)['width'])
game.setAttribute('height', getComputedStyle(game)['height'])

// Set minimum game height
game.height = 400

// Initialize interval count and obstacle array
let intervalCount = 0 
const obstacles = []

//////////////////////////Component Classes////////////////////////////////////

// Create a player class to manage the speed and render the square
class Player {
    constructor (x, y, width, height, color) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
        this.alive = true
        // Since player is stationary at X, they wll hold the frame attribute
        this.frame = 0
        // speed will start at medium and increase or decrease - MOVE THIS TO THE OBSTACLES CLASS
        this.speed = 2
        this.render = function () {
            ctx.fillStyle = this.color
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
        // Gravity/Jumping attributes
        // https://www.w3schools.com/graphics/tryit.asp?filename=trygame_gravity_game
        this.gravity = 0
        this.gravitySpeed = 0
        this.newPosition = function () {
            this.hitTop()
            this.gravitySpeed += this.gravity
            this.y += this.gravitySpeed
            this.hitBottom()
        }
        this.hitTop = function () {
            let top = game.height/2 - 30
            if (this.y < top) {
                this.y = top
            }
            if (this.y === top) {
                document.removeEventListener('keydown', jumpEvent)
                document.removeEventListener('keyup', fallEvent)
                document.removeEventListener('touchstart', jumpEvent)
                document.removeEventListener('touchend', fallEvent)
                this.gravitySpeed = 0
                this.fallDown()
            }
        }
        this.hitBottom = function () {
            let bottom = game.height - 60;
            if (this.y > bottom) {
                this.y = bottom
            }
            if (this.y === bottom) {
                this.gravity = 0
                this.gravitySpeed = 0
                document.addEventListener('keyup', fallEvent)
                document.addEventListener('keydown', jumpEvent)
                document.addEventListener('touchstart', jumpEvent)
                document.addEventListener('touchend', fallEvent)
            }
        }
        this.jumpUp = function () {
            this.gravity = -0.2
        }
        this.fallDown = function () {
            this.gravity = 0.1
        }
    }
}

class Obstacle {
    constructor (x, y, width, height, color) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
        this.active = true
        this.render = function () {
            ctx.fillStyle = this.color
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
        this.newPosition = function (speed) {
            this.x -= speed
            if (this.x <= -30){
                this.active = false
            }
        }
    }
}

const jumpEvent = (e) => {
    console.log(e, 'e')
    if(['w', 'W', 'ArrowUp'].includes(e.key) || e.target.id === "jump") {
        player.jumpUp()
    }
}

const fallEvent = (e) => {
    if(['w', 'W', 'ArrowUp'].includes(e.key) || e.target.id === "jump") {
        player.fallDown()
    }
}

// Detect collistion
const detectHit = (thing) => {
    if (player.x < thing.x + thing.width
        && player.x + player.width > thing.x
        && player.y < thing.y + thing.height
        && player.y + player.height > thing.y) {
            thing.active = false
            message.textContent = "Hit!!"
    }
}

////////////////////////////Game Instances////////////////////////////////////
// Player starts in lower left corner, but not against the edges
const player = new Player(45, game.height - 60, 30, 30, 'hotpink')
player.render()

////////////////////////////////Game Loop/////////////////////////////////////

const gameLoop = () => {
    // Clear the game area
    ctx.clearRect(0, 0, game.width, game.height)
    // Each loop, add to the player's frames based on their speed
    player.frame += player.speed
    // Count each interval, and about every 20 intervals or so, spawn a new obstacle
    intervalCount += 1

    if (intervalCount % 40 === 0 || intervalCount === 1) {
        // Max Height and width is 50px and min is 10px
        obstacleHeight = Math.floor(Math.random()*(50 - 10 + 1) + 10)
        obstacleWidth = Math.floor(Math.random()*(50 - 10 + 1) + 10)
        obstacleY = Math.floor(Math.random()*((game.height - 60) - (game.height/2) + 1)) + (game.height/2)
        obstacles.push(new Obstacle(game.width, obstacleY, obstacleWidth, obstacleHeight, 'red'))
    }
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].newPosition(player.speed)
        obstacles[i].active ? obstacles[i].render() : null
        detectHit(obstacles[i])
    }
    player.newPosition()
    player.render()
    // console.log('gravity', player.gravity)
    // console.log('speed', player.gravitySpeed)
    // console.log('ACTUAL SPEED', player.speed)
}

///////////////////////////////Event Listeners////////////////////////////////
const activateListeners = () => {
    // Jump and fall events for keyboard
    document.addEventListener('keydown', jumpEvent)
    document.addEventListener('keyup', fallEvent)
    // Jump and fall events for mobile
    document.addEventListener('touchstart', jumpEvent)
    document.addEventListener('touchend', fallEvent)
    // Keydown event for speed increase & decrease
    document.addEventListener('keydown', (e) => {
        // don't allow speed to increase upon hold
        if (e.repeat) { return }
        else {
            if (['a', 'A', 'ArrowLeft'].includes(e.key) & player.speed > 1) {
                // Reduce Speed
                player.speed -= 1
            }
            if (['d', 'D', 'ArrowRight'].includes(e.key) & player.speed < 3) {
                // Increase Speed
                player.speed += 1
            }
        }
    })
    // Touch event for speed increase & decrease
    document.addEventListener('touch', (e) => {
        if (e.target.id === 'up' && player.speed < 3) {player.speed += 1}
        if (e.target.id === 'down' && player.speed > 1) {player.speed -= 1}
    })
}


// Game Interval
let gameInterval

startButton.addEventListener('click', () => {
    gameInterval = setInterval(gameLoop, 50)
    activateListeners()
}, {once: true})
