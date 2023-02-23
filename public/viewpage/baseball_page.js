import { currentUser } from '../controller/firebase_auth.js';
import { routePath } from '../controller/route.js';
import * as Elements from './elements.js';
import { unauthorizedAccess } from './unauthorized_access_message.js';
import { DEV } from '../model/constants.js';


export function addEventListeners() {
    Elements.menus.baseball.addEventListener('click', () => {
        history.pushState(null, null, routePath.BASEBALL);
        baseball_page();
    });
}

let gameModel;

let screen = {};

export async function baseball_page() {
    if (!currentUser) {
        Elements.root.innerHTML = unauthorizedAccess();
        return;
    }

    let html;
    const response = await fetch('/viewpage/templates/baseball_page.html', { cache: 'no-store' });
    html = await response.text();
    Elements.root.innerHTML = html;
}