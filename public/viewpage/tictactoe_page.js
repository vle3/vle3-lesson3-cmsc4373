import * as Elements from './elements.js';
import { routePath } from '../controller/route.js';
import { currentUser } from '../controller/firebase_auth.js';
import { unauthorizedAccess } from './unauthorized_access_message.js';

export function addEventListeners() {
    Elements.menus.tictactoe.addEventListener('click', () => {
        history.pushState(null, null, routePath.TICTACTOE);
        tictactoe_page();
    });

}

export function tictactoe_page() {
    if (!currentUser) {
        Elements.root.innerHTML = unauthorizedAccess();
        return;
    }
    let html = 'TicTacToe Game page';
    Elements.root.innerHTML = html;
}