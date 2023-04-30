import { routePath } from '../controller/route.js';
import * as Elements from './elements.js';
import { currentUser } from '../controller/firebase_auth.js';
import { unauthorizedAccess } from './unauthorized_access_message.js';
import { addCommunityFeed } from '../controller/firestore_controller.js';
import * as Util from './util.js';
import * as Constants from '../model/constants.js';



export function addEventListeners() {
    Elements.menus.community.addEventListener('click', () => {
        history.pushState(null, null, routePath.COMMUNITY);
        community_page();
    })
}


let screen = {
    createButton: null,
    editButton: null,
    deleteButton: null,
    saveButton: null,
    cancelButton: null,
    commentText: null,
    commentSection: null,
}

export async function community_page() {
    if (!currentUser) {
        Elements.root.innerHTML = unauthorizedAccess();
        return;
    }

    let html;
    const response = await fetch('/viewpage/templates/community_page.html', { cache: 'no-store' });
    html = await response.text();
    Elements.root.innerHTML = html;

    getScreenElements();
    addPageEvent();
}

function addPageEvent() {
    screen.createButton.addEventListener('click', createButtonEvent);

}

function getScreenElements() {
    screen.createButton = document.getElementById('button-create');
    screen.editButton = document.getElementById('button-edit');
    screen.deleteButton = document.getElementById('button-delete');
    screen.commentSection = document.getElementById('comment-section');
}

async function createButtonEvent() {
    let html = `
        <div>
            <textarea id="text-comment" class="text-comment" required minlength="5" placeholder="Enter Message"></textarea>
        <br>
        <button type="submit" id="button-save" class="btn btn-outline-danger">Save</button>
        <button type="button" id="button-cancel" class="btn btn-outline-secondary">Cancel</button>
    `;

    screen.commentSection.innerHTML = html;
    screen.cancelButton = document.getElementById('button-cancel');
    screen.cancelButton.addEventListener('click', cancelButtonEvent);
    screen.commentText = document.getElementById('text-comment');
    screen.saveButton = document.getElementById('button-save');
    screen.saveButton.addEventListener('click', () => {
        screen.commentText = document.getElementById('text-comment');
        saveButtonEvent(screen.commentText);
    });
}

async function saveButtonEvent(m){
    try{
        const comment = {
            email : currentUser.email,
            message : m.value,
            timestamp: Date.now(),
        }
        await addCommunityFeed(comment);
        Util.info('Comment added;' , 'docId: ');
        await community_page();
        
    }catch(e) {
        if (Constants.DEV) console.log(e);
        Util.info('Add comment failed', JSON.stringify(e));
    }
    let html = `
    <div class="col">
        <button id="button-create" class="btn btn-outline-primary">Create</button>
    </div>
    `;
    screen.commentSection.innerHTML = html;
    screen.createButton = document.getElementById('button-create');
    screen.createButton.addEventListener('click', createButtonEvent);
}

async function cancelButtonEvent() {
    let html = `
    <div class="col">
        <button id="button-create" class="btn btn-outline-primary">Create</button>
    </div>
    `;
    screen.commentForm.innerHTML = html;
    screen.createButton = document.getElementById('button-create');
    screen.createButton.addEventListener('click', createButtonEvent);

}