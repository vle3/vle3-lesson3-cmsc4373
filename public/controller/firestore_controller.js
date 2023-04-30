import {
    getFirestore, doc,
    collection, addDoc, updateDoc, deleteDoc,
    query, where, orderBy,
    getDocs
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js"

const db = getFirestore();

const TicTacToeGameCollection = 'tictactoe_game';
const BaseballGameCollection = 'baseball_game';
const CardGameCollection = 'card_game';
const CommunityFeedCollection = 'community_feed';

export async function addCommunityFeed(comment) {
    //comment = {email, message, timestamp}
    await addDoc(collection(db, CommunityFeedCollection), comment);
}

export async function updateComment(commentId, updateMessage) {
    let updateInfo;
    updateInfo = {message: updateMessage , timestamp: Date.now() };
    const docRef =  doc(db,CommunityFeedCollection, commentId);
    try {
        await updateDoc(docRef,updateInfo);
    } catch (e) {
    }
}

export async function removeComment(commentId){
    const docRef = doc(db,CommunityFeedCollection, commentId);
    try{
        await deleteDoc(docRef);
    }
    catch(e){

    }
}

export async function getCommunityFeedList() {
    let list = [];
    const q = query(collection(db, CommunityFeedCollection),
        orderBy('timestamp', 'desc'),
    );
    const snapShot = await getDocs(q);
    snapShot.forEach(doc => {
        const { email, message, timestamp, } = doc.data();
        list.push({ email, message, timestamp, docId: doc.id });
    });
    return list;
}

export async function addTicTacToeGameHistory(gameplay) {
    //gameplay = {email, winner, moves, timestamp}
    await addDoc(collection(db, TicTacToeGameCollection), gameplay);
}

export async function getTicTacToeGameHistory(email) {
    let history = [];
    const q = query(
        collection(db, TicTacToeGameCollection),
        where('email', '==', email),
        orderBy('timestamp', 'desc'),
    );
    const snapShot = await getDocs(q);
    snapShot.forEach(doc => {
        const { email, winner, moves, timestamp } = doc.data();
        history.push({ email, winner, moves, timestamp });
    });
    return history;
}

export async function addBaseballGameHistory(gameplay) {
    //gameplay = {emails, attemps, timestamp}
    await addDoc(collection(db, BaseballGameCollection), gameplay);
}

export async function getBaseballGameHistory(email) {
    let history = [];
    const q = query(
        collection(db, BaseballGameCollection),
        where('email', '==', email),
        orderBy('timestamp', 'desc'),
    );
    const snapShot = await getDocs(q);
    snapShot.forEach(doc => {
        const { email, attemps, timestamp } = doc.data();
        history.push({ email, attemps, timestamp });
    });
    return history;
}

export async function addCardGameHistory(gameplay) {
    await addDoc(collection(db, CardGameCollection), gameplay);
}

export async function getCardGameHistory(email) {
    let history = [];
    const q = query(
        collection(db, CardGameCollection),
        where('email', '==', email),
        orderBy('timestamp', 'desc'),
    );

    const snapShot = await getDocs(q);
    snapShot.forEach(doc => {
        const { email, balance, bets, loan, debts, timestamp, won } = doc.data();
        history.push({ email, balance, bets, loan, debts, timestamp, won });
    });
    return history;
}