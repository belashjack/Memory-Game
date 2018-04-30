const startGame = function startGame() {
    class Game {
        constructor(numberOfCards, backSide) {
            this.numberOfCards = numberOfCards;
            this.backSide = backSide;
            this.cards = [];
            this.flippedCardsAmount = 0;

            // array of background images of the front side
            this.frontSides = [
                'url("./images/messi.jpg")',
                'url("./images/messi.jpg")',
                'url("./images/ronaldo.jpg")',
                'url("./images/ronaldo.jpg")',
                'url("./images/neymar.jpg")',
                'url("./images/neymar.jpg")',
                'url("./images/buffon.jpg")',
                'url("./images/buffon.jpg")',
                'blue',
                'blue',
                'black',
                'black',
                'pink',
                'pink',
                'rebeccabue',
                'rebeccabue',
                'red',
                'red',
                'yellow',
                'yellow',
                'orange',
                'orange',
                'lightyellow',
                'lightyellow',
                'lightyellow',
                'lightyellow',
            ];
        }
        createCards() {
            // auxiliary function to get random background image of the front side
            const getRandomFrontSide = function getRandomFrontSide(frontSides, numberOfCards) {
                let index = getRandomInt(0, numberOfCards - 1);
                while (frontSides[index] === undefined) {
                    index = getRandomInt(0, numberOfCards - 1);
                }
                const frontSide = frontSides[index];
                delete frontSides[index];
                return frontSide;
            }

            // auxiliary function to get random integer in range
            function getRandomInt(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            // create card DOM objects
            for (let i = 0; i < this.numberOfCards; i++) {
                const card = new Card(i, this.backSide, getRandomFrontSide(this.frontSides, this.numberOfCards));
                this.cards.push(card.getDOMElem());
            }
        }
        addCards() {
            // add card DOM objects to the field
            this.cards.forEach((elem) => {
                const card = elem;
                field.appendChild(card);
            });
        }
        addListeners() {
            field.addEventListener('click', () => {
                this.turnCard();
            });
        }
        showField() {
            homepage.style.display = 'none';
            gamepage.style.display = 'flex';
            window.scrollTo(0, 0);
        }
        turnCard() {
            // cancel if not clicked on card
            if (!event.target.classList.contains('back')) {
                return;
            }

            // cancel if clicked on the first flipped card again
            if (this.getFlippedCards()[0] === event.target.parentNode) {
                return;
            }

            // flip card
            if (this.flippedCardsAmount < 2) {
                event.target.parentNode.classList.add('flipped');
            }

            // increase counter of flipped cards
            this.flippedCardsAmount = this.flippedCardsAmount + 1;

            // compare two flipped cards and remove them or flip them back
            if (this.flippedCardsAmount === 2) {
                let flippedCards = this.getFlippedCards();
                if (this.compareCards(flippedCards)) {
                    flippedCards.forEach((elem) => {
                        setTimeout(() => {
                            elem.parentNode.style.opacity = '0';
                        }, 1000);
                        setTimeout(() => {
                            this.cards.splice(this.cards.indexOf(elem.parentNode), 1);
                            elem.classList.remove('flipped');
                            elem.style.display = 'none';
                            if (this.cards.length === 0) {
                                timer.stop();
                            }
                            this.flippedCardsAmount = 0;
                        }, 1900);
                    });
                } else {
                    flippedCards.forEach((elem) => {
                        setTimeout(() => {
                            elem.classList.remove('flipped');
                        }, 1000);
                        setTimeout(() => {
                            this.flippedCardsAmount = 0;
                        }, 1500);
                    });
                }
            }
        }
        compareCards(flippedCards) {
            if (getComputedStyle(flippedCards[0].children[0]).backgroundImage === getComputedStyle(flippedCards[1].children[0]).backgroundImage) {
                return true;
            }
            return false;
        }
        getFlippedCards() {
            return [...field.querySelectorAll('.flipped')];
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
    }

    class Timer {
        constructor() {
            this.startData = 0;
        }
        start() {
            this.startData = new Date();
            let span = document.createElement('span');
            span.innerHTML = '0';
            document.body.appendChild(span);
            this.timerId = setInterval(() => {
                span.innerHTML = Math.round((Date.now() - this.startData.getTime()) / 1000);
            }, 1000);
        }
        stop() {
            clearInterval(this.timerId);
            alert('er');
        }
    }

    const getNumberOfCards = function getNumberOfCards() {
        // return Number(difficultiesContainer.querySelector('.active-difficulty').dataset.amount);
        return 6;
    }
    const getBackSide = function getBackSide() {
        return getComputedStyle(patternContainer.querySelector('.active-pattern')).backgroundImage;
    }

    // get number of cards and background of the back side
    const numberOfCards = getNumberOfCards();
    const backSide = getBackSide();

    // create and initialize game object
    const game = new Game(numberOfCards, backSide);

    game.createCards();
    game.addCards();
    game.addListeners();
    game.showField();

    const timer = new Timer();
    timer.start();
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
    const changeActivePatternViaKeyboard = function changeActivePatternViaKeyboard() {
        if (event.target.classList.contains('back-side-pattern') && (event.keyCode === keycodes.ENTER || event.keyCode === keycodes.SPACE)) {
            event.preventDefault();
            changeActivePattern();
        }
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
    const changeActiveDifficultyViaKeyboard = function changeActiveDifficultyViaKeyboard() {
        if (event.target.classList.contains('difficulty') && (event.keyCode === keycodes.ENTER || event.keyCode === keycodes.SPACE)) {
            event.preventDefault();
            changeActiveDifficulty();
        }
    };
    const forceBlur = function forceBlur() {
        event.target.blur();
    }

    const keycodes = {
        ENTER: 13,
        SPACE: 32
    };
    
    const buttons = [...document.querySelectorAll('.button')];

    patternContainer.addEventListener('mousedown', changeActivePattern);
    document.body.addEventListener('keydown', changeActivePatternViaKeyboard);
    difficultiesContainer.addEventListener('mousedown', changeActiveDifficulty);
    document.body.addEventListener('keydown', changeActiveDifficultyViaKeyboard);
    buttons.forEach(button => { button.addEventListener('click', forceBlur) });

    // start game when click on PLAY button
    playButton.addEventListener('click', startGame);
}

const homepage = document.querySelector('.homepage');
const patternContainer = document.querySelector('.back-sides-container');
const difficultiesContainer = document.querySelector('.difficulties-container');
const playButton = document.querySelector('.play-button');

const gamepage = document.querySelector('.gamepage');
const field = document.querySelector('.field');

addListeners();



// TODO: forceBlur только на одной кнопке