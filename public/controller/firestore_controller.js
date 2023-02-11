import {
    getFirestore,
    collection, addDoc,
    query, where, orderBy,
    getDocs
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js"

const db = getFirestore();

const TicTacToeGameCollection = 'tictactoe_game';

export async function addTicTacToeGameHistory(gameplay) {
    //gameplay = {email, winner, moves, timestamp}
    await addDoc(collection(db, TicTacToeGameCollection), gameplay);
}

export async function getTicTacToeGameHistory(email) {
    let history = [];
    const q = query(
        collection(db, TicTacToeGameCollection),
        where('email', '==', email),
        orderBy('timestamp','desc'),
    );
    const snapShot = await getDocs(q);
    snapShot.forEach(doc => {
        const {email, winner, moves, timestamp} = doc.data();
        history.push({email, winner, moves, timestamp});
    });
    return history;
}