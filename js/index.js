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

    const keycodes = {
        ENTER: 13,
        SPACE: 32
    };
    const patternContainer = document.querySelector('.back-sides-container');
    const difficultiesContainer = document.querySelector('.difficulties-container');
    const playButton = document.querySelector('.play-button');

    patternContainer.addEventListener('mousedown', changeActivePattern);
    document.body.addEventListener('keydown', changeActivePatternViaKeyboard);
    difficultiesContainer.addEventListener('mousedown', changeActiveDifficulty);
    document.body.addEventListener('keydown', changeActiveDifficultyViaKeyboard);
    playButton.addEventListener('click', forceBlur);
    playButton.addEventListener('click', startGame);
}

document.addEventListener('DOMContentLoaded', addListeners);

const forceBlur = function forceBlur() {
    event.target.blur();
}

const startGame = function startGame() {
    const homepage = document.querySelector('.homepage');
    const game = document.querySelector('.game');
    homepage.style.display = 'none';
    game.style.display = 'block';
}
