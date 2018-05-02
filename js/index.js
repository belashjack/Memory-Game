class Game {
    constructor() {
        this.playerInfo = {};
        this.stopTime = 0;
        this.numberOfCards = 0;
        this.backSide = '';
        this.cards = [];
        this.flippedCardsAmount = 0;
        this.frontSides = [];
        this.timeouts = [];
    }
    getPlayerInfo() {
        this.playerInfo.firstName = form.elements['firstName'].value;
        this.playerInfo.lastName = form.elements['lastName'].value;
        this.playerInfo.email = form.elements['email'].value;
    }
    getNumberOfCards() {
        this.numberOfCards = Number(difficultiesContainer.querySelector('.active-difficulty').dataset.amount);
    }
    getBackSide() {
        this.backSide = getComputedStyle(patternContainer.querySelector('.active-pattern')).backgroundImage;
    }
    getFrontSides() {
        this.frontSides = frontSides.slice(0, this.numberOfCards / 2).concat(frontSides.slice(0, this.numberOfCards / 2));
    }
    createCards() {
        // auxiliary function to get random background image of the front side
        const getRandomFrontSide = function getRandomFrontSide(frontSides, numberOfCards) {
            let index = getRandomInt(0, frontSides.length - 1);
            const frontSide = frontSides[index];
            frontSides.splice(index, 1);
            return frontSide;
        }

        // auxiliary function to get random integer in range
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        for (let i = 0; i < this.numberOfCards; i++) {
            const card = new Card(i, this.backSide, getRandomFrontSide(this.frontSides, this.numberOfCards));
            this.cards.push(card.getDOMElem());
        }
    }
    addCards() {
        this.cards.forEach((card) => {
            field.appendChild(card);
        });
    }
    addGameListeners() {
        field.addEventListener('click', Card.turnCard);
    }
    getFlippedCards() {
        return [...field.querySelectorAll('.flipped')];
    }
    compareCards(flippedCards) {
        if (getComputedStyle(flippedCards[0].children[0]).backgroundImage === getComputedStyle(flippedCards[1].children[0]).backgroundImage) {
            return true;
        }
        return false;
    }
    showResult() {
        field.innerHTML = '';
        field.style.display = 'none';
        result.style.display = 'flex';
        resultValue.innerHTML = timerDOMElem.innerHTML + ' sec.';
    }
    showGame() {
        homepage.style.display = 'none';
        gamepage.style.display = 'flex';
        field.style.display = 'flex';
        window.scrollTo(0, 0);
    }
    hideGame() {
        homepage.style.display = 'flex';
        gamepage.style.display = 'none';
        window.scrollTo(0, 0);
    }
    stopGame() {
        timer.stop();
        field.innerHTML = '';
        result.style.display = 'none';
        resultValue.innerHTML = '';
        this.timeouts.forEach((timeout) => {
            clearTimeout(timeout);
        });
    }
}

class Card {
    constructor(id, backSide, frontSide) {
        this.id = id;
        this.backSide = backSide;
        this.frontSide = frontSide;
    }
    getDOMElem() {
        const card = document.createElement('section');
        card.classList.add('card');

        const cardInner = document.createElement('div');
        cardInner.classList.add('card-inner');

        const front = document.createElement('figure');
        front.classList.add('front');
        front.style.background = this.frontSide;
        front.style.backgroundSize = 'cover';

        const back = document.createElement('figure');
        back.classList.add('back');
        back.style.background = this.backSide;
        back.style.backgroundSize = 'cover';

        cardInner.appendChild(front);
        cardInner.appendChild(back);
        card.appendChild(cardInner);

        return card;
    }
    static turnCard(event) {
        // cancel if not clicked on card
        if (!event.target.classList.contains('back')) {
            return;
        }

        // cancel if clicked on the first flipped card again
        if (game.getFlippedCards()[0] === event.target.parentNode) {
            return;
        }

        // flip card
        if (game.flippedCardsAmount < 2) {
            event.target.parentNode.classList.add('flipped');
        }

        // increase counter of flipped cards
        game.flippedCardsAmount = game.flippedCardsAmount + 1;

        // compare two flipped cards and remove them or flip them back
        if (game.flippedCardsAmount === 2) {
            let flippedCards = game.getFlippedCards();
            if (game.compareCards(flippedCards)) {
                flippedCards.forEach((elem) => {
                    const timeout1 = setTimeout(() => {
                        elem.parentNode.style.opacity = '0';
                    }, 1000);
                    const timeout2 = setTimeout(() => {
                        game.cards.splice(game.cards.indexOf(elem.parentNode), 1);
                        elem.classList.remove('flipped');
                        elem.style.display = 'none';

                        // stop game if all cards disappeared
                        if (game.cards.length === 0) {
                            // stop timer
                            timer.stop();

                            // clear field, show result
                            game.showResult();

                            // save result into localStorage
                            storeResult();
                        }
                        game.flippedCardsAmount = 0;
                    }, 1900);
                    game.timeouts.push(timeout1, timeout2);
                });
            } else {
                flippedCards.forEach((elem) => {
                    const timeout1 = setTimeout(() => {
                        elem.classList.remove('flipped');
                    }, 1000);
                    const timeout2 = setTimeout(() => {
                        game.flippedCardsAmount = 0;
                    }, 1500);
                    game.timeouts.push(timeout1, timeout2);
                });
            }
        }
    }
}

class Timer {
    constructor() {
        this.startDate = 0;
    }
    start() {
        timerDOMElem.innerHTML = String(this.startDate);
        this.startDate = new Date();
        this.timerId = setInterval(() => {
            timerDOMElem.innerHTML = Math.round((Date.now() - this.startDate.getTime()) / 1000);
        }, 1000);
    }
    stop() {
        game.playerInfo.stopTime = new Date().getTime();
        clearInterval(this.timerId);
    }
}

const startGame = function startGame() {
    const checkFormValidity = function checkFormValidity() {
        const elements = [...form.elements];
        let hasMistakes = false;
        elements.forEach((elem) => {
            if (!elem.checkValidity()) {
                hasMistakes = true;
                form.previousElementSibling.scrollIntoView();
                elem.classList.add('invalid-field');
            } else {
                elem.classList.remove('invalid-field');
            }
        });
        if (document.querySelector('.invalid-field') !== null) {
            document.querySelector('.invalid-field').focus();
        }
        return !hasMistakes;
    }

    // simple form validation
    if (!checkFormValidity()) {
        return false;
    }

    // get player info (name, lastname, email)
    game.getPlayerInfo();

    // get number of cards
    game.getNumberOfCards();

    // get back side background
    game.getBackSide();

    // get front side backgrounds used in this game
    game.getFrontSides();

    // create card DOM objects
    game.createCards();

    // add card DOM objects to the field
    game.addCards();

    // make card able to turn
    game.addGameListeners();

    // show game field, hide homepage
    game.showGame();

    // start timer
    timer.start();
}
const restartGame = function restartGame() {
    // stop game (stop timer, clear field and result, cancel existing timeout actions)
    game.stopGame();

    // create new game object instead of previous one
    game = new Game();

    // create new timer object instead of previous one
    timer = new Timer();

    // start new game with new objects
    startGame(game, timer);
}
const stopGame = function stopGame() {
    // stop game (stop timer, clear field and result, cancel existing timeout actions)
    game.stopGame();

    // hide game field, show homepage
    game.hideGame();

    // create new game object instead of previous one
    game = new Game();

    // create new timer object instead of previous one
    timer = new Timer();
}
const storeResult = function storeResult() {
    const archive = [];
    const keys = Object.keys(localStorage);

    game.playerInfo.time = timerDOMElem.innerHTML;

    for (let i = 0; i < keys.length && i < 10; i++) {
        archive.push(localStorage.getItem(keys[i]))
    }

    if (archive.length === 0) {
        localStorage.setItem(1, JSON.stringify(game.playerInfo));
    } else {
        archive.push(JSON.stringify(game.playerInfo));
        archive.sort((a, b) => {
            if (Number(JSON.parse(a).time) < Number(JSON.parse(b).time)) {
                return -1;
            }
            if (Number(JSON.parse(a).time) > Number(JSON.parse(b).time)) {
                return 1;
            }
            return Number(JSON.parse(a).stopTime) - Number(JSON.parse(b).stopTime);
        });
        for (let i = 1; i <= archive.length && i <= 10; i++) {
            localStorage.setItem(i, archive[i - 1]);
        }
    }
}
const showScoreboard = function showScoreboard() {
    homepage.style.display = 'none';
    scoreboard.style.display = 'flex';

    const tbody = scoreboardTable.tBodies[0];
    const archive = [];
    const keys = Object.keys(localStorage);

    if (keys.length === 0) {
        const noDataRow = document.createElement('tr');
        const noDataCell = document.createElement('td');
        noDataCell.innerHTML = 'NO DATA YET';
        noDataCell.colSpan = '4';
        noDataRow.appendChild(noDataCell);
        tbody.appendChild(noDataRow);
    }

    keys.sort((a, b) => {
        return Number(a) - Number(b);
    });

    // retrieve items from localStorage
    for (let i = 0; i < keys.length; i++) {
        archive.push(localStorage.getItem(keys[i]))
    }

    // create table row with the result from localStorage item and append it to the table
    for (let i = 0; i < archive.length; i++) {
        const row = document.createElement('tr');
        const place = document.createElement('td');
        const firstName = document.createElement('td');
        const lastName = document.createElement('td');
        const time = document.createElement('td');
        place.innerHTML = keys[i];
        firstName.innerHTML = JSON.parse(archive[i]).firstName;
        lastName.innerHTML = JSON.parse(archive[i]).lastName;
        time.innerHTML = JSON.parse(archive[i]).time + ' sec.';
        row.appendChild(place);
        row.appendChild(firstName);
        row.appendChild(lastName);
        row.appendChild(time);
        tbody.appendChild(row);
    }
}
const hideScoreboard = function hideScoreboard() {
    homepage.style.display = 'flex';
    scoreboard.style.display = 'none';
    scoreboardTable.tBodies[0].innerHTML = '';
}

const addListeners = function addListeners() {
    const changeActivePattern = function changeActivePattern() {
        if (event.target.classList.contains('back-side-pattern') && !event.target.classList.contains('active-pattern')) {
            const children = [...event.target.parentNode.children];
            for (let i = 0; i < children.length; i++) {
                if (children[i].classList.contains('active-pattern')) {
                    children[i].classList.remove('active-pattern');
                    break;
                }
            }
            event.target.classList.add('active-pattern');
        };
    };
    const changeActiveDifficulty = function changeActiveDifficulty() {
        if (event.target.closest('.difficulty') !== null) {
            const target = event.target.closest('.difficulty');
            const children = [...target.parentNode.children];
            for (let i = 0; i < children.length; i++) {
                if (children[i].classList.contains('active-difficulty')) {
                    children[i].classList.remove('active-difficulty');
                    break;
                }
            }
            target.classList.add('active-difficulty');
        };
    };
    const addKeyboardControl = function addKeyboardControl(event) {
        if (event.target.classList.contains('back-side-pattern') && (event.keyCode === keycodes.ENTER || event.keyCode === keycodes.SPACE)) {
            event.preventDefault();
            changeActivePattern();
        }
        if (event.target.classList.contains('difficulty') && (event.keyCode === keycodes.ENTER || event.keyCode === keycodes.SPACE)) {
            event.preventDefault();
            changeActiveDifficulty();
        }
        if (event.target.classList.contains('play-button') && (event.keyCode === keycodes.ENTER || event.keyCode === keycodes.SPACE)) {
            event.preventDefault();
            startGame();
        }
        if (event.target.classList.contains('scoreboard-button') && (event.keyCode === keycodes.ENTER || event.keyCode === keycodes.SPACE)) {
            event.preventDefault();
            showScoreboard();
        }
        if (event.target.classList.contains('scoreboard-homepage-button') && (event.keyCode === keycodes.ENTER || event.keyCode === keycodes.SPACE)) {
            event.preventDefault();
            hideScoreboard();
        }
        if (event.target.classList.contains('game-homepage-button') && (event.keyCode === keycodes.ENTER || event.keyCode === keycodes.SPACE)) {
            event.preventDefault();
            stopGame();
        }
        if (event.target.classList.contains('play-again-button') && (event.keyCode === keycodes.ENTER || event.keyCode === keycodes.SPACE)) {
            event.preventDefault();
            restartGame();
        }
    };

    patternContainer.addEventListener('mousedown', changeActivePattern);
    difficultiesContainer.addEventListener('mousedown', changeActiveDifficulty);

    // add keyboard control
    document.body.addEventListener('keydown', addKeyboardControl);

    // show scoreboard when clicked on SCOREBOARD button
    scoreboardButton.addEventListener('click', showScoreboard);

    // close scoreboard
    scoreboardHomepageButton.addEventListener('click', hideScoreboard);

    // start game when clicked on PLAY button
    playButton.addEventListener('click', startGame);

    // restart game when clicked on PLAY AGAIN button
    playAgainButton.addEventListener('click', restartGame);

    // stop game when clicked on HOMEPAGE button
    gameHomepageButton.addEventListener('click', stopGame);
}

// get elements on the homepage
const homepage = document.querySelector('.homepage');
const form = document.forms['info'];
const patternContainer = document.querySelector('.back-sides-container');
const difficultiesContainer = document.querySelector('.difficulties-container');
const playButton = document.querySelector('.play-button');
const scoreboardButton = document.querySelector('.scoreboard-button');

// get elements on the scoreboard
const scoreboard = document.querySelector('.scoreboard');
const scoreboardHomepageButton = document.querySelector('.scoreboard-homepage-button');
const scoreboardTable = document.querySelector('.scoreboard-table');

// get elements on the gamepage
const gamepage = document.querySelector('.gamepage');
const gameHomepageButton = document.querySelector('.game-homepage-button');
const timerDOMElem = document.querySelector('.timer-value');
const playAgainButton = document.querySelector('.play-again-button');
const field = document.querySelector('.field');
const result = gamepage.querySelector('.result');
const resultValue = result.lastElementChild;

// front side backgrounds for all games
const frontSides = [
    'url("./images/messi.jpg")',
    'url("./images/ronaldo.jpg")',
    'url("./images/neymar.jpg")',
    'url("./images/buffon.jpg")',
    'url("./images/ibrahimovic.jpg")',
    'url("./images/salah.jpg")',
    'url("./images/ozil.jpg")',
    'url("./images/cavani.jpg")',
    'url("./images/lewandowski.jpg")',
    'url("./images/bonucci.jpg")',
    'url("./images/pogba.jpg")',
    'url("./images/sanchez.jpg")',
];

// codes for ENTER and SPACE
const keycodes = {
    ENTER: 13,
    SPACE: 32
};

// create game object
let game = new Game();

// create game object
let timer = new Timer();

addListeners();