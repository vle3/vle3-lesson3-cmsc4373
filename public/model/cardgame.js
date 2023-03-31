import { Card } from "./card.js";

export class CardGame {
    constructor() {
        this.resultPlacement = 0;
        this.walletCoins = 0;
        this.totalBet = 0;
        this.debt = 0;
        this.cardList = [];
        for (let i = 0; i < 3; i++) {
            this.cardList.push(new Card(i));
            console.log(this.cardList);
        }
    }

    generateResultPlacement(){
        return Math.floor(Math.random() * 3);
    }

   getTotalBet () {
    return this.cardList[0].bet + this.cardList[1].bet + this.cardList[2].bet;
   }

}



