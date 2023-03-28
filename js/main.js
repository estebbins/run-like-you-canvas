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

//! Look into built-in gravity 


//////////////////////////////////Set Up///////////////////////////////////////
// Set HTML elements to variables
const game = document.getElementById('canvas')
const message = document.getElementById('message')
const score = document.getElementById('score')
const startButton = document.getElementById('start')

// Set game context to 2d
const ctx = game.getContext('2d')

// Set width & height of the game area based on the browser's size
game.setAttribute('width', getComputedStyle(game)['width'])
game.setAttribute('height', getComputedStyle(game)['height'])

// Set minimum game height
game.height = 400

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
        this.speedX = 0
        this.speedY = 0
        this.gravity = 0
        this.gravitySpeed = 0
        this.newPosition = function () {
            this.hitTop()
            this.gravitySpeed += this.gravity
            this.x += this.speedX
            this.y += this.speedY + this.gravitySpeed
            this.hitBottom()
        }
        this.hitTop = function () {
            let top = game.height/2
            if (this.y < top) {
                this.y = top
            }
            if (this.y === top) {
                document.removeEventListener('keydown', jumpEvent)
                document.removeEventListener('keyup', fallEvent)
                this.gravitySpeed = 0 
                this.fallDown()
            }
        }
        this.hitBottom = function () {
            let bottom = game.height - this.height - 60;
            if (this.y > bottom) {
                this.y = bottom
            }
            if (this.y === bottom) {
                this.gravity = 0
                this.gravitySpeed = 0
                document.addEventListener('keyup', fallEvent)
                document.addEventListener('keydown', jumpEvent)
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

const jumpEvent = (e) => {
    if(['w', 'W', 'ArrowUp'].includes(e.key)) {
        player.jumpUp()
    }
}

const fallEvent = (e) => {
    if(['w', 'W', 'ArrowUp'].includes(e.key)) {
        player.fallDown()
    }
}

////////////////////////////Game Instances////////////////////////////////////
// Player starts in lower left corner, but not against the edges
const player = new Player(45, game.height - 60, 30, 30, 'hotpink')
player.render()

////////////////////////////////Game Loop/////////////////////////////////////

const gameLoop = () => {
    // Each loop, add one to the player's frame
    ctx.clearRect(0, 0, game.width, game.height)
    player.frame += player.speed
    player.newPosition()
    player.render()
    console.log('gravity', player.gravity)
    console.log('speedX', player.speedX)
    console.log('speedY', player.speedY)
    console.log('speed', player.gravitySpeed)
}

///////////////////////////////Event Listeners////////////////////////////////
const activateListeners = () => {
    document.addEventListener('keydown', jumpEvent)
    document.addEventListener('keyup', fallEvent)
}


// ArrowUp, ArrowRight, ArrowLeft, ArrowDown

// Game Interval
let gameInterval

startButton.addEventListener('click', () => {
    gameInterval = setInterval(gameLoop, 60)
    activateListeners()
}, {once: true})
