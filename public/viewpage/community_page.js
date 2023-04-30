import { routePath } from '../controller/route.js';
import * as Elements from './elements.js';
import { currentUser } from '../controller/firebase_auth.js';
import { unauthorizedAccess } from './unauthorized_access_message.js';
import {
    addCommunityFeed, getCommunityFeedList,
    removeComment, updateComment
} from '../controller/firestore_controller.js';
import * as Util from './util.js';
import * as Constants from '../model/constants.js';
import { DEV } from '../model/constants.js';




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
    commentList: null,
    commentListBody: null,
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

    let commentList;
    try {
        commentList = awat
    } catch (e) {

    }

    getScreenElements();
    addPageEvent();
    getCommentList();
}

function addPageEvent() {
    screen.createButton.addEventListener('click', createButtonEvent);

}

function getScreenElements() {
    screen.createButton = document.getElementById('button-create');
    screen.editButton = document.getElementById('button-edit');
    screen.deleteButton = document.getElementById('button-delete');
    screen.commentSection = document.getElementById('comment-section');
    screen.commentListBody = document.getElementById('tbl-comment-list-body');
    screen.commentList = document.getElementById('tbl-comment-list');
}

async function createButtonEvent() {
    let html = `
        <div>
            <textarea style="display:block; width:100%" id="text-comment" class="text-comment" required minlength="5" placeholder="Enter Message"></textarea>
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

async function saveButtonEvent(m) {
    try {
        if (m.value.length < 5) {
            throw new Error('messase less than 5 char');
        }
        const comment = {
            email: currentUser.email,
            message: m.value,
            timestamp: Date.now(),
        }
        await addCommunityFeed(comment);
        //Util.info('Comment added;', 'docId: ');
        await community_page();
    } catch (e) {
        if (Constants.DEV) console.log(e);
        if (m.value.length < 5) {
            Util.info("Add Comment failed", 'Message must be more than 5 characters');
        } else { Util.info('Add comment failed', JSON.stringify(e)); }

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
    screen.commentSection.innerHTML = html;
    screen.createButton = document.getElementById('button-create');
    screen.createButton.addEventListener('click', createButtonEvent);

}

async function getCommentList() {
    let list;
    try {
        let html = ``;

        list = await getCommunityFeedList();
        list.forEach(e => {
            html += buildCommentItem(e);
        });
        html += '</body></table>';
        if (list.length > 0) {
            const table = document.getElementById('tbl-comment-list');
            table.style.width = '100%'
        }
        screen.commentListBody.innerHTML = html;
    } catch (e) {
        if (DEV) console.log('ERROR; Failed to get history', e);
        Util.info('Failed to get commuity feeds', JSON.stringify(e));
    }
}

let currentEditId = null;
let currentEditMessage = null;

window.editComment = async function (commentId, commentMessage) {

    if (currentEditId != null && currentEditId != commentId) {
        cancelEdit(currentEditId, currentEditMessage);
        currentEditId = null;
        currentEditMessage = null;
        editComment(commentId, commentMessage);
        //return;
    }


    currentEditId = commentId;
    currentEditMessage = commentMessage;

    let html = ``;
    const editTd = document.getElementById(`comment-${commentId}`);
    editTd.style = "display: block";

    html = `
            <textarea style="display:block; width:100%" id="edit-comment${commentId}" 
            class="text-comment" required minlength="5" ">${commentMessage}</textarea>
            <button class="btn btn-outline-danger" onclick="updateComment('${commentId}')">Update</button>
            <button class="btn btn-outline-secondary" onclick="cancelEdit('${commentId}' , '${commentMessage}')">Cancel</button>
            `;
    editTd.innerHTML = html;
}



window.updateComment = async function (commentId) {
    const updateMessage = document.getElementById(`edit-comment${commentId}`).value;
    try {
        await updateComment(commentId, updateMessage);
        await community_page();
    }
    catch (e) {
        if (DEV) {
            console.log(`Error updating comment ${commentId}:` + e);
        }
        Util.info('Update Comment failed', JSON.stringify(e));
    }
}

window.cancelEdit = function (commentId, message) {
    const cancelTd = document.getElementById(`comment-${commentId}`);
    cancelTd.style = "background-color:grey; display:block";
    cancelTd.innerHTML = message;
}

window.deleteComment = async function (commentId) {
    try {
        await removeComment(commentId);
        await community_page();
    } catch (e) {
        if (DEV) {
            console.log(`Error deleting comment ${commentId}:` + e);
        }
        Util.info('Delete Comment failed', JSON.stringify(e));
    }
}

function buildCommentItem(comment) {
    let html = ``;
    html += `
    <tr>
    <td >
        <span style="background-color:green; display:block">By ${comment.email} (Posted at ${new Date(comment.timestamp).toLocaleString()})
        </span> 
        <span id="comment-${comment.docId}" style="background-color:grey; display:block">${comment.message}</span>
    </td>
    `;

    if (comment.email == currentUser.email) {
        html += `
    <td>
        <button  class="btn btn-outline-primary" onclick="editComment('${comment.docId}' ,  '${comment.message}')">Edit</button><br>     
        <button  class="btn btn-outline-danger" onclick="deleteComment('${comment.docId}')">Delete</button>     
    </td>
    `;
    }
    html += `
    </tr>
    `;
    return html;
}

