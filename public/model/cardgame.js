import { Card } from "./card.js";

export class CardGame {
    constructor() {
        this.resultPlacement = 0;
        this.walletCoins = 0;
        this.totalBet = 0;
        this.debt = 0;
        this.cardList = [];
        this.winbet;
        for (let i = 0; i < 3; i++) {
            this.cardList.push(new Card(i));
            console.log(this.cardList);
        }
    }

    generateResultPlacement() {
        return Math.floor(Math.random() * 3);
    }

    getTotalBet() {
        return this.cardList[0].bet + this.cardList[1].bet + this.cardList[2].bet;
    }

    playGame() {
        for (let i = 0; i < 3; i++) {
            if (i == this.resultPlacement) {
                this.winbet = this.cardList[i].bet * 3;
            }
        }
    }

}



