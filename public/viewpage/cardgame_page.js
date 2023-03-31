import { routePath } from '../controller/route.js';
import * as Elements from './elements.js';
import { currentUser } from '../controller/firebase_auth.js';
import { unauthorizedAccess } from './unauthorized_access_message.js';
import { DEV } from '../model/constants.js';
import { CardGame } from '../model/cardgame.js';

export function addEventListeners() {
    Elements.menus.cardgame.addEventListener('click', () => {
        history.pushState(null, null, routePath.CARDGAME);
        cardgame_page();
    })
}

let gameModel;
let resultPlacement;
let totalBet = 0;
let card0bets = 0;
let card1bets = 0;
let card2bets = 0;

let screen = {
    buttons: null,
    card0betsubtract: null,
    card0betadd: null,
    card0bet: null,
    card1betsubtract: null,
    card1betadd: null,
    card1bet: null,
    card2betsubtract: null,
    card2betadd: null,
    card2bet: null,
    balance: null,
    secret: null,
    playButton: null,
    loanButton: null,
    historyButton: null,
    newGameButton: null,
    statusMessage: null,
    gameplayHistory: null,
};

export async function cardgame_page() {
    if (!currentUser) {
        Elements.root.innerHTML = unauthorizedAccess();
        return;
    }

    gameModel = new CardGame();
    resultPlacement = gameModel.generateResultPlacement();
    gameModel.cardList[0].setBet(card0bets);
    gameModel.cardList[1].setBet(card1bets);
    gameModel.cardList[2].setBet(card2bets);


    let html;
    const response = await fetch('/viewpage/templates/cardgame_page.html', { cache: 'no-store' });
    html = await response.text();
    Elements.root.innerHTML = html;

    getScreenElements();
    console.log(screen.buttons);
    addGameEvents();
    updateScreen();
}

function getScreenElements() {

    screen.secret = document.getElementById('text-secret');

    screen.card0betsubtract = document.getElementById('button-card0-minus');
    screen.card0betadd = document.getElementById('button-card0-plus');
    screen.card1betsubtract = document.getElementById('button-card1-minus');
    screen.card1betadd = document.getElementById('button-card1-plus');
    screen.card2betsubtract = document.getElementById('button-card2-minus');
    screen.card2betadd = document.getElementById('button-card2-plus');

    screen.card0bet = document.getElementById('card0-bets');
    screen.card1bet = document.getElementById('card1-bets');
    screen.card2bet = document.getElementById('card2-bets');

    screen.balance = document.getElementById('balance');
    screen.currentBet = document.getElementById('current-bets');
    screen.debt = document.getElementById('debt');

    screen.newGameButton = document.getElementById('button-new-game');
    screen.playButton = document.getElementById('button-play');
    screen.loanButton = document.getElementById('button-loan');
    screen.gameplayHistory = document.getElementById('gameplay-history');

}

function addGameEvents() {
    screen.card0betsubtract.addEventListener('click', async () => {
        if (card0bets > 0) {
            card0bets--;
            console.log('card0 bet reduce');
            gameModel.cardList[0].setBet(card0bets);
        }
        else {
            console.log('card0 bet cannot reduce');
        }
        updateScreen();
    });
    screen.card0betadd.addEventListener('click', async () => {
        card0bets += 1;
        gameModel.cardList[0].setBet(card0bets);
        console.log(`card0 bet increase + card0bets: ${card0bets}`);
        screen.newGameButton.disabled = true;
        updateScreen();
    });
    screen.card1betsubtract.addEventListener('click', async () => {
        if (card1bets > 0) {
            card1bets--;
            gameModel.cardList[1].setBet(card1bets);
            console.log('card1 bet reduce');
        }
        else {
            console.log('card1 bet cannot reduce');
        }
        updateScreen();
    });
    screen.card1betadd.addEventListener('click', async () => {
        card1bets += 1;
        gameModel.cardList[1].setBet(card1bets);
        console.log(`card1 bet increase + card1bets: ${card1bets}`);
        screen.newGameButton.disabled = true;
        updateScreen();
    })
    screen.card2betsubtract.addEventListener('click', async () => {
        if (card2bets > 0) {
            card2bets--;
            gameModel.cardList[2].setBet(card2bets);
            console.log('card2 bet reduce');
        }
        else {
            console.log('card2 bet cannot reduce');
        }
        updateScreen();
    });
    screen.card2betadd.addEventListener('click', async () => {
        card2bets += 1;
        gameModel.cardList[2].setBet(card2bets);
        console.log(`card2 bet increase + card2bets: ${card2bets}`);
        screen.newGameButton.disabled = true;
        updateScreen();
    })
    updateScreen();

    screen.newGameButton.addEventListener('click', async () => {
        screen.gameplayHistory.innerHTML = '';
        gameModel = new CardGame();
        resultPlacement = gameModel.generateResultPlacement();
        updateScreen();
    });

    screen.loanButton.addEventListener('click', async () => {
        gameModel.debt += 8;
        console.log(`debt: ${gameModel.debt}`);
        screen.debt.innerHTML = `Debt: ${gameModel.debt}` ;
        updateScreen();
    });
}

function updateScreen() {
    screen.card0bet.innerHTML = card0bets;
    screen.card1bet.innerHTML = card1bets;
    screen.card2bet.innerHTML = card2bets;
    screen.secret.innerHTML = `SECRET: Firebase card location: ${resultPlacement}`;
    totalBet = card0bets + card1bets + card2bets;
    screen.currentBet.innerHTML = `Current Bets: ${totalBet}`;
}