import { routePath } from '../controller/route.js';
import * as Elements from './elements.js';
import { currentUser } from '../controller/firebase_auth.js';
import { unauthorizedAccess } from './unauthorized_access_message.js';
import { DEV } from '../model/constants.js';
import { CardGame } from '../model/cardgame.js';
import * as Util from './util.js';
import { addCardGameHistory, getCardGameHistory } from '../controller/firestore_controller.js';


export function addEventListeners() {
    Elements.menus.cardgame.addEventListener('click', () => {
        history.pushState(null, null, routePath.CARDGAME);
        cardgame_page();
    })
}

let gameModel;
let resultPlacement;
let balance = 8;
let totalBet = 0;
let card0bets = 0;
let card1bets = 0;
let card2bets = 0;
let totalDebt = 0;
let winbet;

const imageSource = {
    front: '/images/Cardfront.jpg',
    back: '/images/Cardback.jpg',
    goal: '/images/Firebase.png',
};

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
    images: [],
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
    screen.historyButton = document.getElementById('button-history');
    screen.gameplayHistory = document.getElementById('gameplay-history');

    screen.statusMessage = document.getElementById('status-message');

    for (let i = 0; i < 3; i++) {
        screen.images.push(document.getElementById(`image-${i}`));
    }
}

function addGameEvents() {
    screen.newGameButton.disabled = true;
    screen.statusMessage.innerHTML = 'Bet coins and press [Play]';

    screen.card0betsubtract.addEventListener('click', async () => {
        if (card0bets > 0) {
            card0bets--;
            balance++;
            console.log('card0 bet reduce');
            gameModel.cardList[0].setBet(card0bets);
            screen.statusMessage.innerHTML = 'Bet coins and press [Play]';
        }
        if (card0bets == 0) screen.statusMessage.innerHTML = 'cannot reduce bet at 0';
        else {
            console.log('card0 bet cannot reduce');
        }
        updateScreen();
    });
    screen.card0betadd.addEventListener('click', async () => {
        if (balance > 0) {
            card0bets += 1;
            screen.statusMessage.innerHTML = 'Bet coins and press [Play]';
            balance--;
        }
        if (balance == 0) screen.statusMessage.innerHTML = 'No more coin to add bet';
        gameModel.cardList[0].setBet(card0bets);
        console.log(`card0 bet increase + card0bets: ${card0bets} balance: ${balance}`);
        updateScreen();
        screen.playButton.disabled = false;
    });
    screen.card1betsubtract.addEventListener('click', async () => {
        if (card1bets > 0) {
            card1bets--;
            balance++;
            gameModel.cardList[1].setBet(card1bets);
            console.log('card1 bet reduce');
            screen.statusMessage.innerHTML = 'Bet coins and press [Play]';
        }
        else {
            console.log('card1 bet cannot reduce');
        }
        if (card1bets == 0) screen.statusMessage.innerHTML = 'cannot reduce bet at 0';
        updateScreen();
    });
    screen.card1betadd.addEventListener('click', async () => {
        if (balance > 0) {
            card1bets += 1;
            balance--;
            screen.statusMessage.innerHTML = 'Bet coins and press [Play]';
        }
        if (balance == 0) screen.statusMessage.innerHTML = 'No more coin to add bet';
        gameModel.cardList[1].setBet(card1bets);
        console.log(`card1 bet increase + card1bets: ${card1bets}`);
        //screen.newGameButton.disabled = true;
        screen.playButton.disabled = false;
        updateScreen();
    })
    screen.card2betsubtract.addEventListener('click', async () => {
        if (card2bets > 0) {
            card2bets--;
            balance++;
            gameModel.cardList[2].setBet(card2bets);
            console.log('card2 bet reduce');
            screen.statusMessage.innerHTML = 'Bet coins and press [Play]';
        }
        else {
            console.log('card2 bet cannot reduce');
        }
        if (card2bets == 0) screen.statusMessage.innerHTML = 'cannot reduce bet at 0';
        updateScreen();
    });
    screen.card2betadd.addEventListener('click', async () => {
        if (balance > 0) {
            card2bets += 1;
            balance--;
            screen.statusMessage.innerHTML = 'Bet coins and press [Play]';
        }
        if (balance == 0) screen.statusMessage.innerHTML = 'No more coin to add bet';
        gameModel.cardList[2].setBet(card2bets);
        console.log(`card2 bet increase + card2bets: ${card2bets}`);
        screen.playButton.disabled = false;
        //screen.newGameButton.disabled = true;
        updateScreen();
    })
    updateScreen();

    screen.newGameButton.addEventListener('click', async () => {
        screen.gameplayHistory.innerHTML = '';
        gameModel = new CardGame();
        card0bets = 0;
        card1bets = 0;
        card2bets = 0;
        gameModel.cardList[0].setBet(card0bets);
        gameModel.cardList[1].setBet(card1bets);
        gameModel.cardList[2].setBet(card2bets);
        resultPlacement = gameModel.generateResultPlacement();
        updateScreen();
        screen.card0betadd.disabled = false;
        screen.card1betadd.disabled = false;
        screen.card2betadd.disabled = false;
        screen.card0betsubtract.disabled = false;
        screen.card1betsubtract.disabled = false;
        screen.card2betsubtract.disabled = false;
        for (let i = 0; i < 3; i++) {
            screen.images[i].src = imageSource.back;
        }
    });

    screen.loanButton.addEventListener('click', async () => {
        if (balance > 0 || screen.playButton.disabled == false) {
            Util.info('Not available', 'Loan available when your balance is 0 and not playing');
            return;
        }
        else if (balance == 0) {
            totalDebt += 8;
            gameModel.debt += 8;
            balance += 8;
            Util.info('Loan', 'borrowed 8 coins');
        }
        console.log(`debt: ${gameModel.debt}`);
        screen.debt.innerHTML = `Debt: ${gameModel.debt}`;
        updateScreen();
        screen.newGameButton.disabled = false;
        screen.statusMessage.innerHTML = 'coin borrowed; press new game to play!'
    });

    screen.historyButton.addEventListener('click', historyButtonEvent);

    screen.playButton.addEventListener('click', async () => {
        gameModel.resultPlacement = resultPlacement;
        gameModel.playGame();
        winbet = gameModel.winbet;
        balance += winbet;
        // card0bets = 0;
        // card1bets = 0;
        // card2bets = 0;
        screen.statusMessage.innerHTML = `You won ${winbet} by betting ${totalBet}
                                          <br> Game results stored in Firebase`;

        console.log(`winbet: ${winbet} at ${resultPlacement}`);
        updateScreen();
        screen.playButton.disabled = true;
        for (let i = 0; i < 3; i++) {
            screen.images[i].src = imageSource.front;
            if (i == resultPlacement) screen.images[i].src = imageSource.goal;
        }
        screen.card0betadd.disabled = true;
        screen.card1betadd.disabled = true;
        screen.card2betadd.disabled = true;
        screen.card0betsubtract.disabled = true;
        screen.card1betsubtract.disabled = true;
        screen.card2betsubtract.disabled = true;
        screen.newGameButton.disabled = false;
        if (balance == 0) screen.newGameButton.disabled = true;
        if (balance == 0) screen.statusMessage.innerHTML += '<br> no more coin, borrow to play';

        let loan = false;
        if (totalDebt > 0) loan = true;

        const gameplay = {
            email: currentUser.email,
            balance: balance,
            bets: gameModel.totalBet,
            loan: loan,
            debts: totalDebt,
            timestamp: Date.now(),
            won: gameModel.winbet,
        }

        try {
            await addCardGameHistory(gameplay);
        } catch (e) {
            if (DEV) console.log('failed to save', e);
        }
    })
}

function updateScreen() {
    screen.card0bet.innerHTML = card0bets;
    screen.card1bet.innerHTML = card1bets;
    screen.card2bet.innerHTML = card2bets;
    screen.secret.innerHTML = `SECRET: Firebase card location: ${resultPlacement}`;
    totalBet = card0bets + card1bets + card2bets;
    screen.currentBet.innerHTML = `Current Bets: ${totalBet}`;
    screen.balance.innerHTML = `Balance: ${balance}`;
    if (totalBet == 0) { screen.playButton.disabled = true; }
    screen.newGameButton.disabled = true;
    gameModel.totalBet = totalBet;
    // if (balance == 0) {
    //     screen.card0betadd.disabled = true;
    //     screen.card1betadd.disabled = true;
    //     screen.card2betadd.disabled = true;
    // }
    // if(card0bets == 0) screen.card0betsubtract.disabled = true;
    // if(card1bets == 0) screen.card1betsubtract.disabled = true;
    // if(card2bets == 0) screen.card2betsubtract.disabled = true;

}

async function historyButtonEvent() {
    let history;

    try {
        history = await getCardGameHistory(currentUser.email);
        console.log('History', history);
        let html = `
            <table class="table table-secondary table-striped">
                <body>
        `;
        for (let i = 0; i < history.length; i++) {
            html += `
            <tr>
                <td>
                ${new Date(history[i].timestamp).toLocaleString()}
                <br>
                Balance: ${history[i].balance} Debts: ${history[i].debts} Bet: ${history[i].bets} Won: ${history[i].won}
                </td>
            </tr>
            `;
            if (i >= 9) break;
        }
        html += '</body></table>';
        screen.gameplayHistory.innerHTML = html;
    } catch (e) {
        if (DEV) console.log('ERROR, history button', e);
        Util.info('Failed to get game history', JSON.stringify(e));
    }
}