import * as Elements from './elements.js';
import { routePath } from '../controller/route.js';
import { currentUser } from '../controller/firebase_auth.js';
import { unauthorizedAccess } from './unauthorized_access_message.js';
import { TicTacToeGame, marking,  } from '../model/tictactoe_game.js';
import { info } from './util.js';

export function addEventListeners() {
    Elements.menus.tictactoe.addEventListener('click', () => {
        history.pushState(null, null, routePath.TICTACTOE);
        tictactoe_page();
    });

}

let gameModel;

let screen = {
    turn: null,
    moves: null,
    buttons: null,
    images: null,
};

const imageSource = {
    X: '/images/X.png',
    O: '/images/O.png',
    U: '/images/U.png'
};

export async function tictactoe_page() {
    if (!currentUser) {
        Elements.root.innerHTML = unauthorizedAccess();
        return;
    }

    gameModel = new TicTacToeGame();

    let html;
    const response = await fetch('/viewpage/templates/tictactoe_page.html', { cache: 'no-store' });
    html = await response.text();
    Elements.root.innerHTML = html;

    getScreenElements();
    addGameEvents();
    updateScreen();
}

function getScreenElements() {
    screen.turn = document.getElementById('turn');
    screen.moves = document.getElementById('moves');
    screen.buttons = [];
    screen.images = [];
    for (let i = 0; i < 9; i++) {
        screen.buttons.push(document.getElementById(`button-${i}`));
        screen.images.push(document.getElementById(`image-${i}`));
    }
}

function addGameEvents() {
    for (let i = 0; i < 9; i++){
        screen.buttons[i].addEventListener('click', buttonPressListener);
    }
}

function buttonPressListener(){
    const buttonId = event.target.id;
    const pos = buttonId[buttonId.length - 1];

    gameModel.board[pos] = gameModel.turn;
    gameModel.toggleTurn();
    gameModel.moves++;

    gameModel.setWinner();
    if(gameModel.winner != null){
        if(gameModel.winner == marking.U){
            gameModel.status =  'Game Over: DRAW';
        }else {
            gameModel.status = `
                Game Over - Winner: ${marking[gameModel.winner]} with ${gameModel.moves}
            `;
        }
        updateScreen();
        info('Game Over' , gameModel.status);
    }

    updateScreen();
}

function updateScreen() {
    // mapping from game model to view 
    screen.turn.src = imageSource[gameModel.turn];
    screen.moves.innerHTML = gameModel.moves;

    for (let i = 0; i < 9; i++) {
        screen.images[i].src = imageSource[gameModel.board[i]];
        screen.buttons[i].disabled = gameModel.board[i] != marking.U;
    }
}