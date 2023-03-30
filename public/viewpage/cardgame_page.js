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

let screen = {};

export async function cardgame_page() {
    if (!currentUser) {
        Elements.root.innerHTML = unauthorizedAccess();
        return;
    }

    gameModel = new CardGame();

    let html;
    const response = await fetch('/viewpage/templates/cardgame_page.html', {cache: 'no-store'});
    html = await response.text();
    Elements.root.innerHTML = html;
}

function getScreenElements(){

}

function addGameEvents() {

}

function updateScreen(){
    
}