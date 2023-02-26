import { currentUser } from '../controller/firebase_auth.js';
import { routePath } from '../controller/route.js';
import * as Elements from './elements.js';
import { unauthorizedAccess } from './unauthorized_access_message.js';
import { DEV } from '../model/constants.js';
import { BaseballGame } from '../model/baseballgame.js';
import * as Util from './util.js';
import { addBaseballGameHistory, getBaseballGameHistory } from '../controller/firestore_controller.js';


export function addEventListeners() {
    Elements.menus.baseball.addEventListener('click', () => {
        history.pushState(null, null, routePath.BASEBALL);
        baseball_page();
    });


}

let gameModel;

let screen = {
    guesses: null,
    buttons: null,
    keys: null,
    historyButton: null,
    newGameButton: null,
    statusMessage: null,
};

export async function baseball_page() {
    if (!currentUser) {
        Elements.root.innerHTML = unauthorizedAccess();
        return;
    }

    gameModel = new BaseballGame();
    gameModel.generateKeys();

    let html;
    const response = await fetch('/viewpage/templates/baseball_page.html', { cache: 'no-store' });
    html = await response.text();
    Elements.root.innerHTML = html;


    getScreenElements();
    addGameEvents();
    updateScreen();
}

function getScreenElements() {
    screen.buttons = [];
    for (let i = 0; i <= 9; i++) {
        screen.buttons.push(document.getElementById(`button-${i}`));
        if (gameModel.strikes == 3) {
            screen.buttons[i].disabled = true;
        }
    }
    screen.guesses = document.getElementById('guesses');
    screen.keys = document.getElementById('game-keys');
    screen.newGameButton = document.getElementById('button-new-game');
    screen.statusMessage = document.getElementById('status-message');
    screen.historyButton = document.getElementById('button-history');
    screen.gameplayHistory = document.getElementById('gameplay-history');
}

function addGameEvents() {

    for (let i = 0; i <= 9; i++) {
        screen.buttons[i].addEventListener('click', async () => {
            screen.newGameButton.disabled = true;
            screen.gameplayHistory.innerHTML = '';
            gameModel.guesses.push(i);
            screen.buttons[i].disabled = true;
            updateScreen();
            if (gameModel.guesses.length >= 3) {
                gameModel.balls = 0;
                gameModel.strikes = 0;
                for (let j = 0; j <= 9; j++) {
                    screen.buttons[j].disabled = false;
                }
                console.log(gameModel.keys);
                console.log(gameModel.guesses);
                gameModel.setStrikes();
                gameModel.setBalls();
                gameModel.attemps++;
                console.log(gameModel.strikes);
                gameModel.status += ` <br> [${gameModel.attemps}] Guess: ${gameModel.guesses} , B#: ${gameModel.balls} , S#: ${gameModel.strikes}`;
                updateScreen();
                if (gameModel.strikes == 3) {
                    disableKeyPad();
                    let finalStatus = `<br> (Struck out ~~ after ${gameModel.attemps} attemps!)`;
                    gameModel.status += finalStatus;
                    //gameModel.status += `<br> (Struck out ~~ after ${gameModel.attemps} attemps!)`;
                    screen.newGameButton.disabled = false;
                    const gameplay = {
                        email: currentUser.email,
                        attemps: gameModel.attemps,
                        timestamp: Date.now(),
                    }
                    try {
                        await addBaseballGameHistory(gameplay);
                        Util.info('Game Over', finalStatus );
                    } catch (e) {
                        Util.info('Game Over', `Failed to save the gameplay history: ${e}`);
                        if (DEV) console.log('Game over: failed to save: ', e);
                    }
                    updateScreen();
                }   
                console.log(gameModel.balls);
                gameModel.guesses.length = 0;
                console.log('turns: ', gameModel.attemps);
            }
        });
    }

    screen.historyButton.addEventListener('click', historyButtonEvent);

    screen.newGameButton.addEventListener('click', () => {
        screen.gameplayHistory.innerHTML = '';
        gameModel = new BaseballGame();
        gameModel.generateKeys();
        for (let i = 0; i < 10; i++) {
            screen.buttons[i].disabled = false;
        }
        updateScreen();
    });
}

function disableKeyPad() {
    for (let i = 0; i <= 9; i++) {
        screen.buttons[i].disabled = true;
    }
}

function updateScreen() {
    screen.keys.innerHTML = gameModel.keys;
    screen.guesses.innerHTML = gameModel.guesses;
    screen.statusMessage.innerHTML = gameModel.status;
}
async function historyButtonEvent() {
    let history;
    gameModel.status = '';
    try {
        history = await getBaseballGameHistory(currentUser.email);
        console.log('History', history);
        let html = `
            <table class="table table-success table-striped">
                <tr>
                    <th>
                        Attemps
                    </th>
                    <th>
                        Date
                    </th>
                </tr>
                <body>
        `;
        for (let i = 0; i < history.length; i++) {
            html += `
                <tr>
                    <td>
                        ${history[i].attemps}
                    </td>
                    <td>
                        ${new Date(history[i].timestamp).toLocaleString()}
                    </td>
                </tr>
            `;
        }
        html += '</body></table>';
        screen.gameplayHistory.innerHTML = html;
        updateScreen();
    } catch (e) {
        if (DEV) console.log('ERROR; history button', e);
        Util.info('Failed to get game history', JSON.stringify(e));
    }
}